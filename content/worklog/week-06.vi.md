### Mục tiêu Tuần 6

* Khởi tạo project React Native (Expo Router) với file-based routing.
* Kết nối Frontend với Amplify Data (AppSync GraphQL).
* Cùng team xây dựng hệ thống tab navigation chính.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Khởi tạo Expo Router <br>&emsp; + Tạo project với file-based routing trong `app/` <br>&emsp; + Cấu hình layout groups: `(tabs)/` cho UX chính, `(auth)/` cho xác thực | 05/03/2026 | 05/03/2026 | [Expo Router](https://expo.github.io/router) |
| 2 | - Xử lý Dependencies <br>&emsp; + Giải quyết lỗi `npm install` do xung đột peer dependencies React Native <br>&emsp; + Áp dụng `--legacy-peer-deps` và ghim phiên bản thư viện tương thích | 06/03/2026 | 06/03/2026 | [React Native Docs](https://reactnative.dev/docs/getting-started) |
| 3 | - Tích hợp AppSync <br>&emsp; + Cấu hình `Amplify.configure()` với `amplify_outputs.json` <br>&emsp; + Xác nhận kết nối GraphQL client qua `generateClient<Schema>()` | 07/03/2026 | 07/03/2026 | [Amplify Data](https://docs.amplify.aws/gen2/build-a-backend/data/) |
| 4 | - Bottom Tab Navigation (cùng team) <br>&emsp; + Xây dựng layout 5 tabs: Home, Log, Kitchen, Coach, Profile <br>&emsp; + Cấu hình icons và routing cho từng screen | 09/03/2026 | 09/03/2026 | [Expo Tabs](https://docs.expo.dev/router/advanced/tabs/) |
| 5 | - Dựng Screens (cùng team) <br>&emsp; + Tạo placeholder screens cho mỗi tab <br>&emsp; + Implement shared header component và flow chuyển trang | 10/03/2026 | 10/03/2026 | - |
| 6 | - Test Android Emulator <br>&emsp; + Cấu hình `adb reverse tcp:8081 tcp:8081` cho Metro server local <br>&emsp; + Kiểm tra hot reload và navigation trên emulator | 11/03/2026 | 11/03/2026 | - |

### Kết quả đạt được trong Tuần 6

* **Nền tảng Frontend:**
  * Project Expo Router hoạt động đầy đủ với file-based routing phân tách rõ ràng giữa UX chính và luồng xác thực.

* **Kết nối Backend:**
  * Frontend giao tiếp với Amplify backend qua GraphQL queries có schema-typed sử dụng `generateClient<Schema>()`.

* **Phối hợp Team:**
  * Cùng team hoàn thiện hệ thống 5 tabs bottom navigation (Home, Log, Kitchen, Coach, Profile), xác lập luồng trải nghiệm người dùng cốt lõi cho NutriTrack.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Xung đột dependencies React Native khiến `npm install` lỗi liên tục. Nhiều thư viện yêu cầu phiên bản React cụ thể xung đột với Expo SDK.
* **Giải pháp:**
  * Sử dụng flag `--legacy-peer-deps` xuyên suốt và ghim phiên bản thư viện cụ thể trong `package.json`.
* **Bài học:**
  * Quản lý dependencies React Native đòi hỏi kiên nhẫn. Xây dựng UI components cùng team từ sớm giúp mọi người có cùng hiểu biết về kiến trúc ứng dụng.

### Kế hoạch Tuần 7

* Xây dựng giao diện Authentication hoàn chỉnh (Sign Up, Sign In, OTP).
* Tích hợp Amazon Cognito (Email OTP + Google OAuth).
* Bắt đầu kiểm thử bảo mật ban đầu cho luồng Auth.
