# 4.5.5 ScanImage — Image Processing Proxy

`scan-image` is the fifth Lambda in NutriTrack. It is not a general AI orchestrator — it has exactly one job: receive an S3 object key from AppSync, fetch the image, authenticate against the ECS FastAPI cluster using a self-signed JWT, forward the image as multipart form-data, and poll for the result.

The ECS FastAPI container runs its own AI inference pipeline and is accessible through the Application Load Balancer at `http://nutritrack-api-vpc-alb-xxxxxxxxx.ap-southeast-2.elb.amazonaws.com`. The Lambda is the secure bridge between the serverless AppSync layer and the containerised compute layer.

## Resource definition

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

30 seconds is enough: the ECS job for a single image typically completes within 5–10 seconds. If polling times out, the Lambda returns `{ success: false, error: 'Job timed out' }`.

## Environment variables

| Variable | Source | Purpose |
| --- | --- | --- |
| `STORAGE_BUCKET_NAME` | CDK property override | The S3 bucket to fetch images from |
| `ECS_BASE_URL` | CDK property override | ALB DNS or domain for the FastAPI cluster |

Both are injected at deploy time. The Secrets Manager secret name is hard-coded in the handler as `"nutritrack/prod/api-keys"` and does not need an env var:

```typescript
// backend.ts (excerpt)
const cfnScanImageFn = backend.scanImage.resources.lambda.node.defaultChild as cdk.aws_lambda.CfnFunction;
cfnScanImageFn.addPropertyOverride('Environment.Variables.STORAGE_BUCKET_NAME', s3Bucket.bucketName);
cfnScanImageFn.addPropertyOverride('Environment.Variables.ECS_BASE_URL', ecsAlbDns);
```

## JWT authentication against ECS

`scan-image` does not call ECS anonymously. Before every request it:

1. Calls `secretsmanager.GetSecretValue` to retrieve `NUTRITRACK_API_KEY`.
2. Constructs a JWT header and payload, signs with HMAC-SHA256 using Node.js built-in `crypto` — **no external JWT library required**:

```typescript
import { createHmac } from 'crypto';

function buildJWT(secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'nutritrack-scan-image',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 300, // 5-minute TTL
  })).toString('base64url');
  const signature = createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}
```

3. Attaches the token as `Authorization: Bearer <token>` on every HTTP request to the ALB.

The FastAPI container validates the JWT on each request. Requests without a valid token return `401 Unauthorized` — this is the layer that prevents direct internet access from bypassing AppSync auth.

## The three endpoints

| Action argument | ECS endpoint | Input | Returns |
| --- | --- | --- | --- |
| `analyzeFoodImage` | `POST /api/ai/analyze-food` | Image form-data | Nutrition JSON (food_id, macros, ingredients) |
| `analyzeFoodLabel` | `POST /api/ai/analyze-label` | Image form-data | Parsed nutrition label (per-serving macros) |
| `scanBarcode` | `POST /api/ai/scan-barcode` | Image form-data | Barcode number + matched food item |

## Async polling flow

ECS FastAPI processes images asynchronously. A POST returns a `job_id` immediately; the Lambda then polls `/jobs/{job_id}` until the result is ready or the timeout is reached:

```typescript
async function submitAndPoll(endpoint: string, imageBuffer: Buffer, contentType: string, jwt: string): Promise<string> {
  const ECS_URL = process.env.ECS_BASE_URL!;

  // 1. Submit image
  const form = new FormData();
  form.append('file', new Blob([imageBuffer], { type: contentType }), 'image.jpg');

  const submitRes = await fetch(`${ECS_URL}${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  });
  const { job_id } = await submitRes.json();

  // 2. Poll every 3 seconds, up to 90 attempts (270 s total)
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

## Full handler

```typescript
export const handler = async (event: AppSyncResolverEvent<{ action: string; payload?: string }>) => {
  const { action, payload } = event.arguments;
  const data = payload ? JSON.parse(payload) : {};
  const { s3Key } = data;

  try {
    if (!s3Key || s3Key.includes('..')) throw new Error('Invalid s3Key');

    // Fetch image from S3
    const s3Obj = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.STORAGE_BUCKET_NAME!,
      Key: s3Key,
    }));
    const chunks: Uint8Array[] = [];
    for await (const chunk of s3Obj.Body as any) chunks.push(chunk);
    const imageBuffer = Buffer.concat(chunks);
    const contentType = s3Obj.ContentType || 'image/jpeg';

    // Get API key from Secrets Manager and build JWT
    const secret = await getApiKey();
    const jwt = buildJWT(secret);

    // Route to correct ECS endpoint
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

## AppSync wiring

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

## Frontend call (from 4.7.3)

```typescript
const res = await client.queries.scanImage({
  action: 'analyzeFoodImage',
  payload: JSON.stringify({ s3Key: 'incoming/user-abc/img-1.jpg' }),
});
const outer = JSON.parse(res.data ?? '{}');
if (outer.success) {
  const foodData = JSON.parse(outer.text); // nutrition JSON from ECS
}
```

## Security summary

| Layer | Mechanism |
| --- | --- |
| Client → AppSync | Cognito ID token (`userPool` auth mode) |
| AppSync → Lambda | IAM invocation (Amplify managed) |
| Lambda → S3 | `s3:GetObject` IAM policy (least-privilege) |
| Lambda → Secrets Manager | `secretsmanager:GetSecretValue` IAM policy |
| Lambda → ECS ALB | `Authorization: Bearer <HS256 JWT>` (5-minute TTL) |
| ECS ALB | Validates JWT signature and expiry before forwarding |

No request can reach ECS directly from the internet: the ALB's listener rules reject anything without a valid JWT, and the JWT secret is only accessible by the `scan-image` Lambda role.

## Cross-links

- [4.5.2 AIEngine](/workshop/4.5.2-AIEngine) — the 9-action text/voice orchestrator.
- [4.7.3 Voice & Camera](/workshop/4.7.3-Voice-Camera) — camera flow that calls this Lambda.
- [4.8.2 Fargate & ALB](/workshop/4.8.2-Fargate-ALB) — ECS setup and JWT validation on the container side.
- [4.11.2 IAM Policies](/workshop/4.11.2-IAM-Policies) — `scanImage` role statements.
