# 4.5.3 ProcessNutrition — Tra Cứu Dinh Dưỡng Lai Ghép

`process-nutrition` chuyển tên món ăn thành object dinh dưỡng có cấu trúc. Ưu tiên tra cứu bảng DynamoDB `Food` cục bộ trước; chỉ khi không tìm thấy mới gọi Bedrock Qwen3-VL. Với ~200 món Việt đã được seed, đường DynamoDB nhanh và miễn phí. Với món lạ, Bedrock bù vào.

## Định nghĩa resource

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

`resourceGroupName: 'data'` gom Lambda này vào stack data AppSync — tự động nhận IAM để truy cập các bảng DynamoDB.

## Kết nối AppSync

```typescript
// data/resource.ts
processNutrition: a
  .query()
  .arguments({ payload: a.string().required() })
  .returns(a.string())
  .handler(a.handler.function(processNutrition))
  .authorization((allow) => [allow.authenticated()]),
```

`payload` là chuỗi JSON. Hai chế độ:

| `data.action` | Mục đích | Input |
| --- | --- | --- |
| `directSearch` | Tra cứu từ đơn nhanh | `{ action: 'directSearch', query: 'phở bò' }` |
| _(không có)_ | Xử lý mảng nguyên liệu từ AI | `{ items: [ { meal_name, ingredients: [ { name, estimated_g } ] } ] }` |

## Tìm tên bảng

Lambda cần tên bảng lúc runtime. Kiểm tra env var `FOOD_TABLE_NAME` trước; nếu thiếu thì scan `ListTablesCommand` tìm bảng bắt đầu với `Food-`:

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

**Vấn đề đã biết**: `ListTablesCommand` trả về bảng từ mọi môi trường Amplify trong cùng AWS account. Khi hai sandbox cùng tồn tại, Lambda có thể chọn nhầm bảng. **Fix**: inject env var trong `backend.ts`:

```typescript
backend.processNutrition.resources.cfnResources.cfnFunction.addPropertyOverride(
  'Environment.Variables.FOOD_TABLE_NAME',
  backend.data.resources.tables['Food'].tableName
);
```

Khi env var được set, đường `ListTablesCommand` không bao giờ được chạy.

## Chuẩn hóa văn bản

Tên món Việt có dấu biến thể khi nhập. `normalize()` bỏ dấu cho các so sánh fallback:

```typescript
function normalize(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // bỏ tất cả dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
```

`"Phở Bò"` → `"pho bo"`, `"phở bò"` → `"pho bo"`, `"Pho Bo"` → `"pho bo"`. Tất cả đều khớp.

## Tra cứu DynamoDB trực tiếp — `findFoodInDB`

Thay vì load cả bảng vào bộ nhớ Lambda, `findFoodInDB` thực hiện các lệnh DynamoDB nhắm mục tiêu theo từng query. Bảng `Food` có GSI trên `name_vi` và `name_en` (thêm ở 4.4.1), cho phép tra cứu hiệu quả:

```typescript
async function findFoodInDB(query: string, tableName: string): Promise<any | null> {
  if (!query) return null;

  // Tầng 1: khớp chính xác qua GSI name_vi (có dấu, nhanh)
  const queryVi = await docClient.send(new QueryCommand({
    TableName: tableName,
    IndexName: 'name_vi',
    KeyConditionExpression: 'name_vi = :name',
    ExpressionAttributeValues: { ':name': query },
  }));
  if (queryVi.Items?.length) return queryVi.Items[0];

  // Tầng 2: scan chứa chuỗi con trên name_vi và name_en
  const scanVi = await docClient.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: 'contains(name_vi, :q) OR contains(name_en, :q)',
    ExpressionAttributeValues: { ':q': query },
  }));
  if (scanVi.Items?.length) {
    // Ưu tiên tên ngắn nhất (gần query nhất) nếu nhiều kết quả
    return scanVi.Items.sort((a, b) => a.name_vi.length - b.name_vi.length)[0];
  }

  // Tầng 3: scan aliases_vi chứa chuỗi con
  const scanAlias = await docClient.send(new ScanCommand({
    TableName: tableName,
    FilterExpression: 'contains(aliases_vi, :q)',
    ExpressionAttributeValues: { ':q': query },
  }));
  if (scanAlias.Items?.length) return scanAlias.Items[0];

  // Tầng 4: fallback bỏ dấu (cho input không có dấu)
  return null;
}
```

