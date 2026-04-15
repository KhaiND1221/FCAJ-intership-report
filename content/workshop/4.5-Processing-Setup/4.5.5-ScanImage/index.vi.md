# 4.5.5 ScanImage — Proxy Xử Lý Ảnh

`scan-image` là Lambda thứ năm trong NutriTrack. Nó không phải orchestrator AI đa năng — nó có đúng một nhiệm vụ: nhận S3 object key từ AppSync, tải ảnh, xác thực với cụm ECS FastAPI bằng JWT tự ký, chuyển tiếp ảnh dưới dạng multipart form-data, và poll kết quả.

Container ECS FastAPI chạy pipeline AI inference riêng và có thể truy cập qua Application Load Balancer tại `http://nutritrack-api-vpc-alb-xxxxxxxxx.ap-southeast-2.elb.amazonaws.com`. Lambda là cầu nối bảo mật giữa tầng AppSync serverless và tầng compute container hóa.

## Định nghĩa resource

```typescript
// backend/amplify/scan-image/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const scanImage = defineFunction({
  name: 'scan-image',
  entry: './handler.ts',
  runtime: 22,
  memoryMB: 512,
  timeoutSeconds: 30,
});
```

30 giây là đủ: job ECS cho một ảnh thường hoàn thành trong 5–10 giây. Nếu polling timeout, Lambda trả về `{ success: false, error: 'Job timed out' }`.

## Biến môi trường

| Biến | Nguồn | Mục đích |
| --- | --- | --- |
| `STORAGE_BUCKET_NAME` | CDK property override | S3 bucket để tải ảnh |
| `ECS_BASE_URL` | CDK property override | ALB DNS hoặc domain của cụm FastAPI |

Cả hai được inject lúc deploy. Tên secret trong Secrets Manager được hard-code trong handler là `"nutritrack/prod/api-keys"` và không cần env var riêng:

```typescript
// backend.ts (trích)
const cfnScanImageFn = backend.scanImage.resources.lambda.node.defaultChild as cdk.aws_lambda.CfnFunction;
cfnScanImageFn.addPropertyOverride('Environment.Variables.STORAGE_BUCKET_NAME', s3Bucket.bucketName);
cfnScanImageFn.addPropertyOverride('Environment.Variables.ECS_BASE_URL', ecsAlbDns);
```

## Xác thực JWT với ECS

`scan-image` không gọi ECS ẩn danh. Trước mỗi request:

1. Gọi `secretsmanager.GetSecretValue` để lấy `NUTRITRACK_API_KEY`.
2. Tự sinh JWT header và payload, ký bằng HMAC-SHA256 dùng module `crypto` built-in của Node.js — **không cần thư viện JWT bên ngoài**:

```typescript
import { createHmac } from 'crypto';

function buildJWT(secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'nutritrack-scan-image',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 300, // TTL 5 phút
  })).toString('base64url');
  const signature = createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}
```

3. Đính kèm token vào header `Authorization: Bearer <token>` trên mọi request HTTP đến ALB.

Container FastAPI xác thực JWT trên mỗi request. Request không có token hợp lệ nhận `401 Unauthorized` — đây là lớp ngăn truy cập internet trực tiếp bypass xác thực AppSync.

## Ba endpoint

| Tham số action | Endpoint ECS | Đầu vào | Kết quả |
| --- | --- | --- | --- |
| `analyzeFoodImage` | `POST /api/ai/analyze-food` | Form-data ảnh | JSON dinh dưỡng (food_id, macros, ingredients) |
| `analyzeFoodLabel` | `POST /api/ai/analyze-label` | Form-data ảnh | Nhãn dinh dưỡng đã parse (macro theo khẩu phần) |
| `scanBarcode` | `POST /api/ai/scan-barcode` | Form-data ảnh | Số barcode + mặt hàng thực phẩm khớp |

## Luồng polling bất đồng bộ

ECS FastAPI xử lý ảnh bất đồng bộ. Một POST trả về `job_id` ngay lập tức; Lambda sau đó poll `/jobs/{job_id}` cho đến khi có kết quả hoặc hết thời gian:

