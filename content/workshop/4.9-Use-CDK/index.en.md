# 4.9 CI/CD — Amplify Multi-Environment

This phase wires the backend into Amplify Hosting's managed CI/CD and walks through the three environments NutriTrack ships with. There is no hand-written CDK or CodePipeline here — Amplify Gen 2 deploys directly from Git using `amplify.yml`.

## The Three Environments

NutriTrack runs three parallel Amplify backends. Each one has its own Cognito pool, AppSync API, DynamoDB tables, Lambda functions, and S3 bucket. The exact names come from the real deployment recorded in `CLAUDE.md` ([view](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/CLAUDE.md)).

| Environment            | Trigger                            | Lambda name prefix           | DynamoDB table suffix        |
| ---------------------- | ---------------------------------- | ---------------------------- | ---------------------------- |
| **Sandbox** (local)    | `npx ampx sandbox` from `backend/` | `amplify-nutritrack-tdtp2--` | `tynb5fej6jeppdrgxizfiv4l3m` |
| **Branch feat/phase3** | `git push origin feat/phase3`      | `amplify-d1glc6vvop0xlb-fe-` | `vic4ri35gbfpvnw5nw3lkyapki` |
| **Branch main**        | `git push origin main`             | `amplify-d1glc6vvop0xlb-ma-` | `2c73cq2usbfgvp7eaihsupyjwe` |

Every DynamoDB model (`Food`, `user`, `FoodLog`, …) exists three times, once per environment. A `FoodLog` row in sandbox is invisible to `main` and vice versa. This is the whole point — you can blow up sandbox without touching production.

### Why three?

- **Sandbox** is ephemeral, per-developer, and destroyed with `npx ampx sandbox delete`. Use it for iteration.
- **`feat/phase3`** is the shared integration environment. QA and mentors point the mobile app at this backend.
- **`main`** is production. Only merged, reviewed code lands here.

## The `amplify.yml` Build Spec