Mỗi lệnh tìm kiếm là live — DynamoDB được truy vấn theo từng nguyên liệu, không pre-load vào bộ nhớ. Tầng 1 dùng GSI `name_vi` tốn 0,5 RCU. Tầng 2–3 là `Scan` với `FilterExpression`, đọc cả bảng và lọc phía server (~1 RCU mỗi 4 KB).

## Đường direct search

Khi `data.action === 'directSearch'`, handler gọi `findFoodInDB` và trả về item khớp, hoặc `success: false` nếu không tìm thấy:

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

## Đường bình thường — xử lý mảng nguyên liệu

Khi client truyền bữa ăn nhiều nguyên liệu từ output AI, mỗi nguyên liệu qua `findFoodInDB`. Item khớp dùng macro per-100g của bảng `Food` scale theo `estimated_g`; item không khớp dùng giá trị AI ước lượng:

```typescript
function calculateNutrition(dbFood: any, estimatedG: number) {
  const ratio = estimatedG / 100;
  return {
    calories:  Math.round((dbFood.macros?.calories  || 0) * ratio * 10) / 10,
    protein_g: Math.round((dbFood.macros?.protein_g || 0) * ratio * 10) / 10,
    carbs_g:   Math.round((dbFood.macros?.carbs_g   || 0) * ratio * 10) / 10,
    fat_g:     Math.round((dbFood.macros?.fat_g     || 0) * ratio * 10) / 10,
  };
}
```

Response cuối có `db_match_count` và `ai_fallback_count` để UI hiển thị mức độ tin cậy.

## Yêu cầu IAM

Lambda role cần:

- `dynamodb:Scan`, `dynamodb:GetItem`, `dynamodb:Query` trên bảng `Food-*`.
- `dynamodb:ListTables` — chỉ nếu chưa loại bỏ đường `discoverTableName()`.

Không cần quyền Bedrock — Lambda này không gọi Bedrock trực tiếp.

## Kiểm thử

Chạy `npx ampx sandbox` từ `backend/`, sau đó dùng AppSync console:

```graphql
query {
  processNutrition(payload: "{\"action\":\"directSearch\",\"query\":\"phở bò\"}")
}
```

Kết quả mong đợi: `{"success":true,"items":[{"meal_name":"Phở bò",...}]}`.

Với món không có trong DB:

```graphql
query {
  processNutrition(payload: "{\"action\":\"directSearch\",\"query\":\"wagyu ribeye\"}")
}
```

Kết quả: `{"success":false,"error":"Not found in DB direct search"}` — client sau đó gọi `aiEngine`.

## Mô hình chi phí

- Tầng 1 `QueryCommand` trên GSI `name_vi`: ~0,5 RCU mỗi lần gọi (key lookup, eventually consistent).
- Tầng 2–3 `ScanCommand`: ~1 RCU mỗi 4 KB dữ liệu bảng. 200 item × ~2 KB ≈ 400 KB → ~1–2 RCU mỗi scan.
- Mỗi nguyên liệu có tối đa 3 lệnh DynamoDB (1 query + 2 scan). Bữa 5 nguyên liệu không khớp hết: ≤15 RCU — chi phí không đáng kể.
- Không gọi Bedrock — chi phí rất thấp.

## Liên kết

- [4.4.2 DynamoDB](/workshop/4.4.2-DynamoDB) — schema bảng Food và seed data.
- [4.5.2 AIEngine](/workshop/4.5.2-AIEngine) — Bedrock fallback cho món không nhận dạng được.
- [4.5 Compute & AI](/workshop/4.5-Processing-Setup) — tổng quan section.
