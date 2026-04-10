# 4.6.2 Realtime Subscriptions

Mỗi `a.model(...)` định nghĩa trong `data/resource.ts` tự động có ba GraphQL subscription — `onCreate`, `onUpdate`, `onDelete` — được AppSync expose mà không cần thêm code backend. Trang này trình bày cách NutriTrack sử dụng chúng, cách filter, và những điểm cần lưu ý.

## Những gì Amplify tạo miễn phí

Với mỗi model, Amplify phát ra ba subscription vào schema:

```graphql
type Subscription {
  onCreateFoodLog(filter: ModelSubscriptionFoodLogFilterInput, owner: String): FoodLog
  onUpdateFoodLog(filter: ModelSubscriptionFoodLogFilterInput, owner: String): FoodLog
  onDeleteFoodLog(filter: ModelSubscriptionFoodLogFilterInput, owner: String): FoodLog
  # ... tương tự cho Friendship, UserPublicStats, ChallengeParticipant, FridgeItem
}
```

Authorization theo quy tắc của model. Model với `allow.owner()` chỉ đẩy event đến client có owner xác thực khớp với trường `owner` của row — người dùng không bao giờ thấy row riêng của nhau qua subscription.

## Cách AppSync deliver

- Client mở một WebSocket long-lived đến `<appsync-endpoint>/graphql/realtime`.
- Mỗi lần gọi `.subscribe()` đăng ký một subscription trên kết nối đó kèm filter expression.
- DynamoDB Streams record trên bảng underlying kích hoạt AppSync invalidation.
- AppSync đánh giá subscription filter phía server và đẩy các row khớp đến từng client đã đăng ký.
- Khi mạng ngắt, Amplify JS client tự reconnect và đăng ký lại tất cả subscription đang active.

Bên dưới là MQTT-over-WebSocket. Từ code của bạn, bạn không cần biết điều đó — chỉ nhận được một Observable có type.

## Pattern sử dụng cơ bản

```tsx
import { useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';
import { useAuthStore } from '@/src/store/authStore';
import { useMealStore } from '@/src/store/mealStore';

const client = generateClient<Schema>();

export function useFoodLogRealtime() {
  const userId = useAuthStore((s) => s.userId);
  const addLog = useMealStore((s) => s.addLog);

  useEffect(() => {
    if (!userId) return;

    const sub = client.models.FoodLog.onCreate({
      filter: { owner: { eq: userId } },
    }).subscribe({
      next: (log) => addLog(log),
      error: (err) => console.error('[FoodLog.onCreate]', err),
    });

    return () => sub.unsubscribe();
  }, [userId]);
}
```

Ba điều cần chú ý:

1. Subscription được scope bởi filter — client chỉ nhận event cho row mà nó được phép thấy. Đây là defense in depth; AppSync vẫn enforce authorization.
2. `sub.unsubscribe()` phải được gọi trong cleanup của effect. Leak subscription qua các lần mount màn hình là lỗi production phổ biến nhất với API này — mỗi mount mở một server-side listener mới và tốn tiền thật.
3. Callback chạy trên JS thread. Giữ nhẹ — dispatch vào Zustand store, không làm việc nặng.

## NutriTrack dùng subscription ở đâu

| Luồng | Model | Event | Mục đích |
|---|---|---|---|
| Đồng bộ bữa ăn đa thiết bị | `FoodLog` | `onCreate`, `onDelete` | Người dùng log bữa trên điện thoại; cùng account trên máy tính bảng cập nhật ngay lập tức. |
| Thông báo friend request | `Friendship` | `onUpdate` | Khi user B chấp nhận request của A, row của A flip thành `accepted` và A nhận in-app notification. |
| Cập nhật leaderboard | `UserPublicStats` | `onUpdate` | Streak và pet score của bạn bè refresh live trên tab Battle. |
| Thông báo tham gia thử thách | `ChallengeParticipant` | `onCreate` | Người tạo thử thách thấy người tham gia mới xuất hiện khi họ opt in. |
| Tủ lạnh | `FridgeItem` | `onCreate`, `onUpdate`, `onDelete` | Tủ lạnh gia đình chung đồng bộ nhất quán qua các thiết bị. |

Mỗi luồng trên chỉ là vài dòng code client — không có resolver, Lambda, hay DynamoDB Streams handler nào cần duy trì.

## Thông báo chấp nhận friend

```tsx
useEffect(() => {
  if (!currentOwner) return;

  const sub = client.models.Friendship.onUpdate({
    filter: {
      owner: { eq: currentOwner },
      direction: { eq: 'sent' },
      status: { eq: 'accepted' },
    },
  }).subscribe({
    next: (friendship) => {
      showToast(`${friendship.friend_name} đã chấp nhận lời mời kết bạn`);
      useFriendStore.getState().refresh();
    },
    error: (err) => console.error('[Friendship.onUpdate]', err),
  });

  return () => sub.unsubscribe();
}, [currentOwner]);
```

