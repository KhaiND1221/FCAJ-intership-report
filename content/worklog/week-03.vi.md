### Mục tiêu Tuần 3

* Hoàn thành chuỗi bài cơ bản (Basic Cloud Journey) về DynamoDB và AWS CLI.
* Chốt ý tưởng dự án NeuraX (NutriTrack) và phân công vai trò chuyên môn cụ thể.
* Chuyển đổi trạng thái từ "Học cơ bản" sang làm việc theo Role chuyên môn (Security Engineer).
* Phác thảo thiết kế kiến trúc sơ bộ cho backend của NeuraX.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Cơ sở dữ liệu NoSQL <br>&emsp; + Học NoSQL Database Essentials với Amazon DynamoDB | 19/01/2026 | 19/01/2026 | [DynamoDB Essentials](https://000060.awsstudygroup.com) |
| 2 | - Vận hành & Edge Computing <br>&emsp; + Lệnh quản trị với AWS CLI <br>&emsp; + Content Delivery với Amazon CloudFront | 20/01/2026 | 20/01/2026 | [AWS CLI & CloudFront](https://cloudjourney.awsstudygroup.com/) |
| 3 | - Lên ý tưởng dự án <br>&emsp; + Chốt dự án "NutriTrack" (Nằm trong tổ chức NeuraX) <br>&emsp; + Bàn luận về kiến trúc Serverless (Lambda/API Gateway) | 21/01/2026 | 21/01/2026 | [Biên bản họp nội bộ] |
| 4 | - Thiết kế kiến trúc & Vai trò <br>&emsp; + Được phân công vị trí **Cloud Security Engineer** <br>&emsp; + Phác thảo ranh giới bảo mật cho dự án | 22/01/2026 | 22/01/2026 | [Bản nháp kiến trúc] |
| 5 | - Proposal Khởi tạo <br>&emsp; + Viết phần Security cho bản Proposal của NutriTrack <br>&emsp; + Chuẩn bị tài liệu để chuyển sang định hướng WAF, Cognito | 23/01/2026 | 23/01/2026 | [Document Nháp] |
| 6-7 | - Tự học cuối tuần <br>&emsp; + Nghiên cứu bộ tiêu chuẩn bảo mật cho API Gateway và DynamoDB | 24/01/2026 | 25/01/2026 | [AWS Sec Docs] |

### Kết quả đạt được trong Tuần 3

* **Hoàn tất Khóa huấn luyện cơ bản (Cloud Journey):**
  * Hiểu rõ triết lý NoSQL khi thực hành trên DynamoDB.
  * Điều hướng và quản lý tài nguyên AWS thành công thông qua dòng lệnh AWS CLI.
  * Hiểu nguyên lý phân phối dữ liệu siêu tốc bằng CloudFront.

* **Định hình Dự án cốt lõi:**
  * Toàn bộ team thống nhất làm ứng dụng "NutriTrack" (Dự án theo dõi dinh dưỡng bằng kiến trúc Serverless).
  * Đảm nhận chính thức vị trí **Cloud Security Engineer**, chịu trách nhiệm bảo vệ dữ liệu người dùng và các API của ứng dụng.

* **Tài liệu:**
  * Đồng sáng tác Proposal dự án, tập trung cực sâu vào mô hình trách nhiệm chung (Shared Responsibility Model) của các dịch vụ Serverless.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Việc dùng AWS CLI ban đầu rất dễ bị sai cú pháp so với thao tác chuột trên Management Console.
  * Việc chuyển rẽ nhánh từ người học tổng quát sang chuyên trang Security đòi hỏi thay đổi tư duy: Từ "làm sao để chạy" chuyển sang "làm sao để phá và bảo vệ".

* **Giải pháp:**
  * Sử dụng thường xuyên cú pháp `aws help` để tra cứu tham số lệnh.
  * Đọc nền tảng AWS Well-Architected Framework (Cột trụ Security).

* **Bài học:**
  * Serverless lo giùm chúng ta máy chủ nhưng *không* lo giùm vấn đề bảo mật luồng thông tin. API Gateway và Lambda bắt buộc phải có Identity và Resource Policies rất nghiêm ngặt.

### Kế hoạch Tuần 4

* Bước vào giai đoạn triển khai Security tập trung cho NeuraX.
* Mục tiêu Tuần 4: Xây dựng hệ thống Xác thực và Quản lý quyền truy cập danh tính cho người dùng (Identity & Access Management) với **Amazon Cognito**.
* Rèn luyện thiết lập Boundary Permissions trên IAM cho các lập trình viên khác trong team.
