# 4.11.1 Budget Breakdown

Cost estimates for running NutriTrack in `ap-southeast-2` (Sydney). All prices are 2025 public rates. Actual spend varies with traffic — the figures below assume a small active user base (100 DAU, ~3 food logs per user per day via camera).

---

## Amplify Gen 2 Backend

| Service | Unit | Rate | Monthly estimate |
| --- | --- | --- | --- |
| AppSync (GraphQL) | Per million query/mutation | $4.00 / M | ≈$2 (500K ops) |
| AppSync (real-time) | Per million connection-minutes | $0.08 / M | ≈$1 |
| DynamoDB (on-demand) | Per million read/write request units | $0.25 RRU / $1.25 WRU per M | ≈$4 |
| DynamoDB storage | Per GB-month | $0.285 / GB | <$1 |
| Lambda invocations | Per million | $0.20 / M | <$1 (free tier) |
| Lambda duration | Per GB-second | $0.0000166667 | ≈$2 (512 MB × 120s avg) |
| S3 storage | Per GB-month | $0.025 / GB | ≈$1 |
| S3 PUT/GET requests | Per 1,000 | $0.005 PUT / $0.0004 GET | ≈$1 |
| Cognito (MAU) | First 50,000 MAU | Free | $0 |
| Amplify Hosting (CI/CD) | Build minutes | $0.01 / min | ≈$1 |

**Amplify subtotal: ≈$13/month**

---

## Amazon Bedrock (Qwen3-VL 235B)

Qwen3-VL 235B in `ap-southeast-2` (2025 on-demand rates):

| Token type | Rate |
| --- | --- |
| Input (text) | $0.002 / 1K tokens |
| Input (image) | $0.002 / 1K tokens |
| Output | $0.006 / 1K tokens |

### Per-action cost estimate

> **Note:** `analyzeFoodImage`, `analyzeFoodLabel`, and `scanBarcode` are handled by the `scan-image` Lambda, which forwards requests to the ECS FastAPI service — they do **not** invoke Bedrock and are not billed here.

| Action | Input tokens | Output tokens | Cost/call |
| --- | --- | --- | --- |
| `generateFoodNutrition` (DB miss) | ~450 (prompt + name) | ~400 | ≈$0.0033 |
| `voiceToFood` | ~500 | ~350 | ≈$0.0031 |
| `ollieCoachTip` | ~300 | ~100 | ≈$0.0009 |
| `generateCoachResponse` | ~800 | ~500 | ≈$0.0046 |
| `generateRecipe` | ~600 | ~600 | ≈$0.0048 |
| `calculateMacros` | ~350 | ~200 | ≈$0.0019 |
| `challengeSummary` | ~400 | ~150 | ≈$0.0017 |
| `weeklyInsight` | ~500 | ~250 | ≈$0.0025 |

### Monthly Bedrock total (100 DAU)

| Action | Calls/day | Calls/month | Cost/month |
| --- | --- | --- | --- |
| `generateFoodNutrition` | 100 | 3,000 | ≈$10 |
| `voiceToFood` | 50 | 1,500 | ≈$5 |
| Coach tips + chat | 150 | 4,500 | ≈$12 |
| Other (recipe, macro, etc.) | 30 | 900 | ≈$3 |
| **Total** | | | **≈$30** |

Image scanning (`analyzeFoodImage`, `analyzeFoodLabel`, `scanBarcode`) is processed by the ECS FastAPI service — its compute cost is covered by the ECS Fargate line below, not Bedrock.

**Optimization levers:**

- Cache `generateFoodNutrition` results in DynamoDB by food name — cuts repeat lookups.
- Use `FARGATE_SPOT` for batch/offline actions (weekly insight) to save ~70% on compute.

---

## Amazon Transcribe

Vietnamese voice logging uses `LanguageCode: 'vi-VN'` (no auto-detect).

| Metric | Value |
| --- | --- |
| Rate | $0.024 / minute |
| Avg audio duration | 10 seconds |
| Cost per transcription | ≈$0.004 |
| 50 voice logs/day × 30 days | ≈$6/month |

**Transcribe subtotal: ≈$6/month**

---

## ECS Fargate + ALB (FastAPI backend)

From [4.8.2 Fargate & ALB](/workshop/4.8.2-Fargate-ALB):

| Component | Monthly cost |
| --- | --- |
| Fargate (2 tasks, 0.5 vCPU / 1 GB, 730 hrs) | ≈$17 |
| NAT Instance (2×t4g.nano, Auto Scaling) | ≈$9 |
| Application Load Balancer | ≈$16 |
| CloudWatch Logs (5 GB, 30-day retention) | ≈$2 |
| **ECS subtotal** | **≈$44** |

NutriTrack uses NAT Instance (2×t4g.nano) instead of NAT Gateway (≈$43/month in ap-southeast-2), saving ≈$34/month. The container image is hosted on Docker Hub (free tier) — no ECR storage cost. See [4.8.4 NAT Instance](/workshop/4.8.4-NAT-Instance).

---

## Total monthly estimate

| Category | Monthly cost |
| --- | --- |
| Amplify Gen 2 backend (AppSync, DynamoDB, Lambda, S3, Cognito) | ≈$13 |
| Amazon Bedrock (Qwen3-VL, 100 DAU, text/voice only) | ≈$30 |
| Amazon Transcribe (voice logs) | ≈$6 |
| ECS Fargate + ALB + NAT Instance | ≈$44 |
| **Grand total** | **≈$93/month** |

---

## Cost by environment

| Environment | Description | Estimated cost |
| --- | --- | --- |
| Sandbox (`npx ampx sandbox`) | Single developer, ephemeral Amplify backend, no ECS | ≈$5–10/month |
| Staging (`feat/phase3` branch) | Persistent Amplify backend, shared ECS cluster (1 task) | ≈$60–80/month |
| Production (`main` branch) | Full stack as described above (100 DAU) | ≈$166/month |

Sandbox tears down when you exit — DynamoDB tables and Lambda functions are deleted, so no idle cost. The only persistent sandbox cost is S3 objects left behind after teardown.

---

## Scaling projections

| DAU | Bedrock (text/voice) | Transcribe | ECS (auto-scale) | Total |
| --- | --- | --- | --- | --- |
| 100 | ≈$30 | ≈$6 | ≈$44 | ≈$93 |
| 500 | ≈$150 | ≈$30 | ≈$67 (4 tasks) | ≈$260 |
| 1,000 | ≈$300 | ≈$60 | ≈$97 (6 tasks) | ≈$470 |
| 5,000 | ≈$1,500 | ≈$300 | ≈$177 (8 tasks max) | ≈$2,000 |

Note: image-scanning compute scales with ECS task count (already reflected in the ECS column above).

At 5,000 DAU, Bedrock text/voice costs dominate. Consider:

1. **Reserved Capacity** for Bedrock (if available for Qwen3-VL) — can cut per-token cost by up to 50%.
2. **Provisioned Throughput** for Bedrock — reduces latency at high concurrency.
3. **DynamoDB Provisioned** mode above ~500 WCU/RCU sustained — cheaper than on-demand at high steady load.
4. **Two NAT Instances** (one per AZ) for HA — each t4g.nano ≈$4.50/month; doubles NAT cost but survives AZ failure.

## Cross-links

- [4.10 Cleanup](/workshop/4.10-Cleanup) — delete resources to stop billing.
- [4.8.2 Fargate & ALB](/workshop/4.8.2-Fargate-ALB) — ECS cost detail and autoscaling config.
- [4.5.1 Bedrock](/workshop/4.5.1-Bedrock) — model access setup.
