# 4.8.2 Fargate & ALB

Phần này hướng dẫn build và push Docker image, sau đó tạo ECS Cluster, Task Definition, ALB, Target Group, ECS Service, và Auto Scaling — toàn bộ thông qua AWS Console.

## Build & Push Docker Image

Trước khi định nghĩa ECS Task, cần có image trên Docker Hub.

### Clone source code

```bash
git clone https://github.com/justHman/NUTRI_TRACK
cd NUTRI_TRACK
```

### Build và push ARM64 image

ECS Fargate trên Graviton yêu cầu image `linux/arm64`. Build bằng `buildx` và push trực tiếp:

```bash
# Đăng nhập Docker Hub
docker login

# Bật multi-architecture builds (chỉ cần lần đầu)
docker buildx create --use --name mybuilder

# Build và push — thay <your-dockerhub-username> bằng username Docker Hub của bạn
docker buildx build \
  --platform linux/arm64 \
  --tag <your-dockerhub-username>/nutritrack-api-image:arm-latest \
  --push \
  .
```

> Graviton (ARM64) + Fargate Spot cho hiệu suất giá/hiệu năng tốt hơn tới 20%. Task Definition ở bước tiếp theo sẽ tham chiếu đúng tag này.

---

## ECS Cluster

1. AWS Console → **ECS** → **Clusters** → **Create cluster**.

| Field | Giá trị |
| :---- | :------ |
| **Cluster name** | `nutritrack-api-cluster` |
| **Infrastructure** | `AWS Fargate (serverless)` |

1. Tùy chọn bật **Container Insights** trong phần Monitoring (tốn thêm ≈$2–5/tháng nhưng có metric chi tiết).
1. Nhấn **Create**.

---

## Task Definition

Task Definition chỉ định image nào sẽ chạy, bao nhiêu CPU và RAM, và cách truyền secret vào container.

1. ECS Console → **Task definitions** → **Create new task definition**.

**Cấu hình task:**

| Field | Giá trị |
| :---- | :------ |
| **Task definition family** | `arm-nutritrack-api-task` |
| **Launch type** | `AWS Fargate` |
| **OS/Architecture** | `Linux/ARM64` |
| **CPU** | `1 vCPU` |
| **Memory** | `2 GB` |
| **Task execution role** | `ecsTaskExecutionRole` |
| **Task role** | `ecsTaskRole` |

**Cấu hình container:**

| Field | Giá trị |
| :---- | :------ |
| **Name** | `arm-nutritrack-api-container` |
| **Image URI** | `<your-dockerhub-username>/nutritrack-api-image:arm-latest` |
| **Container port** | `8000` |
| **Protocol** | `TCP` |

> Workflow build push 2 tag: `:arm-latest` (luôn mới nhất) và `:arm-DDMMYY` (theo ngày để rollback). Task Definition dùng `:arm-latest` — mỗi lần force redeploy sẽ pull image mới nhất.

**Biến môi trường:**

| Key | Type | Value |
| :-- | :--- | :---- |
| `AWS_DEFAULT_REGION` | Value | `ap-southeast-2` |
| `AWS_S3_CACHE_BUCKET` | Value | Tên S3 bucket của bạn |
| `NUTRITRACK_API_KEY` | ValueFrom | `<SECRET_ARN>:NUTRITRACK_API_KEY::` |
| `USDA_API_KEY` | ValueFrom | `<SECRET_ARN>:USDA_API_KEY::` |
| `AVOCAVO_API_KEY` | ValueFrom | `<SECRET_ARN>:AVOCAVO_API_KEY::` |

> **Cú pháp `ValueFrom`:** `[ARN]:[KEY_NAME]::` — bắt buộc có 2 dấu `::` ở cuối; thiếu là lỗi deploy.

**Logging:**

| Field | Giá trị |
| :---- | :------ |
| **Log driver** | `awslogs` |
| **awslogs-group** | `/ecs/arm-nutritrack-api-task` |
| **awslogs-region** | `ap-southeast-2` |
| **awslogs-stream-prefix** | `ecs` |

