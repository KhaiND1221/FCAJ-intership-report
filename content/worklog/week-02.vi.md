### Mục tiêu Tuần 2

* Đi sâu tìm hiểu Network Security thông qua kiến trúc Amazon VPC.
* Nắm vững cách quản lý ranh giới truy cập thông qua AWS IAM.
* Thực hành bài Lab về Auto Scaling và CloudWatch từ cổng Cloud Journey.
* Tham gia các hoạt động kết nối nhóm và nhận áo đồng phục.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Deep Dive: Amazon VPC <br>&emsp; + Tìm hiểu Subnets, Route Tables, Internet Gateway <br>&emsp; + Phân biệt Public và Private Subnets | 12/01/2026 | 12/01/2026 | [Networking Essentials with VPC](https://000003.awsstudygroup.com) |
| 1 | - Deep Dive: AWS IAM <br>&emsp; + Nguyên tắc đặc quyền tối thiểu (Least Privilege) <br>&emsp; + Cấu hình IAM Policies và Roles | 12/01/2026 | 12/01/2026 | [Access Management with IAM](https://000002.awsstudygroup.com) |
| 2 | - Nâng cao tính bền bỉ <br>&emsp; + Thiết lập Auto Scaling cho EC2 <br>&emsp; + Cấp quyền EC2 thông qua Instance Profiling (IAM Roles) | 13/01/2026 | 13/01/2026 | [Cloud Journey Labs](https://cloudjourney.awsstudygroup.com/1-explore/) |
| 3 | - Hành chính & Gắn kết team <br>&emsp; + Ngày tự học <br>&emsp; + Nhận áo đồng phục AWS x FCAJ <br>&emsp; + Giao lưu với các team khác | 14/01/2026 | 14/01/2026 | [Hình ảnh] |
| 4 | - Giám sát & Metrics <br>&emsp; + Giám sát hệ thống với Amazon CloudWatch <br>&emsp; + Thiết lập Custom Metrics và Alarms | 15/01/2026 | 15/01/2026 | [Monitoring with CloudWatch](https://000008.awsstudygroup.com) |
| 4 | - Chứng chỉ Coursera <br>&emsp; + Hoàn thành Tuần 1: AWS Cloud Fundamentals <br>&emsp; + Đạt điểm vượt qua bài Quiz | 15/01/2026 | 15/01/2026 | [Chứng chỉ / Huy hiệu] |
| 5-7 | - Ôn tập & Lên kế hoạch Tuần 3 <br>&emsp; + Đánh giá các labs IAM/VPC đã làm <br>&emsp; + Cập nhật web báo cáo cá nhân | 16/01/2026 | 18/01/2026 | [Link Web] |

### Kết quả đạt được trong Tuần 2

* Kỹ năng thực hành:
  * Khởi tạo và bảo mật hạ tầng mạng cô lập với **VPC**.
  * Thành thạo các yếu tố cơ bản của **IAM Policies** để thắt chặt quyền truy cập tài nguyên.
  * Triển khai một cụm máy chủ tự động co giãn với **EC2 Auto Scaling** và giám sát bởi **CloudWatch**.

* Kiến thức:
  * Hoàn thiện 100% Tuần 1 môn AWS Cloud Fundamentals (Coursera).
  * Hiểu rõ mô hình Trách nhiệm chung (Shared Responsibility Model) cũng như khái niệm cách ly mạng.

* Ngoại khóa:
  * Nhận áo đồng phục và chính thức hòa nhập với văn hóa FCJ.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Cấu hình định tuyến VPC (Subnet, bảng định tuyến, NAT Gateway) phức tạp, cấu hình sai dễ gây gián đoạn kết nối.
  * Việc tự viết JSON Policy cho IAM rất dễ phát sinh lỗi cú pháp hoặc quyền.

* **Giải pháp:**
  * Vẽ biểu đồ mạng ra giấy để trực quan hóa luồng dữ liệu trước khi thực hiện trên AWS.
  * Sử dụng công cụ AWS IAM Policy Simulator để kiểm tra việc cấp quyền.

* **Bài học:**
  * Network và IAM chính là trái tim của phòng thủ đám mây (Cloud Security). Nếu cấp quyền không chặt và không cô lập VPC đúng cách, mọi dịch vụ tầng cao (như lambda, API) đều có nguy cơ bị tấn công.

### Kế hoạch Tuần 3

* Hoàn tất các dịch vụ truyền tải dữ liệu và ứng dụng (DynamoDB, CloudFront).
* Bắt đầu họp bàn định hướng kiến trúc cho dự án **NeuraX**.
* Vạch ra các yêu cầu bảo mật nền tảng cho ứng dụng web của team.
