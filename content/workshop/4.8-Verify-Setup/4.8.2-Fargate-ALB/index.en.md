# 4.8.2 Fargate & ALB

## ECS Cluster

Create a cluster using the Fargate capacity provider:

```bash
aws ecs create-cluster \
  --cluster-name nutritrack \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1,base=1 \
  --region ap-southeast-2
```

Use `FARGATE` for the base task (always runs) and `FARGATE_SPOT` for burstable capacity (70% cheaper, can be reclaimed). NutriTrack uses FARGATE for all tasks since it handles user-facing HTTP requests that can't tolerate sudden termination.

## Task Definition

Register a task definition. Replace `<ACCOUNT_ID>` and `<IMAGE_URI>` with your values:

```json
{
  "family": "nutritrack-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/nutritrackTaskRole",
  "containerDefinitions": [
    {
      "name": "nutritrack-api",
      "image": "<IMAGE_URI>:latest",
      "essential": true,
      "portMappings": [{ "containerPort": 8000, "protocol": "tcp" }],
      "environment": [
        { "name": "AWS_REGION", "value": "ap-southeast-2" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nutritrack-api",
          "awslogs-region": "ap-southeast-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Save as `task-definition.json` and register:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region ap-southeast-2
```

The FastAPI app must expose `GET /health` returning `200 OK`. Add it to `main.py`:

```python
@app.get("/health")
def health():
    return {"status": "healthy"}
```

## CloudWatch Log Group