1. Nhấn **Create**.

---

## Target Group

Target Group cho ALB biết route traffic đến đâu và cách health-check container.

1. EC2 Console → **Target Groups** → **Create target group**.

| Field | Giá trị |
| :---- | :------ |
| **Target type** | `IP addresses` — **bắt buộc với Fargate** (awsvpc mode dùng ENI, không phải EC2 instance IP) |
| **Target group name** | `nutritrack-api-vpc-tg` |
| **Protocol** | `HTTP` |
| **Port** | `8000` |
| **VPC** | `nutritrack-api-vpc` |
| **Protocol version** | `HTTP1` |

**Health checks:**

| Field | Giá trị | Lý do |
| :---- | :------ | :---- |
| **Protocol** | HTTP | |
| **Path** | `/health` | Endpoint health check của FastAPI |
| **Healthy threshold** | `2` | Phát hiện healthy nhanh hơn (mặc định 5 = chậm gấp 2.5 lần) |
| **Unhealthy threshold** | `3` | |
| **Interval** | `10` giây | Kiểm tra thường xuyên hơn mặc định 30s |
| **Timeout** | `5` giây | |
| **Success codes** | `200` | |

1. Nhấn **Next** → **Create target group** (không cần đăng ký IP thủ công — ECS tự đăng ký task).

---

## Application Load Balancer

1. EC2 Console → **Load Balancers** → **Create Load Balancer** → **Application Load Balancer** → **Create**.

| Field | Giá trị |
| :---- | :------ |
| **Load balancer name** | `nutritrack-api-vpc-alb` |
| **Scheme** | `Internet-facing` |
| **IP address type** | `IPv4` |

**Network mapping:**

| Field | Giá trị |
| :---- | :------ |
| **VPC** | `nutritrack-api-vpc` |
| **Mappings** | `ap-southeast-2a` → `nutritrack-api-vpc-public-alb01` |
| | `ap-southeast-2c` → `nutritrack-api-vpc-public-alb02` |

**Security groups:** Chọn `nutritrack-api-vpc-alb-sg`.

**Listeners and routing:**

- **Protocol**: `HTTP` | **Port**: `80`
- **Default action**: Forward to `nutritrack-api-vpc-tg`

1. Nhấn **Create load balancer**.
1. Đợi ~3 phút để status chuyển sang **Active**.
1. Copy **DNS name** (dạng `nutritrack-api-vpc-alb-xxxxxxxxx.ap-southeast-2.elb.amazonaws.com`) — đây là URL public và sẽ được set làm `ECS_BASE_URL` trong Lambda `scanImage`.

---

## AWS WAF — Web ACL cho ALB

Sau khi ALB active, gắn Web ACL để bảo vệ khỏi brute-force và truy cập không xác thực.

### Tạo Web ACL

1. AWS Console → **WAF & Shield** → **Web ACLs** → **Create web ACL**.
1. Đặt tên `waf_for_alb_nutritrack`, chọn scope **Regional**, chọn region của ALB (`ap-southeast-2`).

![Cấu hình tên và scope WAF](images/name_waf_alb.png)

1. Ở mục **Associated AWS resources**, nhấn **Add AWS resources** → chọn ALB `nutritrack-api-vpc-alb` → **Add**.

![Web ACL đã liên kết với ALB](images/protection_waf_alb.png)

### Thêm rule rate-based — RateLimitPerIP

Rule này block mọi IP gửi quá 100 request trong 5 phút, bảo vệ khỏi tấn công brute-force và scanning.

1. Ở bước **Add rules and rule groups**, nhấn **Add rules** → **Add my own rules and rule groups**.
1. Chọn **Rate-based rule**.

![Dialog thêm rule — chọn Rate-based rule](images/rule_waf_alb.png)

1. Cấu hình rule:

