# 4.11.1 Ước Tính Chi Phí

Ước tính chi phí vận hành NutriTrack tại `ap-southeast-2` (Sydney). Tất cả giá dựa trên mức công khai năm 2025. Chi phí thực tế sẽ thay đổi theo lưu lượng — các con số dưới đây giả định quy mô nhỏ (100 DAU, trung bình 3 lần log thức ăn/người/ngày qua camera).

---

## Amplify Gen 2 Backend

| Dịch vụ | Đơn vị | Giá | Ước tính/tháng |
| --- | --- | --- | --- |
| AppSync (GraphQL) | Mỗi triệu query/mutation | $4.00 / triệu | ≈$2 (500K ops) |
| AppSync (real-time) | Mỗi triệu connection-minute | $0.08 / triệu | ≈$1 |
| DynamoDB (on-demand) | Mỗi triệu RRU/WRU | $0.25 RRU / $1.25 WRU / triệu | ≈$4 |
| DynamoDB storage | Mỗi GB-tháng | $0.285 / GB | <$1 |
| Lambda invocations | Mỗi triệu | $0.20 / triệu | <$1 (free tier) |
| Lambda duration | Mỗi GB-giây | $0.0000166667 | ≈$2 (512 MB × 120s avg) |
| S3 storage | Mỗi GB-tháng | $0.025 / GB | ≈$1 |
| S3 PUT/GET | Mỗi 1.000 request | $0.005 PUT / $0.0004 GET | ≈$1 |
| Cognito (MAU) | 50.000 MAU đầu | Miễn phí | $0 |
| Amplify Hosting (CI/CD) | Build minutes | $0.01 / phút | ≈$1 |

**Tổng phụ Amplify: ≈$13/tháng**

---

## Amazon Bedrock (Qwen3-VL 235B)

Qwen3-VL 235B tại `ap-southeast-2` (giá on-demand 2025):

| Loại token | Giá |
| --- | --- |
| Input (text) | $0.002 / 1K token |
| Input (image) | $0.002 / 1K token |
| Output | $0.006 / 1K token |

### Ước tính chi phí mỗi action

> **Lưu ý:** `analyzeFoodImage`, `analyzeFoodLabel`, và `scanBarcode` được xử lý bởi Lambda `scan-image`, chuyển tiếp request đến ECS FastAPI service — các action này **không** gọi Bedrock và không được tính phí ở đây.

| Action | Token input | Token output | Chi phí/lần gọi |
| --- | --- | --- | --- |
| `generateFoodNutrition` (DB miss) | ~450 (prompt + tên) | ~400 | ≈$0.0033 |
| `voiceToFood` | ~500 | ~350 | ≈$0.0031 |
| `ollieCoachTip` | ~300 | ~100 | ≈$0.0009 |
| `generateCoachResponse` | ~800 | ~500 | ≈$0.0046 |
| `generateRecipe` | ~600 | ~600 | ≈$0.0048 |
| `calculateMacros` | ~350 | ~200 | ≈$0.0019 |
| `challengeSummary` | ~400 | ~150 | ≈$0.0017 |
| `weeklyInsight` | ~500 | ~250 | ≈$0.0025 |

### Tổng Bedrock/tháng (100 DAU)

| Action | Lần/ngày | Lần/tháng | Chi phí/tháng |
| --- | --- | --- | --- |
| `generateFoodNutrition` | 100 | 3.000 | ≈$10 |
| `voiceToFood` | 50 | 1.500 | ≈$5 |
| Coach tips + chat | 150 | 4.500 | ≈$12 |
| Khác (recipe, macro, v.v.) | 30 | 900 | ≈$3 |
| **Tổng** | | | **≈$30** |

Các action scan ảnh (`analyzeFoodImage`, `analyzeFoodLabel`, `scanBarcode`) được xử lý bởi ECS FastAPI service — chi phí compute nằm trong dòng ECS Fargate bên dưới, không phải Bedrock.

**Các đòn bẩy tối ưu:**

- Cache kết quả `generateFoodNutrition` trong DynamoDB theo tên món — giảm các lần tra cứu lặp lại.
- Dùng `FARGATE_SPOT` cho các action batch/offline (weekly insight) — tiết kiệm ~70% compute.

---

## Amazon Transcribe

Tính năng log bằng giọng nói dùng `LanguageCode: 'vi-VN'` (không auto-detect).

