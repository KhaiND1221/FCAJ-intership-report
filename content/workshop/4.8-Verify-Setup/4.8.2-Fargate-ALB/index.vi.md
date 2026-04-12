# 4.8.2 Fargate & ALB

> **Điều kiện trước:** Đã hoàn thành [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR), [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure), và [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance).

---

## 1. Build & Push Docker Image lên Docker Hub

NutriTrack dùng **Docker Hub** (không phải ECR) để lưu container image. ECS Task sẽ pull image từ Docker Hub qua NAT Instance đã cấu hình.

### 1.1 Chuẩn bị

```bash
# Đăng nhập Docker Hub
docker login
# Nhập Docker Hub username và password/token khi được hỏi
```

### 1.2 Build Image

```bash
# Build cho kiến trúc amd64 (Fargate mặc định)
docker build \
  --platform linux/amd64 \
  -t <DOCKERHUB_USERNAME>/nutritrack-api:latest \
  .

# Xác nhận image đã tồn tại
docker images | grep nutritrack-api
```

> **`--platform linux/amd64`:** Bắt buộc khi build trên máy Apple Silicon (M1/M2/M3) hoặc ARM. Fargate sử dụng x86_64 theo mặc định. Bỏ qua bước này sẽ dẫn đến lỗi `exec format error` khi task khởi động.

### 1.3 Push Image

```bash
docker push <DOCKERHUB_USERNAME>/nutritrack-api:latest
```

> **Rate limiting Docker Hub:** Docker Hub giới hạn 100 pull/6 giờ cho tài khoản anonymous, 200 pull/6 giờ cho tài khoản free. ECS Task pull image khi khởi động — với 2 task chạy liên tục, bạn sẽ không bị rate limit trong môi trường workshop này. Nếu cần nhiều hơn, dùng Docker Hub Personal Access Token với `imagePullCredentials` trong Task Definition.

---

## 2. CloudWatch Log Group

Tạo log group **trước** khi deploy (ECS không tự tạo):

```bash
aws logs create-log-group \
  --log-group-name /ecs/nutritrack-api \
  --region ap-southeast-2

aws logs put-retention-policy \
  --log-group-name /ecs/nutritrack-api \
  --retention-in-days 30 \
  --region ap-southeast-2
```

---

## 3. ECS Cluster

Tạo cluster dùng Fargate capacity provider:

```bash
aws ecs create-cluster \
  --cluster-name nutritrack \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1,base=1 \
  --region ap-southeast-2
```

NutriTrack dùng `FARGATE` cho tất cả task vì xử lý HTTP request người dùng không chịu được việc task bị thu hồi đột ngột (như FARGATE_SPOT).

---

## 4. Task Definition

Đăng ký task definition. Thay `<ACCOUNT_ID>` và `<DOCKERHUB_USERNAME>` bằng giá trị của bạn:

```json
{
  "family": "nutritrack-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "nutritrack-api",
      "image": "<DOCKERHUB_USERNAME>/nutritrack-api:latest",
      "essential": true,
      "portMappings": [{ "containerPort": 8000, "protocol": "tcp" }],
      "environment": [
        { "name": "AWS_REGION", "value": "ap-southeast-2" }
      ],
      "secrets": [
        {
          "name": "USDA_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:ap-southeast-2:<ACCOUNT_ID>:secret:nutritrack/prod/api-keys:USDA_API_KEY::"
        },
        {
          "name": "NUTRITRACK_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:ap-southeast-2:<ACCOUNT_ID>:secret:nutritrack/prod/api-keys:NUTRITRACK_API_KEY::"
        }
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
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

**Giải thích `secrets`:** ECS tự động inject giá trị từ Secrets Manager vào biến môi trường của container trước khi khởi động. `ecsTaskExecutionRole` cần có `secretsmanager:GetSecretValue` (đã cấu hình ở [4.8.3](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure)).

Lưu thành `task-definition.json` và đăng ký:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region ap-southeast-2
```

FastAPI app phải expose `GET /api/health` trả về `200 OK`. Thêm vào `main.py`:

```python
@app.get("/api/health")
def health():
    return {"status": "healthy"}
```

---

## 5. Application Load Balancer

### 5.1 Tạo ALB

