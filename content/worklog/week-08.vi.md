### Mục tiêu Tuần 8

* Ràng buộc các chính sách Quyền riêng tư đối với dữ liệu hình ảnh và thể trạng người dùng NutriTrack.
* Tự động hóa phát hiện rò rỉ Dữ liệu định danh cá nhân (PII) thông qua Amazon Macie.
* Bài bản hóa chu trình sao lưu và lưu giữ vòng đời ảnh chụp nhanh (snapshot) để đảm bảo độ bền bỉ.
* Vô hiệu hóa rủi ro mã độc tống tiền (Ransomware) thông qua tính năng bắt lỗi dị thường trên bản sao lưu.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Quản trị Quyền riêng tư <br>&emsp; + Kích hoạt Amazon Macie trên tài khoản <br>&emsp; + Lên cấu hình yêu cầu Macie quét các S3 bucket tìm PII | 23/02/2026 | 23/02/2026 | [Data Protection with Amazon Macie](https://000090.awsstudygroup.com) |
| 2 | - Trinh sát dữ liệu PII <br>&emsp; + Bơm thử data mẫu sinh ảo (Tên, Email, tình trạng bệnh) vào bucket <br>&emsp; + Đọc báo cáo rò rỉ trả về từ Macie | 24/02/2026 | 24/02/2026 | [Macie PII Scan] |
| 3 | - Sao lưu Tự động <br>&emsp; + Tạo vòng đời duy trì Snapshot thông qua Amazon EBS Data Lifecycle Manager (DLM) <br>&emsp; + Viết luật copy tự động sang vùng (Region) khác đề phòng thảm họa | 25/02/2026 | 25/02/2026 | [Snapshot Automation](https://000088.awsstudygroup.com) |
| 4 | - Dò tìm mầm mống Ransomware <br>&emsp; + Tìm hiểu Anomaly Detection for EBS Backups <br>&emsp; + Dùng cơ chế khóa không cho phép thao tác xóa bản sao lưu | 26/02/2026 | 26/02/2026 | [Anomaly Detection](https://000089.awsstudygroup.com) |
| 5 | - Xuất báo cáo Tuân thủ <br>&emsp; + Triển khai AWS Backup làm hub trung tâm backup DynamoDB <br>&emsp; + Trích xuất báo cáo tuân thủ ban đầu gửi cho Dev team | 27/02/2026 | 27/02/2026 | [Data Protection with AWS Backup](https://000013.awsstudygroup.com) |
| 6-7 | - Củng cố Kiến trúc <br>&emsp; + Duyệt lại sơ đồ luồng dữ liệu (Data flow diagrams) liên quan đến phân tầng PII <br>&emsp; + Cập nhật quy định yêu cầu xóa định danh trước quá trình phân tích số liệu | 28/02/2026 | 01/03/2026 | [Architecture Draft] |

### Kết quả đạt được trong Tuần 8

* **Thắt chặt Quyền Riêng tư Đặc thù:**
  * Thuần thục **Amazon Macie**, xây dựng hàng rào đánh giá không ngừng nghỉ lên các bucket S3. Giờ đây hệ thống sẽ lập tức gióng lên hồi chuông báo động nếu một file log do dev lỡ ghi vào chứa hàng loạt Email, IP người dùng dạng văn bản trần.

* **Tính Bền bỉ Tự động:**
  * Khắc họa rõ nét chiến lược Ứng phó thảm họa khẩn cấp (Disaster Recovery). Qua **AWS Backup** và **EBS Data Lifecycle Manager**, trạng thái cơ sở dữ liệu được snapshot định kì và truyền sang khu vực dự phòng, miễn nhiễm với sự cố sập phân vùng mạng cục bộ.

* **Giảm thiểu thiệt hại Mã độc:**
  * Bật thành công chế độ dò tìm dị thường trên ảnh lưu. Trường hợp có hacker chèn payload mã hóa toàn hệ thống file máy chủ trước giờ sao lưu, tính năng Machine Learning sẽ bắt được hoa văn (pattern) nhiễu loạn của Ransomware và cấp báo để admin khóa quyền truy xuất chéo ngay.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Do không để ý, lệnh quét Macie ban đầu tính tiền lẹm vào ngân sách cực cao bởi nó đọc *lại từ đầu toàn bộ* đống bucket lịch sử thay vì chỉ đọc các file mới/có thay đổi.
  * Hệ thống AWS Backup bị khựng khi không gom đủ tài nguyên máy chủ theo chính sách thiết lập ban đầu.

* **Giải pháp:**
  * Rút gọn phạm vi quét của Macie, chỉ cho phép chạy Targeted Job nhắm đích xác vào những prefix path đánh giá là Cực Khẩn yếu thay vì đọc loạn xạ mảng raw image.
  * Phổ biến bộ quy tắc Cắm cờ Tài nguyên (Resource Tagging) thống nhất (Ví dụ: `BackupPlan: Daily`). Đây là móc xích cho các dịch vụ backup bắt trúng mục tiêu.

* **Bài học:**
  * Các tool siêu việt như Macie là con dao hai lưỡi về tài chính. Việc phân loại dữ liệu nghiêm ngặt (đâu là Public, đâu là Nhạy cảm) *trước* khi quét mới là yếu tố quyết định của bảo mật khôn ngoan.
  * Một bản sao lưu vô dụng nếu nó không có đặc tính Bất khả biến (Immutable) cũng như chưa được miễn nhiễm khỏi việc bị chính nhân sự nội bộ xóa sạch.

### Kế hoạch Tuần 9

* Nâng tầm quy mô bảo mật lên mức Quản trị Tổng thể (Governance).
* Triển khai **AWS Security Hub** để gom quy tụ báo cáo rủi ro về một màn hình.
* Áp hệ thống vào khuôn khổ bộ quy chuẩn khắt khe **CIS AWS Foundations Benchmark**.
* Sửa soạn quy trình chốt hạ Kiểm thử xâm nhập (Pen Test) cho thiết kế backend ứng dụng NutriTrack.