```typescript
async function submitAndPoll(endpoint: string, imageBuffer: Buffer, contentType: string, jwt: string): Promise<string> {
  const ECS_URL = process.env.ECS_BASE_URL!;

  // 1. Submit ảnh
  const form = new FormData();
  form.append('file', new Blob([imageBuffer], { type: contentType }), 'image.jpg');

  const submitRes = await fetch(`${ECS_URL}${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  });
  const { job_id } = await submitRes.json();

  // 2. Poll mỗi 3 giây, tối đa 90 lần (270 giây)
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const pollRes = await fetch(`${ECS_URL}/jobs/${job_id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const result = await pollRes.json();
    if (result.status === 'completed') return JSON.stringify(result.data);
    if (result.status === 'failed') throw new Error(result.error ?? 'ECS job failed');
  }
  throw new Error('Job timed out after 270 s');
}
```

## Handler đầy đủ

```typescript
export const handler = async (event: AppSyncResolverEvent<{ action: string; payload?: string }>) => {
  const { action, payload } = event.arguments;
  const data = payload ? JSON.parse(payload) : {};
  const { s3Key } = data;

  try {
    if (!s3Key || s3Key.includes('..')) throw new Error('Invalid s3Key');

    // Tải ảnh từ S3
    const s3Obj = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.STORAGE_BUCKET_NAME!,
      Key: s3Key,
    }));
    const chunks: Uint8Array[] = [];
    for await (const chunk of s3Obj.Body as any) chunks.push(chunk);
    const imageBuffer = Buffer.concat(chunks);
    const contentType = s3Obj.ContentType || 'image/jpeg';

    // Lấy API key từ Secrets Manager và tạo JWT
    const secret = await getApiKey();
    const jwt = buildJWT(secret);

    // Route đến endpoint ECS đúng
    const endpointMap: Record<string, string> = {
      'analyzeFoodImage': '/api/ai/analyze-food',
      'analyzeFoodLabel': '/api/ai/analyze-label',
      'scanBarcode':      '/api/ai/scan-barcode',
    };
    const endpoint = endpointMap[action];
    if (!endpoint) throw new Error(`Unknown action: ${action}`);

    const text = await submitAndPoll(endpoint, imageBuffer, contentType, jwt);
    return JSON.stringify({ success: true, text });
  } catch (error: any) {
    return JSON.stringify({ success: false, error: error.message });
  }
};
```

## Kết nối AppSync

```typescript
// data/resource.ts
scanImage: a
  .query()
  .arguments({
    action: a.string().required(),
    payload: a.string(),
  })
  .returns(a.string())
  .handler(a.handler.function(scanImage))
  .authorization((allow) => [allow.authenticated()]),
```

## Gọi từ frontend (xem 4.7.3)

```typescript
const res = await client.queries.scanImage({
  action: 'analyzeFoodImage',
  payload: JSON.stringify({ s3Key: 'incoming/user-abc/img-1.jpg' }),
});
const outer = JSON.parse(res.data ?? '{}');
if (outer.success) {
  const foodData = JSON.parse(outer.text); // JSON dinh dưỡng từ ECS
}
```

## Tóm tắt bảo mật

| Tầng | Cơ chế |
| --- | --- |
| Client → AppSync | Cognito ID token (auth mode `userPool`) |
| AppSync → Lambda | IAM invocation (Amplify quản lý) |
| Lambda → S3 | IAM policy `s3:GetObject` (least-privilege) |
| Lambda → Secrets Manager | IAM policy `secretsmanager:GetSecretValue` |
| Lambda → ECS ALB | `Authorization: Bearer <JWT HS256>` (TTL 5 phút) |
| ECS ALB | Xác thực chữ ký JWT và hạn sử dụng trước khi forward |

Không có request nào có thể đến thẳng ECS từ internet: listener rule của ALB từ chối mọi request không có JWT hợp lệ, và secret JWT chỉ được truy cập bởi role Lambda `scan-image`.

## Liên kết

- [4.5.2 AIEngine](/workshop/4.5.2-AIEngine) — orchestrator text/voice 9 action.
- [4.7.3 Giọng Nói & Camera](/workshop/4.7.3-Voice-Camera) — luồng camera gọi Lambda này.
- [4.8.2 Fargate & ALB](/workshop/4.8.2-Fargate-ALB) — setup ECS và xác thực JWT phía container.
- [4.11.2 IAM Policies](/workshop/4.11.2-IAM-Policies) — các policy statement của role `scanImage`.
