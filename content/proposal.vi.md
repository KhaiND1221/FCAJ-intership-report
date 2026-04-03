# Tên Dự Án

**Hệ thống Giám sát Bảo mật Thông minh sử dụng Kiến trúc Serverless AWS**

Giải pháp cloud-native để phát hiện mối đe dọa thời gian thực và phân tích bảo mật tận dụng các dịch vụ AWS và machine learning.

---

## Vấn Đề

Các tổ chức đối mặt với ngày càng nhiều mối đe dọa an ninh mạng nhưng thiếu khả năng giám sát thời gian thực vào cơ sở hạ tầng đám mây. Các công cụ bảo mật truyền thống chỉ phản ứng và không phát hiện được các cuộc tấn công tinh vi cho đến khi thiệt hại đáng kể đã xảy ra.

---

## Mục Tiêu

- Thiết kế kiến trúc giám sát bảo mật có thể mở rộng, tiết kiệm chi phí sử dụng dịch vụ serverless AWS
- Triển khai phát hiện bất thường dựa trên ML để xác định hoạt động đáng ngờ
- Tạo hệ thống cảnh báo thời gian thực với thông tin chi tiết hữu ích
- Phát triển tài liệu toàn diện và workshop thực hành

---

## Kiến Trúc Giải Pháp

> **Ghi chú:** Thêm hình ảnh sơ đồ kiến trúc của bạn ở đây

Kiến trúc tận dụng các dịch vụ serverless của AWS để mở rộng và tiết kiệm chi phí, với các mô hình ML để phát hiện mối đe dọa thông minh.

---

## Các Dịch Vụ AWS Sử Dụng

| Dịch Vụ | Mục Đích |
|---------|----------|
| AWS Lambda | Compute serverless cho xử lý sự kiện |
| Amazon S3 | Lưu trữ logs và artifacts mô hình ML |
| Amazon DynamoDB | Database NoSQL để lưu cảnh báo |
| AWS CloudWatch | Giám sát và tập hợp log |
| Amazon SNS | Gửi thông báo |
| AWS IAM | Bảo mật và kiểm soát truy cập |

---

## Lịch Trình

| Giai Đoạn | Thời Gian | Sản Phẩm |
|-----------|-----------|----------|
| Nghiên cứu & Thiết kế | Tuần 1-2 | Sơ đồ kiến trúc, Tài liệu kỹ thuật |
| Phát triển | Tuần 3-8 | Prototype, Các API endpoint |
| Kiểm thử & Triển khai | Tuần 9-10 | Kết quả test, Triển khai production |
| Tài liệu | Tuần 11-12 | Nội dung workshop, Báo cáo cuối |

---

## Ngân Sách (Ước tính)

Sử dụng AWS Free Tier khi có thể. Chi phí ước tính cho workload production:

- Lambda: ~$5/tháng
- API Gateway: ~$3/tháng
- DynamoDB: ~$2/tháng
- CloudWatch: ~$1/tháng
- **Tổng: ~$11/tháng**

---

## Rủi Ro & Giải Pháp

| Rủi Ro | Ảnh Hưởng | Giải Pháp |
|--------|-----------|-----------|
| Lo ngại về quyền riêng tư dữ liệu | Cao | Sử dụng mã hóa, IAM least privilege |
| Vượt ngân sách | Trung bình | Đặt cảnh báo billing, dùng Free Tier |
| Độ phức tạp kỹ thuật | Trung bình | Bắt đầu với MVP, lặp lại |
