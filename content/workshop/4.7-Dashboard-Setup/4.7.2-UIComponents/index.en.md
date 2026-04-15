# 4.7.2 UI Components

## Design tokens

Colors are defined in `src/constants/colors.ts`, typography in `src/constants/typography.ts`. The palette centers on a dark-navy primary with a vivid-green accent:

| Token | Value | Usage |
| --- | --- | --- |
| Primary | `#1B2838` | Dark Navy — backgrounds, nav bars, cards |
| Accent | `#2ECC71` | Green — progress bars, CTAs, streak highlights |
| Background | `#F8F9FA` | Light screens |
| Surface | `#FFFFFF` | Card backgrounds |
| Error | `#E74C3C` | Validation, danger actions |
| Warning | `#F39C12` | Expiring fridge items |

Typography uses `Inter` as the primary font family, loaded via `expo-font`. Scale: heading-xl (28 sp), heading-lg (22 sp), body (16 sp), caption (12 sp).

## Tab structure

Six screens live in `app/(tabs)/`:

| Tab | File | Purpose |
| --- | --- | --- |
| Home | `home.tsx` | Daily macro ring, streak counter, Ollie pet widget |
| Kitchen | `kitchen.tsx` | Fridge inventory list, expiry warnings, AI recipe button |
| Battle | `battle.tsx` | Friend leaderboard, active challenges |
| AI Coach | `ai-coach.tsx` | Chat interface with Ollie, food/exercise cards |
| Progress | `progress.tsx` | Weekly/monthly bar charts, weight trend |
| Add | `add.tsx` | Camera, voice, manual, barcode entry modes |

The center Add tab uses a custom tab bar button (`+` icon, larger, accent-colored) that floats above the tab bar.

## Zustand store pattern

All state lives in `src/store/`. Stores use plain `zustand` with manual `AsyncStorage` persistence — **not** the `persist` middleware. Each store manages its own `STORAGE_KEY` and calls `AsyncStorage.setItem`/`getItem` inside actions:

```typescript
// src/store/mealStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@nutritrack_meals';

interface MealState {
  meals: Meal[];
  isLoading: boolean;
  addMeal: (meal: Omit<Meal, 'id' | 'time' | 'date'> & { date?: string }) => Promise<void>;
  loadMeals: () => Promise<void>;
  // ...
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  isLoading: false,

  loadMeals: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) set({ meals: JSON.parse(raw) });
  },

  addMeal: async (mealData) => {
    // ... build meal object
    const updated = [meal, ...get().meals];
    set({ meals: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
```

A screen reads from the store and calls a service:

```tsx
// app/(tabs)/kitchen.tsx (simplified)
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

The eleven stores in `src/store/`: `authStore`, `chatStore`, `foodStore`, `fridgeStore`, `friendStore`, `mealStore`, `notificationStore`, `recipeStore`, `settingsStore`, `userStore`, `workoutStore`.

## Internationalization (i18n)

`src/i18n/LanguageProvider.tsx` wraps the app root and exposes `useAppLanguage()`:

```typescript
const { t, language, setLanguage } = useAppLanguage();

// In component:
<Text>{t('home.title')}</Text>   // renders "Home" or "Trang chủ"

// Toggle:
<Switch onValueChange={(v) => setLanguage(v ? 'vi' : 'en')} />
```

`translations.ts` holds the full EN/VI key-value map. Keys use dot notation (`home.title`, `kitchen.addItem`, `battle.yourRank`). The default language is Vietnamese.

## Pet evolution screen

NutriTrack's gamification hook is "Ollie" — a pet character that evolves as the user maintains their streak. The frontend mobile của NutriTrack được xây dựng với Expo SDK 54, điều hướng qua Expo Router. App hiển thị sự tiến hóa của vòng đời thú cưng ảo (Ollie) thông qua các video giai đoạn (`.mp4`) được phát bằng module `expo-av` nhằm tối ưu hóa CPU cho thiết bị di động.

Each evolution level maps to a pre-rendered video file in `MANHINH/` (`1.mp4` through `5.mp4`). The `battle.tsx` screen uses the `Video` component from `expo-av` to play the appropriate file:

```tsx
import { Video, ResizeMode } from 'expo-av';
import { getUserData } from '@/src/store/userStore';

export default function BattleScreen() {
  const [petLevel, setPetLevel] = useState(1);

  useEffect(() => {
    getUserData().then((user) => {
      setPetLevel(user?.gamification?.pet_level ?? 1);
    });
  }, []);

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

> **Note:** `userStore.ts` is **not** a Zustand store — it is a plain AsyncStorage utility that exports `getUserData()` and `saveUserData()` async functions. There is no `useUserStore` hook. Read user data with `await getUserData()` inside a `useEffect`.

This approach avoids the WebGL/3D overhead entirely, giving smooth 60 fps playback on low-end Android devices.

## Security layer

`src/security/` implements four guards:

1. **Biometric auth** (`biometricAuth.ts`) — prompts `expo-local-authentication` on app resume. Locks the app if the user fails or cancels.
2. **Screen capture prevention** (`screenCapture.ts`) — calls `expo-screen-capture`'s `preventScreenCapture()` on sensitive screens (meal detail, profile, payment). Reverts on screen blur.
3. **Input validation** (`validation.ts`) — sanitizes form inputs at system boundaries (signup, food manual entry, friend search). Rejects strings with injection patterns.
4. **Secure storage** — auth tokens are stored via `expo-secure-store` (Keychain on iOS, Keystore on Android), not `AsyncStorage`.

## Screen architecture notes

Each tab screen follows this pattern:

- **Mount**: read from Zustand store (local cache), start subscription from `4.6.2`.
- **Effect**: if the store is empty or stale, call the relevant service to fetch from DynamoDB.
- **Interaction**: user action → call service → service updates DynamoDB and dispatches to store → subscription confirms the change on other devices.
- **Unmount**: unsubscribe from all AppSync subscriptions.

This means the UI is never blocked waiting for a network call — it shows cached data immediately and updates when fresh data arrives.

## Cross-links

- [4.7.1 Expo Setup](/workshop/4.7.1-ReactNative) — dependency install and routing.
- [4.7.3 Voice & Camera](/workshop/4.7.3-Voice-Camera) — the Add screen's camera and voice modes.
- [4.6.2 Realtime Subscriptions](/workshop/4.6.2-Realtime-Subscriptions) — subscription usage in screens.