Create the log group before deploying (ECS won't create it automatically):

```bash
aws logs create-log-group \
  --log-group-name /ecs/nutritrack-api \
  --region ap-southeast-2

aws logs put-retention-policy \
  --log-group-name /ecs/nutritrack-api \
  --retention-in-days 30 \
  --region ap-southeast-2
```

## Application Load Balancer

### Create ALB

```bash
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name nutritrack-alb \
  --type application \
  --scheme internet-facing \
  --subnets <PUBLIC_SUBNET_A_ID> <PUBLIC_SUBNET_B_ID> \
  --security-groups <ALB_SG_ID> \
  --region ap-southeast-2 \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)
```

### Create Target Group

```bash
TG_ARN=$(aws elbv2 create-target-group \
  --name nutritrack-api-tg \
  --protocol HTTP \
  --port 8000 \
  --target-type ip \
  --vpc-id <VPC_ID> \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region ap-southeast-2 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)
```

`target-type ip` is required for Fargate (`awsvpc` network mode uses task ENIs, not EC2 instance IPs).

### Create Listener

For HTTP (redirect to HTTPS in production; use HTTP for dev):

```bash
aws elbv2 create-listener \
  --load-balancer-arn ${ALB_ARN} \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=${TG_ARN} \
  --region ap-southeast-2
```

For HTTPS (requires an ACM certificate for your domain):

```bash
CERT_ARN=$(aws acm list-certificates \
  --query 'CertificateSummaryList[?DomainName==`nutri-track.link`].CertificateArn' \
  --output text)

aws elbv2 create-listener \
  --load-balancer-arn ${ALB_ARN} \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=${CERT_ARN} \
  --default-actions Type=forward,TargetGroupArn=${TG_ARN} \
  --region ap-southeast-2
```

## ECS Service

```bash
aws ecs create-service \
  --cluster nutritrack \
  --service-name nutritrack-api \
  --task-definition nutritrack-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[<PRIVATE_SUBNET_A_ID>,<PRIVATE_SUBNET_B_ID>],
    securityGroups=[<TASK_SG_ID>],
    assignPublicIp=DISABLED
  }" \
  --load-balancers "targetGroupArn=${TG_ARN},containerName=nutritrack-api,containerPort=8000" \
  --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200" \
  --region ap-southeast-2
```

`minimumHealthyPercent=100` / `maximumPercent=200`: rolling update — starts new tasks before stopping old ones, ensuring zero downtime.

## Autoscaling

Target tracking on CPU:

```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/nutritrack/nutritrack-api \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 8 \
  --region ap-southeast-2

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/nutritrack/nutritrack-api \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-target-tracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 60.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }' \
  --region ap-southeast-2
```

Scale out quickly (60s cooldown) when CPU spikes; scale in slowly (300s cooldown) to avoid thrashing.

## Deploying updates

Push a new image, then update the service:

```bash
docker build --platform linux/amd64 -t nutritrack-api .
docker push ${REGISTRY}/nutritrack-api:latest

aws ecs update-service \
  --cluster nutritrack \
  --service nutritrack-api \
  --force-new-deployment \
  --region ap-southeast-2
```

`--force-new-deployment` triggers a rolling deploy even if the task definition didn't change (e.g., new image at the same `latest` tag).

## Verification

```bash
# Get ALB DNS
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names nutritrack-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text \
  --region ap-southeast-2)

# Health check
curl http://${ALB_DNS}/health
# Expected: {"status":"healthy"}

# Watch service events
aws ecs describe-services \
  --cluster nutritrack \
  --services nutritrack-api \
  --query 'services[0].events[0:5]' \
  --region ap-southeast-2
```

## Serverless → Container Authentication

The ECS FastAPI cluster is not open to the internet — it only accepts requests that carry a valid JWT signed with the shared `NUTRITRACK_API_KEY` secret. This section explains how the `scan-image` Lambda generates that token and how the container validates it.

### Lambda side — JWT generation

Before every call to the ALB, `scan-image`:

1. Calls `secretsmanager:GetSecretValue` to retrieve the `NUTRITRACK_API_KEY` from Secrets Manager (ARN: `arn:aws:secretsmanager:<region>:<account>:secret:nutritrack/prod/api-keys*`).
2. Constructs and signs a JWT using **HS256** with Node.js built-in `crypto` — no third-party JWT library:

   ```typescript
   import { createHmac } from 'crypto';

   function buildJWT(secret: string): string {
     const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
     const payload = Buffer.from(JSON.stringify({
       iss: 'nutritrack-scan-image',
       iat: Math.floor(Date.now() / 1000),
       exp: Math.floor(Date.now() / 1000) + 60,  // 1-minute TTL
     })).toString('base64url');
     const sig = createHmac('sha256', secret)
       .update(`${header}.${payload}`)
       .digest('base64url');
     return `${header}.${payload}.${sig}`;
   }
   ```

3. Sends the token as `Authorization: Bearer <token>` on every HTTP request to the ALB.

### Container side — JWT validation

The FastAPI middleware on the ECS container verifies the token on every incoming request:

- Decodes the header and payload (base64url).
- Recomputes the HMAC-SHA256 signature using its own copy of `NUTRITRACK_API_KEY` (injected via ECS task environment variable or Secrets Manager sidecar).
- Rejects with `401 Unauthorized` if the signature does not match or `exp` is in the past.

Requests that reach the ALB without `Authorization: Bearer` are rejected by the ALB listener rule before they reach the container — the task SG only allows inbound TCP 8000 from the ALB SG, so direct internet access is blocked at the network layer as well.

### Why HS256 over asymmetric keys?

The Lambda and the ECS container are both internal AWS services in the same account. Symmetric HS256 is simpler to rotate (update one secret, redeploy both sides) and has no certificate management overhead. The 1-minute TTL limits the blast radius if a token is intercepted.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Task stuck in PROVISIONING | Image pull fails | Check ECR: execution role needs `ecr:GetAuthorizationToken` + `ecr:BatchGetImage`; NAT Gateway route is correct |
| Task stops immediately (exit 1) | App crash on startup | `aws logs tail /ecs/nutritrack-api --follow`; usually a missing env var or import error |
| ALB returns 502 Bad Gateway | `/health` endpoint missing or container not started | Verify `GET /health` returns 200; check health check grace period (`startPeriod: 60`) |
| ALB returns 504 Gateway Timeout | Task-SG blocks ALB-SG | Verify Task-SG inbound rule allows TCP 8000 from ALB-SG specifically |
| Autoscaling not triggering | Scale-in cooldown | Wait 5 minutes; or check CloudWatch alarm state |

## Cost estimate

At 2 tasks × 0.5 vCPU / 1 GB RAM in ap-southeast-2 (2025 prices):

| Component | Monthly cost |
| --- | --- |
| Fargate (2 tasks, 730 hrs) | ~$17 |
| NAT Gateway | ~$32 |
| ALB | ~$16 |
| CloudWatch logs (30 days, 5 GB) | ~$2 |
| **Total** | **~$67** |

At 0 traffic, the dominant cost is NAT Gateway — consider using VPC endpoints for DynamoDB and S3 to reduce it.

## Cross-links

- [4.8.1 VPC & ECR](/workshop/4.8.1-VPC-ECR) — network and registry prerequisites.
- [4.10 Cleanup](/workshop/4.10-Cleanup) — delete service → task definitions → cluster → ALB → VPC (in order).
