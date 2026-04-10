# 4.2 Điều kiện tiên quyết

Trang này là một checklist. Đừng bỏ qua. Bỏ sót một mục — đặc biệt là quyền truy cập Bedrock — có thể khiến cả workshop dừng 24 giờ chờ AWS phê duyệt.

## Yêu cầu tài khoản AWS

### 1. Tài khoản AWS còn hoạt động, có quyền admin

Bạn cần một tài khoản AWS có thể:

- Tạo IAM user và role.
- Tạo bảng DynamoDB, Lambda function, AppSync API, S3 bucket, Cognito user pool, ECS cluster.
- Đăng ký truy cập model trên Bedrock.

Cho workshop này, dùng tài khoản root hoặc một IAM user có managed policy `AdministratorAccess`. **Không** dùng tài khoản read-only hay sandbox hạn chế — nhiều bước sẽ lỗi do permission boundary.

### 2. Truy cập Mô hình Amazon Bedrock

Amazon Bedrock hiện cho phép người dùng truy cập trực tiếp các mô hình có sẵn mà không yêu cầu đăng ký trước. Để tích hợp và sử dụng các mô hình AI của Bedrock trong mã nguồn của bạn, hãy thực hiện theo hướng dẫn sau:
1.  **Xác định Mã định danh Mô hình (Model ID)**: Chọn mô hình Bedrock bạn muốn sử dụng và ghi nhận mã định danh duy nhất của nó.
2.  **Sử dụng Thư viện Boto3**: Tích hợp thư viện `boto3` (AWS SDK for Python) vào dự án của bạn để thiết lập kết nối và gọi các API của Bedrock, truyền vào mã định danh mô hình đã xác định để tương tác và gửi yêu cầu đến mô hình.

![Bedrock model access granted for Qwen3-VL](/FCAJ-intership-report/workshop-images/4.2-Prerequiste/take_Id_model.png)

IAM policy được gắn vào Lambda `ai-engine` trong `backend/amplify/backend.ts` chỉ cấp quyền `bedrock:InvokeModel` trên đích danh ARN của mô hình này:

```text
arn:aws:bedrock:ap-southeast-2::foundation-model/qwen.qwen3-vl-235b-a22b
```

### 3. Cảnh báo AWS Budgets

Trước khi chạy bất kỳ lệnh nào, tạo một budget để Bedrock không làm bạn bất ngờ:

- **AWS Console → Billing → Budgets → Create budget**.
- Cost budget, hằng tháng, ngưỡng **$25 USD**, cảnh báo ở 50%, 80%, 100%.

## Công cụ local

Cài các công cụ sau lên máy. Các phiên bản liệt kê là mức tối thiểu đã test với codebase.

| Công cụ                                          | Phiên bản tối thiểu | Dùng cho                                        |
| ------------------------------------------------ | ------------------- | ----------------------------------------------- |
| Node.js                                          | **22 LTS** trở lên  | Chạy `ampx` CLI, build Lambda, Expo             |
| npm                                              | **10+**             | Cài package (đi kèm Node 20+)                   |
| AWS CLI                                          | **v2**              | Cấu hình credential, thao tác CloudFormation/S3 |
| Git                                              | **2.40+**           | Clone template, push branch cho CI              |
| Docker Desktop                                   | **bản stable mới**  | Build image FastAPI cho ECS                     |
| Expo Go (điện thoại) hoặc Android Studio / Xcode | mới nhất            | Chạy mobile client                              |

### Kiểm tra phiên bản

```bash
node --version
npm --version
```

```bash
aws --version
docker --version
```

```bash
git --version
```

Cả năm lệnh phải in ra kết quả không lỗi. Node phải báo **v22.x trở lên**.

### AWS CLI profile

Cấu hình một profile để Amplify CLI và các lệnh `aws` trong phần cleanup dùng:

```bash
aws configure --profile nutritrack
aws sts get-caller-identity --profile nutritrack
```

Export `AWS_PROFILE=nutritrack` trong shell mà bạn chạy `npx ampx sandbox`, hoặc set trong shell profile.

## Google Cloud Console — OAuth Client

Cognito federate sang Google cho đăng nhập xã hội. Bạn cần một OAuth 2.0 Web client của Google.

1. Mở [Google Cloud Console](https://console.cloud.google.com/) và tạo (hoặc dùng lại) một project.
2. Vào **APIs & Services → OAuth consent screen**. Cấu hình consent screen **External** với email của bạn làm test user.
3. Vào **APIs & Services → Credentials → Create credentials → OAuth client ID**.
4. Application type: **Web application**.
5. Authorized redirect URIs: bạn sẽ thêm URL callback của Cognito Hosted UI sau khi phần 4.3 tạo user pool. Tạm thời để trống — bạn sẽ quay lại.
6. Copy lại **Client ID** và **Client secret**.

![Google OAuth Web client credentials](/FCAJ-intership-report/workshop-images/4.2-Prerequiste/image.png)

Sau này, lưu chúng thành Amplify sandbox secret (chạy trong `backend/`):

```bash
cd backend
npx ampx sandbox secret set GOOGLE_CLIENT_ID
npx ampx sandbox secret set GOOGLE_CLIENT_SECRET
```

Tên secret `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` được tham chiếu trong `backend/amplify/auth/resource.ts` — không đổi tên.

## Kiến thức tiên quyết

Bạn không cần là chuyên gia ở các lĩnh vực dưới đây, nhưng nên đọc và chỉnh code được mà không phải tra cú pháp cơ bản.

- **TypeScript** — toàn bộ backend và frontend là TypeScript. Bạn nên nắm type, generic cơ bản, và `async/await`.
- **Thao tác AWS Console** — biết đổi region, tìm service, đọc CloudWatch log.
- **GraphQL (nên có)** — Amplify Data sinh schema GraphQL. Bạn không cần viết resolver, nhưng đọc hiểu query sẽ thuận lợi hơn.
- **React Native (tùy chọn)** — app Expo chạy nguyên trạng. Có kinh nghiệm giúp bạn tùy chỉnh màn hình dễ hơn.

## Cảnh báo chi phí

Bedrock tính tiền theo input và output token. Chạy full workshop, bao gồm vài chục lần gọi AI để smoke test, tốn khoảng **$1 đến $5 USD** tiền Bedrock. ECS Fargate tính theo giờ lẻ khi cluster đang chạy. Những thứ còn lại (DynamoDB on-demand, AppSync, Lambda, S3) nằm gọn trong free tier cho một ngày dev nhẹ.

Nếu bạn dừng ở phần 4.10 Cleanup trong cùng ngày, tổng hóa đơn AWS thường dưới **$10 USD**. Nếu để tài nguyên chạy cả tháng, dự kiến **$50 đến $150 USD** tùy mức độ sử dụng AI.

## Sẵn sàng?

Khi mọi mục phía trên đã xong — Bedrock đã được cấp quyền, CLI đã cài, OAuth client của Google đã tạo, budget alert đã bật — tiếp tục sang [4.3 Foundation Setup](../4.3-Foundation-Setup/).