Đây là phía client của luồng được khởi động bởi Lambda `friendRequest` trong 4.6.1. Khi Lambda flip row `sent` của user A thành `accepted` qua `TransactWriteItems`, AppSync nhận thay đổi DynamoDB và đẩy đến client đã đăng ký của A.

## Lưu ý về filter

- **Chỉ equality.** Filter subscription được tạo tự động hỗ trợ `eq`, `ne`, `in`, `notIn`, `contains`, `notContains`, `beginsWith`. Không hỗ trợ số học, `between` trên số, hay `and`/`or` lồng nhau phức tạp. Nếu cần filter phức tạp hơn, subscribe rộng hơn rồi filter phía client, hoặc thêm custom resolver với pipeline phát sự kiện.
- **Filter chạy phía server** — không tiết kiệm authorization (AppSync vẫn kiểm tra owner rules) nhưng tiết kiệm bandwidth và JS main thread.
- **`contains` trên array** hoạt động, nhưng khớp toàn giá trị chuỗi, không phải phần tử array riêng lẻ. Để kiểm tra array membership, denormalize thành scalar.

## Hành vi reconnect

Amplify JS client expose `ConnectionState` qua listener:

```typescript
import { CONNECTION_STATE_CHANGE } from 'aws-amplify/api';
import { Hub } from 'aws-amplify/utils';

Hub.listen('api', (data) => {
  if (data.payload.event === CONNECTION_STATE_CHANGE) {
    console.log('[AppSync] connection:', data.payload.data.connectionState);
  }
});
```

Các trạng thái bạn sẽ thấy: `Connecting` → `Connected` → (mất mạng) → `ConnectionDisrupted` → `Connecting` → `Connected`. Khi reconnect, client tự replay đăng ký subscription, code ứng dụng không cần biết socket đã chết.

Trường hợp ngoại lệ:

- Nếu app bị background trên iOS quá 30 giây, OS có thể kill WebSocket. Amplify client reconnect khi foreground, nhưng **bạn mất event xảy ra trong khoảng thời gian đó**. Reconcile khi resume bằng cách refetch query list liên quan.
- Android Doze mode hành xử tương tự. Cùng quy tắc reconciliation.

## Mô hình chi phí

Pricing AppSync có hai chiều liên quan đến subscription:

- **Real-time updates** — $2.00/triệu message delivered (ap-southeast-2, giá 2025; kiểm tra console để cập nhật).
- **Connection minutes** — $0.08/triệu phút kết nối mở.

Với NutriTrack ~1000 DAU:

- Mỗi user trung bình 4 phút/ngày connected và nhận ~20 event/ngày → dưới $1/tháng.
- Mỗi user connected 24/7 → ~$3.50/tháng/user. Tránh điều này.

Quy tắc giữ hóa đơn ổn định:

1. Unsubscribe khi màn hình unmount, luôn luôn.
2. Scope filter càng chặt càng tốt — subscribe `onCreate FoodLog` cho `owner: currentUser`, không phải toàn bộ FoodLog.
3. Không mở subscription từ component lồng sâu bị remount theo mỗi prop thay đổi — hoist lên screen root hoặc Zustand store initializer.

## Kiểm thử luồng subscription

Smoke test hai thiết bị là cách nhanh nhất xác nhận toàn bộ pipeline end-to-end:

1. Khởi động hai Expo client — điện thoại thật + simulator, hoặc hai simulator.
2. Đăng nhập cùng user account trên cả hai.
3. Trên thiết bị A, gọi `client.models.FoodLog.create({ ... })`.
4. Trên thiết bị B, subscription `onCreate` bắn. Nếu UI được kết nối đúng, log mới xuất hiện trong danh sách bữa ăn trong ~500 ms.
5. Xóa từ A; row biến mất trên B.

Nếu không nhận được gì trên B:

- Kiểm tra browser/Metro devtools xem có lỗi kết nối WebSocket không.
- Xác nhận cả hai client đang ở cùng sandbox/branch (môi trường Amplify tách biệt — subscription của `sandbox-A` không thấy ghi từ `sandbox-B`).
- Xác nhận authorization rule của model thực sự cho phép subscriber đọc row. Row với owner-auth chỉ được stream đến user sở hữu.

## Quay lại index

- [Section 4.6 — API & Social](/workshop/4.6-Automation-Setup)
- [4.6.1 — FriendRequest Lambda](/workshop/4.6.1-FriendRequest)
