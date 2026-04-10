# 4.7 Frontend — Expo, UI, Voice & Camera

NutriTrack's mobile frontend is built with Expo SDK 54, React Native 0.81, and React 19. It uses file-based routing via Expo Router 6, Zustand 5 for state, and the Amplify JS client (`aws-amplify` ^6.16) for all backend calls. The install requires `--legacy-peer-deps` (enforced by `frontend/.npmrc`) because of peer dependency conflicts between React 19 and some transitive packages.

## Directory layout

```text
frontend/
  app/                     # Expo Router — every file is a route
    _layout.tsx            # Root: LanguageProvider, GestureHandlerRootView, auth guard
    (tabs)/
      _layout.tsx          # Tab bar with 6 tabs + center "+" button
      home.tsx             # Dashboard: daily macros, streak, Ollie pet
      kitchen.tsx          # Fridge inventory + AI recipe suggestions
      battle.tsx           # Friend leaderboard + challenges
      ai-coach.tsx         # Chat with Ollie
      progress.tsx         # Weekly/monthly nutrition charts
      add.tsx              # Food logging: photo, voice, manual
    welcome.tsx            # Onboarding / landing
    login.tsx              # Email+password + Google OAuth
    signup.tsx             # Registration form
    verify-otp.tsx         # Email OTP verification
  src/
    store/                 # Zustand stores (authStore, userStore, mealStore, ...)
    services/              # Business logic (authService, aiService, audioService, ...)
    lib/amplify.ts         # Amplify.configure() — import as side-effect in _layout
    i18n/                  # LanguageProvider + translations (vi/en)
    security/              # Biometric auth, screen capture prevention, input validation
    constants/             # colors.ts, typography.ts
  assets/                  # Images, fonts
  MANHINH/                 # Pet evolution videos 1.mp4–5.mp4
  amplify_outputs.json     # Auto-generated per environment — do NOT edit manually
  package.json
  .npmrc                   # legacy-peer-deps=true
```

## Quick start

```bash
cd frontend
npm install                # --legacy-peer-deps is implicit via .npmrc
npm start                  # Start Metro bundler; scan QR with Expo Go
```

For a native dev build (required for biometric auth, which Expo Go sandboxes):

```bash
npm run android            # expo run:android
npm run ios                # expo run:ios
```

For web:

```bash
npm run web                # expo start --web
npm run build              # expo export --platform web → dist/
```

## Sub-sections

- [4.7.1 Expo Setup](/workshop/4.7.1-ReactNative) — project init, Amplify config, auth guard, routing.
- [4.7.2 UI Components](/workshop/4.7.2-UIComponents) — design tokens, tab structure, Zustand pattern, i18n, pet evolution.
- [4.7.3 Voice & Camera](/workshop/4.7.3-Voice-Camera) — camera capture → S3 → resizeImage → aiEngine, voice → Transcribe → food log.
