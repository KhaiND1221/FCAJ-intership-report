### Mục tiêu Tuần 2:

* Hoàn thành Module 3 & 4.
* Thực hiện nghiên cứu tùy chọn: AWS Well-Architected Framework.
* Lên ý tưởng dự án và tìm hiểu các ứng dụng tham khảo.

### Các công việc thực hiện trong tuần:

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | ⭐ **SỰ KIỆN:** AWS re:Invent 2025 Recap - Vietnam Edition <br>&emsp; - Soạn thảo NutriTrack Proposal <br>&emsp; + Phối hợp cùng Hưng tinh chỉnh Problem Statement và đánh giá tính khả thi của giải pháp AI. | 27/01/2026 | 27/01/2026 | - |
| 2 | - Lab 6: RDS Database <br>&emsp; + Dùng Linux qua EC2 để cài MySQL <br>&emsp; + Tạo Load Balancer & Target Groups | 28/01/2026 | 28/01/2026 | [Lab 6](https://000006.awsstudygroup.com/) |
| 3 | - Lab 5: Hỗ trợ team fix lỗi script lab kết nối RDS <br> - Thiếu bước `cd` tới thư mục ứng dụng | 29/01/2026 | 29/01/2026 | [Lab 5](https://000005.awsstudygroup.com/) |
| 4 | - Nghiên cứu các nền tảng mạng xã hội để làm tài liệu tham khảo cho dự án: <br>&emsp; + Tìm hiểu Cal AI. <br>&emsp; + Khám phá các ý tưởng mới để cải thiện Google Maps. | 30/01/2026 | 30/01/2026 | - |
| 5-6 | - Làm lại Lab 10: Route 53 Hybrid DNS & Microsoft AD <br> - Lab 8: CloudWatch Metrics & Dashboard <br> - Khảo sát AWS Well-Architected Framework (6 Trụ cột: Vận hành, Bảo mật, Tin cậy, Hiệu suất, Chi phí, Bền vững) | 31/01/2026 | 01/02/2026 | [Lab 8](https://000008.awsstudygroup.com/) |

### Kết quả đạt được trong Tuần 2:

* **Lên ý tưởng & Hoạch định:**
  * Đóng góp trực tiếp vào việc chốt "Problem Statement" cho NutriTrack, đồng thời cùng nhóm phân tích tính thực tiễn của mảng AI trong dự án.
  * Tham khảo và phân tích các nền tảng thực tế (Cal AI, Google Maps) để rút ra định hướng thiết kế phù hợp.

* **Triển khai Lưu trữ Đám mây:**
  * Nắm bắt cách khởi tạo và quản lý hệ quản trị cơ sở dữ liệu trên RDS, thao tác tích hợp thành công MySQL Client từ EC2 vào môi trường ảo (Lab 6).
  * Tự chủ khắc phục lỗi kết nối bằng cách điều tra và bổ sung các mã lệnh bị thiếu trong tài liệu hướng dẫn (Lab 5).

* **Thiết lập Mạng & Đo lường:**
  * Khảo sát thiết lập mô hình DNS lai (Hybrid DNS) thông qua Route 53 kết hợp dịch vụ Microsoft AD (Lab 10).
  * Khai thác Amazon CloudWatch để xây dựng các biểu đồ giám sát và hệ thống cảnh báo tự động, theo dõi trực quan hiệu năng hệ thống (Lab 8).

* **Tư duy Kiến trúc Hệ thống:**
  * Đi sâu vào bộ quy chuẩn AWS Well-Architected Framework. Nắm bắt cách áp dụng thực tiễn 6 khía cạnh cốt yếu (Bảo mật, Chi phí, Độ tin cậy, Hiệu suất, Vận hành, và Bền vững) vào thiết kế cloud.

### Thách thức & Bài học kinh nghiệm:

* **Thách thức:** Bài thực hành sử dụng rất nhiều tool / mã nguồn ngoài đã quá cũ không còn chạy được.
* **Bài học:** Không được nhắm mắt làm theo tài liệu blindly. Luôn cần khả năng debug cơ bản (Ví dụ: Đọc lỗi thiếu file thì phải tự `cd` chuyển thư mục).

### Kế hoạch Tuần 3:

* Hoàn thành Module 5.
* Làm mạnh về quản trị lưu trữ FSx.
* Giới hạn quyền hạn IAM và triển khai KMS mã hóa.
* Quét lỗi tự động với AWS Security Hub.
