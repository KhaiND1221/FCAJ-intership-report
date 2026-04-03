### Mục tiêu Tuần 7

* Triển khai Cognito authentication cho NutriTrack.
* Hoàn thành các Lambda functions còn lại cho AI features.
* Thiết lập CI/CD pipeline với GitHub Actions.
* Bắt đầu frontend development với React.

### Các nhiệm vụ thực hiện trong tuần

| Ngày | Nhiệm vụ | Ngày BĐ | Ngày HT | Tài liệu tham khảo |
| --- | --- | --- | --- | --- |
| 1 | - Thiết lập Amazon Cognito <br>&emsp; + Tạo User Pool cho NutriTrack <br>&emsp; + Cấu hình password policies <br>&emsp; + Thiết lập email verification | 16/02/2026 | 16/02/2026 | [Cognito Docs](https://docs.aws.amazon.com/cognito/) |
| 2 | - Cognito Integration <br>&emsp; + Tích hợp Cognito với API Gateway <br>&emsp; + Tạo JWT authorizer <br>&emsp; + Test protected endpoints | 17/02/2026 | 17/02/2026 | [Auth Config] |
| 3 | - AI Lambda Functions <br>&emsp; + Tạo Lambda tích hợp Bedrock <br>&emsp; + Triển khai endpoint gợi ý bữa ăn <br>&emsp; + Thêm function phân tích dinh dưỡng | 18/02/2026 | 18/02/2026 | [Bedrock Integration](https://docs.aws.amazon.com/bedrock/) |
| 4 | - Thiết lập CI/CD Pipeline <br>&emsp; + Tạo GitHub Actions workflow <br>&emsp; + Cấu hình SAM deploy steps <br>&emsp; + Thiết lập môi trường dev/staging | 19/02/2026 | 19/02/2026 | [GitHub Actions] |
| 5 | - Thiết lập Frontend Project <br>&emsp; + Khởi tạo React + Vite project <br>&emsp; + Cấu hình Tailwind CSS <br>&emsp; + Thiết lập cấu trúc project | 20/02/2026 | 20/02/2026 | [Frontend Repo] |
| 6-7 | - Frontend Development (Phần 1) <br>&emsp; + Tạo authentication pages (Login, Register) <br>&emsp; + Tích hợp AWS Amplify cho Cognito <br>&emsp; + Test auth flow end-to-end | 21/02/2026 | 22/02/2026 | [UI Components] |

### Thành tựu Tuần 7

* **Authentication:**
  * Cognito User Pool đã tạo với secure password policy.
  * API Gateway được bảo vệ với JWT authorizer.
  * Email verification flow hoạt động.

* **AI Integration:**
  * Bedrock Claude 3 Sonnet được tích hợp cho gợi ý bữa ăn.
  * Nutrition analysis function cung cấp breakdown calories/macros.
  * Rate limiting được cấu hình để quản lý chi phí Bedrock API.

* **CI/CD:**
  * Pipeline deployment tự động: Push → Test → Deploy.
  * Stacks riêng biệt cho môi trường dev và staging.
  * Cơ chế rollback được cấu hình.

* **Frontend:**
  * React + Vite + Tailwind project đã khởi tạo.
  * Trang Login và Registration hoàn thành.
  * AWS Amplify được cấu hình cho Cognito integration.

### Khó khăn & Bài học

* **Khó khăn:**
  * Bedrock API responses là async; cần proper error handling.
  * Cognito token refresh flow khá phức tạp để implement.

* **Cách giải quyết:**
  * Triển khai retry logic với exponential backoff cho Bedrock.
  * Sử dụng AWS Amplify library vì nó tự động xử lý token refresh.

* **Bài học rút ra:**
  * Bedrock prompts cần được engineering cẩn thận để đảm bảo output nhất quán.
  * AWS Amplify đơn giản hóa đáng kể việc tích hợp auth frontend.

### Kế hoạch Tuần 8

* Hoàn thành tất cả frontend pages (Dashboard, Meal Log, Analytics).
* Triển khai upload ảnh và phân tích ảnh bữa ăn.
* Tích hợp frontend với tất cả backend APIs.
* Bắt đầu unit testing cho Lambda functions.