Amplify Hosting reads `amplify.yml` at the repo root. The real file ships at `amplify.yml` ([view](https://github.com/NeuraX-HQ/neurax-web-app/blob/main/amplify.yml)):

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - cd backend
        - npm install --legacy-peer-deps --include=dev

        - cd amplify/ai-engine
        - npm install --include=dev
        - cd ../..

        - cd amplify/process-nutrition
        - npm install --include=dev
        - cd ../..

        - cd amplify/friend-request
        - npm install --include=dev
        - cd ../..

        - cd amplify/resize-image
        - npm install --include=dev
        - cd ../..

        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID --outputs-out-dir ../frontend
        - cd ..
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend && npm install --legacy-peer-deps && cd ..
    build:
      commands:
        - cd frontend && npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - "**/*"
  cache:
    paths:
      - frontend/node_modules/**/*
      - frontend/.expo/**/*
      - backend/node_modules/**/*
      - backend/amplify/ai-engine/node_modules/**/*
      - backend/amplify/process-nutrition/node_modules/**/*
      - backend/amplify/friend-request/node_modules/**/*
      - backend/amplify/resize-image/node_modules/**/*
```

### Key things to notice

1. **Every Lambda subfolder has its own `package.json`.** The build spec enters each one and runs `npm install --include=dev` before the Amplify CLI bundles the function. If you add a fifth Lambda, you must add its `cd / npm install / cd ../..` block here, or the build will fail with "Cannot find module" at deploy time.
2. **`--legacy-peer-deps` is mandatory** for both `backend/` and `frontend/`. Expo SDK 54 + React 19 produces peer-dep conflicts that the default npm resolver rejects. This is enforced for the frontend in `frontend/.npmrc`.
3. **`npx ampx pipeline-deploy`** is the Gen 2 CI command. It reads `$AWS_BRANCH` and `$AWS_APP_ID` (injected by Amplify Hosting) and deploys the `backend/amplify/` CDK app into the environment's CloudFormation stack.
4. **`--outputs-out-dir ../frontend`** writes `amplify_outputs.json` next to the Expo app. The frontend build step then picks it up — no manual step required.
5. **`cache.paths`** keeps all seven `node_modules/` warm between builds. The first build of a branch is slow; subsequent builds are minutes, not tens of minutes.

## `amplify_outputs.json` — Never Commit Manual Edits

The Amplify CLI generates `frontend/amplify_outputs.json` on every deploy. It contains environment-specific ARNs, endpoints, and user pool IDs. You must:

- **Never hand-edit the file.** Your change will be wiped on the next `pipeline-deploy` or `npx ampx generate outputs`.
- **Never commit a sandbox version of it to `main`.** That would point the `main` frontend at sandbox resources.
- **Regenerate locally after backend changes** from `backend/`:

```bash
cd backend
npx ampx generate outputs --outputs-out-dir ../frontend
```

If you need environment-specific files committed (rare), use `.gitignore` to exclude `amplify_outputs.json` and have each developer generate their own.

## Sandbox Secrets

Secrets referenced by `backend.ts` — Google OAuth is the common one — are set per environment. For sandbox:

```bash
cd backend
npx ampx sandbox secret set GOOGLE_CLIENT_ID
npx ampx sandbox secret set GOOGLE_CLIENT_SECRET
```

For branch environments, go to **Amplify Console → your app → Hosting → Secrets** and set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` against the branch. Amplify injects them at deploy time; they are not stored in the repo.

List what sandbox currently has:

```bash
cd backend
npx ampx sandbox secret list
```

## Promotion Flow

The promotion path is strictly linear: sandbox → `feat/phase3` → `main`.

```mermaid
flowchart LR
  Dev[Developer laptop<br/>npx ampx sandbox] -->|commit + push| Feat[Branch: feat/phase3<br/>Amplify env: fe-]
  Feat -->|PR + merge| Main[Branch: main<br/>Amplify env: ma-]
  Main -->|Amplify Hosting| Prod[Production<br/>DynamoDB + AppSync + Lambda]
```

### Day-to-day loop

```bash
cd backend
npx ampx sandbox
```

Make changes. The sandbox watcher re-deploys on save. Run the Expo app locally against the sandbox `amplify_outputs.json`.

When the feature is stable:

```bash
git checkout feat/phase3
git merge my-feature-branch
git push origin feat/phase3
```

Amplify Hosting picks up the push and runs `amplify.yml` against the `feat/phase3` environment. Watch the build in **Amplify Console → your app → feat/phase3**.

When QA signs off:

```bash
git checkout main
git merge feat/phase3
git push origin main
```

Same flow, different environment. The `main` deploy uses the tables suffixed `2c73cq2usbfgvp7eaihsupyjwe`.

![Amplify Console build history](images/amplify-console-build-history.png)

## Verifying a Deploy

After a successful build:

1. Amplify Console shows **Provision → Build → Deploy → Verify** all green.
2. CloudFormation stacks in the region contain the new resources. Check with the command below.
3. Lambda function names for the branch should match the prefix in the table at the top of this page.
4. Run a smoke test against AppSync from the mobile client to confirm tokens issued by the new Cognito pool work.

```bash
aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE
```

If a deploy fails, read the Amplify Console log top-to-bottom. The most common failures are (a) missing `npm install` for a new Lambda folder and (b) Bedrock model access not granted in `ap-southeast-2` — the IAM policy in `backend.ts` will deploy, but runtime calls will fail with `AccessDeniedException`.

## Mobile CI/CD with EAS

While Amplify Hosting handles the web and backend pipeline, the native mobile app (`.apk` for Android, `.ipa` for iOS) is built and distributed through **EAS (Expo Application Services)** — Expo's managed cloud build service.

### EAS Build Profiles

EAS uses three build profiles defined in `eas.json` at the `frontend/` root:

| Profile | Build type | Target |
| --- | --- | --- |
| `development` | `developmentClient` | Developer devices — local sandbox testing |
| `preview` | `apk` / `ad-hoc` | QA team — internal distribution |
| `production` | `store` | App Store / Google Play submission |

#### Development

The `development` profile builds with `expo-dev-client`, which embeds a developer menu and allows the app to connect to your local Metro bundler. This is the profile you install on your own device when testing against `npx ampx sandbox`:

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

Build and install on a connected Android device:

```bash
cd frontend
eas build --profile development --platform android
```

EAS returns a download link for the `.apk`. Install it once — then run `npx expo start --dev-client` to connect it to your local Metro server for fast refresh without rebuilding.

#### Preview and Production

`preview` and `production` profiles enable **auto-increment versioning** — EAS reads the current `versionCode` / `buildNumber` and bumps it on every build so you never ship a duplicate version code:

```json
"preview": {
  "distribution": "internal",
  "android": { "buildType": "apk" }
},
"production": {
  "autoIncrement": true
}
```

**OTA (Over The Air) updates** via `expo-updates` let you push JavaScript bundle fixes to devices without going through the app store review cycle. After merging a JS-only fix to `main`:

```bash
eas update --branch production --message "Fix nutrition calculation"
```

Devices running the production build check for updates on next launch and apply the new bundle silently. OTA updates are limited to JavaScript changes — any native module addition requires a full EAS build and store submission.

### EAS vs Amplify Hosting

| Concern | Amplify Hosting | EAS |
| --- | --- | --- |
| Web dashboard build | ✅ | — |
| Backend (Lambda, DynamoDB) | ✅ | — |
| Android `.apk` / iOS `.ipa` | — | ✅ |
| OTA JS updates | — | ✅ |
| Secret management | Amplify Console Secrets | EAS Secrets |

Both pipelines run independently. A push to `main` triggers Amplify Hosting for the backend and web; EAS builds are triggered manually or via `eas build` in a separate CI workflow.

## Rollback

Amplify Hosting does not roll back CloudFormation stacks automatically across branches. To roll back `main`:

```bash
git revert <bad-commit-sha>
git push origin main
```

That triggers a fresh `pipeline-deploy` that brings the stack back to the previous state. DynamoDB data is not reverted — if the bad deploy wrote corrupt rows, you must fix them directly in DynamoDB.
