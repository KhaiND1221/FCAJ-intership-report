# 4.1 Overview

NutriTrack is a production-grade, AI-powered nutrition tracking platform built on AWS Amplify Gen 2. This workshop walks you through deploying the exact backend and mobile client that — source: [neurax-web-app](https://github.com/NeuraX-HQ/neurax-web-app) — end to end, in a single working day.

## What You Will Build

By the end of this workshop you will have a running stack that contains:

- **6 DynamoDB models** managed by AppSync (`Food`, `user`, `FoodLog`, `FridgeItem`, `Friendship`, `UserPublicStats`) defined in `backend/amplify/data/resource.ts`.
- **5 Lambda functions** on **Node.js 22 / ARM64**:
  - `ai-engine` — multi-action AI handler, 512 MB, 120 s timeout.
  - `process-nutrition` — hybrid DynamoDB + AI nutrition lookup.
  - `friend-request` — friend system mutations.
  - `resize-image` — S3 event trigger on the `incoming/` prefix.
  - `scan-image` — image processing proxy: fetches files from S3, forwards to ECS FastAPI (`/analyze-food`, `/analyze-label`, `/scan-barcode`) via JWT-authenticated requests, and returns results via asynchronous job polling.
- **8 AI actions** served by the `aiEngine` Lambda: `generateCoachResponse`, `generateFoodNutrition`, `fixFood`, `voiceToFood`, `ollieCoachTip`, `generateRecipe`, `calculateMacros`, `weeklyInsight`.
- **Amazon Bedrock** foundation model `qwen.qwen3-vl-235b-a22b` in **ap-southeast-2** (Sydney), invoked by the AI coach persona **Ollie**, processing voice context, and called directly from the **ECS FastAPI** service for image analysis.
- **Amazon S3** storage bucket with `incoming/`, `voice/`, and `media/` prefixes, wired to `resize-image` via an S3 event notification and a 1-day lifecycle rule on `incoming/`.
- **Amazon Cognito** user pool with email + OTP signup and Google federated identity.
- **Amazon Transcribe** for voice-to-food logging, invoked from `ai-engine` with a resource-policy grant on `voice/*`.
- **ECS Fargate** container tier running a FastAPI service (`backend/main.py`) behind an Application Load Balancer. Deployed manually via the AWS Console for simpler understanding, without Terraform.
- **Expo mobile app** (SDK 54, React Native 0.81, React 19, Expo Router 6, Zustand 5) in `frontend/`.

## AWS Services Used

| Service | Role in NutriTrack |
| --- | --- |
| **AWS Amplify Gen 2** | Project scaffold, CI/CD pipeline (`amplify.yml`), multi-environment deployments (sandbox → staging → production) |
| **AWS AppSync** | Managed GraphQL API — all client queries, mutations, and real-time subscriptions route through AppSync |
| **Amazon DynamoDB** | Primary NoSQL datastore for 6 data models (`Food`, `FoodLog`, `FridgeItem`, `Friendship`, and more) |
| **AWS Lambda** | Five Node.js 22 / ARM64 functions: `aiEngine`, `processNutrition`, `friendRequest`, `resizeImage`, `scan-image` |
| **AWS Secrets Manager** | Secure storage for `NUTRITRACK_API_KEY` — the shared secret used to generate HS256 JWT tokens for ECS endpoint authentication |
| **Amazon Bedrock** | Foundation model inference — `qwen.qwen3-vl-235b-a22b` in `ap-southeast-2` for all AI actions, voice processing, and image analysis directly from ECS |
| **Amazon S3** | Media storage with four prefixes (`incoming/`, `voice/`, `avatar/`, `media/`) and a 1-day lifecycle rule on `incoming/` |
| **Amazon Cognito** | User authentication — email + OTP signup and Google federated identity via the Hosted UI |
| **Amazon Transcribe** | Speech-to-text for Vietnamese voice food logging (`vi-VN`), invoked from `aiEngine` |
| **Amazon ECS Fargate** | Containerized FastAPI service for image analysis, deployed manually via AWS Console behind an Application Load Balancer for high throughput |
| **Amazon ECR** | Stores the container image of FastAPI for deployment to ECS |
| **Amazon VPC** | Network isolation for the ECS tier — private subnets, NAT Instance, VPC endpoints for DynamoDB/S3 |
| **Amazon CloudWatch** | Logs, metrics, and alarms for Lambda execution, Bedrock latency, and ECS health |
| **AWS IAM** | Least-privilege execution roles for each Lambda and ECS task; Cognito identity pool roles for mobile client |
| **Amazon CloudFront** | CDN for the Amplify Hosting frontend (auto-configured by Amplify) |
| **Amazon Route 53** | DNS routing for the ALB endpoint and CloudFront distribution |
| **AWS WAF** | Web Application Firewall protecting the CloudFront + ALB layer from malicious traffic |

## Architecture at a Glance

![NutriTrack Solution Architecture](/FCAJ-intership-report/solution-architect/nutritrack-v4.drawio.png)

## Learning Outcomes

After completing this workshop you will be able to:

1. Bootstrap an Amplify Gen 2 backend from scratch and evolve it through three environments (sandbox, `feat/phase3`, `main`).
2. Model a real multi-tenant domain in Amplify Data with owner-scoped authorization and GSIs.
3. Wire Node.js 22 Lambdas into AppSync as custom queries and mutations, and attach IAM policies with the CDK escape hatch.
4. Call Amazon Bedrock multimodal foundation models (Qwen3-VL) from Lambda, including image and voice inputs.
5. Configure S3 event notifications, resource policies for Transcribe, and lifecycle rules directly in `backend.ts`.
6. Ship the Expo client against the auto-generated `amplify_outputs.json` and run it on a device via Expo Go.
7. Decommission everything cleanly so your AWS bill returns to zero.

## Estimated Cost

| Service | 1 Day (workshop) | 1 Month (100 DAU) |
| --- | --- | --- |
| Amplify Gen 2 (AppSync, DynamoDB, Lambda, S3) | < $1 | ≈$13 |
| Amazon Bedrock (Qwen3-VL 235B) | ≈$2–5 | ≈$30 |
| Amazon Transcribe (voice logs) | < $0.50 | ≈$6 |
| ECS Fargate + ALB + NAT Instance | ≈$2–5 | ≈$44 |
| **Total** | **≈$5–10** | **≈$93** |

The dominant cost driver is **Amazon Bedrock** — AI coaching and food text lookups account for the majority of Bedrock spend. Image scanning now runs directly on **ECS Fargate**, shifting photo-analysis cost to the ECS compute line. Enable AWS Budgets with a **$25/month** alert before starting. See the full breakdown in [4.11.1 Budget Breakdown](/workshop/4.11.1-Budget-Breakdown).

## Duration and Difficulty

- **Duration**: ~1 full working day (6 to 8 hours) if you follow every step in order without detours.
- **Difficulty**: **Intermediate**. You should be comfortable with TypeScript, the AWS Console, and a terminal. React Native experience is helpful but not required — the frontend runs as-is.

## Workshop Sections

1. [4.2 Prerequisites](/workshop/4.2-Prerequiste) — accounts, tooling, Bedrock access request.
2. [4.3 Foundation Setup](/workshop/4.3-Foundation-Setup) — repo layout, Amplify sandbox, Cognito.
3. [4.4 Monitoring Setup](/workshop/4.4-Monitoring-Setup) — AppSync and DynamoDB models.
4. [4.5 Processing Setup](/workshop/4.5-Processing-Setup) — Bedrock + `ai-engine` Lambda.
5. [4.6 Automation Setup](/workshop/4.6-Automation-Setup) — S3, resize-image trigger, Transcribe.
6. [4.7 Dashboard Setup](/workshop/4.7-Dashboard-Setup) — Expo app configuration.
7. [4.8 Verify Setup](/workshop/4.8-Verify-Setup) — end-to-end smoke tests.
8. [4.9 CI/CD — Amplify Multi-Environment](/workshop/4.9-Use-CDK) — `amplify.yml`, sandbox → `feat/phase3` → `main`.
9. [4.10 Cleanup](/workshop/4.10-Cleanup) — destructive-safe teardown.
10. [4.11 Appendices](/workshop/4.11-Appendices) — cost breakdown, troubleshooting, references.

## Team 11 — NeuraX

Built by **Team 11 — NeuraX** during the First Cloud AI Journey (FCAJ) internship at Amazon Web Services Vietnam. See the [proposal](/proposal) for the full member list and role breakdown.

## Source of Truth

Every claim in this workshop is grounded in the real implementation under the [neurax-web-app](https://github.com/NeuraX-HQ/neurax-web-app) repository. When the documentation and the code disagree, the code wins. Key files to keep open in a second tab:

- `backend/amplify/backend.ts` ([view](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/backend/amplify/backend.ts))
- `backend/amplify/data/resource.ts` ([view](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/backend/amplify/data/resource.ts))
- `backend/amplify/ai-engine/handler.ts` ([view](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/backend/amplify/ai-engine/handler.ts))
- `amplify.yml` ([view](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/amplify.yml))
- `CLAUDE.md` ([view](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/CLAUDE.md))