```bash
# Lấy subnet IDs public (cần cả 2 AZ)
PUBLIC_SUBNET_A=$(aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc-public-subnet-01" \
  --query 'Subnets[0].SubnetId' --output text --region ap-southeast-2)

PUBLIC_SUBNET_C=$(aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc-public-subnet-02" \
  --query 'Subnets[0].SubnetId' --output text --region ap-southeast-2)

ALB_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=nutritrack-alb-sg" \
  --query 'SecurityGroups[0].GroupId' --output text --region ap-southeast-2)

ALB_ARN=$(aws elbv2 create-load-balancer \
  --name nutritrack-alb \
  --type application \
  --scheme internet-facing \
  --subnets "$PUBLIC_SUBNET_A" "$PUBLIC_SUBNET_C" \
  --security-groups "$ALB_SG_ID" \
  --region ap-southeast-2 \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

echo "ALB ARN: $ALB_ARN"

# Lấy DNS name — đây chính là ECS_BASE_URL
aws elbv2 describe-load-balancers \
  --load-balancer-arns "$ALB_ARN" \
  --query 'LoadBalancers[0].DNSName' \
  --output text
```

> Copy DNS name output (ví dụ `nutritrack-api-vpc-alb-1060755902.ap-southeast-2.elb.amazonaws.com`). Giá trị này được inject vào Lambda `scanImage` dưới dạng `ECS_BASE_URL` qua CDK property override trong `backend.ts`.

### 5.2 Tạo Target Group

```bash
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc" \
  --query 'Vpcs[0].VpcId' --output text --region ap-southeast-2)

TG_ARN=$(aws elbv2 create-target-group \
  --name nutritrack-api-tg \
  --protocol HTTP \
  --port 8000 \
  --target-type ip \
  --vpc-id "$VPC_ID" \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region ap-southeast-2 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

echo "Target Group ARN: $TG_ARN"
```

`target-type ip` bắt buộc với Fargate (`awsvpc` network mode dùng task ENI, không phải EC2 instance IP).

### 5.3 Tạo Listener

```bash
aws elbv2 create-listener \
  --load-balancer-arn "$ALB_ARN" \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn="$TG_ARN" \
  --region ap-southeast-2
```

---

## 6. ECS Service

```bash
PRIVATE_SUBNET_A=$(aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc-private-subnet-01" \
  --query 'Subnets[0].SubnetId' --output text --region ap-southeast-2)

PRIVATE_SUBNET_C=$(aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc-private-subnet-02" \
  --query 'Subnets[0].SubnetId' --output text --region ap-southeast-2)

TASK_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=nutritrack-ecs-sg" \
  --query 'SecurityGroups[0].GroupId' --output text --region ap-southeast-2)

aws ecs create-service \
  --cluster nutritrack \
  --service-name nutritrack-api \
  --task-definition nutritrack-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[$PRIVATE_SUBNET_A,$PRIVATE_SUBNET_C],
    securityGroups=[$TASK_SG_ID],
    assignPublicIp=DISABLED
  }" \
  --load-balancers "targetGroupArn=$TG_ARN,containerName=nutritrack-api,containerPort=8000" \
  --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200" \
  --region ap-southeast-2
```

`minimumHealthyPercent=100` / `maximumPercent=200`: rolling update — khởi động task mới trước khi dừng task cũ, đảm bảo không downtime.

---

## 7. Auto Scaling

Target tracking theo CPU:

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

Scale out nhanh (60s cooldown) khi CPU tăng đột biến; scale in chậm (300s) để tránh thrashing.

---

## 8. Xác minh

```bash
# Lấy DNS của ALB
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names nutritrack-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text \
  --region ap-southeast-2)

echo "ALB DNS: $ALB_DNS"

# Health check
curl http://${ALB_DNS}/api/health
# Expected: {"status":"healthy"}

# Xem service events (5 events gần nhất)
aws ecs describe-services \
  --cluster nutritrack \
  --services nutritrack-api \
  --query 'services[0].events[0:5]' \
  --region ap-southeast-2

# Xem task logs
aws logs tail /ecs/nutritrack-api --follow
```

---

## 9. Triển khai cập nhật

Khi có image mới, force rolling deploy:

```bash
docker build --platform linux/amd64 -t <DOCKERHUB_USERNAME>/nutritrack-api:latest .
docker push <DOCKERHUB_USERNAME>/nutritrack-api:latest

aws ecs update-service \
  --cluster nutritrack \
  --service nutritrack-api \
  --force-new-deployment \
  --region ap-southeast-2
```

