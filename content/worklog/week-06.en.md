### Week 6 Objectives

* Initialize the React Native (Expo Router) frontend project with file-based routing.
* Establish the connection between Frontend and Amplify Data (AppSync GraphQL).
* Collaboratively build the core tab navigation system with the development team.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Expo Router Initialization <br>&emsp; + Scaffolded project with file-based routing architecture in `app/` <br>&emsp; + Configured layout groups: `(tabs)/` for main UX, `(auth)/` for authentication | 05/03/2026 | 05/03/2026 | [Expo Router](https://expo.github.io/router) |
| 2 | - Dependency Resolution <br>&emsp; + Resolved persistent `npm install` failures caused by React Native peer dependency conflicts <br>&emsp; + Applied `--legacy-peer-deps` and pinned compatible library versions | 06/03/2026 | 06/03/2026 | [React Native Docs](https://reactnative.dev/docs/getting-started) |
| 3 | - AppSync Integration <br>&emsp; + Configured `Amplify.configure()` with the generated `amplify_outputs.json` <br>&emsp; + Verified GraphQL client connectivity using `generateClient<Schema>()` | 07/03/2026 | 07/03/2026 | [Amplify Data](https://docs.amplify.aws/gen2/build-a-backend/data/) |
| 4 | - Bottom Tab Navigation (with team) <br>&emsp; + Implemented the 5-tab layout: Home, Log, Kitchen, Coach, Profile <br>&emsp; + Configured tab bar icons and screen routing hierarchy | 09/03/2026 | 09/03/2026 | [Expo Tabs](https://docs.expo.dev/router/advanced/tabs/) |
| 5 | - Screen Scaffolding (with team) <br>&emsp; + Created placeholder screens for each tab module <br>&emsp; + Implemented shared header component and inter-screen navigation flow | 10/03/2026 | 10/03/2026 | - |
| 6 | - Android Emulator Validation <br>&emsp; + Configured `adb reverse tcp:8081 tcp:8081` for local Metro connectivity <br>&emsp; + Validated hot reload functionality and full navigation flow on emulator | 11/03/2026 | 11/03/2026 | - |

### Week 6 Achievements

* **Frontend Foundation:**
  * Expo Router project fully operational with clean file-based routing separation between main UX and auth flows.

* **Backend Connectivity:**
  * Frontend communicates with the Amplify backend via schema-typed GraphQL queries using `generateClient<Schema>()`.

* **Team Navigation:**
  * Collaboratively delivered the 5-tab bottom navigation system (Home, Log, Kitchen, Coach, Profile), establishing the core user journey for NutriTrack.

### Challenges & Lessons

* **Challenges:**
  * React Native dependency conflicts caused repeated `npm install` failures. Multiple libraries required specific React versions that clashed with Expo SDK.
* **Solutions:**
  * Used `--legacy-peer-deps` flag consistently and pinned specific library versions in `package.json`.
* **Lessons Learned:**
  * React Native dependency management requires patience. Always use `--legacy-peer-deps` and verify compatible version ranges before adding new packages. Building core UI collaboratively ensures shared architectural understanding.

### Next Week Plan

* Build the complete Authentication UI (Sign Up, Sign In, OTP).
* Integrate Amazon Cognito (Email OTP + Google OAuth).
* Begin initial security testing of the auth flow.
