### Mục tiêu Tuần 3

* Hoàn thành Module 5: Lý thuyết các dịch vụ bảo mật (Cognito, Identity Center, KMS, Security Hub).
* Thực hành chuyên sâu về IAM policies, Permission Boundaries, và giới hạn địa lý.
* Kích hoạt AWS Security Hub và thiết lập đánh giá bảo mật baseline đầu tiên.
* Hỗ trợ đồng đội với các lab còn vướng mắc.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1-2 | - Lab 25: Amazon FSx File System <br>&emsp; + Fix lỗi Runtime Lambda quá cũ (Nâng cấp nodejs12.x -> nodejs20.x) <br>&emsp; + Thiết lập Quota và báo động Throughput (chạm mức 400MB) trên CloudWatch <br> - Học mô hình trách nhiệm chia sẻ (Shared Responsibility) | 03/02/2026 | 04/02/2026 | [Lab 25](https://000025.awsstudygroup.com/) |
| 3 | - Lý thuyết Module 5: Amazon Cognito, Identity Center (SSO), AWS KMS, Security Hub <br> - Lab 14: Kéo VM từ ngoài vào làm AMI (Bị lỗi Kernel do Ubuntu 24.04 còn mới, phải lùi về dùng Ubuntu 22.04) | 05/02/2026 | 05/02/2026 | [Lab 14 Part 1](https://000014.awsstudygroup.com/) |
| 4 | - Lab 14: Export ngược EC2 ra file .OVA <br> - Lab 18: Kích hoạt AWS Security Hub và AWS Config rà soát | 06/02/2026 | 06/02/2026 | [Lab 14 Part 2](https://000014.awsstudygroup.com/) <br> [Lab 18](https://000018.awsstudygroup.com/) |
| 5 | - Lab 22: Viết Lambda tự rà soát Tag để Bật/Tắt EC2 (Bắn thông báo qua Slack) <br> - Lab 28/30: Áp luật IAM giới hạn chỉ cho phép thao tác ở vùng `ap-southeast-1` <br> - Lab 18 Report: Điểm bảo mật quét đạt 85% (Bị trừ điểm nặng vụ để IAM User nắm quyền Admin) <br> - Lab 33: Quản lý Khóa KMS | 07/02/2026 | 07/02/2026 | [Lab 22](https://000022.awsstudygroup.com/) <br> [Lab 28](https://000028.awsstudygroup.com/) <br> [Lab 30](https://000030.awsstudygroup.com/) <br> [Lab 33](https://000033.awsstudygroup.com/) |
| 6 | - Lab 44: Khống chế thời gian và IP của Role <br> - Lab 48: Xóa Access Key, dùng IAM Role trực tiếp để EC2 chọc vào S3 <br> - Microsoft Workload: Sửa lỗi AD và gỡ ổ volume cấp cứu cho EC2 | 09/02/2026 | 09/02/2026 | [Lab 44](https://000044.awsstudygroup.com/) <br> [Lab 48](https://000048.awsstudygroup.com/) |

### Kết quả đạt được trong Tuần 3

* **Hiện đại hóa Runtime:**
  * Tự debug và sửa source code Lambda (chuyển nodejs12.x sang nodejs20.x) để hoàn thành Lab 25 (Amazon FSx).

* **Lưu trữ doanh nghiệp:**
  * Triển khai Amazon FSx với User Quotas, tính sẵn sàng cao, và giám sát throughput qua CloudWatch (đỉnh 400MB).

* **Rào chắn Danh tính & Quyền truy cập:**
  * Giới hạn chặt quyền địa lý chỉ cho phép thao tác tại `ap-southeast-1` (Lab 28/30).
  * Tiêu hủy hoàn toàn Access Keys, thay bằng IAM Instance Profiles (Lab 48).
  * Khống chế thời gian và IP truy cập cho IAM Role (Lab 44).

* **Kiểm toán Bảo mật:**
  * Kích hoạt AWS Security Hub (Lab 18), đạt điểm bảo mật 85% — phát hiện lỗ hổng nghiêm trọng: IAM User nắm quyền Administrative Access.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * VM Import/Export (Lab 14) lỗi trên Ubuntu 24.04 do kernel không tương thích, phải quay về Ubuntu 22.04 LTS.
  * Nhận cảnh báo rằng kích hoạt AWS Organizations sẽ mất quyền Free Tier, nên Lab 12 (SCPs) được bỏ qua để bảo vệ ngân sách nhóm.
* **Bài học:**
  * Security Hub phản ánh trung thực tình trạng bảo mật — áp dụng Least Privilege là kỷ luật liên tục, không phải cài đặt mặc định.
  * Luôn kiểm tra khả năng tương thích kernel trước khi import VM, và kiểm tra ảnh hưởng Free Tier trước khi bật các dịch vụ cấp tổ chức.

### Kế hoạch Tuần 4

* Nghiên cứu AWS WAF, CloudFront, Route 53, và Amazon Bedrock.
* Chuẩn bị kiến thức bảo mật và networking cho dự án NutriTrack.
