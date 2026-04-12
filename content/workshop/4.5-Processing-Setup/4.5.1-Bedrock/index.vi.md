# 4.5.1 Bedrock — Model Access, IAM, Cấu trúc Invocation

Amazon Bedrock là dịch vụ foundation-model duy nhất mà NutriTrack dùng. Trang này bao phủ phần chuẩn bị (verify model, region, IAM) và cấu trúc request chính xác mà Qwen3-VL mong đợi.

## Bước 1 — Verify model access

> **Lưu ý:** AWS đã bỏ yêu cầu xin model access thủ công đối với Qwen3-VL — model này không cần gửi request duyệt như các model Anthropic. Chỉ cần verify rằng model đang hoạt động trên account và region của bạn.

**Verify thủ công trên AWS Console:**

1. Mở **AWS Console** → **Amazon Bedrock** → chuyển region sang **Asia Pacific (Sydney) `ap-southeast-2`**.
1. Sidebar trái → **Test** → **Playground**.
1. Nhấn **Select model** → Tìm kiếm và chọn **Qwen3 VL 235B A22B**.
1. Nhập prompt ngắn (ví dụ: `Nói xin chào nhé`) → Nhấn **Run**.
1. Nếu có phản hồi text bình thường, model đã sẵn sàng để invoke.

**Verify bằng CLI:**

```bash
aws bedrock list-foundation-models \
  --region ap-southeast-2 \
  --query "modelSummaries[?modelId=='qwen.qwen3-vl-235b-a22b']"
```

Nếu mảng trả về không rỗng và `modelLifecycle.status == 'ACTIVE'`, bạn đã có thể invoke.

## Bước 2 — Vì sao chọn Qwen3-VL thay vì Claude

Bốn lý do workload này chọn Qwen3-VL:

1. **Đa phương thức trong một lần gọi**. Model nhận `type: 'image_url'` và `type: 'text'` trong cùng mảng `messages[]`. `scanImage` gửi JPEG base64 + prompt tiếng Việt ngắn — một round trip, không cần pipeline riêng cho vision.
2. **Suy luận + gọi tool + OCR + VLM**. Qwen3-VL có khả năng suy luận nhiều bước từ ngữ cảnh bữa ăn, tương thích tốt với luồng gọi tool của AI Engine, OCR được chữ trên bao bì hoặc thực đơn, và là VLM native cho bài toán phân tích ảnh món ăn.
3. **Tiếng Việt native**. System prompt của Ollie dày đặc giọng Gen-Z Việt (`ê`, `nhé`, `nha`, `nè`). Qwen xử lý thẳng, không cần dịch qua.
4. **Chi phí**. Với tỷ lệ NutriTrack (80% text, 20% vision), Qwen3-VL rẻ hơn đáng kể so với Claude 3.5 Sonnet trên mỗi 1M token. Giá chính xác thay đổi — tra trang pricing Bedrock cho số hiện tại ở `ap-southeast-2`.

Kiểm tra thứ tự độ lớn: chi phí mỗi user mỗi ngày nằm trong khoảng vài cent USD với user tích cực log.

## Bước 3 — IAM policy cho Lambda aiEngine

Policy nằm trong `backend/amplify/backend.ts`. Amplify không tự gắn quyền Bedrock — phải patch role Lambda qua CDK escape hatch:

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

Điểm quan trọng:

- ARN khoá Lambda vào đúng một model. Sau này thêm model khác thì append ARN mới — không dùng `*`.
- Cả `InvokeModel` và `InvokeModelWithResponseStream` đều được cấp; handler hiện chỉ dùng cái đầu, streaming chỉ là một dòng đổi sau này cho coach response.
- Account ID trong ARN để trống (`::foundation-model`) — đây là chuẩn cho foundation model Bedrock vì chúng do AWS sở hữu.

Cùng file cũng cấp quyền S3 read/delete và Transcribe cho `aiEngine`:

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

Và resource policy trên bucket để Transcribe (chạy dưới service principal của nó) đọc được file voice trực tiếp:

