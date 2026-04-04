### Mục tiêu Tuần 7

* Xây dựng khả năng giám sát không gián đoạn để phát hiện nguy cơ tấn công hạ tầng NeuraX.
* Tích hợp Amazon GuardDuty, tận dụng Machine Learning để rà soát hành vi bất thường.
* Giám sát luồng mạng nội bộ với tính năng VPC Flow Logs.
* Thiết lập hệ thống Cảnh báo tự động thông qua Amazon SNS và CloudWatch Alarms.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Khởi tạo Trinh sát Bảo mật <br>&emsp; + Bật AWS GuardDuty cho tài khoản thực tập <br>&emsp; + Thiết lập mức baseline cho hành vi tài nguyên | 16/02/2026 | 16/02/2026 | [Threat Detection with GuardDuty](https://000098.awsstudygroup.com) |
| 2 | - Giám sát luồng mạng <br>&emsp; + Bật VPC Flow Logs cho Backend VPC chính yếu <br>&emsp; + Đẩy dữ liệu Flow Logs về CloudWatch | 17/02/2026 | 17/02/2026 | [Network Monitoring with VPC Flow Logs](https://000074.awsstudygroup.com) |
| 3 | - Đo đạc Nâng cao <br>&emsp; + Thiết lập Advanced Monitoring với CloudWatch Metrics <br>&emsp; + Dựng Dashboard quan sát tổng thể | 18/02/2026 | 18/02/2026 | [Advanced Monitoring with CloudWatch](https://000029.awsstudygroup.com) |
| 4 | - Hệ thống Báo động <br>&emsp; + Triển khai Amazon Simple Notification Service (SNS) <br>&emsp; + Nối SNS với webhook của NeuraX Discord nội bộ | 19/02/2026 | 19/02/2026 | [Messaging Systems with SNS](https://000077.awsstudygroup.com) |
| 5 | - Căng bẫy sự kiện <br>&emsp; + Viết luật EventBridge định tuyến các phát hiện nghiêm trọng của GuardDuty sang SNS <br>&emsp; + Cài báo động CloudWatch nếu API Gateway trả về quá nhiều lỗi 4xx/5xx | 20/02/2026 | 20/02/2026 | [CloudWatch Advanced Workshop](https://000036.awsstudygroup.com) |
| 6-7 | - Thử nghiệm Mô phỏng <br>&emsp; + Chạy các lệnh API bất thường (Quét cổng/Brute force) từ một IP ngoài <br>&emsp; + Xác nhận tin nhắn báo động nổ về kênh chat | 21/02/2026 | 22/02/2026 | [Kiểm thử Nội bộ] |

### Kết quả đạt được trong Tuần 7

* **Phòng thủ Chủ động (Proactive Security):**
  * Đã bật chức năng **Amazon GuardDuty**. Nhờ đó, môi trường AWS liên tục được quét để nhận diện dấu hiệu tài khoản bị lộ mật khẩu, gọi API móc nối dữ liệu bất hợp pháp... mà không cần phải cài cắm Agent phức tạp.
  * Hoàn thành hiển thị 100% luồng truy cập đi xuyên qua các subnet thông qua **VPC Flow Logs**, giúp team có cơ sở chứng cứ để chặn mọi gói tin quét ngang trái phép.

* **Giao tiếp sự cố Thời gian thực:**
  * Tạo chuỗi liên kết hoàn hảo dẫn truyền sự kiện an ninh mạng từ AWS EventBridge nhảy thẳng thành tin nhắn báo động gọn gàng trên channel NeuraX Discord. Báo động không còn bị chôn vùi dưới đáy biểu đồ Log.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * GuardDuty cần thời gian máy học (learning period) để xác định mức baseline bình thường. Khá khó để giả lập tấn công một cách giả tạo bởi cơ chế của AWS thừa thông minh để coi các truy cập kia là an toàn.
  * Bật tối đa tính năng lưu VPC Flow Logs trực tiếp lên CloudWatch làm phình to dữ liệu nhanh chóng, ngốn chi phí lưu trữ trong vòng chỉ 24h đầu.

* **Giải pháp:**
  * Sử dụng tính năng "Generate Sample Findings" tích hợp sẵn của GuardDuty để test tính liền mạch của bộ thu phát EventBridge/SNS thay vì cố gắng tự đi "hacker" hệ thống mình.
  * Tinh chỉnh cấu hình đẩy lưu trữ của VPC Flow Logs chuyển trực tiếp về Amazon S3 chung với việc gom nhóm khoảng thời lượng dài hơn (aggregation interval) nhằm tiết kiệm ngân sách.

* **Bài học:**
  * Có quá nhiều chỉ số viễn trắc (telemetry) mà không màng tới bộ lọc sẽ trở thành rác. Việc siết chặt ngưỡng báo động (chuẩn High-severity) trước khi đẩy về Discord là tối quan trọng nhằm chống lại "Hội chứng mệt mỏi cảnh báo" (Alert fatigue) ở Team Dev.

### Kế hoạch Tuần 8

* Chăm chút vào các yếu tố riêng tư nhạy cảm của dữ liệu Y tế/Sức khỏe.
* Dùng **Amazon Macie** đánh giá quyền truy cập sâu bên trong dữ liệu S3.
* Triển khai bộ dò tìm bất thường đối với hệ thống sao lưu.
