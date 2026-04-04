### Mục tiêu Tuần 4

* Chuyển mình hoàn toàn vào vai trò **Security Engineer** cho dự án NeuraX (NutriTrack).
* Bảo mật quyền truy cập hạ tầng cho đội ngũ Dev bằng AWS IAM Identity Center.
* Xây dựng hệ thống quản lý danh tính người dùng chót (End-User) bằng Amazon Cognito.
* Thiết lập và thực thi các chính sách IAM nghiêm ngặt trên toàn bộ môi trường phát triển.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Bảo mật truy cập cho Developer <br>&emsp; + Thiết lập Identity Federation với AWS Single Sign-On (SSO) <br>&emsp; + Gán các permission sets cho Dev team | 26/01/2026 | 26/01/2026 | [Identity Federation with SSO](https://000012.awsstudygroup.com) |
| 2 | - Lập rào chắn IAM <br>&emsp; + Cấu hình IAM Permission Boundaries <br>&emsp; + Ngăn chặn lập trình viên tự động leo thang đặc quyền | 27/01/2026 | 27/01/2026 | [IAM Permission Boundaries](https://000030.awsstudygroup.com) |
| 3 | - Thiết lập Authentication người dùng <br>&emsp; + Khởi tạo Amazon Cognito User Pool cho NutriTrack <br>&emsp; + Đặt chính sách mật khẩu và MFA cho end-users | 28/01/2026 | 28/01/2026 | [Auth with Cognito](https://000081.awsstudygroup.com/) |
| 4 | - Identity Pools & Cấp quyền <br>&emsp; + Setup Cognito Identity Pool <br>&emsp; + Mapping IAM Roles tương ứng cho user đã đăng nhập và khách | 29/01/2026 | 29/01/2026 | [Cognito Auth Docs] |
| 5 | - Danh tính xuyên dải mạng (Cross-Domain) <br>&emsp; + Thử nghiệm Cross-Domain Authentication với Amazon Cognito <br>&emsp; + Kiểm chứng token JWT được cấp phát | 30/01/2026 | 30/01/2026 | [Cross-Domain Cognito](https://000141.awsstudygroup.com) |
| 6-7 | - Audit bảo mật & Đồng bộ <br>&emsp; + Kiểm toán các Lambda execution roles hiện có và cắt giảm đặc quyền dư thừa <br>&emsp; + Họp đồng bộ tiến độ định kỳ với Dev team | 31/01/2026 | 01/02/2026 | [Audit Logs] |

### Kết quả đạt được trong Tuần 4

* **Truy cập Backend an toàn:**
  * Bỏ việc tạo IAM User thủ công, thay bằng **AWS IAM Identity Center (SSO)**, giúp team đăng nhập an toàn từ một cổng tập trung.
  * Áp dụng thành công **IAM Permission Boundaries**, đảm bảo Developer không vô tình trao quyền admin cho các Lambda function do họ deploy.

* **Lớp xác thực Client hiệu quả:**
  * Triển khai hoàn chỉnh kiến trúc **Amazon Cognito** (User Pools + Identity Pools).
  * Quy định điều kiện mật khẩu khắt khe (độ dài >= 8, chữ Hoa, chữ thường, ký tự đặc biệt) và kích hoạt MFA tùy chọn.
  * Cấu hình sinh JWT token chuẩn xác để phục vụ cho việc kiểm soát các API phía sau.

* **Thế trận bảo mật (Security Posture):**
  * Đưa thành phần kiến trúc đầu tiên của Backend Serverless An toàn vào hoạt động. Việc xác thực giờ đây đã độc lập với code logic.
  * Hoàn tất đợt audit đầu tiên đối với các quyền chạy Lambda, ép khuôn theo Principle of Least Privilege.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Cấu hình Cognito để trích xuất token MAP với AWS Credentials qua Identity Pools rất dễ rối vì phải làm việc cùng lúc với 2 loại Pool.
  * Các lỗi `AccessDenied` liên tục bay ra khi áp dụng Permission Boundaries khiến team dev phàn nàn và chán nản ban đầu.

* **Giải pháp:**
  * Viết một tài liệu hướng dẫn nội bộ ngắn gọn phân biệt rõ User Pools (dùng để Auth) và Identity Pools (dùng để Authorization tài nguyên).
  * Đọc log AWS CloudTrail để chỉ thẳng cho Dev đoạn API nào vượt quyền, rồi điều chỉnh lại JSON policy một cách hợp lý.

* **Bài học:**
  * Áp dụng bảo mật chặt chẽ luôn gây ma sát với nhóm làm sản phẩm ban đầu. Giao tiếp và dẫn chứng mạch lạc qua log system là chìa khóa tháo gỡ tranh cãi.
  * Chuyển giao trọng trách Authentication cho Cognito giảm đi hàng tá thời gian và rủi ro so với việc code tay tính năng đăng nhập.

### Kế hoạch Tuần 5

* Tiến lên bước bảo vệ Application Layer.
* Triển khai **AWS Web Application Firewall (WAF)** để phòng thủ cho API Gateway.
* Theo dõi và ngăn chặn các kiểu tấn công Web kinh điển theo tiêu chuẩn OWASP Top 10 (SQLi, XSS, DDoS,...).
