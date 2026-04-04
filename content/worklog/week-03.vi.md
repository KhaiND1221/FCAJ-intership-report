### Mục tiêu Tuần 3:

* Hoàn thành Module 5.
* Hỗ trợ đồng đội với các lab còn vướng mắc.
* Sửa đổi các file script cũ trong gói thực hành Free Tier.
* Áp dụng và giới hạn chặt chẽ tài nguyên bằng IAM / Organizations.

### Các công việc thực hiện trong tuần:

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1-2 | - Lab 25: Amazon FSx File System <br>&emsp; + Fix lỗi Runtime Lambda quá cũ (Nâng cấp nodejs12.x -> nodejs20.x) <br>&emsp; + Thiết lập Quota và báo động Throughput (chạm mức 400MB) trên CloudWatch <br> - Học mô hình trách nhiệm chia sẻ (Shared Responsibility) | 19/01/2026 | 20/01/2026 | [Lab 25](https://000025.awsstudygroup.com/) |
| 3 | - Lý thuyết Module 5: Amazon Cognito, AWS Organizations, Identity Center (SSO), AWS KMS, Security Hub <br> - Lab 14: Kéo VM từ ngoài vào làm AMI (Bị lỗi Kernel do Ubuntu 24.04 còn mới, phải lùi về dùng Ubuntu 22.04) | 21/01/2026 | 21/01/2026 | [Lab 14 Part 1](https://000014.awsstudygroup.com/) |
| 4 | - Lab 14: Export ngược EC2 ra file .OVA <br> - Lab 18: Kích hoạt AWS Security Hub và AWS Config rà soát | 22/01/2026 | 22/01/2026 | [Lab 14 Part 2](https://000014.awsstudygroup.com/) <br> [Lab 18](https://000018.awsstudygroup.com/) |
| 5 | - Lab 22: Viết Lambda tự rà soát Tag để Bật/Tắt EC2 (Bắn thông báo qua Slack) <br> - Lab 28/30: Áp luật IAM cực kì khắc nghiệt (Chỉ cho phép thao tác ở vùng `ap-southeast-1`) <br> - Lab 18 Report: Điểm bảo mật quét đạt 85% (Bị điểm sàn trừ nặng vụ để IAM User nắm quyền Admin) <br> - Lab 33: Quản lý Khóa KMS | 23/01/2026 | 23/01/2026 | [Lab 22](https://000022.awsstudygroup.com/) <br> [Lab 28](https://000028.awsstudygroup.com/) <br> [Lab 30](https://000030.awsstudygroup.com/) <br> [Lab 33](https://000033.awsstudygroup.com/) |
| 6-7 | - Lab 44: Khống chế thời gian và IP của Role <br> - Lab 48: Xóa Access Key, dùng IAM Role trực tiếp để EC2 chọc vào S3 <br> - Lab 12: Tổ chức AWS Organizations Group và SCPs. <br> - Microsoft Workload: Sửa lỗi AD và cách gỡ ổ volume cấp cứu cho EC2 | 24/01/2026 | 25/01/2026 | [Lab 44](https://000044.awsstudygroup.com/) <br> [Lab 48](https://000048.awsstudygroup.com/) |

### Kết quả đạt được trong Tuần 3:

* **Sửa lại Runtime hỏng:** Tự động debug và sửa source code tạo Lambda (chuyển nodejs version cũ sang bản chuẩn đang lưu hành để pass qua bài Lab 25).
* **Nghiệp vụ lưu trữ nâng cao:** Trải nghiệm lưu trữ dữ liệu lớn với Amazon FSx, kiểm soát dung lượng người dùng (Quotats) và chạy throughput cao để đẩy giới hạn.
* **Siết chặt Danh tính & Rào cản Bảo mật:**
  * Giới hạn chặt quyền địa lý không cho tạo máy chủ ngoài Singapore (Lab 28, 30).
  * Tiêu hủy hoàn toàn điểm yếu mang tên thẻ "Access Keys" nhằm thay bằng IAM Role (Lab 48).
  * Kiểm soát toàn bộ tổ chức thông qua chính sách tuyệt đối SCPs của AWS Organizations (Lab 12).
* **Kiểm toán (Auditing):** 
  * Chạy quét dọn Security Hub và AWS Config. Tự ý thức được hiểm họa tiềm tàng khi điểm số chỉ đạt 85% vì lý do một user lỏng lẻo dính chính sách Administrator.

### Thách thức & Bài học kinh nghiệm:

* **Thách thức:** Bài toán Import Hệ Điều Hành ngoài vào AWS làm máy ảo (Lab 14) cực kỳ kén nhân Kernel. Bản Ubuntu 24.04 cự tuyệt việc nén, ép người làm phải downgrade xuống 22.04 LTS tốn khá nhiều giờ mò mẫm.
* **Bài học:** AWS không tự động làm mọi thứ hoàn hảo. Bài test Security Hub phản ánh trung thực rằng nếu lơ đễnh và tiện tay gán quyền lố diện rộng (Overly-permissive IAM), ta sẽ ôm rủi ro nghiêm trọng.

### Kế hoạch Tuần 4:

* Chuyển mình vào vai trò Kỹ sư Cơ sở Hạ tầng Phân tích Bảo mật (**Cloud Security Engineer**) để thiết kế hệ thống Cognito thực chiến cho App NeuraX.
