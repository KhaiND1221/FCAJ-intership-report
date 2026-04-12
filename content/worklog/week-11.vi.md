### Mục tiêu Tuần 11

* Khắc phục tất cả lỗ hổng phát hiện trong quá trình pentest.
* Thực hiện kiểm thử chất lượng toàn diện trên tất cả user flows.
* Đóng tất cả tickets bảo mật và bug còn tồn đọng.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Khắc phục Lỗ hổng IDOR <br>&emsp; + Thêm kiểm tra JWT claim `cognito:username` vào logic authorization Lambda <br>&emsp; + Viết unit tests xác nhận trả 403 khi identity không khớp | 09/04/2026 | 09/04/2026 | [Cognito JWT Claims](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html) |
| 2 | - Sửa lỗi Ổn định Frontend <br>&emsp; + Giải quyết vấn đề đồng bộ state trong Zustand stores <br>&emsp; + Fix edge cases AsyncStorage persistence gây mất dữ liệu khi restart app | 10/04/2026 | 10/04/2026 | [Zustand](https://github.com/pmndrs/zustand) |
| 3 | ⭐ **SỰ KIỆN:** AWS Cloud Mastery 3 (FPT Uni) | 11/04/2026 | 11/04/2026 | - |
| 4 | - Kiểm thử Chất lượng Toàn diện <br>&emsp; + Test end-to-end thủ công: Auth → Food Log → AI Coach → Gamification → Leaderboard <br>&emsp; + Xác nhận tương tác cross-feature và tính nhất quán dữ liệu | 13/04/2026 | 13/04/2026 | - |
| 5 | - Xác nhận lại Bảo mật <br>&emsp; + Chạy lại tất cả kịch bản pentest trước đó trên endpoints đã vá <br>&emsp; + Xác nhận zero regression trong khắc phục lỗ hổng | 14/04/2026 | 14/04/2026 | [OWASP Re-testing](https://owasp.org/www-project-web-security-testing-guide/) |
| 6 | - Đóng Tickets & Tài liệu <br>&emsp; + Đóng tất cả tickets pentest và bug fix <br>&emsp; + Chuẩn bị tài liệu kỹ thuật cho tuần thuyết trình cuối | 15/04/2026 | 15/04/2026 | - |

### Kết quả đạt được trong Tuần 11

* **Không còn Lỗ hổng Nghiêm trọng:**
  * Lỗ IDOR đã vá hoàn toàn — Lambda giờ cross-reference JWT claims với quyền sở hữu resource được yêu cầu.

* **Ổn định Ứng dụng:**
  * Giải quyết tất cả vấn đề state management frontend, đảm bảo persistence dữ liệu đáng tin cậy giữa các sessions.

* **Sạch sẽ Hoàn toàn:**
  * Tất cả tickets bảo mật và QA đã đóng. Ứng dụng verified ổn định và sẵn sàng cho thuyết trình cuối.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Tách rời thay đổi logic authorization mà không phá vỡ response format frontend mong đợi đòi hỏi phối hợp chặt chẽ.
* **Bài học:**
  * Khắc phục lỗ hổng là nỗ lực hợp tác giữa Security và Development. Giao tiếp rõ ràng đẩy nhanh việc giải quyết ticket.

### Kế hoạch Tuần 12

* Thuyết trình báo cáo dự án cuối cùng trước FCJ Mentors.
* Hoàn tất đối soát ngân sách cùng IA-1 teammate.
* Bàn giao kiến thức và hoàn thiện tài liệu dự án.
