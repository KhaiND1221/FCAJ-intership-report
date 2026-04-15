# 4.8.3 Infrastructure

Phần này thiết lập ba thành phần hạ tầng hỗ trợ cho ECS Fargate: S3 Bucket để cache kết quả API, Secrets Manager để lưu API keys, và IAM Roles để cấp quyền cho ECS.

> **Điều kiện trước:** Đã hoàn thành [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR).

---

## 1. S3 Bucket

S3 Bucket `nutritrack-cache-01apr26` lưu trữ cache kết quả từ USDA, OpenFoodFacts, và Avocavo Nutrition APIs — giảm latency và chi phí gọi API bên ngoài.

> **Lưu ý tên Bucket:** S3 Bucket name phải **độc nhất toàn cầu**. Tên `nutritrack-cache-01apr26` nghĩa là "tạo ngày 01 tháng 4 năm 2026". Thêm tên hoặc ngày tháng của bạn để tránh trùng.

### 1.1 Tạo S3 Bucket

1. AWS Console → **S3** → **Create bucket**.

| Field | Giá trị |
| :--- | :--- |
| **Bucket name** | `nutritrack-cache-01apr26` *(hoặc thêm hậu tố ngày bạn tạo)* |
| **AWS Region** | `ap-southeast-2` (Sydney) |
| **Object Ownership** | `ACLs disabled (recommended)` |
| **Block all public access** | ✅ Bật (Block all public access) |
| **Bucket Versioning** | Disable |
| **Default encryption** | SSE-S3 (mặc định) |

2. Nhấn **Create bucket**.

---

## 2. Secrets Manager

Secrets Manager lưu trữ API keys được mã hóa — container đọc key lúc khởi động thông qua IAM Role, không cần lưu plaintext trong code hay environment variables.

### 2.1 Tạo Secret

1. AWS Console → **Secrets Manager** → **Store a new secret**.
2. **Secret type**: `Other type of secret`.
3. **Key/value pairs** — Thêm các keys sau:

| Key | Value |
| :--- | :--- |
| `USDA_API_KEY` | `<API key USDA của bạn>` |
| `AVOCAVO_API_KEY` | `<API key Avocavo của bạn>` |
| `OPENFOODFACTS_API_KEY` | `<API key nếu có, hoặc để trống>` |
| `NUTRITRACK_API_KEY` | `<JWT signing secret dùng chung giữa scan-image Lambda và ECS>` |

> **Không nhập** AWS Access Key/Secret Key vào đây — đó là việc của IAM Role.
> **`ECS_BASE_URL`** (`http://nutritrack-api-vpc-alb-xxxxxxxxx.ap-southeast-2.elb.amazonaws.com`) **không phải secret** — inject nó dưới dạng `environment` entry trong ECS Task Definition, hoặc override qua CDK property override cho `ECS_BASE_URL` trong `scanImage` Lambda.

4. **Encryption key**: Giữ `aws/secretsmanager` (mặc định, miễn phí).
5. Nhấn **Next**.

### 2.2 Đặt tên Secret

| Field | Giá trị |
| :--- | :--- |
| **Secret name** | `nutritrack/prod/api-keys` |
| **Description** | `API Keys for NutriTrack production ECS` |

6. Nhấn **Next** → Bỏ qua Auto-rotation → Nhấn **Next** → Nhấn **Store**.
7. Click vào tên secret → Sao chép **Secret ARN** (cần dùng ở bước tạo IAM Role bên dưới).

---

## 3. IAM Roles

ECS dùng **2 Role riêng biệt** với mục đích hoàn toàn khác nhau:

| Role | Ai dùng | Để làm gì |
| :--- | :--- | :--- |
| **`ecsTaskExecutionRole`** | ECS Agent (hệ thống AWS) | Pull Docker image, ghi log CloudWatch, đọc Secrets Manager để inject env vars |
| **`ecsTaskRole`** | Code Python trong container | Gọi Bedrock, đọc/ghi S3 Cache |

Ngoài ra còn có **`nutritrack-api-vpc-nat-instance-role`** dành cho NAT Instance EC2.

### 3.1 Cấu hình `ecsTaskExecutionRole`

Role này thường đã tồn tại trong tài khoản. Ta cần thêm quyền đọc Secret.

1. AWS Console → **IAM** → **Roles** → Tìm `ecsTaskExecutionRole`.
2. Nếu **chưa có**, tạo mới:
   - **Create role** → **AWS service** → **Elastic Container Service Task**
   - Attach policy: `AmazonECSTaskExecutionRolePolicy`
   - Role name: `ecsTaskExecutionRole`
