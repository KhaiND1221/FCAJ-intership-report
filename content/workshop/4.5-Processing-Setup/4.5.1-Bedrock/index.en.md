# 4.5.1 Bedrock — Model Access, IAM, Invocation Shape

Amazon Bedrock is the only foundation-model service used by NutriTrack. This page covers the preflight setup (verify model, region, IAM) and the exact invocation shape Qwen3-VL expects.

## Step 1 — Verify model access

> **Note:** AWS removed the explicit model-access request requirement for Qwen3-VL — it does not need to be approved the way Anthropic models do. You only need to verify the model is active and reachable in your account and region.

**Verify manually in the AWS Console:**

1. Open **AWS Console** → **Amazon Bedrock** → switch region to **Asia Pacific (Sydney) `ap-southeast-2`**.
1. Left sidebar → **Test** → **Playground**.
1. Click **Select model** → search for and select **Qwen3 VL 235B A22B**.
1. Enter a short prompt (e.g., `Say hello`) → click **Run**.
1. If you receive a normal text response, the model is ready to invoke.

**Verify from the CLI:**

```bash
aws bedrock list-foundation-models \
  --region ap-southeast-2 \
  --query "modelSummaries[?modelId=='qwen.qwen3-vl-235b-a22b']"
```

If the array is non-empty and `modelLifecycle.status == 'ACTIVE'`, you are good to invoke.

## Step 2 — Why Qwen3-VL and not Claude

Four reasons this workload picks Qwen3-VL:

1. **Multimodal in one call**. The model accepts `type: 'image_url'` and `type: 'text'` in the same `messages[]` array. `scanImage` sends a base64-encoded JPEG and a short Vietnamese prompt — one round trip, no separate vision pipeline.
2. **Reasoning + tool calling + OCR + VLM**. Qwen3-VL can reason across multi-step meal context, integrates well with the AI Engine's tool-calling flow, reads text on food packaging or menus (OCR), and is a native VLM for food image analysis tasks.
3. **Native Vietnamese**. Ollie's system prompts are full of Gen-Z Vietnamese phrasing (`ê`, `nhé`, `nha`, `nè`). Qwen handles this without a separate translation hop.
4. **Cost**. For the typical NutriTrack mix (80% text, 20% vision), Qwen3-VL comes in substantially cheaper than Claude 3.5 Sonnet per 1M tokens. Exact per-token pricing moves — check the AWS Bedrock pricing page for current numbers in `ap-southeast-2`.

Order-of-magnitude sanity check: per-user per-day cost sits in the single-digit US cents range for an active logger.

## Step 3 — IAM policy for the aiEngine Lambda

The policy lives in `backend/amplify/backend.ts`. Amplify does not attach Bedrock permissions by default — you must patch the Lambda role via the CDK escape hatch:

```typescript
// backend.ts
const aiEngineLambda = backend.aiEngine.resources.lambda;

aiEngineLambda.addToRolePolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
    resources: [
      "arn:aws:bedrock:ap-southeast-2::foundation-model/qwen.qwen3-vl-235b-a22b",
    ],
  })
);
```

Key points:

- The resource ARN locks the Lambda to one model. If you later add a second model, append another ARN — do not use `*`.
- Both `InvokeModel` and `InvokeModelWithResponseStream` are granted; the current handler only uses the former, but streaming is a one-line swap for coach responses later.
- The account ID in the ARN is empty (`::foundation-model`) — that is correct for Bedrock foundation models, which are AWS-owned resources.

The same file also grants S3 read/delete and Transcribe permissions to `aiEngine`:

```typescript
s3Bucket.grantRead(aiEngineLambda);
s3Bucket.grantDelete(aiEngineLambda);
aiEngineLambda.addToRolePolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      "transcribe:StartTranscriptionJob",
      "transcribe:GetTranscriptionJob",
      "transcribe:DeleteTranscriptionJob",
    ],
    resources: ["*"],
  })
);
```

And a bucket resource policy so Transcribe (running as its own service principal) can read voice uploads directly:

