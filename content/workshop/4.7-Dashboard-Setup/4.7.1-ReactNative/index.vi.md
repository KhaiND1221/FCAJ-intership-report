# 4.7.1 Cài Đặt Expo

## Cấu trúc dự án

Frontend NutriTrack nằm trong `frontend/` cùng với backend Amplify tại `backend/`. Nếu build từ đầu:

```bash
npx create-expo-app@latest frontend --template blank-typescript
cd frontend
```

Repo đã có `frontend/` — clone và cài đặt:

```bash
cd frontend
npm install   # --legacy-peer-deps được enforce bởi .npmrc
```

## Các dependency chính

| Package | Phiên bản | Mục đích |
| --- | --- | --- |
| `expo` | ~54.0.0 | Core SDK — liên kết native module |
| `react-native` | 0.81.5 | RN runtime |
| `react` | 19.1.0 | React 19 — concurrent features |
| `expo-router` | ~6.0.23 | File-based routing |
| `aws-amplify` | ^6.16.2 | Amplify JS client (auth, API, storage) |
| `@aws-amplify/react-native` | ^1.3.3 | Adapter RN-specific của Amplify |
| `zustand` | ^5.0.11 | State management |
| `expo-camera` | ~17.0.10 | Chụp ảnh |
| `expo-av` | ~16.0.8 | Ghi âm + phát video pet evolution |
| `expo-local-authentication` | ~17.0.8 | Xác thực sinh trắc |
| `expo-secure-store` | ~15.0.8 | Lưu trữ token bảo mật |
| `expo-screen-capture` | ~8.0.9 | Ngăn chụp màn hình |

Cài với `--legacy-peer-deps`. File `.npmrc` trong `frontend/` tự động hóa điều này:

```text
legacy-peer-deps=true
```

## Cấu hình Amplify

`amplify_outputs.json` được tạo bởi Amplify pipeline, chứa URL endpoint, region config, và API identifier cho môi trường đang hoạt động. Không commit sửa thủ công — bị ghi đè mỗi lần chạy `npx ampx sandbox` hoặc CI deploy.

Khởi tạo Amplify một lần trong `src/lib/amplify.ts`:

```typescript
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);
```

Import như side-effect trong root layout để chạy trước mọi component:

```typescript
// app/_layout.tsx
import '@/src/lib/amplify';  // phải là dòng đầu tiên
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider } from '@/src/i18n/LanguageProvider';
// ...
```

Tái tạo `amplify_outputs.json` sau khi thay đổi backend:

```bash
cd backend
npx ampx generate outputs --outputs-out-dir ../frontend
```

## File-based routing với Expo Router

Mỗi file trong `app/` là một route:

```text
app/
  _layout.tsx          → root Stack navigator + auth guard
  (tabs)/
    _layout.tsx        → Tab navigator (home, kitchen, battle, ai-coach, progress, add)
    home.tsx           → /
    kitchen.tsx        → /kitchen
    battle.tsx         → /battle
    ai-coach.tsx       → /ai-coach
    progress.tsx       → /progress
    add.tsx            → /add
  welcome.tsx          → /welcome
  login.tsx            → /login
  signup.tsx           → /signup
  verify-otp.tsx       → /verify-otp
```

Expo Router suy ra kiểu navigator từ tên thư mục: `(tabs)/` dùng Tab navigator; `_layout.tsx` root bọc tất cả trong Stack.

## Guest Mode — Cognito Unauthenticated Identities

NutriTrack cho phép người dùng chưa đăng nhập quét mã vạch thực phẩm. Để điều này hoạt động, cần bật **Guest Access (Unauthenticated Identities)** trên Cognito Identity Pool — nếu không, app không thể gọi bất kỳ AWS API nào cho guest và tính năng quét mã sẽ lỗi im lặng.

Bật trong `backend/amplify/auth/resource.ts`:

```typescript
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: { ... },
      callbackUrls: [...],
      logoutUrls: [...],
    },
  },
  // Bắt buộc để guest quét mã thực phẩm trước khi đăng nhập
  guestAccess: 'enabled',
});
```