| Field | Giá trị |
| :---- | :------ |
| **Rule name** | `RateLimitPerIP` |
| **Rate limit** | `100` |
| **Evaluation window** | `5 minutes` |
| **Aggregation key** | `IP address` |
| **Action** | `Block` |

![Cấu hình rule RateLimitPerIP](images/rate_rule_waf_alb.png)

![Chi tiết rate và window của RateLimitPerIP](images/ratelimitperid_waf_alb.png)

1. Nhấn **Add rule**.

### Thêm custom rule — RequireAuthorizationHeader

Rule này block mọi request không mang header `Authorization: Bearer`, đảm bảo chỉ Lambda `scan-image` (luôn đính kèm JWT) mới đến được container.

1. Nhấn **Add rules** → **Add my own rules and rule groups** lần nữa.
1. Chọn **Rule builder** (custom rule).

![Dialog thêm rule — chọn Custom rule](images/custom_rule_waf_alb.png)

1. Cấu hình rule:

| Field | Giá trị |
| :---- | :------ |
| **Rule name** | `RequireAuthorizationHeader` |
| **Type** | Regular rule |
| **If a request** | `does not match the statement` |
| **Inspect** | `Single header` → `authorization` |
| **Match type** | `Starts with string` → `Bearer` |
| **Action** | `Block` |

![Rule RequireAuthorizationHeader — block request không có Bearer token](images/RequireAuthorizationHeader_waf_alb.png)

1. Nhấn **Add rule** → **Next** → review → **Create web ACL**.

> **Thứ tự ưu tiên rule:** `RateLimitPerIP` được đánh giá trước `RequireAuthorizationHeader`. IP bị flood sẽ bị block ở tầng rate trước khi đến kiểm tra header.

---

## ECS Service

ECS Service đảm bảo luôn có task đang chạy và kết nối với ALB.

1. ECS Console → **Clusters** → `nutritrack-api-cluster` → tab **Services** → **Create**.

**Compute configuration:**

- **Capacity provider strategy** → **Add capacity provider**:
  - **Provider**: `FARGATE_SPOT` | **Weight**: `1`

**Deployment configuration:**

| Field | Giá trị |
| :---- | :------ |
| **Application type** | `Service` |
| **Task definition** | `arm-nutritrack-api-task` (Latest revision) |
| **Service name** | `spot-arm-nutritrack-api-task-service` |
| **Desired tasks** | `1` |

**Deployment options:**

- **Deployment type**: Rolling update
- **Minimum healthy percent**: `50`
- **Maximum percent**: `200`

**Networking:**

| Field | Giá trị |
| :---- | :------ |
| **VPC** | `nutritrack-api-vpc` |
| **Subnets** | `nutritrack-api-vpc-private-ecs01` ✅ + `nutritrack-api-vpc-private-ecs02` ✅ |
| **Security group** | `nutritrack-api-vpc-ecs-sg` |
| **Public IP** | **DISABLED** — container ra Internet qua NAT Instance |

**Load balancing:**

| Field | Giá trị |
| :---- | :------ |
| **Load balancing type** | `Application Load Balancer` |
| **Load balancer** | `nutritrack-api-vpc-alb` |
| **Listener** | `HTTP:80` |
| **Target group** | `nutritrack-api-vpc-tg` |
| **Health check grace period** | `60` giây |

1. Nhấn **Create**.

---

## Auto Scaling

Cấu hình Step Scaling để thêm task khi CPU cao và giảm khi CPU thấp.

### Bật Service Auto Scaling

1. ECS Console → **Clusters** → `nutritrack-api-cluster` → service `spot-arm-nutritrack-api-task-service`.
1. Xác nhận service đang `ACTIVE` và task có trạng thái `RUNNING`.
1. Nhấn **Update** (góc trên bên phải).
1. Cuộn đến **Service auto scaling** → chọn **Use Service Auto Scaling**.
1. Khai báo giới hạn task:
   - **Minimum number of tasks**: `1`
   - **Maximum number of tasks**: `10`

