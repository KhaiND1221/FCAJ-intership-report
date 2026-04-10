# 4.8.1 VPC & ECR

## Network design

NutriTrack's ECS tier runs in a dedicated VPC in `ap-southeast-2`. The design follows the standard public/private subnet pattern:

```
VPC: 10.0.0.0/16 (ap-southeast-2)
  Public subnets (ALB):
    ap-southeast-2a: 10.0.1.0/24
    ap-southeast-2b: 10.0.2.0/24
  Private subnets (Fargate tasks):
    ap-southeast-2a: 10.0.3.0/24
    ap-southeast-2b: 10.0.4.0/24
  Internet Gateway → attached to VPC
  NAT Gateway → 10.0.1.0/24 (one AZ, cost trade-off)
  Route tables:
    Public:  0.0.0.0/0 → Internet Gateway
    Private: 0.0.0.0/0 → NAT Gateway
```

**Cost trade-off**: a single NAT Gateway (~$32/month + data transfer) is cheaper than two HA NAT Gateways (~$64/month). For production, use two NAT Gateways (one per AZ) to survive an AZ failure.

## Security groups

Two security groups:

**ALB-SG** — attached to the Application Load Balancer:

```
Inbound:
  HTTP  80   0.0.0.0/0   (redirects to HTTPS)
  HTTPS 443  0.0.0.0/0
Outbound:
  All traffic → Task-SG
```

**Task-SG** — attached to Fargate tasks:

```
Inbound:
  TCP 8000  source: ALB-SG   (FastAPI port)
Outbound:
  All traffic → 0.0.0.0/0    (reaches DynamoDB/Bedrock/S3 via NAT)
```

Never open port 8000 directly to `0.0.0.0/0`. All traffic must come through the ALB.

## VPC Endpoints (optional, cost saving)

To avoid NAT Gateway data transfer fees for AWS API calls:

- **S3 Gateway endpoint** — free, reduces S3 traffic cost.
- **DynamoDB Gateway endpoint** — free.
- **Bedrock Interface endpoint** — ~$7/month per AZ, but saves NAT data transfer on large payloads.

Add endpoints in the VPC console or via your IaC tool before deploying tasks.

## ECR repository setup

Create the repository in the same region as your ECS cluster:

```bash
aws ecr create-repository \
  --repository-name nutritrack-api \
  --region ap-southeast-2 \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability MUTABLE
```

`scanOnPush=true` runs a Basic Security Scan against the Common Vulnerabilities and Exposures (CVE) database on every push. Check the scan results in the ECR console before deploying.

## Build and push the Docker image

### Dockerfile

The FastAPI service uses a Python 3.11 slim base:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY routes/ routes/

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Login to ECR

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=ap-southeast-2
REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

aws ecr get-login-password --region ${REGION} \
  | docker login --username AWS --password-stdin ${REGISTRY}
```

### Build, tag, push

```bash
# Build for linux/amd64 (Fargate default; use linux/arm64 for Graviton tasks)
docker build --platform linux/amd64 -t nutritrack-api .

docker tag nutritrack-api:latest ${REGISTRY}/nutritrack-api:latest
docker push ${REGISTRY}/nutritrack-api:latest

# Tag with git SHA for traceability
GIT_SHA=$(git rev-parse --short HEAD)
docker tag nutritrack-api:latest ${REGISTRY}/nutritrack-api:${GIT_SHA}
docker push ${REGISTRY}/nutritrack-api:${GIT_SHA}
```

Always push two tags: `latest` and a git SHA. The SHA tag is immutable and makes rollbacks trivial.

### Verify the push

```bash
aws ecr describe-images \
  --repository-name nutritrack-api \
  --region ap-southeast-2 \
  --query 'imageDetails[*].{Tag:imageTags,Pushed:imagePushedAt,Size:imageSizeInBytes}' \
  --output table
```

## Lifecycle policy

Untagged images accumulate over time and incur storage cost. Add a lifecycle policy to keep only the 10 most recent tagged images:

```bash
aws ecr put-lifecycle-policy \
  --repository-name nutritrack-api \
  --region ap-southeast-2 \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Keep last 10 tagged images",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["latest"],
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": { "type": "expire" }
    }]
  }'
```

## IAM roles

Two IAM roles are needed for ECS:

**Task execution role** — used by the ECS agent to pull the image and push logs. Attach the managed policy `AmazonECSTaskExecutionRolePolicy`. This role is separate from the task role.

**Task role** — used by the running container. It needs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:PutItem", "dynamodb:UpdateItem"],
      "Resource": "arn:aws:dynamodb:ap-southeast-2:<account>:table/*"
    },
    {
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel"],
      "Resource": "arn:aws:bedrock:ap-southeast-2::foundation-model/qwen.qwen3-vl-235b-a22b"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::<bucket>/*"
    }
  ]
}
```

![VPC diagram](images/vpc-diagram.png)
![ECR console](images/ecr-console.png)

## Cross-links

- [4.8.2 Fargate & ALB](/workshop/4.8.2-Fargate-ALB) — deploy the ECS service and connect to the ALB.
- [4.10 Cleanup](/workshop/4.10-Cleanup) — ECS teardown order.
