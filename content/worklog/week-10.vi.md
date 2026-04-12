### Mục tiêu Tuần 10

* Thực hiện pentest sâu vào backend serverless NutriTrack.
* Hoàn thành sơ đồ kiến trúc NutriTrack toàn diện.
* Nộp project deliverables.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Pentest #3: Đánh giá Lỗ hổng IDOR <br>&emsp; + Test endpoint `GET /meals/{id}` cho khả năng truy cập dữ liệu chéo user <br>&emsp; + Kiểm tra thực thi ranh giới authorization ở tầng Lambda | 02/04/2026 | 02/04/2026 | [OWASP IDOR Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References) |
| 2 | - Pentest #4: Bảo mật API Gateway <br>&emsp; + Chặn và fuzz AppSync GraphQL queries bằng Burp Suite <br>&emsp; + Test injection attacks và exposure dữ liệu dư thừa trong API responses | 03/04/2026 | 03/04/2026 | [Burp Suite](https://portswigger.net/burp) |
| 3 | ⭐ **SỰ KIỆN:** AWS Cloud Mastery 2 (FPT Uni) | 04/04/2026 | 04/04/2026 | - |
| 4 | 🎨 Hoàn thành Sơ đồ Kiến trúc + 📦 Nộp Project <br>&emsp; + Hoàn thiện sơ đồ hạ tầng NutriTrack (Cognito → AppSync → Lambda → Bedrock → DynamoDB → S3) <br>&emsp; + Nộp toàn bộ project deliverables | 05/04/2026 | 05/04/2026 | - |
| 5 | - Báo cáo Đánh giá Lỗ hổng <br>&emsp; + Tổng hợp tất cả findings pentest vào báo cáo có cấu trúc <br>&emsp; + Xếp hạng lỗ hổng theo phương pháp CVSS severity scoring | 07/04/2026 | 07/04/2026 | [CVSS v3.1](https://www.first.org/cvss/calculator/3.1) |
| 6 | - Triển khai Khắc phục <br>&emsp; + Vá các error response verbose lộ stack traces nội bộ <br>&emsp; + Siết chặt Lambda execution role permissions theo Principle of Least Privilege | 08/04/2026 | 08/04/2026 | - |

### Kết quả đạt được trong Tuần 10

* **Sơ đồ Kiến trúc Hoàn thành:**
  * Tài liệu trực quan toàn diện về toàn bộ hạ tầng serverless NutriTrack được hoàn thành và nộp.

* **Phát hiện Lỗ hổng IDOR:**
  * Xác định lỗ IDOR mức nghiêm trọng trung bình trong `GET /meals/{id}` — thiếu kiểm tra authorization cho phép liệt kê dữ liệu chéo user.

* **Hiệu quả WAF Chứng minh:**
  * AWS WAF chặn thành công 100% payload injection tiêu chuẩn và giới hạn tốc độ các nỗ lực fuzzing tự động.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Phân biệt giữa lỗi cấu hình hạ tầng và lỗi logic ứng dụng đòi hỏi review sâu source code Lambda.
* **Bài học:**
  * Bảo mật không bao giờ chỉ là hạ tầng. Cấu hình WAF và IAM hoàn hảo vẫn bị vô hiệu hóa bởi logic ứng dụng có lỗ hổng.

### Kế hoạch Tuần 11

* Khắc phục tất cả lỗ hổng phát hiện trong quá trình pentest.
* Thực hiện kiểm thử chất lượng toàn diện trên tất cả user flows.
* Đóng tất cả tickets bảo mật và bug còn tồn đọng.
