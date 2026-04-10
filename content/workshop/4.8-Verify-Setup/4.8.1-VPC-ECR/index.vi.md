# 4.8.1 VPC & ECR

## Thiết kế mạng

Tầng ECS của NutriTrack chạy trong một VPC riêng tại `ap-southeast-2`. Thiết kế theo pattern public/private subnet tiêu chuẩn:

```text
VPC: 10.0.0.0/16 (ap-southeast-2)
  Public subnets (ALB):
    ap-southeast-2a: 10.0.1.0/24
    ap-southeast-2b: 10.0.2.0/24
  Private subnets (Fargate tasks):
    ap-southeast-2a: 10.0.3.0/24
    ap-southeast-2b: 10.0.4.0/24
  Internet Gateway → gắn vào VPC
  NAT Gateway → 10.0.1.0/24 (một AZ, đánh đổi chi phí)
  Route tables:
    Public:  0.0.0.0/0 → Internet Gateway
    Private: 0.0.0.0/0 → NAT Gateway
```

**Đánh đổi chi phí**: một NAT Gateway (~$32/tháng + data transfer) rẻ hơn hai NAT Gateway HA (~$64/tháng). Cho production, dùng hai NAT Gateway (mỗi AZ một cái) để chịu lỗi AZ.

## Security group

Hai security group:

**ALB-SG** — gắn vào Application Load Balancer:

```text
Inbound:
  HTTP  80   0.0.0.0/0   (chuyển hướng sang HTTPS)
  HTTPS 443  0.0.0.0/0
Outbound:
  All traffic → Task-SG
```

**Task-SG** — gắn vào Fargate task:

```text
Inbound:
  TCP 8000  source: ALB-SG   (cổng FastAPI)
Outbound:
  All traffic → 0.0.0.0/0    (tiếp cận DynamoDB/Bedrock/S3 qua NAT)
```

Không bao giờ mở port 8000 trực tiếp ra `0.0.0.0/0`. Toàn bộ traffic phải đi qua ALB.

## VPC Endpoint (tùy chọn, tiết kiệm chi phí)

Để tránh phí data transfer NAT Gateway khi gọi AWS API:

- **S3 Gateway endpoint** — miễn phí, giảm chi phí S3 traffic.
- **DynamoDB Gateway endpoint** — miễn phí.
- **Bedrock Interface endpoint** — ~$7/tháng/AZ, nhưng tiết kiệm NAT với payload lớn.

Thêm endpoint trong VPC console hoặc qua IaC trước khi deploy task.

## Tạo ECR repository

Tạo repository trong cùng region với ECS cluster:

```bash
aws ecr create-repository \
  --repository-name nutritrack-api \
  --region ap-southeast-2 \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability MUTABLE
```

`scanOnPush=true` chạy Basic Security Scan đối với cơ sở dữ liệu CVE khi mỗi lần push. Kiểm tra kết quả scan trong ECR console trước khi deploy.

## Build và push Docker image

### Dockerfile

FastAPI service dùng base Python 3.11 slim:

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

### Login ECR

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=ap-southeast-2
REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

aws ecr get-login-password --region ${REGION} \
  | docker login --username AWS --password-stdin ${REGISTRY}
```

### Build, tag, push

```bash
# Build cho linux/amd64 (Fargate mặc định)
docker build --platform linux/amd64 -t nutritrack-api .

docker tag nutritrack-api:latest ${REGISTRY}/nutritrack-api:latest
docker push ${REGISTRY}/nutritrack-api:latest

# Tag với git SHA để traceability
GIT_SHA=$(git rev-parse --short HEAD)
docker tag nutritrack-api:latest ${REGISTRY}/nutritrack-api:${GIT_SHA}
docker push ${REGISTRY}/nutritrack-api:${GIT_SHA}
```

Luôn push hai tag: `latest` và git SHA. Tag SHA bất biến giúp rollback dễ dàng.

### Xác nhận push

```bash
aws ecr describe-images \
  --repository-name nutritrack-api \
  --region ap-southeast-2 \
  --query 'imageDetails[*].{Tag:imageTags,Pushed:imagePushedAt,Size:imageSizeInBytes}' \
  --output table
```

## Lifecycle policy

Image không có tag tích lũy theo thời gian và tốn storage. Thêm lifecycle policy giữ 10 image tagged gần nhất:

```bash
aws ecr put-lifecycle-policy \
  --repository-name nutritrack-api \
  --region ap-southeast-2 \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Giữ 10 image tagged gần nhất",
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

Cần hai IAM role cho ECS:

**Task execution role** — dùng bởi ECS agent để pull image và push log. Gắn managed policy `AmazonECSTaskExecutionRolePolicy`.

**Task role** — dùng bởi container đang chạy. Cần:

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

![Sơ đồ VPC](images/vpc-diagram.png)
![ECR console](images/ecr-console.png)

## Liên kết

- [4.8.2 Fargate & ALB](/workshop/4.8.2-Fargate-ALB)
- [4.10 Dọn Dẹp](/workshop/4.10-Cleanup)
