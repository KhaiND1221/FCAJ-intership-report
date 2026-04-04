### Mục tiêu Tuần 11

* Trực tiếp khắc phục và vá các lỗ hổng hệ thống khai quật được từ đợt Tấn công thử nghiệm Tuần 10.
* Thắt chặt logic lập trình phía Ứng dụng về việc đối chiếu phân quyền.
* Trau chuốt lại cấu hình phần cứng hạ tầng (WAF / API Gateway).
* Số hóa Cẩm nang Phản ứng Sự cố (Incident Response playbook) cho nội bộ team NeuraX.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Sàng lọc báo cáo Lỗ hổng <br>&emsp; + Định mức mức độ nguy hiểm và phân công ticket cho nhóm <br>&emsp; + Đặt lỗi IDOR lên mức độ khẩn cấp (Prioritized) | 16/03/2026 | 16/03/2026 | [Vulnerability Report] |
| 2 | - Xóa sổ nợ IDOR <br>&emsp; + Chèn ngầm logic đối chiếu Claim UUID của token Cognito với ID được truy vấn <br>&emsp; + Đan xen Unit Test để bắt hàm tự tát 403 khi ID không khớp | 17/03/2026 | 17/03/2026 | [AWS Lambda Auth context] |
| 3 | - Tường đồng Vách sắt API <br>&emsp; + Tiễn độ nhạy trả lỗi tận gốc (verbose tracebacks) từ API Gateway ra bãi rác <br>&emsp; + Thay bằng cấu trúc bọc "500 Internal Server Error" trung tính | 18/03/2026 | 18/03/2026 | [API Gateway Models] |
| 4 | - Tinh luyện rào WAF <br>&emsp; + Review lại đống log của WAF khi giả lập bị đánh Pen-test <br>&emsp; + Châm chước các dải IP đẩy code CI/CD tự động tránh chặn nhầm bằng tính năng Exclusion Rate Limits | 19/03/2026 | 19/03/2026 | [AWS WAF Console] |
| 5 | - Biên soạn Cẩm nang Tác chiến <br>&emsp; + Phác thảo Version 1 cho Cẩm nang phản ứng khẩn cấp (IR Playbook) <br>&emsp; + Diễn đạt step-by-step quy trình vô hiệu hóa lập tức một IAM/Cognito token nghi ngờ rò rỉ | 20/03/2026 | 20/03/2026 | [IR Playbook Template] |
| 6-7 | - Thẩm định kết quả (Re-test) <br>&emsp; + Y chang đợt test cũ, gọi trích xuất lỗ hổng lại lần nữa (Re-scan) và mò nhắm tay lại <br>&emsp; + Hoàn thiện chu trình giải quyết đóng Ticket mã độc | 21/03/2026 | 22/03/2026 | [Re-validation Logs] |

### Kết quả đạt được trong Tuần 11

* **Zero Tồn đọng Cấp thiết:**
  * Vá xong xuôi triệt đường hổng IDOR. Lớp code Backend Serverless hiện tại sẽ gắp thẳng thuộc tính `cognito:username` bảo mật cấp bởi JWT (đã pass chữ ký) để đấu chéo so sánh với URI Parameter cấp từ client. Triệt tiêu 100% tình trạng "đứa này lén dò dữ liệu đứa kia".

* **Bít cửa Hở Thông Tin:**
  * Vệ sinh thành công vỏ bọc trả lời của API Gateway. Mọi truy vấn dị dạng hay cú pháp sai lệch giờ đều trả chung một mẫu thông tin. Kẻ gian hết cơ hội lượm lặt đặc tả tên thư mục nội bộ (stack traces) thông qua màn hình báo ngáo.

* **Bản lề Tác chiến Trực trạm:**
  * Xuất bản Bộ cẩm nang V1 **NeuraX Incident Response Playbook**. Cả team hiện đều có Quy chế chung (SOP) kể rành rành về cách phong tỏa Lambda, cách lật trục Khóa mạ AWS KMS, và cắt cổ tài khoản nghi án Cognito ngay trong vài ba phút.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Cắt ghép logic bảo vệ giấu kín nhưng phải giữ vẹn toàn cấu trúc phản hồi frontend yêu cầu là việc rất phiềnái. Mở cái nọ dễ sập cái kia.
  * Việc vạch định ra một quy tắc Khắc phục hỏa tốc (IR) từ zero là quá tải đối với người chưa tiếp xúc với khung quy củ cấp doanh nghiệp.

* **Giải pháp:**
  * Tận dụng triệt để chức năng "Mapping templates" ảo diệu ngay thân API Gateway để chặn mút và lột vỏ nội dung error thô ráp từ Backend trước khi gởi đi báo client.
  * Tham vấn hệ thống biểu mẫu của viện SANS Institute, xào nấu lại thành bản rút gọn khớp lệnh với mảng AWS Serverless đặc hữu cho gọn gàng.

* **Bài học:**
  * Bản vá lỗi hiếm khi là món tự chơi tự chịu. Tụm đầu với đội Dev, phân giải rành rọt "Vì sao cái file mảng này phải đóng hộp" với thái độ tôn trọng là cách nhanh nhất để chốt sổ Ticket.
  * Bản đề án chuẩn bị tác chiến (IR) nếu cất ngăn bàn mà chưa bao giờ lôi quân ra đóng kịch diễn thử phản xạ... thì nó cũng chỉ làm mồi nhen lửa. Nhất quyết phải có một buổi Drill test sắp tới.

### Kế hoạch Tuần 12

* Cột gọn tàn dư của cả dự án!
* Khắc phác thảo lần cuối chốt hạ Kiến trúc Bảo mật (Secure Architecture Diagrams) hoành tráng nhất.
* Gom cục 12 tuần này đóng thành Báo Cáo Thực Tập vĩ mô và đi vào thuyết trình bế giảng.