| Chỉ số | Giá trị |
| --- | --- |
| Giá | $0.024 / phút |
| Thời lượng audio trung bình | 10 giây |
| Chi phí mỗi lần transcribe | ≈$0.004 |
| 50 voice log/ngày × 30 ngày | ≈$6/tháng |

**Tổng phụ Transcribe: ≈$6/tháng**

---

## ECS Fargate + ALB (FastAPI backend)

Từ [4.8.2 Fargate & ALB](/workshop/4.8.2-Fargate-ALB):

| Thành phần | Chi phí/tháng |
| --- | --- |
| Fargate (2 task, 0.5 vCPU / 1 GB, 730 giờ) | ≈$17 |
| NAT Instance (2×t4g.nano, Auto Scaling) | ≈$9 |
| Application Load Balancer | ≈$16 |
| CloudWatch Logs (5 GB, 30 ngày retention) | ≈$2 |
| **Tổng phụ ECS** | **≈$44** |

NutriTrack dùng NAT Instance (2×t4g.nano) thay NAT Gateway (≈$43/tháng ở ap-southeast-2), tiết kiệm ≈$34/tháng. Container image được host trên Docker Hub (free tier) — không có chi phí ECR. Xem [4.8.4 NAT Instance](/workshop/4.8.4-NAT-Instance).

---

## Tổng chi phí hàng tháng

| Danh mục | Chi phí/tháng |
| --- | --- |
| Amplify Gen 2 backend (AppSync, DynamoDB, Lambda, S3, Cognito) | ≈$13 |
| Amazon Bedrock (Qwen3-VL, 100 DAU, chỉ text/voice) | ≈$30 |
| Amazon Transcribe (voice log) | ≈$6 |
| ECS Fargate + ALB + NAT Instance | ≈$44 |
| **Tổng cộng** | **≈$93/tháng** |

---

## Chi phí theo môi trường

| Môi trường | Mô tả | Ước tính |
| --- | --- | --- |
| Sandbox (`npx ampx sandbox`) | Một developer, Amplify backend tạm thời, không có ECS | ≈$5–10/tháng |
| Staging (branch `feat/phase3`) | Amplify backend thường trực, ECS cluster dùng chung (1 task) | ≈$50–70/tháng |
| Production (branch `main`) | Toàn bộ stack như mô tả (100 DAU) | ≈$93/tháng |

Sandbox tự dọn dẹp khi thoát — DynamoDB table và Lambda function bị xóa, không phát sinh chi phí khi nhàn rỗi. Chi phí sandbox duy nhất còn lại là các object S3 không bị xóa sau teardown.

---

## Dự báo khi scale

| DAU | Bedrock (text/voice) | Transcribe | ECS (auto-scale) | Tổng |
| --- | --- | --- | --- | --- |
| 100 | ≈$30 | ≈$6 | ≈$44 | ≈$93 |
| 500 | ≈$150 | ≈$30 | ≈$67 (4 task) | ≈$260 |
| 1.000 | ≈$300 | ≈$60 | ≈$97 (6 task) | ≈$470 |
| 5.000 | ≈$1.500 | ≈$300 | ≈$177 (8 task max) | ≈$2.000 |

Lưu ý: chi phí scan ảnh tăng theo số ECS task (đã phản ánh trong cột ECS ở trên).

Ở 5.000 DAU, Bedrock text/voice chiếm phần lớn tổng chi phí. Các giải pháp nên xem xét:

1. **Reserved Capacity** cho Bedrock (nếu có cho Qwen3-VL) — có thể giảm chi phí/token tới 50%.
2. **Provisioned Throughput** cho Bedrock — giảm latency khi concurrency cao.
3. **DynamoDB Provisioned** mode khi vượt ~500 WCU/RCU ổn định — rẻ hơn on-demand ở tải cao liên tục.
4. **Hai NAT Instance** (mỗi AZ một cái, mỗi t4g.nano ≈$4.50/tháng) để HA — nhân đôi chi phí NAT nhưng chịu được lỗi AZ.

## Liên kết

- [4.10 Dọn Dẹp](/workshop/4.10-Cleanup) — xóa resource để dừng tính phí.
- [4.8.2 Fargate & ALB](/workshop/4.8.2-Fargate-ALB) — chi tiết chi phí ECS và cấu hình autoscaling.
- [4.5.1 Bedrock](/workshop/4.5.1-Bedrock) — thiết lập model access.
