### Mục tiêu Tuần 4

* Nghiên cứu AWS WAF (Web Application Firewall) và các kỹ thuật phòng chống tấn công web.
* Tìm hiểu Amazon CloudFront CDN và cấu hình HTTPS/SSL.
* Khám phá Route 53 DNS management và kiến trúc hosted zone.
* Giới thiệu Amazon Bedrock — Danh mục Foundation Model và quy trình truy cập.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - AWS WAF Cơ bản <br>&emsp; + Nghiên cứu cấu trúc Web ACL: Rules, Rule Groups, và managed rule sets <br>&emsp; + Học các vector tấn công OWASP Top 10 (SQLi, XSS, CSRF) và cách WAF phòng chống | 10/02/2026 | 10/02/2026 | [AWS WAF Docs](https://docs.aws.amazon.com/waf/) |
| 2 | - Amazon CloudFront CDN <br>&emsp; + Tìm hiểu kiến trúc CloudFront: edge locations, origins, cache behaviors <br>&emsp; + Nghiên cứu tích hợp HTTPS/SSL với AWS Certificate Manager (ACM) | 11/02/2026 | 11/02/2026 | [CloudFront Docs](https://docs.aws.amazon.com/cloudfront/) |
| 3 | - Tích hợp WAF + CloudFront <br>&emsp; + Nghiên cứu cách gắn WAF Web ACLs vào CloudFront distributions <br>&emsp; + Tìm hiểu rate-based rules và geo-restriction configurations | 12/02/2026 | 12/02/2026 | [WAF + CloudFront](https://000039.awsstudygroup.com) |
| 4 | - Route 53 DNS chuyên sâu <br>&emsp; + Tìm hiểu hosted zones, loại record (A, CNAME, ALIAS), và routing policies <br>&emsp; + Nghiên cứu DNS failover và health check mechanisms | 13/02/2026 | 13/02/2026 | [Route 53 Docs](https://docs.aws.amazon.com/route53/) |
| 5 | - Giới thiệu Amazon Bedrock <br>&emsp; + Khám phá danh mục Foundation Model và mô hình giá <br>&emsp; + Nghiên cứu khả năng Qwen3-VL cho bài toán nhận diện thực phẩm | 14/02/2026 | 14/02/2026 | [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/) |
| 6 | - Tổng kết tuần & Chuẩn bị dự án <br>&emsp; + Tổng hợp ghi chú về WAF, CloudFront, Route 53, và Bedrock <br>&emsp; + Phác thảo yêu cầu hạ tầng NutriTrack cho giai đoạn khởi động dự án | 16/02/2026 | 16/02/2026 | [OWASP Top 10](https://owasp.org/www-project-top-ten/) |

### Kết quả đạt được trong Tuần 4

* **Nền tảng Bảo mật Web:**
  * Nắm vững AWS WAF — rule groups, managed rules, và mô hình tích hợp với CloudFront để phòng chống OWASP Top 10.

* **Thành thạo CDN & DNS:**
  * Nghiên cứu kiến trúc CloudFront distribution và quản lý DNS Route 53, hiểu toàn bộ luồng request từ DNS resolution → CDN edge → origin server.

* **Nhận thức Dịch vụ AI:**
  * Tiếp cận hệ sinh thái Foundation Model của Amazon Bedrock, xác định Qwen3-VL là model mục tiêu cho pipeline nhận diện thực phẩm của NutriTrack.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Phạm vi dịch vụ rộng (WAF, CloudFront, Route 53, Bedrock) khiến việc đào sâu vào bất kỳ chủ đề nào trong một tuần trở nên khó khăn.
* **Bài học:**
  * Hiểu biết tổng quan về các dịch vụ AWS trước khi bắt đầu dự án giúp đưa ra quyết định kiến trúc tốt hơn. Nắm vững mô hình WAF + CloudFront sớm ngăn ngừa lỗ hổng bảo mật trong production.

### Kế hoạch Tuần 5

* Bắt đầu giai đoạn hạ tầng dự án NutriTrack cùng IA-1 teammate.
* Thiết lập môi trường AWS Amplify sandbox.
* Xây dựng ước tính chi phí AWS theo giá thị trường.
