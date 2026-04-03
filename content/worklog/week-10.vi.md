### Mục tiêu Tuần 10

* Thực hiện load testing và stress testing.
* Triển khai chiến lược tối ưu chi phí.
* Chuẩn bị demo cho stakeholder presentation.
* Bắt đầu viết technical documentation.

### Các nhiệm vụ thực hiện trong tuần

| Ngày | Nhiệm vụ | Ngày BĐ | Ngày HT | Tài liệu tham khảo |
| --- | --- | --- | --- | --- |
| 1 | - Load Testing <br>&emsp; + Thiết lập Artillery.io cho load tests <br>&emsp; + Mô phỏng 100 concurrent users <br>&emsp; + Xác định bottlenecks trong API endpoints | 09/03/2026 | 09/03/2026 | [Load Test Reports] |
| 2 | - Stress Testing <br>&emsp; + Tăng lên 500 concurrent users <br>&emsp; + Test Lambda scaling behavior <br>&emsp; + Xác minh DynamoDB auto-scaling | 10/03/2026 | 10/03/2026 | [Stress Test Reports] |
| 3 | - Tối ưu chi phí <br>&emsp; + Phân tích dữ liệu AWS Cost Explorer <br>&emsp; + Triển khai Reserved Capacity cho DynamoDB <br>&emsp; + Thiết lập S3 Intelligent-Tiering | 11/03/2026 | 11/03/2026 | [Cost Analysis](https://docs.aws.amazon.com/cost-management/) |
| 4 | - Chuẩn bị Demo <br>&emsp; + Tạo demo script và flow <br>&emsp; + Thiết lập demo data trong staging <br>&emsp; + Tập trình bày với team | 12/03/2026 | 12/03/2026 | [Demo Script] |
| 5 | - Technical Documentation (Phần 1) <br>&emsp; + Bắt đầu viết architecture documentation <br>&emsp; + Tài liệu hóa API specifications <br>&emsp; + Tạo deployment guide | 13/03/2026 | 13/03/2026 | [Tech Docs] |
| 6-7 | - Technical Documentation (Phần 2) <br>&emsp; + Viết developer setup guide <br>&emsp; + Tài liệu hóa troubleshooting steps <br>&emsp; + Tạo runbook cho operations | 14/03/2026 | 15/03/2026 | [Runbook] |

### Thành tựu Tuần 10

* **Load Testing:**
  * Hệ thống xử lý 100 concurrent users với <200ms response time.
  * Stress test cho thấy graceful degradation ở 500 users.
  * Lambda auto-scaling kích hoạt ở 200 concurrent requests.

* **Tối ưu chi phí:**
  * Ước tính giảm 40% chi phí với các chiến lược tối ưu.
  * S3 Intelligent-Tiering tiết kiệm ~$15/tháng cho dữ liệu ít truy cập.
  * Bedrock usage được tối ưu với prompt caching.

* **Demo:**
  * Demo script hoàn chỉnh bao gồm tất cả tính năng NutriTrack.
  * Môi trường staging được chuẩn bị với dữ liệu thực tế.
  * Team rehearsal hoàn thành thành công.

* **Tài liệu:**
  * Architecture document với diagrams hoàn thành.
  * API documentation với examples (Postman collection).
  * Deployment và developer setup guides.

### Khó khăn & Bài học

* **Khó khăn:**
  * Lambda concurrent execution limits gây ra lỗi 429 ở high load.
  * Tối ưu chi phí yêu cầu hiểu các pricing models phức tạp.

* **Cách giải quyết:**
  * Yêu cầu tăng Lambda quota qua AWS Support.
  * Sử dụng AWS Pricing Calculator để model các scenarios khác nhau.

* **Bài học rút ra:**
  * Luôn lên kế hoạch cho quota limits trong serverless architecture.
  * Tối ưu chi phí nên được xem xét từ giai đoạn thiết kế.

### Kế hoạch Tuần 11

* Hoàn thành Workshop documentation cho báo cáo thực tập.
* Chuẩn bị final presentation slides.
* Thực hiện internal demo với mentors.
* Hoàn thiện tất cả project documentation.
