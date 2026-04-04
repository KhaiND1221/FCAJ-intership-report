### Mục tiêu Tuần 1:

* Kết nối với các thành viên và thiết lập không gian số.
* Bắt đầu tìm hiểu các dịch vụ cơ bản của AWS thông qua lộ trình Cloud Journey (Module 1, 2, 3).
* Khởi tạo trang Web bằng Hugo để làm báo cáo thực tập (Worklog).

### Các công việc thực hiện trong tuần:

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Thiết lập Discord Server, GitHub Organization | 05/01/2026 | 06/01/2026 | - |
| 2 | - Khởi tạo tài khoản AWS <br>&emsp; + Lab 1: Quản lý nhóm người dùng IAM <br>&emsp; + Lab 7: Quản lý ngân sách (Budget) <br>&emsp; + Lab 9: Tìm hiểu AWS Support Services | 06/01/2026 | 07/01/2026 | [Lab 1](https://000001.awsstudygroup.com/) |
| 3 | - Bắt đầu lý thuyết Module 2: <br>&emsp; + Học về VPC, Subnets, Routetable, Security Groups <br>&emsp; + Cài đặt Hugo để viết worklog bằng Markdown | 07/01/2026 | 08/01/2026 | [Cloud Journey](https://cloudjourney.awsstudygroup.com/) |
| 4 | - Hoàn thành Lab Module 2: <br>&emsp; + Lab 3: EC2 Instances và NAT Gateway <br>&emsp; + Lab 10: Key pairs, RDP Security Groups <br>&emsp; + Lab 19: VPC Peering, Network ACLs | 08/01/2026 | 09/01/2026 | [Lab 3](https://000003.awsstudygroup.com/) <br> [Lab 10](https://000010.awsstudygroup.com/) |
| 5 | - Lab 20: Tạo AWS Transit Gateway <br>&emsp; + Sửa lỗi file yaml CloudFormation (đổi EC2 sang t3.micro) | 09/01/2026 | 10/01/2026 | [Lab 20](https://000020.awsstudygroup.com/) |
| 6-7 | - Bắt đầu lý thuyết Module 3 (EBS, S3, EFS) <br> - Lab 13: Tạo Backup Plan với AWS Backup <br> - Lab 24: Storage Gateway <br> - Lab 57: Host Static Website bằng S3 | 10/01/2026 | 11/01/2026 | [Lab 13](https://000013.awsstudygroup.com/) <br> [Lab 57](https://000057.awsstudygroup.com/)|

### Kết quả đạt được trong Tuần 1:

* Đã tạo và bảo vệ tài khoản AWS an toàn, bao gồm cả thiết lập báo động ngân sách (Lab 7).
* Triển khai và kết nối thành công với EC2 (MobaXTerm/PuTTY), cấu hình NAT Gateway và quản lý mạng VPC Peering, Transit Gateway (Lab 3, 19, 20).
* Có kinh nghiệm thực hành lưu trữ (S3, Storage Gateway) và thiết lập sao lưu (Lab 13, 24, 57).
* Sửa thành công một Template CloudFormation bị lỗi thời trong quá trình cấu hình (chuyển sang `t3.micro`).

### Thách thức & Bài học kinh nghiệm:

* **Thách thức:** Bài học đắt giá về việc dọn dẹp tài nguyên (bị tính phí 12$ credits do quên tắt các tài nguyên chạy nền).
* **Bài học:** Việc đầu tiên cần làm trên AWS là giám sát Resource và hiểu rõ Billing Alarm để không bị trừ tiền ngoài ý muốn.

### Kế hoạch Tuần 2:

* Đi sâu vào Module 3 & 4 (Database và nâng cao Storage).
* Tham gia Sự kiện AWS Cloud Day.
