### Mục tiêu Tuần 5

* Thiết lập lá chắn bảo vệ lớp ứng dụng NeuraX khỏi các lỗi khai thác Web phổ biến.
* Triển khai AWS Web Application Firewall (WAF) bảo vệ cho API Gateway và CloudFront.
* Xây dựng cơ chế Rate Limiting để giảm thiểu tấn công DDoS cơ bản.
* Đánh giá quy tắc WAF bằng cách mô phỏng trực tiếp các payload tấn công.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Khởi tạo Application Protection <br>&emsp; + Khởi tạo AWS WAF Web ACLs <br>&emsp; + Áp dụng Web ACLs lên CloudFront/API Gateway | 26/02/2026 | 26/02/2026 | [Application Protection with AWS WAF](https://000026.awsstudygroup.com) |
| 2 | - Phòng chống rủi ro lõi <br>&emsp; + Import AWS Managed Rules (Core rule set, SQLi, XSS) <br>&emsp; + Tinh chỉnh rule để giảm thiểu cảnh báo sai (false positive) cho API | 27/02/2026 | 27/02/2026 |  |
| 3 | - Ngăn chặn DDoS <br>&emsp; + Cấu hình Rate-based rules (VD: 500 requests / 5 mins) <br>&emsp; + Bật AWS Shield Standard chặn tấn công mạng Layer 3/4 | 28/02/2026 | 28/02/2026 |  |
| 4 | - Lưu trữ Log và Phân tích WAF <br>&emsp; + Định tuyến WAF logs về CloudWatch / S3 <br>&emsp; + Thử nghiệm trực quan hóa lượng request | 01/03/2026 | 01/03/2026 | [CloudWatch Logs] |
| 5 | - Kiểm thử WAF Policy <br>&emsp; + Giả lập payload độc hại với `curl` và Burp Suite <br>&emsp; + Xác nhận hệ thống trả về mã 403 Forbidden đúng quy trình | 02/03/2026 | 02/03/2026 |  |
| 6-7 | - Tối ưu hóa Rules <br>&emsp; + Đọc log các requests bị block từ phía Dev <br>&emsp; + Chuyển đổi trạng thái từ Count sang Block ở các rule ổn định | 03/03/2026 | 04/03/2026 | [Audit Logs] |

### Kết quả đạt được trong Tuần 5

* **Hoàn thiện Vành đai bảo mật lớp 7:**
  * Đưa **AWS WAF** vào hoạt động toàn diện tại các rìa (Edge) của CloudFront cũng như API Gateway vùng, hình thành chốt chặn giao thông toàn cục.
  * Các loại mã độc dạng SQL injection, Cross-Site Scripting (XSS), và trình quét bot rác bị cản lại triệt để nhờ AWS Managed rules.
  
* **Sức chịu đựng trước DDoS:**
  * Luật chống Spam/Brute-force (Rate Limiting) giúp tự động khóa IP nếu chúng gửi trên 500 yêu cầu trong 5 phút. Điều này đặc biệt giá trị để bảo vệ cổng đăng nhập Cognito.

* **Quan sát và Cảnh báo:**
  * Enabled tính năng logging yêu cầu. Nhóm hiện có thể tra cứu toàn bộ header và nội dung payload của mọi request bị rớt để làm rõ nguyên nhân.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Khi vừa bật WAF, một số API gửi lên định dạng Meal Logging có chứa cụm text lạ bị WAF hiểu lầm là SQLi (False positive), dẫn đến chặn nhầm traffic chuẩn của dự án NutriTrack.
  * Việc tra cứu file JSON rối rắm của WAF log bên trong CloudWatch tiêu tốn nhiều thời gian.

* **Giải pháp:**
  * Tạm chỉnh rule nghi ngờ về trạng thái "Count" (chỉ đếm, không chặn), phân tích trường dữ liệu bị nghi ngờ và viết Exception rule (loại trừ) cho trường JSON đó.
  * Dùng CloudWatch Log Insights với cú pháp truy vấn chuyên dụng để tách nhanh thông tin Client IP, URL và RuleID.

* **Bài học:**
  * Không bao giờ nên bật WAF ở trạng thái "Block" ngay khi ra mắt. Luôn đặt ở trạng thái "Count" trong một khoảng thời gian để thăm dò traffic thực tế, qua đó lọc bỏ các lệnh chặn nhầm.
  * Security tốt là security không gây khó dễ hay cản trở tính năng hợp lệ của doanh nghiệp.

### Kế hoạch Tuần 6

* Chuyển hướng tập trung sang **Bảo vệ Dữ liệu (Data Protection)**.
* Sử dụng **AWS KMS** để mã hóa dữ liệu lưu trữ tại S3 và bảng DynamoDB.
* Chuyển toàn bộ các thông số nhạy cảm trong code sang hệ thống **AWS Secrets Manager**.