### Policy Scale-Out (CPU ≥ 70% → thêm task)

1. **Scaling policy type**: `Step scaling`
1. **Policy name**: `nutritrack-api-cluster-cpu-above-70`
1. **Amazon ECS service alarm**: nhấn **Create a new alarm using Amazon ECS metrics** — trình duyệt mở CloudWatch trong tab mới.

**Tạo CloudWatch Alarm (trong tab mới):**

1. **Metric**: `CPUUtilization` | **Statistic**: `Average` | **Period**: `1 minute` → **Next**.
1. **Conditions**: Static, `Greater/Equal >=`, threshold `70`.
1. **Next** → nhấn **Remove** để xóa action thông báo mặc định → **Next**.
1. **Alarm name**: `nutritrack-api-cluster-cpu-above-70-alarm` → **Next** → **Create alarm**.

**Quay lại tab ECS:**

- Nhấn **Refresh (🔄)** ở phần alarm.
- Chọn `nutritrack-api-cluster-cpu-above-70-alarm`.
- **Scaling actions**:
  - **Action**: `Add` | **Value**: `10` | **Type**: `percent`
  - **Lower bound**: `70` (tự điền) | **Upper bound**: để trống (+infinity)
  - **Cooldown period**: `120` giây
  - **Minimum adjustment magnitude**: `1`

### Policy Scale-In (CPU ≤ 20% → giảm task)

1. Nhấn **Add more scaling policies**.
1. **Scaling policy type**: `Step scaling`
1. **Policy name**: `nutritrack-api-cluster-cpu-below-20`
1. **Amazon ECS service alarm**: **Create a new alarm using Amazon ECS metrics**.

**Tạo CloudWatch Alarm thứ hai (trong tab mới):**

1. **Metric**: `CPUUtilization` | **Statistic**: `Average` | **Period**: `1 minute` → **Next**.
1. **Conditions**: Static, `Less/Equal <=`, threshold `20`.
1. **Next** → **Remove** action mặc định → **Next**.
1. **Alarm name**: `nutritrack-api-cluster-cpu-below-20-alarm` → **Next** → **Create alarm**.

**Quay lại tab ECS:**

- Nhấn **Refresh (🔄)**.
- Chọn `nutritrack-api-cluster-cpu-below-20-alarm`.
- **Scaling actions**:
  - **Action**: `Remove` | **Value**: `10` | **Type**: `percent`
  - **Lower bound**: để trống (-infinity) | **Upper bound**: `20` (tự điền)
  - **Cooldown period**: `300` giây
  - **Minimum adjustment magnitude**: `1`

### Lưu và xác minh

- Cuộn xuống cuối và nhấn **Update** để lưu cả 2 policy.
- Verify bằng CLI:

```bash
# Liệt kê 2 scaling policy
aws application-autoscaling describe-scaling-policies \
  --service-namespace ecs \
  --resource-id "service/nutritrack-api-cluster/spot-arm-nutritrack-api-task-service" \
  --query "ScalingPolicies[].{PolicyName:PolicyName,Type:PolicyType}" \
  --output table

# Kiểm tra trạng thái alarm
aws cloudwatch describe-alarms \
  --alarm-names \
    "nutritrack-api-cluster-cpu-above-70-alarm" \
    "nutritrack-api-cluster-cpu-below-20-alarm" \
  --query 'MetricAlarms[].{Name:AlarmName,State:StateValue}' \
  --output table
```

| Alarm | Điều kiện | Hành động | Cooldown |
| :---- | :-------- | :-------- | :------- |
| `nutritrack-api-cluster-cpu-above-70-alarm` | CPU ≥ 70% trong 1 phút | +10% task | 120 s |
| `nutritrack-api-cluster-cpu-below-20-alarm` | CPU ≤ 20% trong 1 phút | −10% task | 300 s |

> Cooldown không đối xứng: scale-out nhanh (120s) để xử lý spike ngay; scale-in chậm (300s) tránh dao động task liên tục.

