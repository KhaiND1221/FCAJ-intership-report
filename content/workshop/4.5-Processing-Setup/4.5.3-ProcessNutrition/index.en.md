# 4.5.3 ProcessNutrition — Hybrid Nutrition Lookup

`process-nutrition` resolves a food name to a structured nutrition object. It tries the local DynamoDB `Food` table first; only if that misses does it call Bedrock Qwen3-VL. For the ~200 Vietnamese foods already seeded, the DynamoDB path is fast and free. For anything unusual, Bedrock fills the gap.

## Resource definition

```typescript
// backend/amplify/process-nutrition/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const processNutrition = defineFunction({
  name: 'process-nutrition',
  entry: './handler.ts',
  runtime: 22,
  memoryMB: 512,
  timeoutSeconds: 30,
  resourceGroupName: 'data',
});
```

`resourceGroupName: 'data'` bundles this Lambda's permissions with the AppSync data stack — it gets IAM access to the DynamoDB tables automatically.

## AppSync wiring

```typescript
// data/resource.ts
processNutrition: a
  .query()
  .arguments({ payload: a.string().required() })
  .returns(a.string())
  .handler(a.handler.function(processNutrition))
  .authorization((allow) => [allow.authenticated()]),
```

The `payload` is a JSON string. Two modes are supported:

| `data.action` | Purpose | Input |
| --- | --- | --- |
| `directSearch` | Fast single-word text lookup | `{ action: 'directSearch', query: 'phở bò' }` |
| _(omitted)_ | Process AI-generated ingredient array | `{ items: [ { meal_name, ingredients: [ { name, estimated_g } ] } ] }` |

## Table discovery

The Lambda needs the table name at runtime. It first checks the `FOOD_TABLE_NAME` env var (injected from `backend.ts`); if missing, it falls back to scanning `ListTablesCommand` for any table starting with `Food-`:

```typescript
async function discoverTableName(): Promise<string> {
  if (cachedTableName) return cachedTableName;

  if (process.env.FOOD_TABLE_NAME) {
    cachedTableName = process.env.FOOD_TABLE_NAME;
    return cachedTableName;
  }

  const result = await client.send(new ListTablesCommand({}));
  const foodTable = result.TableNames?.find((name) => name.startsWith('Food-'));
  if (!foodTable) throw new Error('Food table not found in DynamoDB');
  cachedTableName = foodTable;
  return cachedTableName;
}
```

**Known issue**: `ListTablesCommand` returns tables from all Amplify environments in the same AWS account. When two sandbox environments coexist, it may pick the wrong one. Fix: inject the env var explicitly in `backend.ts`:

```typescript
backend.processNutrition.resources.cfnResources.cfnFunction.addPropertyOverride(
  'Environment.Variables.FOOD_TABLE_NAME',
  backend.data.resources.tables['Food'].tableName
);
```

Once the env var is set, the `ListTablesCommand` path is never reached.

## Text normalization

Vietnamese food names carry diacritics that vary in input. `normalize()` strips them for fallback comparisons:

```typescript
function normalize(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip all diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
```

`"Phở Bò"` → `"pho bo"`, `"phở bò"` → `"pho bo"`, `"Pho Bo"` → `"pho bo"`. All match.

## Live DynamoDB lookup — `findFoodInDB`

Instead of loading the whole table into Lambda memory, `findFoodInDB` issues targeted DynamoDB calls per query. The `Food` table has GSIs on `name_vi` and `name_en` (added in 4.4.1), enabling efficient lookups:

```typescript
async function findFoodInDB(query: string, tableName: string): Promise<any | null> {
  if (!query) return null;

  // Tier 1: exact match via name_vi GSI (diacritic-sensitive, fast)
  const queryVi = await docClient.send(new QueryCommand({
    TableName: tableName,
    IndexName: 'name_vi',
    KeyConditionExpression: 'name_vi = :name',
    ExpressionAttributeValues: { ':name': query },
  }));
  if (queryVi.Items?.length) return queryVi.Items[0];

  // Tier 2: substring scan on name_vi and name_en
  const scanVi = await docClient.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: 'contains(name_vi, :q) OR contains(name_en, :q)',
    ExpressionAttributeValues: { ':q': query },
  }));
  if (scanVi.Items?.length) {
    // Prefer shortest name (closest match) when multiple rows match
    return scanVi.Items.sort((a, b) => a.name_vi.length - b.name_vi.length)[0];
  }

  // Tier 3: aliases_vi substring scan
  const scanAlias = await docClient.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: 'contains(aliases_vi, :q)',
    ExpressionAttributeValues: { ':q': query },
  }));
  if (scanAlias.Items?.length) return scanAlias.Items[0];

  // Tier 4: diacritic-stripped fallback (for inputs without tone marks)
  // normalize() → further scan if needed
  return null;
}
```