Sau đó gắn IAM policy có phạm vi hẹp vào **unauthenticated role** trong `backend.ts` để guest chỉ gọi được các action cần thiết cho tra cứu thực phẩm — không được ghi food log hay truy cập dữ liệu người dùng khác:

```typescript
const { unauthenticatedUserIamRole } = backend.auth.resources;

unauthenticatedUserIamRole.addToPolicy(new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: ['appsync:GraphQL'],
  resources: [`${backend.data.resources.graphqlApi.arn}/types/Query/*`],
}));
```

> **Nếu bỏ qua bước này**, guest nhận `UnauthorizedException` ngay khi mở màn hình quét mã và tính năng hoàn toàn không hoạt động.

## Auth guard trong root layout

Root `_layout.tsx` kiểm tra trạng thái xác thực khi mount và redirect user chưa đăng nhập đến `/welcome`. Phiên bản thực (~390 dòng) có thêm `Hub.listen('auth')` để xử lý OAuth redirect, biometric prompt, và `useRef` guard. Cấu trúc cốt lõi:

```typescript
// app/_layout.tsx (rút gọn)
import { useEffect } from 'react';
import { router, Slot } from 'expo-router';
import { getCurrentUser } from 'aws-amplify/auth';
import { LanguageProvider } from '@/src/i18n/LanguageProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useEffect(() => {
    getCurrentUser()
      .then(() => { /* đã đăng nhập — ở lại */ })
      .catch(() => router.replace('/welcome'));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <Slot />
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
```

Layout đầy đủ cũng subscribe `Hub.listen('auth', ...)` để khi `signInWithRedirect` hoàn tất (Google OAuth), auth state cập nhật ngay và router điều hướng về `(tabs)/home` mà không cần poll `getCurrentUser` thêm.

`LanguageProvider` bọc toàn bộ app để mọi màn hình có thể truy cập `useAppLanguage()` cho chuyển đổi Tiếng Việt/English.

## Xác thực sinh trắc

Sau đăng nhập, mỗi lần app resume, lớp security nhắc xác thực sinh trắc (vân tay hoặc Face ID) qua `expo-local-authentication`:

```typescript
import * as LocalAuthentication from 'expo-local-authentication';

const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Xác thực để tiếp tục',
  fallbackLabel: 'Dùng mật khẩu',
});
if (!result.success) {
  // khóa app hoặc đăng xuất
}
```

**Quan trọng**: `expo-local-authentication` cần native build. Không hoạt động trong Expo Go. Dùng `npm run android` hoặc `npm run ios` để test biometric.

## Chạy app

```bash
# Expo Go (nhanh nhất, nhưng không có biometric / native module)
npm start          # scan QR bằng Expo Go

# Native đầy đủ (cần Android Studio / Xcode)
npm run android
npm run ios

# Trình duyệt web
npm run web

# Export web production
npm run build      # output ra frontend/dist/
```

## Path alias

`@/` map đến `frontend/` trong `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

Dùng `@/src/store/authStore` thay vì `../../src/store/authStore` xuyên suốt codebase.

## Xử lý lỗi thường gặp

| Triệu chứng | Nguyên nhân | Fix |
| --- | --- | --- |
| `npm install` lỗi peer-dep | Thiếu `.npmrc` | Thêm `legacy-peer-deps=true` vào `frontend/.npmrc` |
| Metro không resolve `amplify_outputs.json` | File thiếu | Chạy `npx ampx generate outputs --outputs-out-dir ../frontend` từ `backend/` |
| Biometric prompt không hiện | Đang dùng Expo Go | Dùng `npm run android` / `npm run ios` cho dev build |
| `Cannot find module 'aws-amplify'` | Chưa cài | `cd frontend && npm install` |
| Màn hình nhấp nháy giữa auth và tab | Race condition trên `isAuthenticated` | Thêm loading state vào `authStore`; hiển thị splash cho đến khi state được hydrate |

## Liên kết

- [4.7.2 UI Components](/workshop/4.7.2-UIComponents)
- [4.7.3 Giọng Nói & Camera](/workshop/4.7.3-Voice-Camera)
- [4.3.2 Cognito Auth](/workshop/4.3.2-Cognito-Auth)
