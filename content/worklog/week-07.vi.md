### Mục tiêu Tuần 7

* Xây dựng giao diện Authentication hoàn chỉnh (Sign Up, Sign In, OTP Verification).
* Tích hợp Amazon Cognito với hai phương thức xác thực (Email OTP + Google OAuth).
* Thực hiện pentest đầu tiên nhắm vào luồng xác thực và quản lý token.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Phát triển Auth UI <br>&emsp; + Xây dựng màn hình Sign Up, Sign In, và OTP Verification <br>&emsp; + Tích hợp luồng xác thực Cognito Email + OTP | 12/03/2026 | 12/03/2026 | [Auth with Cognito](https://000081.awsstudygroup.com/) |
| 2 | - Tích hợp Google OAuth <br>&emsp; + Cấu hình OAuth 2.0 redirect URIs trong `auth/resource.ts` <br>&emsp; + Thiết lập Google Cloud Console OAuth Client credentials | 13/03/2026 | 13/03/2026 | [Google Cloud Console](https://console.cloud.google.com/welcome/new?pli=1) |
| 3 | ⭐ **SỰ KIỆN:** AWS Cloud Mastery 1 | 14/03/2026 | 14/03/2026 | - |
| 4 | - Lưu trữ Token An toàn <br>&emsp; + Implement lưu JWT token bằng `expo-secure-store` <br>&emsp; + Thiết kế quản lý session lifecycle (token refresh, xử lý hết hạn) | 16/03/2026 | 16/03/2026 | [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) |
| 5 | - Kiểm thử Chức năng Auth <br>&emsp; + Kiểm tra end-to-end: đăng ký, đăng nhập, OTP, Google OAuth <br>&emsp; + Xác nhận session persistence khi restart app | 17/03/2026 | 17/03/2026 | - |
| 6 | - Pentest #1: Đánh giá Bảo mật Token <br>&emsp; + Thử thao túng JWT token và bypass chữ ký <br>&emsp; + Đánh giá việc thực thi hết hạn token và rotation refresh token | 18/03/2026 | 18/03/2026 | [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) |

### Kết quả đạt được trong Tuần 7

* **Luồng Auth Hoàn chỉnh:**
  * Pipeline xác thực hoạt động đầy đủ — Email+OTP và Google OAuth đều được verify end-to-end.

* **Bảo mật Được Xác nhận:**
  * Pentest ban đầu xác nhận JWT do Cognito cấp chống lại các nỗ lực thao túng và thực thi chính sách hết hạn đúng cách.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Cấu hình Google OAuth redirect URIs cho môi trường phát triển Expo cần thử nhiều lần do khác biệt URL scheme giữa các platform.
* **Bài học:**
  * Authentication là bề mặt tấn công quan trọng nhất. Kiểm thử bảo mật token sớm ngăn ngừa lỗ hổng lan truyền xuống downstream.

### Kế hoạch Tuần 8

* Cùng DEV team nghiên cứu và prototype giao diện Pet evolution.
* Thiết kế và demo Streak system và cơ chế tích lũy XP.
* Mở rộng bộ công cụ pentest.
