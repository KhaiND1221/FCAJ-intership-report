### Mục tiêu Tuần 2:

* Hoàn thành Module 3 & 4.
* Thực hiện nghiên cứu tùy chọn: AWS Well-Architected Framework.
* Lên ý tưởng dự án và tìm hiểu các ứng dụng tham khảo.

### Các công việc thực hiện trong tuần:

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | ⭐ **SỰ KIỆN:** AWS re:Invent 2025 Recap - Vietnam Edition <br>&emsp; - Soạn thảo NutriTrack Proposal <br>&emsp; + Phối hợp cùng Hưng tinh chỉnh Problem Statement và đánh giá tính khả thi của giải pháp AI. | 27/01/2026 | 27/01/2026 | - |
| 2 | - Lab 6: RDS Database <br>&emsp; + Dùng Linux qua EC2 để cài MySQL <br>&emsp; + Tạo Load Balancer & Target Groups <br>&emsp; + Cài công cụ `Siege` để Load test mô phỏng 50 người dùng cho đến khi EC2 tự terminate | 28/01/2026 | 28/01/2026 | [Lab 6](https://000006.awsstudygroup.com/) |
| 3 | - Lab 5: Hỗ trợ team fix lỗi script lab kết nối RDS <br> - Thiếu bước `cd` tới thư mục ứng dụng | 29/01/2026 | 29/01/2026 | [Lab 5](https://000005.awsstudygroup.com/) |
| 4 | - Nghiên cứu các nền tảng mạng xã hội để làm tài liệu tham khảo cho dự án: <br>&emsp; + Tìm hiểu Cal AI. <br>&emsp; + Khám phá các ý tưởng mới để cải thiện Google Maps. | 30/01/2026 | 30/01/2026 | - |
| 5-6 | - Làm lại Lab 10: Route 53 Hybrid DNS & Microsoft AD <br> - Lab 8: CloudWatch Metrics & Dashboard <br> - Khảo sát AWS Well-Architected Framework (6 Trụ cột: Vận hành, Bảo mật, Tin cậy, Hiệu suất, Chi phí, Bền vững) | 31/01/2026 | 01/02/2026 | [Lab 8](https://000008.awsstudygroup.com/) |

### Kết quả đạt được trong Tuần 2:

* Phối hợp tinh chỉnh Problem Statement của dự án NutriTrack và nghiên cứu các ứng dụng tham khảo như Cal AI, Google Maps để lấy ý tưởng phát triển ứng dụng.
* Thiết lập Database & Proxy chịu tải thành công khi hoàn tất Lab 6 (RDS, Load Balancing). Tự tìm giải pháp thay thế tool test lỗi thời bằng `Siege`.
* Hỗ trợ sửa các script bash bị mất thư mục kết nối DB trong hướng dẫn của hệ thống (Lab 5).
* Đọc và đánh giá CloudWatch metrics theo thời gian thực (Lab 8).
* Nắm vững triết lý 6 trụ cột cốt lõi làm nên một hệ thống Cloud chuẩn "Well-Architected".

### Thách thức & Bài học kinh nghiệm:

* **Thách thức:** Bài thực hành sử dụng rất nhiều tool / mã nguồn ngoài đã quá cũ không còn chạy được.
* **Bài học:** Không được nhắm mắt làm theo tài liệu blindly. Luôn cần khả năng debug cơ bản (Ví dụ: Đọc lỗi thiếu file thì phải tự `cd` chuyển thư mục hoặc kiếm tool Load Test thay thế).

### Kế hoạch Tuần 3:

* Hoàn thành Module 5.
* Làm mạnh về quản trị lưu trữ FSx.
* Giới hạn quyền hạn IAM và triển khai KMS mã hóa.
* Quét lỗi tự động với AWS Security Hub.
