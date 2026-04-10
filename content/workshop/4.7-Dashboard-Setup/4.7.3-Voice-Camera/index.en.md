# 4.7.3 Voice & Camera

Two of the three food-logging methods in NutriTrack use hardware inputs — camera and microphone. Voice logging calls `aiEngine` directly; camera logging routes through the dedicated `scanImage` Lambda, which proxies to ECS FastAPI for image analysis.

## Camera capture flow

### Permissions

`expo-camera` is configured via Expo's config plugin — no manual `Info.plist` / `AndroidManifest.xml` edits are needed. Request permission lazily on first camera open:

```tsx
import { CameraView, useCameraPermissions } from 'expo-camera';

export function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <View>
        <Text>Camera access is needed to log food photos.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />;
}
```

### Capture → S3 upload

```tsx
import { uploadData } from 'aws-amplify/storage';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';

async function captureAndUpload(cameraRef: React.RefObject<CameraView>, userId: string) {
  // 1. Capture photo
  const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
  if (!photo?.uri) throw new Error('Capture failed');

  // 2. Read as blob
  const blob = await FileSystem.readAsStringAsync(photo.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const binary = Uint8Array.from(atob(blob), (c) => c.charCodeAt(0));

  // 3. Upload to incoming/ — triggers resizeImage Lambda
  const fileId = randomUUID();
  const s3Key = `incoming/${userId}/${fileId}.jpg`;
  await uploadData({
    path: s3Key,
    data: binary,
    options: { contentType: 'image/jpeg' },
  });

  return s3Key;
}
```

### Wait and analyze

After the upload, `resizeImage` runs in the background (triggered by S3 ObjectCreated). Then call `scanImage` — the dedicated image-processing Lambda that proxies to ECS FastAPI:

```tsx
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify_outputs.json';

const client = generateClient<Schema>();

async function analyzePhoto(s3Key: string) {
  const res = await client.queries.scanImage({
    action: 'analyze-food',
    payload: JSON.stringify({ s3Key }),
  });
  const outer = JSON.parse(res.data ?? '{}');
  if (!outer.success) throw new Error(outer.error);
  return JSON.parse(outer.text); // ECS FastAPI nutrition JSON
}
```

The `s3Key` is the `incoming/` key — `scan-image` fetches it directly from S3 (the file is not gone yet; the lifecycle rule only expires it after 24 hours). The Lambda then forwards it to ECS FastAPI and polls for the result.

### Full camera flow

```text
User taps camera → request permission → CameraView fullscreen
  → user frames food → taps capture button
  → takePictureAsync()
  → uploadData() to incoming/{userId}/{uuid}.jpg
  → S3 ObjectCreated → resizeImage fires → media/{userId}/{uuid}.jpg written
  → client.queries.scanImage({ action: 'analyze-food', s3Key })
  → scan-image Lambda: S3 GetObject → JWT auth → POST /analyze-food (ECS)
  → ECS FastAPI: poll /jobs/{job_id} every 3 s → returns nutrition JSON
  → FoodDetailSheet slides up with nutrition card
  → user confirms → mealService.logMeal() → FoodLog.create() in DynamoDB
```

### UI patterns

- Fullscreen `CameraView` with a semi-transparent overlay and a centered shutter button.
- While uploading: show a progress spinner over the last captured frame.
- While `scanImage` is waiting for the ECS result: show a skeleton nutrition card with animated shimmer.
- On AI error: show a "Try again" button and a manual-entry fallback.

![Camera capture screen](images/camera-capture.png)

## Voice capture flow

### Mic permissions

`expo-av` handles recording; permissions are requested lazily:

```tsx
import { Audio } from 'expo-av';

async function requestMicPermission() {
  const { granted } = await Audio.requestPermissionsAsync();
  if (!granted) throw new Error('Microphone permission denied');
}
```

### Record → S3 upload

