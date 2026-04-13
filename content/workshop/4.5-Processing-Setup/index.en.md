# 4.5 Compute & AI — Lambdas and Bedrock

This section covers the compute layer of NutriTrack: five Lambda functions plus Amazon Bedrock. Together they turn a photo of phở into a structured nutrition log, answer Vietnamese-language coaching questions, proxy image analysis through ECS, and keep the image bucket tidy.

## The five Lambdas

All five are defined under `backend/amplify/*` and registered in `defineBackend` at `backend.ts`. Every one runs **Node.js 22 on ARM64** — no exceptions.

| Function | Entry | Memory | Timeout | Resource group | Trigger |
| --- | --- | --- | --- | --- | --- |
| `ai-engine` | `ai-engine/handler.ts` | 512 MB | 120 s | (default) | AppSync query `aiEngine` |
| `process-nutrition` | `process-nutrition/handler.ts` | 512 MB | 30 s | `data` | AppSync query `processNutrition` |
| `friend-request` | `friend-request/handler.ts` | (default) | (default) | (default) | AppSync mutation `friendRequest` |
| `resize-image` | `resize-image/handler.ts` | 512 MB | (default) | `storage` | S3 `ObjectCreated` on `incoming/` |
| `scan-image` | `scan-image/handler.ts` | 512 MB | 30 s | (default) | AppSync query `scanImage` |

The `resourceGroupName` matters: it tells Amplify which CloudFormation stack the Lambda belongs to. `storage` = grouped with the S3 bucket (no circular deps), `data` = grouped with the DynamoDB tables. `friend-request` and `ai-engine` sit in the root stack.

The 120-second timeout on `ai-engine` is required because `voiceToFood` starts an Amazon Transcribe job and polls it — Transcribe can take 30-60 seconds end-to-end before Bedrock is even called.

## Architecture

![Architecture Diagram](/FCAJ-intership-report/solution-architect/nutritrack-v4.drawio.png)

## Ground-truth Bedrock model

Every Bedrock call in NutriTrack targets exactly one model:

- **Model ID**: `qwen.qwen3-vl-235b-a22b`
- **Region**: `ap-southeast-2` (Sydney)
- **Invocation API**: `InvokeModelCommand` from `@aws-sdk/client-bedrock-runtime`
- **Schema**: OpenAI-compatible chat-completions (`messages[]` with `role` and `content`, supporting `type: 'text'` and `type: 'image_url'`)

This model is multimodal (vision + text), handles Vietnamese natively, and costs a fraction of Claude 3.5 Sonnet for this workload. The choice is discussed in 4.5.1.

> Any older docs or stale comments referencing `anthropic.claude-3-haiku-...` are wrong — production runs Qwen3-VL.

## The AI coach persona: Ollie

Every system prompt in `ai-engine/handler.ts` begins with `You are Ollie...`. Ollie is the NutriTrack brand persona: a Gen-Z Vietnamese nutrition coach, casual tone, responds in Vietnamese by default. Do not rename to "Bảo" or anything else — the frontend, analytics, and prompt library all depend on "Ollie."

## Sub-pages

- [4.5.1 Bedrock — model access, pricing, IAM, invocation shape](/workshop/4.5.1-Bedrock)
- [4.5.2 AIEngine — the 9-action Lambda orchestrator](/workshop/4.5.2-AIEngine)
- [4.5.3 ProcessNutrition — hybrid DB + Bedrock fuzzy lookup](/workshop/4.5.3-ProcessNutrition)
- [4.5.4 ResizeImage — S3-triggered sharp resizer](/workshop/4.5.4-ResizeImage)
- [4.5.5 ScanImage — image processing proxy to ECS FastAPI](/workshop/4.5.5-ScanImage)

Next: [4.6 Automation Setup](/workshop/4.6-Automation-Setup).
