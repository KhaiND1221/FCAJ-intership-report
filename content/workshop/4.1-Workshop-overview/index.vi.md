# 4.1 Tổng quan

NutriTrack là nền tảng theo dõi dinh dưỡng tích hợp AI, cấp độ production, xây dựng trên AWS Amplify Gen 2. Workshop này hướng dẫn bạn triển khai đúng backend và mobile client đang có — xem source tại [neurax-web-app](https://github.com/NeuraX-HQ/neurax-web-app) — từ đầu đến cuối, trong một ngày làm việc.

## Bạn sẽ xây dựng gì

Sau khi hoàn thành workshop, bạn sẽ có một stack đang chạy gồm:

- **6 model DynamoDB** do AppSync quản lý (`Food`, `user`, `FoodLog`, `FridgeItem`, `Friendship`, `UserPublicStats`), định nghĩa trong `backend/amplify/data/resource.ts`.
- **4 Lambda function** chạy trên **Node.js 22 / ARM64**:
  - `ai-engine` — handler AI đa hành động, 512 MB, timeout 120 giây.
  - `process-nutrition` — tra cứu dinh dưỡng lai DynamoDB + AI.
  - `friend-request` — mutation cho hệ thống bạn bè.
  - `resize-image` — trigger S3 event trên prefix `incoming/`.
  - `scan-image` — proxy xử lý ảnh: tải file từ S3, chuyển tiếp đến ECS FastAPI (/analyze-food, /analyze-label, /scan-barcode) qua JWT xác thực, trả kết quả bằng cơ chế polling bất đồng bộ.
- **9 hành động AI** do Lambda `aiEngine` phục vụ: `generateCoachResponse`, `generateFoodNutrition`, `fixFood`, `voiceToFood`, `ollieCoachTip`, `generateRecipe`, `calculateMacros`, `challengeSummary`, `weeklyInsight`.
- **Amazon Bedrock** với foundation model `qwen.qwen3-vl-235b-a22b` ở **ap-southeast-2** (Sydney), được gọi bởi AI coach persona tên **Ollie**, xử lý dịch âm thanh (voice), và gọi API trực tiếp từ service **ECS FastAPI** để phân tích hình ảnh/thực phẩm.
- **Amazon S3** bucket với các prefix `incoming/`, `voice/`, `media/`, gắn vào `resize-image` qua S3 event notification và lifecycle rule 1 ngày trên `incoming/`.
- **Amazon Cognito** user pool với đăng ký email + OTP và Google federated identity.
- **Amazon Transcribe** cho tính năng voice-to-food, gọi từ `ai-engine` với resource policy cấp quyền trên `voice/*`.
- **ECS Fargate** container tier chạy service FastAPI (`backend/main.py`) sau một Application Load Balancer. Được triển khai thủ công qua giao diện AWS Console để dễ diễn giải và quản lý thực tế (không dùng Terraform như lý thuyết).
- **Ứng dụng Expo** (SDK 54, React Native 0.81, React 19, Expo Router 6, Zustand 5) trong `frontend/`.

## Các dịch vụ AWS sử dụng

| Dịch vụ | Vai trò trong NutriTrack |
| --- | --- |
| **AWS Amplify Gen 2** | Scaffold project, CI/CD pipeline (`amplify.yml`), triển khai đa môi trường (sandbox → staging → production) |
| **AWS AppSync** | Managed GraphQL API — toàn bộ query, mutation và real-time subscription của client đều đi qua AppSync |
| **Amazon DynamoDB** | NoSQL datastore chính cho 6 model dữ liệu (`Food`, `FoodLog`, `FridgeItem`, `Friendship` và nhiều hơn) |
| **AWS Lambda** | Bốn function Node.js 22 / ARM64: `aiEngine`, `processNutrition`, `friendRequest`, `resizeImage` |
| **AWS Secrets Manager** | Lưu trữ bảo mật `NUTRITRACK_API_KEY` — khóa bí mật dùng để tạo JWT HS256 xác thực với các endpoint trên ECS |
| **Amazon Bedrock** | Inference foundation model — `qwen.qwen3-vl-235b-a22b` tại `ap-southeast-2` cho các hành động AI, xử lý voice và phân tích hình ảnh trực tiếp từ ECS |
| **Amazon S3** | Lưu trữ media với 4 prefix (`incoming/`, `voice/`, `avatar/`, `media/`) và lifecycle rule 1 ngày trên `incoming/` |
| **Amazon Cognito** | Xác thực người dùng — đăng ký email + OTP và Google federated identity qua Hosted UI |
| **Amazon Transcribe** | Speech-to-text cho ghi âm thực phẩm bằng tiếng Việt (`vi-VN`), gọi từ `aiEngine` |
| **Amazon ECS Fargate** | Service xử lý API hình ảnh/thực phẩm bằng FastAPI, đóng gói container và triển khai thủ công qua AWS Console, chạy sau một Application Load Balancer cho thông lượng cao |
| **Amazon ECR** | Lưu trữ image container của FastAPI cho việc triển khai ECS trong môi trường thực tế |
| **Amazon VPC** | Cách ly mạng cho tầng ECS — private subnet, NAT Instance, VPC endpoint cho DynamoDB/S3 |
| **Amazon CloudWatch** | Log, metric và alarm cho Lambda, độ trễ Bedrock và sức khỏe ECS |
| **AWS IAM** | Execution role theo nguyên tắc least-privilege cho từng Lambda và ECS task; role Cognito identity pool cho mobile client |
| **Amazon CloudFront** | CDN cho frontend Amplify Hosting (tự cấu hình bởi Amplify) |
| **Amazon Route 53** | DNS routing cho ALB endpoint và CloudFront distribution |
| **AWS WAF** | Web Application Firewall bảo vệ tầng CloudFront + ALB khỏi traffic độc hại |

## Kiến trúc tổng quan

![Kiến trúc tổng thể NutriTrack](/FCAJ-intership-report/solution-architect/nutritrack-v4.drawio.png)

## Kết quả học tập

Sau khi hoàn thành workshop này, bạn sẽ có thể:

1. Khởi tạo một backend Amplify Gen 2 từ đầu và tiến hóa qua ba môi trường (sandbox, `feat/phase3`, `main`).
2. Mô hình hóa một domain multi-tenant thực tế trong Amplify Data với authorization theo owner và GSI.
3. Gắn Lambda Node.js 22 vào AppSync dưới dạng custom query và mutation, đính kèm IAM policy bằng CDK escape hatch.
4. Gọi foundation model đa phương thức trên Amazon Bedrock (Qwen3-VL) từ Lambda, bao gồm đầu vào hình ảnh và giọng nói.
5. Cấu hình S3 event notification, resource policy cho Transcribe, và lifecycle rule trực tiếp trong `backend.ts`.
6. Chạy Expo client với file `amplify_outputs.json` được tự sinh và test trên thiết bị thật qua Expo Go.
7. Gỡ toàn bộ tài nguyên sạch sẽ để hóa đơn AWS trở về 0.

## Ước tính chi phí

| Dịch vụ | 1 Ngày (workshop) | 1 Tháng (100 DAU) |
| --- | --- | --- |
| Amplify Gen 2 (AppSync, DynamoDB, Lambda, S3) | < $1 | ≈$13 |
| Amazon Bedrock (Qwen3-VL 235B) | ≈$2–5 | ≈$30 |
| Amazon Transcribe (ghi âm thực phẩm) | < $0.50 | ≈$6 |
| ECS Fargate + ALB + NAT Instance | ≈$2–5 | ≈$44 |
| **Tổng cộng** | **≈$5–10** | **≈$93** |

Chi phí chủ yếu đến từ **Amazon Bedrock** — coaching AI và tra cứu dinh dưỡng text chiếm phần lớn chi phí Bedrock. Phân tích ảnh nay chạy trực tiếp trên **ECS Fargate**, chuyển chi phí xử lý sang dòng compute ECS. Hãy bật AWS Budgets với mức cảnh báo **$25/tháng** trước khi bắt đầu. Xem chi tiết tại [4.11.1 Chi tiết ngân sách](/workshop/4.11.1-Budget-Breakdown).

## Thời lượng và độ khó

- **Thời lượng**: khoảng 1 ngày làm việc (6 đến 8 tiếng) nếu bạn làm tuần tự, không rẽ ngang.
- **Độ khó**: **Trung cấp**. Bạn nên quen TypeScript, AWS Console, và terminal. Kinh nghiệm React Native là một lợi thế nhưng không bắt buộc — frontend chạy nguyên trạng.

## Các phần trong workshop

1. [4.2 Điều kiện tiên quyết](/workshop/4.2-Prerequiste) — tài khoản, công cụ, đăng ký truy cập Bedrock.
2. [4.3 Foundation Setup](/workshop/4.3-Foundation-Setup) — cấu trúc repo, Amplify sandbox, Cognito.
3. [4.4 Monitoring Setup](/workshop/4.4-Monitoring-Setup) — AppSync và các model DynamoDB.
4. [4.5 Processing Setup](/workshop/4.5-Processing-Setup) — Bedrock + Lambda `ai-engine`.
5. [4.6 Automation Setup](/workshop/4.6-Automation-Setup) — S3, trigger resize-image, Transcribe.
6. [4.7 Dashboard Setup](/workshop/4.7-Dashboard-Setup) — cấu hình app Expo.
7. [4.8 Verify Setup](/workshop/4.8-Verify-Setup) — smoke test end-to-end.
8. [4.9 CI/CD — Amplify đa môi trường](/workshop/4.9-Use-CDK) — `amplify.yml`, sandbox → `feat/phase3` → `main`.
9. [4.10 Dọn dẹp](/workshop/4.10-Cleanup) — teardown an toàn.
10. [4.11 Phụ lục](/workshop/4.11-Appendices) — bảng chi phí, troubleshooting, tham khảo.

## Nhóm 11 — NeuraX

Xây dựng bởi **Nhóm 11 — NeuraX** trong chương trình thực tập First Cloud AI Journey (FCAJ) tại Amazon Web Services Vietnam. Xem [proposal](/proposal) để biết danh sách thành viên và phân công vai trò đầy đủ.

## Nguồn đối chiếu

Mọi phát biểu trong workshop này đều dựa trên code thực tế dưới repository [neurax-web-app](https://github.com/NeuraX-HQ/neurax-web-app). Khi tài liệu và code mâu thuẫn, code là đúng. Các file nên mở sẵn ở tab thứ hai:

- `backend/amplify/backend.ts` ([xem](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/backend/amplify/backend.ts))
- `backend/amplify/data/resource.ts` ([xem](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/backend/amplify/data/resource.ts))
- `backend/amplify/ai-engine/handler.ts` ([xem](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/backend/amplify/ai-engine/handler.ts))
- `amplify.yml` ([xem](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/amplify.yml))
- `CLAUDE.md` ([xem](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/CLAUDE.md))