```typescript
s3Bucket.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [new iam.ServicePrincipal('transcribe.amazonaws.com')],
  actions: ['s3:GetObject'],
  resources: [`${s3Bucket.bucketArn}/voice/*`],
}));
```

Without that resource policy, Transcribe jobs fail asynchronously with an opaque `FailureReason` — the Lambda's role does not transfer to the Transcribe service.

## Step 4 — Invocation shape for Qwen3-VL

Qwen3-VL on Bedrock exposes an **OpenAI-compatible chat-completions schema** rather than Anthropic's Messages API. Do not copy-paste Claude invocation code — it will not work.

### Text-only request

> **The real system prompt is much longer.** The example below uses a shortened version for illustration. The actual handler in `ai-engine/handler.ts` uses the full `GEN_FOOD_SYSTEM_PROMPT` constant — a multi-paragraph string defining Ollie's character, expected JSON output format, Gen-Z Vietnamese tone, and fallback rules.

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "ap-southeast-2" });

const body = JSON.stringify({
  messages: [
    {
      role: "system",
      content: GEN_FOOD_SYSTEM_PROMPT, // full constant in ai-engine/handler.ts
    },
    { role: "user", content: "Phở bò có bao nhiêu calo?" },
  ],
  max_tokens: 500,
});

const response = await client.send(new InvokeModelCommand({
  modelId: "qwen.qwen3-vl-235b-a22b",
  contentType: "application/json",
  accept: "application/json",
  body,
}));

const parsed = JSON.parse(new TextDecoder().decode(response.body));
const text = parsed.choices?.[0]?.message?.content ?? "";
```

### Vision request (image + text)

```typescript
const body = JSON.stringify({
  messages: [
    { role: "system", content: GEN_FOOD_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        },
        {
          type: "text",
          text: "Analyze this food image and return JSON only.",
        },
      ],
    },
  ],
  max_tokens: 1000,
});
```

The real `callQwen` helper in `ai-engine/handler.ts` wraps this and handles response parsing with a fallback chain:

```typescript
const text = responseBody.choices?.[0]?.message?.content
    || responseBody.output?.message?.content?.[0]?.text
    || responseBody.content?.[0]?.text
    || '';
```

The fallback chain exists because Bedrock has occasionally shipped schema tweaks between Qwen model revisions. Always parse defensively.

### `ConverseCommand` alternative

AWS ships `ConverseCommand` as a model-agnostic wrapper and it **fully supports Qwen3-VL including vision inputs** (AWS API compatibility table: `Converse: Yes`):

```typescript
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

await client.send(new ConverseCommand({
  modelId: "qwen.qwen3-vl-235b-a22b",
  messages: [{ role: "user", content: [{ text: "Hello" }] }],
}));
```

NutriTrack uses `InvokeModelCommand` with the OpenAI-compatible chat-completions schema rather than `ConverseCommand` because the ECS FastAPI service already speaks that protocol, keeping the request shape consistent end-to-end. Either API works for Qwen3-VL.

## Step 5 — Smoke-test via CLI

Before touching Lambda, prove the model responds:

```bash
aws bedrock-runtime invoke-model \
  --model-id qwen.qwen3-vl-235b-a22b \
  --region ap-southeast-2 \
  --content-type application/json \
  --accept application/json \
  --body '{"messages":[{"role":"user","content":"Nói xin chào nhé"}],"max_tokens":50}' \
  --cli-binary-format raw-in-base64-out \
  /tmp/bedrock-out.json

cat /tmp/bedrock-out.json | jq '.choices[0].message.content'
```

Expected output: a short Vietnamese greeting. If you get `AccessDeniedException`, recheck step 1. If you get `ValidationException: Unknown model`, recheck the region.

## Step 6 — Retries and throttling

Bedrock enforces a per-account, per-region concurrent-request quota. When throttled, `InvokeModelCommand` throws `ThrottlingException`. The aws-sdk-v3 ships a built-in retry strategy (`standard`, 3 retries with exponential backoff) that handles this transparently for most cases. For bursty workloads (e.g., a push notification kicking off hundreds of `weeklyInsight` calls), tune the retry count:

```typescript
import { StandardRetryStrategy } from "@aws-sdk/util-retry";

const client = new BedrockRuntimeClient({
  region: "ap-southeast-2",
  retryStrategy: new StandardRetryStrategy(async () => 6, { maxRetries: 6 }),
});
```

For sustained throughput, request a quota increase via Service Quotas → Amazon Bedrock → **Model invocations per minute for `qwen.qwen3-vl-235b-a22b`**.

## Cross-links

- Lambda that actually calls Bedrock: [4.5.2 AIEngine](/workshop/4.5.2-AIEngine)
- Hybrid DB + Bedrock lookup: [4.5.3 ProcessNutrition](/workshop/4.5.3-ProcessNutrition)
- CloudWatch logs and alarms: [4.6 Automation Setup](/workshop/4.6-Automation-Setup)
