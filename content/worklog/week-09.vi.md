### Mục tiêu Tuần 9

* Hợp nhất toàn bộ các tín hiệu cảnh báo bảo mật phân tán về chung một màn hình thông qua AWS Security Hub.
* Đối chiếu kiến trúc hiện tại của dự án NeuraX với các chuẩn mực độ tin cậy quốc tế.
* Thực thi quản trị tập trung (Governance) đối với các rules bức tường bằng AWS Firewall Manager.
* Thực hiện dò quét yếu điểm phần mềm (Vulnerability scanning) trên hạ tầng máy chủ qua Amazon Inspector.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Hội tụ thế trận (Posture) <br>&emsp; + Kích hoạt AWS Security Hub <br>&emsp; + Thu thập cảnh báo từ GuardDuty, Macie, và WAF chung về 1 Hub | 26/03/2026 | 26/03/2026 | [Security Compliance with AWS Security Hub](https://000018.awsstudygroup.com) |
| 2 | - Đánh giá Tuân thủ <br>&emsp; + Khởi chạy bảng kiểm định CIS AWS Foundations Benchmark <br>&emsp; + Chỉ ra các lỗ hổng tuân thủ (thiếu MFA, cổng mạng hớ hênh) | 27/03/2026 | 27/03/2026 | [CIS Benchmark] |
| 3 | - Quản trị An ninh <br>&emsp; + Tìm hiểu áp dụng luật WAF diện rộng qua AWS Firewall Manager <br>&emsp; + Thiết lập policy tự động để chuẩn bị scale lên mô hình đa tài khoản (Multi-account) | 28/03/2026 | 28/03/2026 | [Security Governance with Firewall Manager](https://000097.awsstudygroup.com) |
| 4 | - Dò quét Lỗ hổng <br>&emsp; + Deploy Amazon Inspector rà soát con Bastion Host (EC2) / các Container xử lý nền <br>&emsp; + Đọc và phân hạng mức độ nguy hiểm của các lỗi CVE | 29/03/2026 | 29/03/2026 | [Systems Patching with EC2 Image Builder](https://000099.awsstudygroup.com) |
| 5 | - Quản lý Cập nhật Bản vá (Patching) <br>&emsp; + Tạo kịch bản tự động vá lỗi bảo mật OS <br>&emsp; + Đảm bảo Image gốc (Golden Image) luôn an toàn từ đầu | 30/03/2026 | 30/03/2026 | [Systems Manager] |
| 6-7 | - Tổng kết Tiền Thanh tra <br>&emsp; + Báo cáo điểm số Security Hub cho toàn bộ cấp quản lý / dev team <br>&emsp; + Lên danh sách việc khắc phục cho tuần sau | 31/03/2026 | 01/04/2026 | [Họp nội bộ] |

### Kết quả đạt được trong Tuần 9

* **Tự động Đo lường Tuân thủ (Compliance):**
  * Đưa **AWS Security Hub** lên sóng, cung cấp cái nhìn 360 độ về sức khỏe an ninh của dự án. Hoàn thành map kiến trúc thực tế với bộ tiêu chuẩn **CIS AWS Foundations Benchmark** cực kì gắt gao nhằm lộ diện những yếu kém cấu hình vô tình bỏ sót.

* **Quản trị Vành đai Tập trung:**
  * Triển khai framework của **AWS Firewall Manager** để áp đặt luật WAF tự động lên mọi API Gateway mới sinh ra từ phía dev, dập tắt tận gốc viễn cảnh lộ API không có khiên chắn ném ra internet.

* **Tiệt trừ Nhược điểm Phần mềm Nhúng (Compute Vulnerability):**
  * Xài **Amazon Inspector** soi chiếu toàn bộ máy chủ nhúng EC2 (dùng cho kết nối hầm ngầm tới rds proxy) ra hàng loạt lỗi từ thư viện OS cũ (Zero-day). Các chu trình đẩy bản vá tự động đã được lập lịch rà soát lại.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Vừa bấm nút chạy Security Hub thì giao diện báo đỏ quạch cả tá "High Severity Findings", khiến tinh thần anh em lập trình viên rơi vào hoảng sợ vì tưởng bị thâm nhập.
  * Diễn dịch ngôn từ hàn lâm từ bộ Compliance benchmark ra tác vụ Dev cụ thể.

* **Giải pháp:**
  * Dùng bộ lọc tạm giấu đi những resource cấp thấp chưa cần thiết, chỉ hiển thị trước các lỗi liên quan vùng Public facing và IAM Root Privileges nhằm trấn an team.
  * Phác thảo "To-do List" bảo mật vi mô: cầm tay chỉ việc team dev bật MFA và xoay password.

* **Bài học:**
  * Điểm uy tín bảo mật là thước đo dài hạn (Iterative), thay vì muốn 100/100 điểm ngay tắp lự. Kỹ năng thiết yếu của anh Kỹ sư Bảo mật là Định mức Ưu tiên (Triage) - Lùi một bước để từ từ vá dứt điểm sự cố cốt lõi.
  * Bề mặt rủi ro (Attack surface) trên Cloud rất bao la, hệ thống Gom Thông báo Trung tâm (Centralized Hub) là bắt buộc cho team chứ không phải có thì tùy.

### Kế hoạch Tuần 10

* Đảo chiều qua thế trận Tấn Công (Offense).
* Khởi động Tuần lễ **Kiểm thử Xâm nhập (Penetration Testing)** vào thẳng mạn sườn hạ tầng NutriTrack.
* Chuẩn bị Tool như Burp Suite để đánh chặn Cognito session token và test phá rào API Gateway.