```typescript
s3Bucket.addToResourcePolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  principals: [new iam.ServicePrincipal('transcribe.amazonaws.com')],
  actions: ['s3:GetObject'],
  resources: [`${s3Bucket.bucketArn}/voice/*`],
}));
```

Không có resource policy này, job Transcribe sẽ fail bất đồng bộ với `FailureReason` không rõ — role của Lambda không truyền sang Transcribe service.

## Bước 4 — Cấu trúc invocation cho Qwen3-VL

Qwen3-VL trên Bedrock phơi ra **schema chat-completions kiểu OpenAI**, không phải Messages API của Anthropic. Đừng copy code invoke của Claude — sẽ không chạy.

### Request chỉ text

> **System prompt thực tế dài hơn nhiều.** Ví dụ dưới dùng version rút gọn cho mục đích minh hoạ. Handler thật trong `ai-engine/handler.ts` dùng hằng `GEN_FOOD_SYSTEM_PROMPT` — một đoạn văn nhiều đoạn định nghĩa nhân vật Ollie, format JSON mong đợi, ngữ điệu Gen-Z tiếng Việt, và các quy tắc fallback.

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "ap-southeast-2" });

const body = JSON.stringify({
  messages: [
    {
      role: "system",
      content: GEN_FOOD_SYSTEM_PROMPT, // hằng đầy đủ trong ai-engine/handler.ts
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

### Request vision (ảnh + text)

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

Helper `callQwen` thật trong `ai-engine/handler.ts` bọc lại đoạn này và có fallback khi parse response:

```typescript
const text = responseBody.choices?.[0]?.message?.content
    || responseBody.output?.message?.content?.[0]?.text
    || responseBody.content?.[0]?.text
    || '';
```

Chuỗi fallback tồn tại vì Bedrock đã có lúc đổi schema giữa các revision Qwen. Luôn parse phòng thủ.

### Tuỳ chọn `ConverseCommand`

AWS có `ConverseCommand` như wrapper model-agnostic:

```typescript
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

await client.send(new ConverseCommand({
  modelId: "qwen.qwen3-vl-235b-a22b",
  messages: [{ role: "user", content: [{ text: "Hello" }] }],
}));
```

**`ConverseCommand` hỗ trợ đầy đủ Qwen3-VL kể cả vision** (bảng AWS API compatibility: `Converse: Yes`). NutriTrack dùng `InvokeModelCommand` với schema chat-completions tương thích OpenAI vì ECS FastAPI service đã dùng protocol này — giữ format request nhất quán từ đầu đến cuối. Cả hai API đều hoạt động với Qwen3-VL.

## Bước 5 — Smoke-test bằng CLI

Trước khi đụng Lambda, chứng minh model phản hồi:

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

Kỳ vọng: một câu chào tiếng Việt ngắn. Nếu gặp `AccessDeniedException`, xem lại bước 1. Nếu gặp `ValidationException: Unknown model`, xem lại region.

## Bước 6 — Retry và throttling

Bedrock áp quota concurrent-request theo account-region. Khi bị throttle, `InvokeModelCommand` ném `ThrottlingException`. aws-sdk-v3 đã có sẵn retry strategy (`standard`, 3 lần retry backoff) xử lý tự động. Với workload burst (ví dụ một push notification kích hàng trăm cuộc gọi `weeklyInsight`), tăng retry:

```typescript
import { StandardRetryStrategy } from "@aws-sdk/util-retry";

const client = new BedrockRuntimeClient({
  region: "ap-southeast-2",
  retryStrategy: new StandardRetryStrategy(async () => 6, { maxRetries: 6 }),
});
```

Cho throughput bền vững, xin tăng quota qua Service Quotas → Amazon Bedrock → **Model invocations per minute for `qwen.qwen3-vl-235b-a22b`**.

## Liên kết

- Lambda thực sự gọi Bedrock: [4.5.2 AIEngine](/workshop/4.5.2-AIEngine)
- Hybrid DB + Bedrock: [4.5.3 ProcessNutrition](/workshop/4.5.3-ProcessNutrition)
- CloudWatch log và alarm: [4.6 Automation Setup](/workshop/4.6-Automation-Setup)
