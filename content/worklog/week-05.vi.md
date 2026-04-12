### Mục tiêu Tuần 5

* Thiết lập môi trường AWS Amplify sandbox cùng IA-1 teammate.
* Tạo và đồng bộ file `amplify_outputs.json` cho Frontend.
* Xây dựng ước tính chi phí AWS theo giá thị trường và cấu hình cảnh báo ngân sách.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Phân tích Hạ tầng (cùng IA-1) <br>&emsp; + Nghiên cứu sâu `backend.ts`, `data/resource.ts`, `auth/`, `storage/` <br>&emsp; + Map các định nghĩa CDK resource với dịch vụ AWS tương ứng | 26/02/2026 | 26/02/2026 | [AWS Amplify Docs](https://docs.amplify.aws/) |
| 2 | - Khởi tạo Sandbox (cùng IA-1) <br>&emsp; + Chạy `npx ampx sandbox` lần đầu <br>&emsp; + Xác nhận Cognito User Pool, DynamoDB tables, S3 buckets được tự động tạo | 27/02/2026 | 27/02/2026 | [Amplify Sandbox](https://docs.amplify.aws/gen2/deploy-and-host/sandbox-environments/) |
| 3 | - Đồng bộ Config Frontend (cùng IA-1) <br>&emsp; + Tạo `amplify_outputs.json` qua `npx ampx generate outputs --outputs-out-dir ../frontend` <br>&emsp; + Kiểm tra schema config cho AppSync, Cognito, và S3 | 28/02/2026 | 28/02/2026 | [Amplify CLI Reference](https://docs.amplify.aws/gen2/reference/cli-commands/) |
| 4 | - Ước tính Chi phí Production <br>&emsp; + Tính giá thị trường cho các dịch vụ AWS: Lambda, DynamoDB, S3, Cognito, Bedrock (Qwen3-VL 235B) <br>&emsp; + Dự toán chi phí hàng tháng cho cả workshop (1 ngày) và production (1 tháng) | 02/03/2026 | 02/03/2026 | [AWS Pricing Calculator](https://calculator.aws/) |
| 5 | - Cấu hình Rào chắn Ngân sách <br>&emsp; + Thiết lập AWS Budgets với cảnh báo đa ngưỡng hàng tháng <br>&emsp; + Cấu hình Cost Explorer dashboards phân loại theo dịch vụ | 03/03/2026 | 03/03/2026 | [Cost and Usage Management](https://000064.awsstudygroup.com) |
| 6 | - Kiểm tra Sandbox toàn diện (cùng IA-1) <br>&emsp; + Test luồng đăng ký/đăng nhập Cognito <br>&emsp; + Xác nhận quyền upload S3 và đo thời gian cold start Lambda | 04/03/2026 | 04/03/2026 | - |

### Kết quả đạt được trong Tuần 5

* **Hạ tầng Baseline:**
  * Cùng IA-1 teammate dựng thành công Amplify sandbox. Backend stack (Cognito, DynamoDB, S3, Lambda) được tự động sinh từ CDK definitions.

* **Đồng bộ Frontend-Backend:**
  * Tạo và xác nhận `amplify_outputs.json`, cho phép frontend kết nối mọi dịch vụ backend không cần cấu hình thủ công.

* **Quản trị Chi phí:**
  * Ước tính chi phí production theo giá thị trường và triển khai cảnh báo ngân sách chủ động, cung cấp tầm nhìn tài chính rõ ràng cho toàn team.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Lệnh `npx ampx sandbox` lỗi ngay lần chạy đầu do thiếu dependencies Node.js và AWS CLI phiên bản cũ.
* **Giải pháp:**
  * Nâng cấp Node.js lên v22 LTS và cài lại AWS CLI v2, giải quyết triệt để lỗi provisioning.
* **Bài học:**
  * Amplify sử dụng CDK, đòi hỏi hiểu sâu về Infrastructure as Code. Ước tính chi phí nên dùng giá thị trường thay vì Free Tier để đảm bảo lập ngân sách chính xác cho production.

### Kế hoạch Tuần 6

* Khởi tạo project React Native (Expo Router) cho frontend.
* Kết nối frontend với Amplify backend.
* Xây dựng hệ thống tab navigation cùng team.
