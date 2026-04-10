# 4.8.2 Fargate & ALB

## ECS Cluster

Tạo cluster dùng Fargate capacity provider:

```bash
aws ecs create-cluster \
  --cluster-name nutritrack \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1,base=1 \
  --region ap-southeast-2
```

Dùng `FARGATE` cho base task (luôn chạy). NutriTrack dùng FARGATE cho tất cả task vì xử lý HTTP request người dùng không chịu được việc task bị thu hồi đột ngột.

## Task Definition

Đăng ký task definition. Thay `<ACCOUNT_ID>` và `<IMAGE_URI>` bằng giá trị của bạn:

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

Lưu thành `task-definition.json` và đăng ký:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region ap-southeast-2
```

FastAPI app phải expose `GET /health` trả về `200 OK`. Thêm vào `main.py`:

```python
@app.get("/health")
def health():
    return {"status": "healthy"}
```

## CloudWatch Log Group

Tạo log group trước khi deploy (ECS không tự tạo):

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

### Tạo ALB

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

### Tạo Target Group

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

`target-type ip` bắt buộc với Fargate (network mode `awsvpc` dùng task ENI, không phải EC2 instance IP).

### Tạo Listener

```bash
aws elbv2 create-listener \
  --load-balancer-arn ${ALB_ARN} \
  --protocol HTTP \
  --port 80 \
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

`minimumHealthyPercent=100` / `maximumPercent=200`: rolling update — khởi động task mới trước khi dừng task cũ, đảm bảo không downtime.

## Autoscaling

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

## Triển khai cập nhật

```bash
docker build --platform linux/amd64 -t nutritrack-api .
docker push ${REGISTRY}/nutritrack-api:latest

aws ecs update-service \
  --cluster nutritrack \
  --service nutritrack-api \
  --force-new-deployment \
  --region ap-southeast-2
```

`--force-new-deployment` kích hoạt rolling deploy dù task definition không thay đổi (ví dụ image mới ở cùng tag `latest`).

## Xác minh

```bash
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names nutritrack-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text \
  --region ap-southeast-2)

curl http://${ALB_DNS}/health
# Expected: {"status":"healthy"}
```

## Xác thực Serverless → Container

Cụm ECS FastAPI không mở cho internet — nó chỉ chấp nhận request mang JWT hợp lệ được ký bằng secret `NUTRITRACK_API_KEY` chia sẻ. Phần này giải thích cách Lambda `scan-image` tạo token đó và container xác thực nó.

### Phía Lambda — tạo JWT

Trước mỗi lần gọi ALB, `scan-image`:

1. Gọi `secretsmanager:GetSecretValue` để lấy `NUTRITRACK_API_KEY` từ Secrets Manager (ARN: `arn:aws:secretsmanager:<region>:<account>:secret:nutritrack/prod/api-keys*`).
2. Tự tạo và ký JWT bằng **HS256** dùng module `crypto` built-in của Node.js — không cần thư viện JWT bên ngoài:

   ```typescript
   import { createHmac } from 'crypto';

   function buildJWT(secret: string): string {
     const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
     const payload = Buffer.from(JSON.stringify({
       iss: 'nutritrack-scan-image',
       iat: Math.floor(Date.now() / 1000),
       exp: Math.floor(Date.now() / 1000) + 60,  // TTL 1 phút
     })).toString('base64url');
     const sig = createHmac('sha256', secret)
       .update(`${header}.${payload}`)
       .digest('base64url');
     return `${header}.${payload}.${sig}`;
   }
   ```

3. Đính kèm token vào `Authorization: Bearer <token>` trên mọi HTTP request đến ALB.

### Phía Container — xác thực JWT

Middleware FastAPI trên container ECS kiểm tra token trên mỗi request đến:

- Giải mã header và payload (base64url).
- Tính lại chữ ký HMAC-SHA256 dùng bản sao `NUTRITRACK_API_KEY` của chính mình (inject qua biến môi trường task ECS hoặc Secrets Manager sidecar).
- Từ chối `401 Unauthorized` nếu chữ ký không khớp hoặc `exp` đã qua.

Request đến ALB không có `Authorization: Bearer` bị listener rule ALB từ chối trước khi đến container — Task-SG chỉ cho phép TCP 8000 inbound từ ALB-SG, nên truy cập internet trực tiếp bị chặn ở tầng mạng.

### Tại sao dùng HS256 thay vì khóa bất đối xứng?

Lambda và ECS container đều là service AWS nội bộ trong cùng tài khoản. HS256 đối xứng đơn giản hơn để xoay khóa (cập nhật một secret, redeploy cả hai phía) và không cần quản lý certificate. TTL 1 phút giới hạn mức độ thiệt hại nếu token bị chặn.

## Xử lý lỗi

| Triệu chứng | Nguyên nhân | Fix |
| --- | --- | --- |
| Task kẹt ở PROVISIONING | Image pull thất bại | Kiểm tra ECR: execution role cần `ecr:GetAuthorizationToken`; NAT Gateway route đúng |
| Task dừng ngay (exit 1) | App crash khi khởi động | `aws logs tail /ecs/nutritrack-api --follow`; thường do thiếu env var hoặc import error |
| ALB trả 502 Bad Gateway | Thiếu endpoint `/health` hoặc container chưa khởi động | Xác nhận `GET /health` trả 200; kiểm tra `startPeriod: 60` |
| ALB trả 504 Gateway Timeout | Task-SG chặn ALB-SG | Xác nhận Task-SG inbound cho phép TCP 8000 từ ALB-SG |

## Ước tính chi phí

2 task × 0.5 vCPU / 1 GB RAM ở ap-southeast-2:

| Thành phần | Chi phí hàng tháng |
| --- | --- |
| Fargate (2 task, 730 giờ) | ~$17 |
| NAT Gateway | ~$32 |
| ALB | ~$16 |
| CloudWatch logs (30 ngày, 5 GB) | ~$2 |
| **Tổng** | **~$67** |

## Liên kết

- [4.8.1 VPC & ECR](/workshop/4.8.1-VPC-ECR)
- [4.10 Dọn Dẹp](/workshop/4.10-Cleanup)
