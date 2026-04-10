# 4.7.2 UI Components

## Design token

Color được định nghĩa trong `src/constants/colors.ts`, typography trong `src/constants/typography.ts`. Bảng màu xoay quanh dark-navy làm màu chính với green vivid làm màu nhấn:

| Token | Giá trị | Sử dụng |
| --- | --- | --- |
| Primary | `#1B2838` | Dark Navy — background, nav bar, card |
| Accent | `#2ECC71` | Green — progress bar, CTA, streak highlight |
| Background | `#F8F9FA` | Màn hình sáng |
| Surface | `#FFFFFF` | Background card |
| Error | `#E74C3C` | Validation, hành động nguy hiểm |
| Warning | `#F39C12` | Item tủ lạnh sắp hết hạn |

Typography dùng `Inter` làm font chính, load qua `expo-font`. Scale: heading-xl (28 sp), heading-lg (22 sp), body (16 sp), caption (12 sp).

## Cấu trúc tab

Sáu màn hình trong `app/(tabs)/`:

| Tab | File | Mục đích |
| --- | --- | --- |
| Home | `home.tsx` | Vòng macro ngày, đếm streak, widget pet Ollie |
| Kitchen | `kitchen.tsx` | Danh sách tủ lạnh, cảnh báo hết hạn, nút gợi ý công thức AI |
| Battle | `battle.tsx` | Bảng xếp hạng bạn bè, thử thách đang hoạt động |
| AI Coach | `ai-coach.tsx` | Giao diện chat với Ollie, thẻ món ăn/bài tập |
| Progress | `progress.tsx` | Biểu đồ cột tuần/tháng, xu hướng cân nặng |
| Add | `add.tsx` | Camera, giọng nói, thủ công, barcode |

Tab Add ở giữa dùng nút tab bar tùy chỉnh (icon `+`, to hơn, màu accent) nổi lên trên tab bar.

## Pattern Zustand store

Toàn bộ state trong `src/store/`. Mỗi store dùng `zustand` với middleware `persist` backed bởi `AsyncStorage`:

```typescript
// src/store/mealStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MealState {
  logs: FoodLog[];
  addLog: (log: FoodLog) => void;
  clearLogs: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) => set((s) => ({ logs: [log, ...s.logs] })),
      clearLogs: () => set({ logs: [] }),
    }),
    { name: 'meal-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

Màn hình đọc từ store và gọi service:

```tsx
// app/(tabs)/kitchen.tsx (rút gọn)
import { useMealStore } from '@/src/store/mealStore';
import { mealService } from '@/src/services/mealService';

export default function KitchenScreen() {
  const logs = useMealStore((s) => s.logs);
  const addLog = useMealStore((s) => s.addLog);

  async function handleAddMeal(foodData: FoodData) {
    const log = await mealService.logMeal(foodData);
    addLog(log);
  }

  return <FlatList data={logs} renderItem={...} />;
}
```

Mười một store trong `src/store/`: `authStore`, `chatStore`, `foodStore`, `fridgeStore`, `friendStore`, `mealStore`, `notificationStore`, `recipeStore`, `settingsStore`, `userStore`, `workoutStore`.

## Quốc tế hóa (i18n)

`src/i18n/LanguageProvider.tsx` bọc app root và expose `useAppLanguage()`:

```typescript
const { t, language, setLanguage } = useAppLanguage();

// Trong component:
<Text>{t('home.title')}</Text>   // render "Home" hoặc "Trang chủ"

// Chuyển đổi:
<Switch onValueChange={(v) => setLanguage(v ? 'vi' : 'en')} />
```

`translations.ts` chứa toàn bộ key-value map EN/VI. Key dùng dot notation (`home.title`, `kitchen.addItem`, `battle.yourRank`). Ngôn ngữ mặc định là Tiếng Việt.

## Màn hình pet evolution

Hook gamification của NutriTrack là "Ollie" — nhân vật pet tiến hóa khi người dùng duy trì streak. App hiển thị sự tiến hóa của vòng đời thú cưng ảo (Ollie) thông qua các video giai đoạn (`.mp4`) được phát bằng module `expo-av` nhằm tối ưu hóa CPU cho thiết bị di động.

Mỗi cấp độ tiến hóa tương ứng với một file video pre-render trong `MANHINH/` (`1.mp4` đến `5.mp4`). Màn hình `battle.tsx` dùng component `Video` từ `expo-av` để phát file tương ứng:

```tsx
import { Video, ResizeMode } from 'expo-av';

export default function BattleScreen() {
  const petLevel = useUserStore((s) => s.petLevel); // 1–5

  return (
    <Video
      source={petVideos[petLevel]}
      resizeMode={ResizeMode.CONTAIN}
      isLooping
      shouldPlay
      style={{ width: '100%', aspectRatio: 1 }}
    />
  );
}

const petVideos: Record<number, { uri: string }> = {
  1: require('@/assets/MANHINH/1.mp4'),
  2: require('@/assets/MANHINH/2.mp4'),
  3: require('@/assets/MANHINH/3.mp4'),
  4: require('@/assets/MANHINH/4.mp4'),
  5: require('@/assets/MANHINH/5.mp4'),
};
```

Cách tiếp cận này tránh hoàn toàn overhead của WebGL/3D, cho phép phát mượt 60 fps trên thiết bị Android phổ thông.

## Lớp bảo mật

`src/security/` triển khai bốn guard:

1. **Xác thực sinh trắc** (`biometricAuth.ts`) — nhắc `expo-local-authentication` khi app resume. Khóa app nếu người dùng thất bại hoặc hủy.
2. **Chống chụp màn hình** (`screenCapture.ts`) — gọi `expo-screen-capture`'s `preventScreenCapture()` trên màn hình nhạy cảm. Reverting khi màn hình blur.
3. **Validation đầu vào** (`validation.ts`) — sanitize form input tại system boundary (đăng ký, nhập món thủ công, tìm bạn bè). Từ chối chuỗi có pattern injection.
4. **Secure storage** — auth token được lưu qua `expo-secure-store` (Keychain iOS, Keystore Android), không phải `AsyncStorage`.

## Kiến trúc màn hình

Mỗi màn hình tab theo pattern này:

- **Mount**: đọc từ Zustand store (local cache), bắt đầu subscription từ 4.6.2.
- **Effect**: nếu store rỗng hoặc stale, gọi service liên quan để fetch từ DynamoDB.
- **Tương tác**: hành động người dùng → gọi service → service cập nhật DynamoDB và dispatch vào store → subscription xác nhận thay đổi trên thiết bị khác.
- **Unmount**: unsubscribe tất cả AppSync subscription.

Điều này có nghĩa là UI không bao giờ bị block chờ network call — hiển thị dữ liệu cache ngay lập tức và cập nhật khi dữ liệu mới đến.

## Liên kết

- [4.7.1 Cài Đặt Expo](/workshop/4.7.1-ReactNative)
- [4.7.3 Giọng Nói & Camera](/workshop/4.7.3-Voice-Camera)
- [4.6.2 Realtime Subscriptions](/workshop/4.6.2-Realtime-Subscriptions)