Each search call is live — DynamoDB is queried per ingredient, not pre-loaded into memory. Tier 1 uses the `name_vi` GSI and costs 0.5 RCU for a key lookup. Tiers 2–3 are `Scan` with a `FilterExpression`, which reads the full table and filters server-side (~1 RCU per 4 KB).

## Direct search path

When `data.action === 'directSearch'`, the handler calls `findFoodInDB` and returns the matched item, or `success: false` if nothing is found:

```typescript
if (data.action === 'directSearch') {
  const match = await findFoodInDB(data.query, tableName);
  if (match) {
    return JSON.stringify({
      success: true,
      source: 'database',
      food: { ...match, calculated_nutrition: match.macros },
    });
  }
  return JSON.stringify({ success: false, error: 'Not found in DB' });
}
```

If no match is found, the client is expected to escalate to `aiEngine` with `action: 'generateFoodNutrition'`.

## Normal path — ingredient array processing

When the client passes a multi-ingredient meal from the AI output, each ingredient goes through `findFoodInDB`. Matched items use the `Food` table's per-100g macros scaled to `estimated_g`; unmatched items fall back to AI-estimated values:

```typescript
function calculateNutrition(dbFood: any, estimatedG: number) {
  const ratio = estimatedG / 100;
  return {
    calories:   Math.round((dbFood.macros?.calories  || 0) * ratio * 10) / 10,
    protein_g:  Math.round((dbFood.macros?.protein_g || 0) * ratio * 10) / 10,
    carbs_g:    Math.round((dbFood.macros?.carbs_g   || 0) * ratio * 10) / 10,
    fat_g:      Math.round((dbFood.macros?.fat_g     || 0) * ratio * 10) / 10,
  };
}
```

The final response includes `db_match_count` and `ai_fallback_count` so the UI can indicate confidence.

## IAM requirements

The Lambda role needs:

- `dynamodb:Scan`, `dynamodb:GetItem`, `dynamodb:Query` on the `Food-*` table.
- `dynamodb:ListTables` — only if you haven't eliminated the `discoverTableName()` fallback path.

No Bedrock permission is needed here — the `process-nutrition` Lambda itself does not call Bedrock. When a DB miss occurs, it returns `success: false` and the client calls `aiEngine.generateFoodNutrition` separately.

## Testing

Run `npx ampx sandbox` from `backend/`, then use the AppSync console to call the query:

```graphql
query TestProcessNutrition {
  processNutrition(payload: "{\"action\":\"directSearch\",\"query\":\"phở bò\"}") 
}
```

Expected: `{"success":true,"items":[{"meal_name":"Phở bò","portion_size":"...","total_calories":...}]}`.

For an unknown food:

```graphql
query {
  processNutrition(payload: "{\"action\":\"directSearch\",\"query\":\"wagyu ribeye\"}") 
}
```

Expected: `{"success":false,"error":"Not found in DB direct search"}` — client then calls `aiEngine` for the fallback.

## Cost model

- Tier 1 `QueryCommand` on `name_vi` GSI: ~0.5 RCU per call (key lookup, eventually consistent).
- Tiers 2–3 `ScanCommand`: ~1 RCU per 4 KB of table data. At 200 items × ~2 KB ≈ 400 KB → ~1–2 RCUs per scan.
- Each ingredient triggers up to 3 DynamoDB calls (query + up to 2 scans). For a 5-ingredient meal with all DB misses: ≤15 RCUs — negligible cost.
- Bedrock is not called here — cost stays minimal.

## Cross-links

- [4.4.2 DynamoDB](/workshop/4.4.2-DynamoDB) — Food table schema and seeding.
- [4.5.2 AIEngine](/workshop/4.5.2-AIEngine) — Bedrock fallback for unrecognized foods.
- [4.5 Compute & AI](/workshop/4.5-Processing-Setup) — Section overview.
