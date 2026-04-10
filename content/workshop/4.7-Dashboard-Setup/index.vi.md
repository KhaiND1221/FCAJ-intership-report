# 4.7 Frontend — Expo, UI, Giọng Nói & Camera

Frontend mobile của NutriTrack được xây dựng với Expo SDK 54, React Native 0.81, và React 19. Sử dụng file-based routing qua Expo Router 6, Zustand 5 cho state, và Amplify JS client (`aws-amplify` ^6.16) cho tất cả lệnh gọi backend. Cài đặt yêu cầu `--legacy-peer-deps` (được enforce bởi `frontend/.npmrc`) do xung đột peer dependency giữa React 19 và một số package transitional.

## Cấu trúc thư mục

```text
frontend/
  app/                     # Expo Router — mỗi file là một route
    _layout.tsx            # Root: LanguageProvider, GestureHandlerRootView, auth guard
    (tabs)/
      _layout.tsx          # Tab bar với 6 tab + nút "+" ở giữa
      home.tsx             # Dashboard: macro ngày, streak, pet Ollie
      kitchen.tsx          # Tủ lạnh + gợi ý công thức AI
      battle.tsx           # Bảng xếp hạng bạn bè + thử thách
      ai-coach.tsx         # Chat với Ollie
      progress.tsx         # Biểu đồ dinh dưỡng tuần/tháng
      add.tsx              # Log bữa ăn: ảnh, giọng nói, thủ công
    welcome.tsx            # Onboarding / landing
    login.tsx              # Email+password + Google OAuth
    signup.tsx             # Form đăng ký
    verify-otp.tsx         # Xác thực OTP email
  src/
    store/                 # Zustand stores (authStore, userStore, mealStore, ...)
    services/              # Business logic (authService, aiService, audioService, ...)
    lib/amplify.ts         # Amplify.configure() — import side-effect trong _layout
    i18n/                  # LanguageProvider + translations (vi/en)
    security/              # Xác thực sinh trắc, chống chụp màn hình, validation đầu vào
    constants/             # colors.ts, typography.ts
  assets/                  # Hình ảnh, fonts
  MANHINH/                 # Video pet evolution 1.mp4–5.mp4
  amplify_outputs.json     # Tự động tạo theo môi trường — KHÔNG sửa thủ công
  package.json
  .npmrc                   # legacy-peer-deps=true
```

## Khởi động nhanh

```bash
cd frontend
npm install                # --legacy-peer-deps đã được .npmrc enforce
npm start                  # Khởi động Metro; scan QR bằng Expo Go
```

Cho native dev build (cần thiết cho xác thực sinh trắc — Expo Go sandbox không hỗ trợ):

```bash
npm run android            # expo run:android
npm run ios                # expo run:ios
```

Cho web:

```bash
npm run web                # expo start --web
npm run build              # expo export --platform web → dist/
```

## Các trang con

- [4.7.1 Cài Đặt Expo](/workshop/4.7.1-ReactNative) — khởi tạo dự án, cấu hình Amplify, auth guard, routing.
- [4.7.2 UI Components](/workshop/4.7.2-UIComponents) — design token, cấu trúc tab, pattern Zustand, i18n, pet evolution.
- [4.7.3 Giọng Nói & Camera](/workshop/4.7.3-Voice-Camera) — camera → S3 → resizeImage → aiEngine, giọng nói → Transcribe → food log.