3. Click vào `ecsTaskExecutionRole` → **Add permissions** → **Create inline policy**.
4. Tab **JSON** → Paste policy sau (thay `<SECRET_ARN>` bằng ARN vừa copy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSecretsManagerRead",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "<SECRET_ARN>"
      ]
    },
    {
      "Sid": "AllowCloudWatchLogs",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": "arn:aws:logs:ap-southeast-2:*:log-group:/ecs/arm-nutritrack-api-task:*"
    }
  ]
}
```

> **Lưu ý về Docker Hub vs ECR:**
> Policy này **không có** `ecr:GetAuthorizationToken` vì dự án này dùng **Docker Hub** (`<your-dockerhub-username>/nutritrack-api-image`), không phải Amazon ECR. ECS Agent kéo image trực tiếp qua HTTP đến `registry-1.docker.io` thông qua NAT Instance — không cần AWS IAM auth. Nếu bạn dùng ECR, thêm `ecr:GetAuthorizationToken` với `Resource: "*"`.

5. **Policy name**: `NutriTrackExecutionPolicy` → **Create policy**.

### 3.2 Tạo `ecsTaskRole`

1. IAM → **Roles** → **Create role**.
2. **Trusted entity type**: `AWS service` → **Use case**: `Elastic Container Service Task`.
3. Nhấn **Next** → **Next** (bỏ qua attach managed policy).
4. **Role name**: `ecsTaskRole` → **Create role**.
5. Click vào `ecsTaskRole` → **Add permissions** → **Create inline policy**.
6. Tab **JSON** → Paste policy sau (thay tên bucket nếu khác):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBedrockInvoke",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:ListFoundationModels"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowS3CacheAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::nutritrack-cache-01apr26",
        "arn:aws:s3:::nutritrack-cache-01apr26/*"
      ]
    }
  ]
}
```

7. **Policy name**: `NutriTrackTaskPolicy` → **Create policy**.

### 3.3 Tạo IAM Role cho NAT Instance

NAT Instance cần quyền **tự cập nhật Route Table** khi được Auto Scaling Group tạo mới (xem [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance)).

1. IAM → **Roles** → **Create role**.
2. **Trusted entity type**: `AWS service` → **Use case**: `EC2`.
3. Nhấn **Next** → **Next**.
4. **Role name**: `nutritrack-api-vpc-nat-instance-role` → **Create role**.
5. Click vào role → **Add permissions** → **Create inline policy** → tab **JSON**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowRouteTableUpdate",
      "Effect": "Allow",
      "Action": [
        "ec2:ReplaceRoute",
        "ec2:CreateRoute",
        "ec2:DescribeRouteTables",
        "ec2:DescribeInstances",
        "ec2:DescribeSubnets"
      ],
      "Resource": "*"
    }
  ]
}
```

6. **Policy name**: `NutriTrackNATRoutePolicy` → **Create policy**.

### 3.4 Thêm SSM Policy cho NAT Instance Role (nếu dùng SSM)

Nếu muốn quản lý NAT Instance qua SSM Session Manager (không cần SSH key pair):

1. Click `nutritrack-api-vpc-nat-instance-role` → **Add permissions** → **Attach policies**.
2. Tìm `AmazonSSMManagedInstanceCore` → **Add permissions**.

Xem thêm phần SSM trong [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance).

---

## Tóm tắt tài nguyên đã tạo

| Tài nguyên | Tên | Mục đích |
| :--- | :--- | :--- |
| S3 Bucket | `nutritrack-cache-01apr26` | Cache kết quả từ USDA/OpenFoodFacts/Avocavo |
| Secrets Manager | `nutritrack/prod/api-keys` | Lưu API keys mã hóa |
| IAM Role | `ecsTaskExecutionRole` | ECS Agent pull image + ghi log |
| IAM Role | `ecsTaskRole` | Container gọi Bedrock + đọc/ghi S3 |
| IAM Role | `nutritrack-api-vpc-nat-instance-role` | NAT Instance cập nhật Route Table |

---

## Liên kết

- [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) — Bước trước: VPC, Subnets, Security Groups
- [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance) — Bước tiếp theo: Setup NAT Instance
- [4.8.2 Fargate & ALB](/workshop/4.8-Verify-Setup/4.8.2-Fargate-ALB) — ECS Cluster và Service deployment
