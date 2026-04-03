### Mục tiêu Tuần 9

* Hoàn thành end-to-end testing cho tất cả user flows.
* Thiết lập CloudWatch monitoring và alarms.
* Triển khai các tối ưu hóa hiệu năng.
* Sửa bugs còn lại và polish UI.

### Các nhiệm vụ thực hiện trong tuần

| Ngày | Nhiệm vụ | Ngày BĐ | Ngày HT | Tài liệu tham khảo |
| --- | --- | --- | --- | --- |
| 1 | - End-to-End Testing <br>&emsp; + Tạo bộ test E2E với Playwright <br>&emsp; + Test auth flow, meal logging, analytics <br>&emsp; + Tự động hóa regression tests | 02/03/2026 | 02/03/2026 | [E2E Tests] |
| 2 | - Thiết lập CloudWatch (Phần 1) <br>&emsp; + Tạo CloudWatch dashboards <br>&emsp; + Cấu hình visualization Lambda metrics <br>&emsp; + Thiết lập API Gateway metrics | 03/03/2026 | 03/03/2026 | [CloudWatch Docs](https://docs.aws.amazon.com/cloudwatch/) |
| 3 | - Thiết lập CloudWatch (Phần 2) <br>&emsp; + Tạo alarms cho error rates <br>&emsp; + Thiết lập SNS notifications <br>&emsp; + Cấu hình cost monitoring alerts | 04/03/2026 | 04/03/2026 | [Alarm Config] |
| 4 | - Tối ưu hóa hiệu năng <br>&emsp; + Tối ưu Lambda cold starts (Provisioned Concurrency) <br>&emsp; + Bật DynamoDB DAX cho caching <br>&emsp; + Triển khai CloudFront cho static assets | 05/03/2026 | 05/03/2026 | [Optimization Report] |
| 5 | - Sửa Bugs <br>&emsp; + Sửa 8 bugs còn lại từ testing <br>&emsp; + Cải thiện error messages <br>&emsp; + Nâng cao mobile responsiveness | 06/03/2026 | 06/03/2026 | [Bug Tracker] |
| 6-7 | - UI Polish <br>&emsp; + Thêm loading animations <br>&emsp; + Cải thiện accessibility (ARIA labels) <br>&emsp; + Review và sửa UI cuối cùng | 07/03/2026 | 08/03/2026 | [UI Review] |

### Thành tựu Tuần 9

* **Testing:**
  * Bộ test E2E với 15 scenarios tự động.
  * 95% pass rate trên tất cả critical paths.
  * Regression test chạy trên mỗi deployment.

* **Monitoring:**
  * CloudWatch dashboard với real-time metrics.
  * Alarms được cấu hình: Error Rate > 5%, Latency > 3s, Cost > Budget.
  * SNS email notifications cho critical alerts.

* **Hiệu năng:**
  * Cold start giảm từ 3s xuống 0.5s với Provisioned Concurrency.
  * DynamoDB queries nhanh hơn 80% với DAX caching.
  * Static assets load nhanh hơn 60% với CloudFront CDN.

* **Bug Fixes:**
  * 8 bugs đã sửa, 0 critical issues còn lại.
  * Trải nghiệm mobile được cải thiện đáng kể.

### Khó khăn & Bài học

* **Khó khăn:**
  * Provisioned Concurrency tăng chi phí đáng kể.
  * DAX setup yêu cầu thay đổi cấu hình VPC.

* **Cách giải quyết:**
  * Sử dụng scheduled scaling cho Provisioned Concurrency (chỉ giờ cao điểm).
  * Tạo private subnets cho DAX trong VPC hiện có.

* **Bài học rút ra:**
  * Tối ưu hóa hiệu năng phải cân bằng chi phí vs. tốc độ.
  * Monitoring nên được thiết lập sớm, không phải là ý tưởng sau cùng.

### Kế hoạch Tuần 10

* Thực hiện load testing và stress testing.
* Triển khai chiến lược tối ưu chi phí.
* Chuẩn bị demo cho stakeholder presentation.
* Bắt đầu viết technical documentation.