```tsx
import { Audio } from 'expo-av';
import { uploadData } from 'aws-amplify/storage';

let recording: Audio.Recording | null = null;

async function startRecording() {
  await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
  const { recording: rec } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  recording = rec;
}

async function stopAndUpload(userId: string): Promise<string> {
  if (!recording) throw new Error('No active recording');
  await recording.stopAndUnloadAsync();

  const uri = recording.getURI();
  if (!uri) throw new Error('No recording URI');

  const fileInfo = await FileSystem.getInfoAsync(uri);
  const blob = await fetch(uri).then((r) => r.blob());

  const fileId = randomUUID();
  const s3Key = `voice/${userId}/${fileId}.m4a`;

  await uploadData({
    path: s3Key,
    data: blob,
    options: { contentType: 'audio/m4a' },
  });

  return s3Key;
}
```

### Transcribe + AI parse

```tsx
async function voiceToFood(s3Key: string) {
  const res = await client.queries.aiEngine({
    action: 'voiceToFood',
    payload: JSON.stringify({ s3Key }),
  });
  const outer = JSON.parse(res.data ?? '{}');
  if (!outer.success) throw new Error(outer.error);

  const result = JSON.parse(outer.text);
  // result.action === 'log' | 'clarify'
  // result.food_data — nutrition object if action === 'log'
  // result.clarification_question_vi — follow-up prompt if action === 'clarify'
  return result;
}
```

Inside `aiEngine`, the Lambda starts an Amazon Transcribe job with `LanguageCode: 'vi-VN'`, polls for completion (up to 50 seconds), then feeds the transcript to Qwen3-VL via `VOICE_SYSTEM_PROMPT`. Qwen returns either `action: 'log'` with a full food JSON, or `action: 'clarify'` with a question (e.g., `"Phở bò hay phở gà nè?"`).

### Full voice flow

```text
User holds mic button → Audio.Recording starts
  → waveform animation plays
  → user releases → recording stops
  → uploadData() to voice/{userId}/{uuid}.m4a
  → client.queries.aiEngine({ action: 'voiceToFood', s3Key })
  → aiEngine: StartTranscriptionJob → poll → transcript
  → aiEngine: Qwen(VOICE_SYSTEM_PROMPT, transcript) → JSON
  → if action === 'log': show FoodDetailSheet
  → if action === 'clarify': show follow-up prompt, wait for user reply
  → user confirms → mealService.logMeal()
```

![Voice logging screen](images/voice-logging.png)

## Error states

| Error | User sees | Recovery |
| --- | --- | --- |
| Permission denied (camera/mic) | Explanation + settings link | Tap to open system settings |
| Upload fails | Toast: "Upload failed, try again" | Retry button; falls back to manual entry |
| `Transcription timed out` | Toast: "Voice not recognized" | Retry or switch to camera/manual |
| `aiEngine` returns `action: 'clarify'` | Follow-up question dialog | User types or re-records |
| Bedrock throttled | Toast: "AI busy, retrying…" | SDK retries with backoff; user sees spinner |

## Security notes

- Voice files uploaded to `voice/` are **not** automatically deleted after transcription (delete code is commented out in `aiEngine/handler.ts` to preserve debug ability). Implement a lifecycle rule on `voice/` or add a post-transcription delete if you need GDPR compliance.
- Camera uploads to `incoming/` are expired by lifecycle rule after 24 hours.
- S3 presigned URLs for `voice/` require the caller to be authenticated via Cognito (enforced by the storage access rule in `storage/resource.ts`).

## Cross-links

- [4.3.3 S3 Storage](/workshop/4.3.3-S3-Storage) — bucket prefixes and lifecycle rule on `incoming/`.
- [4.5.2 AIEngine](/workshop/4.5.2-AIEngine) — `analyzeFoodImage` and `voiceToFood` handler details.
- [4.5.4 ResizeImage](/workshop/4.5.4-ResizeImage) — what happens between S3 upload and `aiEngine` call.