---

## Xác thực Serverless → Container

ECS FastAPI chỉ chấp nhận request mang JWT hợp lệ được ký bằng secret `NUTRITRACK_API_KEY`. Đây là cách Lambda `scan-image` tạo token và container xác thực.

### Phía Lambda — tạo JWT

Trước mỗi lần gọi ALB, `scan-image`:

1. Gọi `secretsmanager:GetSecretValue` để lấy `NUTRITRACK_API_KEY` (ARN: `arn:aws:secretsmanager:<region>:<account>:secret:nutritrack/prod/api-keys*`).
1. Tạo và ký JWT bằng **HS256** dùng module `crypto` built-in của Node.js:

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

Middleware FastAPI kiểm tra mọi request đến:

- Giải mã header và payload (base64url).
- Tính lại chữ ký HMAC-SHA256 dùng `NUTRITRACK_API_KEY` (inject qua biến môi trường của task).
- Trả về `401 Unauthorized` nếu chữ ký không khớp hoặc `exp` đã qua.

Task-SG chỉ cho phép TCP 8000 inbound từ ALB-SG nên truy cập internet trực tiếp cũng bị chặn ở tầng mạng.

### Tại sao dùng HS256 thay vì khóa bất đối xứng?

Lambda và ECS container đều là service AWS nội bộ trong cùng tài khoản. HS256 đối xứng đơn giản hơn để xoay khóa (cập nhật một secret, redeploy cả hai phía) và không cần quản lý certificate. TTL 5 phút giới hạn thiệt hại nếu token bị chặn.

---

## Xử lý lỗi

| Triệu chứng | Nguyên nhân | Fix |
| :---------- | :---------- | :-- |
| Task kẹt ở PROVISIONING | Image pull thất bại | Kiểm tra NAT Instance route hoạt động; xác nhận image URI là `<dockerhub-user>/nutritrack-api-image:arm-latest` |
| Task dừng ngay | App crash khi khởi động | CloudWatch → `/ecs/arm-nutritrack-api-task` → stream mới nhất — thường do thiếu env var |
| ALB trả 502 | Thiếu endpoint `/health` hoặc container chưa khởi động | Xác nhận `GET /health` trả 200; kiểm tra health check grace period |
| ALB trả 504 | Task-SG chặn ALB-SG trên port 8000 | Xác nhận Task-SG inbound cho phép TCP 8000 **từ ALB-SG** |
| Auto Scaling không trigger | Cooldown chưa hết | Đợi hết cooldown; kiểm tra trạng thái CloudWatch alarm |

---

## Ước tính chi phí

1 FARGATE_SPOT task × 1 vCPU / 2 GB RAM ở ap-southeast-2 (giá 2025):

| Thành phần | Chi phí/tháng |
| :--------- | :------------ |
| Fargate Spot (ARM64, 1 task, 730 giờ) | ≈$5–10 |
| NAT Instance (2 × t4g.nano) | ≈$10.96 |
| ALB | ≈$16.20 |
| CloudWatch logs (30 ngày) | ≈$0.50 |
| **Tổng (không kể Bedrock)** | **≈$33–38** |

FARGATE_SPOT trên ARM64 rẻ hơn đáng kể so với on-demand x86. Chi phí cố định lớn nhất là ALB. Xem [4.8.4 NAT Instance](/workshop/4.8.4-NAT-Instance) để biết chi tiết cấu hình NAT.

---

## Liên kết

- [4.8.1 VPC & ECR](/workshop/4.8.1-VPC-ECR) — Network và registry prerequisites.
- [4.8.3 Infrastructure](/workshop/4.8.3-Infrastructure) — Secrets Manager và IAM role.
- [4.8.4 NAT Instance](/workshop/4.8.4-NAT-Instance) — NAT Instance và Auto Scaling Group.
- [4.10 Cleanup](/workshop/4.10-Cleanup) — Xóa theo thứ tự: service → task definitions → cluster → ALB → VPC.
