### Mục tiêu Tuần 8

* Hoàn thành tất cả frontend pages và components.
* Triển khai upload ảnh và phân tích ảnh bữa ăn.
* Tích hợp frontend với tất cả backend APIs.
* Bắt đầu unit testing cho Lambda functions.

### Các nhiệm vụ thực hiện trong tuần

| Ngày | Nhiệm vụ | Ngày BĐ | Ngày HT | Tài liệu tham khảo |
| --- | --- | --- | --- | --- |
| 1 | - Dashboard Page <br>&emsp; + Tạo layout dashboard chính <br>&emsp; + Triển khai widget theo dõi calories hàng ngày <br>&emsp; + Thêm biểu đồ macro breakdown | 23/02/2026 | 23/02/2026 | [Dashboard UI] |
| 2 | - Meal Logging UI <br>&emsp; + Tạo form nhập bữa ăn <br>&emsp; + Triển khai component upload ảnh <br>&emsp; + Thêm autocomplete tìm kiếm thực phẩm | 24/02/2026 | 24/02/2026 | [Meal Log UI] |
| 3 | - Image Analysis Feature <br>&emsp; + Tích hợp Bedrock cho phân tích ảnh bữa ăn <br>&emsp; + Tạo preview ảnh với nutrition overlay <br>&emsp; + Xử lý edge cases (không phát hiện thức ăn) | 25/02/2026 | 25/02/2026 | [AI Features] |
| 4 | - Analytics Page <br>&emsp; + Xây dựng trends dinh dưỡng tuần/tháng <br>&emsp; + Tạo biểu đồ lịch sử calories <br>&emsp; + Thêm goal progress indicators | 26/02/2026 | 26/02/2026 | [Analytics UI] |
| 5 | - API Integration <br>&emsp; + Kết nối tất cả frontend components với backend <br>&emsp; + Triển khai loading states đúng cách <br>&emsp; + Thêm error handling và retry logic | 27/02/2026 | 27/02/2026 | [Integration Tests] |
| 6-7 | - Unit Testing <br>&emsp; + Viết unit tests cho Lambda functions <br>&emsp; + Đạt 75% code coverage <br>&emsp; + Sửa bugs phát hiện trong quá trình testing | 28/02/2026 | 01/03/2026 | [Test Reports] |

### Thành tựu Tuần 8

* **Frontend Pages:**
  * ✅ Dashboard với real-time nutrition tracking.
  * ✅ Meal logging với image upload.
  * ✅ Analytics với trends tuần/tháng.
  * ✅ Settings và profile pages.

* **AI Features:**
  * Phân tích ảnh bữa ăn hoạt động với 85%+ độ chính xác.
  * Gợi ý dinh dưỡng dựa trên mục tiêu người dùng.
  * Smart food search với các món ăn Việt Nam.

* **Testing:**
  * 75% unit test coverage cho Lambda functions.
  * Integration tests cho các user flows quan trọng.
  * 12 bugs đã sửa trong giai đoạn testing.

### Khó khăn & Bài học

* **Khó khăn:**
  * Image analysis đôi khi nhận diện sai món ăn Việt Nam.
  * Upload ảnh lớn gây ra timeout issues.

* **Cách giải quyết:**
  * Thêm ví dụ các món ăn Việt vào Bedrock prompt.
  * Triển khai nén ảnh phía client trước khi upload (max 1MB).

* **Bài học rút ra:**
  * Prompt engineering rất quan trọng cho độ chính xác theo locale.
  * Validation phía client ngăn chặn issues phía backend.

### Kế hoạch Tuần 9

* Hoàn thành end-to-end testing cho tất cả user flows.
* Thiết lập CloudWatch monitoring và alarms.
* Triển khai các tối ưu hóa hiệu năng.
* Sửa bugs còn lại và polish UI.