`--force-new-deployment` kích hoạt rolling deploy dù task definition không thay đổi (ví dụ image mới ở cùng tag `latest`).

---

## 10. Xác thực Serverless → Container

Cụm ECS FastAPI không mở cho internet — nó chỉ chấp nhận request mang JWT hợp lệ được ký bằng secret `NUTRITRACK_API_KEY` chia sẻ.

### Phía Lambda — tạo JWT

Trước mỗi lần gọi ALB, Lambda `scan-image`:

1. Gọi `secretsmanager:GetSecretValue` để lấy `NUTRITRACK_API_KEY`.
1. Tự tạo và ký JWT bằng **HS256** dùng module `crypto` built-in của Node.js — không cần thư viện JWT bên ngoài:

   ```typescript
   import { createHmac } from 'crypto';

   function buildJWT(secret: string): string {
     const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
     const payload = Buffer.from(JSON.stringify({
       iss: 'nutritrack-scan-image',
       iat: Math.floor(Date.now() / 1000),
       exp: Math.floor(Date.now() / 1000) + 300,  // TTL 5 phút
     })).toString('base64url');
     const sig = createHmac('sha256', secret)
       .update(`${header}.${payload}`)
       .digest('base64url');
     return `${header}.${payload}.${sig}`;
   }
   ```

1. Đính kèm token vào `Authorization: Bearer <token>` trên mọi HTTP request đến ALB.

### Phía Container — xác thực JWT

Middleware FastAPI trên container ECS kiểm tra token trên mỗi request đến:

- Giải mã header và payload (base64url).
- Tính lại chữ ký HMAC-SHA256 dùng `NUTRITRACK_API_KEY` (inject qua `secrets` trong Task Definition).
- Từ chối `401 Unauthorized` nếu chữ ký không khớp hoặc `exp` đã qua.

Request đến ALB không có `Authorization: Bearer` bị ALB từ chối — Task-SG chỉ cho phép TCP 8000 inbound từ ALB-SG nên truy cập internet trực tiếp bị chặn ở tầng mạng.

### Tại sao dùng HS256 thay vì khóa bất đối xứng?

Lambda và ECS container đều là service AWS nội bộ trong cùng tài khoản. HS256 đối xứng đơn giản hơn để xoay khóa (cập nhật một secret, redeploy cả hai phía) và không cần quản lý certificate. TTL 5 phút giới hạn mức độ thiệt hại nếu token bị chặn.

---

## Xử lý lỗi

| Triệu chứng | Nguyên nhân | Fix |
| :--- | :--- | :--- |
| Task kẹt ở PROVISIONING | Image pull thất bại | Kiểm tra Docker Hub: image có public không? NAT Instance có route không? SG NAT-SG cho HTTPS outbound chưa? |
| Task dừng ngay (exit 1) | App crash khi khởi động | `aws logs tail /ecs/nutritrack-api --follow`; thường do thiếu env var hoặc import error |
| ALB trả 502 Bad Gateway | Thiếu endpoint `/api/health` hoặc container chưa khởi động | Xác nhận `GET /api/health` trả 200; kiểm tra `startPeriod: 60` |
| ALB trả 504 Gateway Timeout | Task-SG chặn ALB-SG | Xác nhận Task-SG inbound cho phép TCP 8000 từ ALB-SG |
| Task không lấy được secret | `ecsTaskExecutionRole` thiếu quyền | Kiểm tra inline policy `AllowSecretsManagerRead` trong [4.8.3](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure) |

---

## Ước tính chi phí

2 task × 0.5 vCPU / 1 GB RAM ở ap-southeast-2:

| Thành phần | Chi phí hàng tháng |
| :--- | :--- |
| Fargate (2 task, 730 giờ) | ~$17 |
| NAT Instance ×2 (`t4g.nano`) | ~$9 |
| ALB | ~$16 |
| CloudWatch logs (30 ngày, 5 GB) | ~$2 |
| **Tổng** | **~$44** |

So với dùng NAT Gateway (~$32/tháng): **tiết kiệm ~$23/tháng (~34%)**.

---

## Liên kết

- [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) — VPC, Subnets, Security Groups, S3 VPCE
- [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure) — S3, Secrets Manager, IAM Roles
- [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance) — Cấu hình NAT forwarding
