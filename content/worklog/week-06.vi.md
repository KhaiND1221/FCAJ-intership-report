### Mục tiêu Tuần 6

* Đảm bảo Dữ liệu lưu trữ (At-rest) và Dữ liệu truyền tải (In-transit) được mã hóa đồng bộ trong hệ sinh thái NeuraX.
* Quản lý và tiến hành xoay vòng khóa mật mã qua AWS Key Management Service (KMS).
* Loại bỏ việc "code cứng" (hard-code) các tham số bí mật bằng AWS Secrets Manager.
* Thi hành các Quy chuẩn Bảo mật S3 (S3 Security Best Practices) cho kho chứa ảnh thực đơn NutriTrack.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Thiết lập Hệ thống Khóa <br>&emsp; + Tạo Customer Managed Keys (CMK) trong AWS KMS <br>&emsp; + Định nghĩa Key Policies cấp quyền truy cập | 05/03/2026 | 05/03/2026 | [Encryption with AWS KMS](https://000033.awsstudygroup.com) |
| 2 | - Mã hóa S3 & DynamoDB <br>&emsp; + Áp dụng vòng khóa KMS lên bảng DynamoDB của NutriTrack <br>&emsp; + Bắt buộc mã hóa mặc định (Default Encryption) trên mọi S3 bucket | 06/03/2026 | 06/03/2026 | [AWS Sec Best Practices] |
| 3 | - Quản lý tham số Bí mật <br>&emsp; + Chuyển các khóa API bên thứ ba vào lưu trong AWS Secrets Manager <br>&emsp; + Xóa toàn bộ secret tồn tại dưới dạng thuần text trong Lambda Env Vars | 07/03/2026 | 07/03/2026 | [AWS Secrets Manager](https://000096.awsstudygroup.com) |
| 4 | - Định tuyến Kín cho S3 <br>&emsp; + Ngăn chặn luồng dữ liệu từ Lambda gọi sang S3 đi qua mạng Internet công cộng <br>&emsp; + Setup S3 Gateway VPC Endpoint | 08/03/2026 | 08/03/2026 | [Private Access to S3](https://000111.awsstudygroup.com) |
| 5 | - Tăng cường bọc thép S3 <br>&emsp; + Kích hoạt toàn bộ S3 Block Public Access <br>&emsp; + Viết S3 Bucket Policy từ chối mọi truy vấn không thông qua HTTPS | 09/03/2026 | 09/03/2026 | [S3 Security Best Practices](https://000069.awsstudygroup.com) |
| 6-7 | - Đánh giá Kiến trúc <br>&emsp; + Phổ biến quy chuẩn mã hóa cùng Dev team <br>&emsp; + Rà soát đảm bảo các IAM Role của Lambda đã thêm cờ `kms:Decrypt` | 10/03/2026 | 11/03/2026 | [Architecture Draft] |

### Kết quả đạt được trong Tuần 6

* **Thực thi Mã hóa dữ liệu:**
  * Tạo thành công Custom Keys bảo mật cao qua **AWS KMS** và triển khai gắn thành công vào mảng lưu trữ (DynamoDB, S3). Rủi ro rò rỉ dữ liệu khi bị đánh cắp ổ cứng cấp bách được triệt tiêu toàn diện.

* **Cô lập tham số mật (Secrets Decoupling):**
  * Rà soát mã nguồn IaC của nhóm dev. Lọc bỏ các giá trị biến môi trường chứa token nhạy cảm, thay bằng việc cho code tự tải cấu hình mật từ **AWS Secrets Manager**, giảm hẳn nguy cơ sập bẫy rò rỉ khóa lên GitHub.

* **Tiêu chuẩn hóa kho S3:**
  * Niêm phong tuyệt đối các kho ảnh của NutriTrack qua tính năng "Block Public Access". Mọi giao tiếp trao đổi dữ liệu từ Lambda sang S3 giờ đây chạy an toàn qua **VPC Endpoints** nội bộ trực tiếp trên hạ tầng mạng của AWS.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Sau khi bật mã hóa bảng DynamoDB, các cục hàm Lambda đột ngột ném lỗi `AccessDeniedContext` mù mờ, gây tê liệt các API.
  * Developers báo lỗi không test code dưới local được vì công cụ AWS SAM thiếu quyền kết nối ngữ cảnh KMS.

* **Giải pháp:**
  * Lần theo dấu vết trên AWS CloudTrail, phát hiện Execution Role của Lambda chỉ có quyền đọc DynamoDB mà chưa được cấp bổ sung cờ lệnh `kms:GenerateDataKey` và `kms:Decrypt` cho con CMK đang dùng. 
  * Hướng dẫn team sử dụng kĩ thuật test Mock Integration đối với KMS để vượt qua lỗi rào cản dưới local.

* **Bài học:**
  * Việc áp dụng mã hóa phá vỡ định nghĩa quyền truy cập cũ: Có quyền hạn với IAM không có nghĩa là sẽ đọc được dữ liệu nếu Identity bị thiếu quyền xử lý trong KMS Policy.
  * AWS Secrets Manager sẽ làm hệ thống Lambda xử lý chậm hơn vài mili-giây lúc khởi động (cold start), nhưng đó là sự đánh đổi bắt buộc để lấy sự an toàn ở tầm mức Enterprise.

### Kế hoạch Tuần 7

* Bước vào phân đoạn Theo dõi & Trinh sát Bảo mật (Continuous Security Monitoring).
* Kích hoạt radar phân tích mã độc khôn ngoan với **Amazon GuardDuty**.
* Đọc và phân tích **VPC Flow Logs**, đi kèm thiết kế hệ thống báo động CloudWatch Alarms chuyên bắt lỗi các hành vi bất thường trên API của NeuraX.
