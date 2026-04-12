### Mục tiêu Tuần 8

* Cùng DEV team nghiên cứu và prototype giao diện Pet evolution.
* Thiết kế và demo Streak system cùng cơ chế tích lũy XP.
* Mở rộng bộ công cụ pentest bằng cách nghiên cứu các tool bảo mật mã nguồn mở hiện đại.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Nghiên cứu UI Pet (cùng DEV) <br>&emsp; + Tìm kiếm visual references và patterns animation cho hệ thống "Minh Long" Dragon evolution <br>&emsp; + Benchmark gamification UI từ các ứng dụng wellness cạnh tranh | 19/03/2026 | 19/03/2026 | [Lottie Animations](https://lottiefiles.com/) |
| 2 | - Thiết kế Wireframe (cùng DEV) <br>&emsp; + Sketch wireframe 5 giai đoạn tiến hóa: Egg → Newborn → Young → Adult → Legendary <br>&emsp; + Đề xuất animation transitions và visual state indicators | 20/03/2026 | 20/03/2026 | - |
| 3 | - Demo Streak/XP System (cùng DEV) <br>&emsp; + Prototype logic daily check-in, Streak Flame counter, và engine tính XP <br>&emsp; + Demo prototype hoạt động cho toàn team để nhận feedback | 21/03/2026 | 21/03/2026 | - |
| 4 | - Cải tiến Demo <br>&emsp; + Calibrate XP thresholds cho 5 giai đoạn tiến hóa (36 ngày/stage) <br>&emsp; + Tích hợp logic Podium ranking cho tính năng Leaderboard cạnh tranh | 23/03/2026 | 23/03/2026 | - |
| 5 | - Khám phá Công cụ Pentest <br>&emsp; + Khảo sát các tool bảo mật mã nguồn mở trên GitHub: toxssin, Nuclei, httpx, ffuf <br>&emsp; + Đánh giá tính phù hợp của từng tool với kiến trúc serverless API | 24/03/2026 | 24/03/2026 | [toxssin](https://github.com/t3l3machus/toxssin) |
| 6 | - Cài đặt Bộ Pentest <br>&emsp; + Cài đặt và cấu hình các tool đã chọn trên sandbox environment <br>&emsp; + Chạy baseline scans ban đầu để xác nhận tương thích | 25/03/2026 | 25/03/2026 | [Nuclei Scanner](https://github.com/projectdiscovery/nuclei) |

### Kết quả đạt được trong Tuần 8

* **Bản thiết kế Gamification:**
  * Cùng DEV team hoàn thành wireframe đầy đủ và prototype Streak/XP hoạt động, xác định hành trình Dragon evolution 180 ngày.

* **Arsenal Bảo mật Mở rộng:**
  * Tập hợp bộ pentest hiện đại (toxssin, Nuclei, httpx, ffuf) phù hợp cho kiến trúc serverless API.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Cân bằng giữa tính hấp dẫn gamification và khả thi kỹ thuật — một số ý tưởng animation quá tốn tài nguyên cho rendering mobile.
* **Bài học:**
  * Gamification hiệu quả đòi hỏi phối hợp chặt chẽ giữa tầm nhìn thiết kế và ràng buộc kỹ thuật. Bộ tool bảo mật phải được chọn lọc phù hợp kiến trúc mục tiêu.

### Kế hoạch Tuần 9

* Kiểm thử chức năng toàn diện Camera, Voice, và Food Card.
* Góp ý cải thiện UI/UX cho trải nghiệm Camera scan.
* Thực hiện pentest nhắm vào cơ chế S3 presigned URL.
