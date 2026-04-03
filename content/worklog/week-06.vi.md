### Mục tiêu Tuần 6

* Nộp và được phê duyệt NutriTrack Proposal.
* Bắt đầu triển khai backend với Lambda functions.
* Thiết lập SAM CLI cho phát triển local.
* Tạo OpenAPI specification cho tất cả endpoints.

### Các nhiệm vụ thực hiện trong tuần

| Ngày | Nhiệm vụ | Ngày BĐ | Ngày HT | Tài liệu tham khảo |
| --- | --- | --- | --- | --- |
| 1 | - Nộp Proposal <br>&emsp; + Hoàn thiện tài liệu NutriTrack Proposal <br>&emsp; + Nộp để mentor review <br>&emsp; + Chuẩn bị slides thuyết trình | 09/02/2026 | 09/02/2026 | [Final Proposal] |
| 2 | - Thiết lập SAM CLI <br>&emsp; + Cài đặt AWS SAM CLI <br>&emsp; + Tạo sample template.yaml <br>&emsp; + Test local Lambda invocation | 10/02/2026 | 10/02/2026 | [SAM Docs](https://docs.aws.amazon.com/serverless-application-model/) |
| 3 | - OpenAPI Specification <br>&emsp; + Định nghĩa tất cả 12 API endpoints <br>&emsp; + Tài liệu hóa request/response schemas <br>&emsp; + Tạo Swagger documentation | 11/02/2026 | 11/02/2026 | [OpenAPI Spec] |
| 4 | - Lambda Functions (Phần 1) <br>&emsp; + Tạo user management functions <br>&emsp; + POST /users, GET /users/{id} <br>&emsp; + Tích hợp với DynamoDB | 12/02/2026 | 12/02/2026 | [Lambda Code] |
| 5 | - Lambda Functions (Phần 2) <br>&emsp; + Tạo meal logging functions <br>&emsp; + POST /meals, GET /meals <br>&emsp; + Upload ảnh qua S3 presigned URL | 13/02/2026 | 13/02/2026 | [Lambda Code] |
| 6-7 | - API Gateway Integration <br>&emsp; + Kết nối Lambda functions với API Gateway <br>&emsp; + Cấu hình CORS settings <br>&emsp; + Test endpoints với Postman | 14/02/2026 | 15/02/2026 | [API Tests] |

### Thành tựu Tuần 6

* **Proposal:**
  * ✅ NutriTrack Proposal đã nộp và **được mentor phê duyệt**.
  * Nhận feedback tích cực về lựa chọn kiến trúc serverless.
  * Góp ý nhỏ: thêm chi tiết về AI integration.

* **Môi trường phát triển:**
  * SAM CLI được cấu hình cho Lambda development local.
  * Local testing hoạt động với Docker và DynamoDB Local.

* **Tiến độ Backend:**
  * 6 Lambda functions đã triển khai và test.
  * API Gateway được cấu hình với CORS và authorization đúng cách.
  * OpenAPI documentation được tạo với Swagger UI.

### Khó khăn & Bài học

* **Khó khăn:**
  * SAM CLI trên Windows có một số vấn đề path với Docker.
  * Tạo presigned URL yêu cầu IAM permissions cụ thể.

* **Cách giải quyết:**
  * Sử dụng WSL2 cho SAM CLI development thay vì native Windows.
  * Thêm quyền S3 PutObject vào Lambda execution role.

* **Bài học rút ra:**
  * WSL2 + SAM CLI là setup được khuyến nghị cho Windows developers.
  * Luôn test IAM permissions với minimal policy trước.

### Kế hoạch Tuần 7

* Triển khai các Lambda functions còn lại (nutrition calculation, AI recommendations).
* Thiết lập Amazon Cognito cho user authentication.
* Tạo CI/CD pipeline với GitHub Actions.
* Bắt đầu cấu trúc frontend development.
