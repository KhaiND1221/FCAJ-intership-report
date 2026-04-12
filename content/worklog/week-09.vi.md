### Mục tiêu Tuần 9

* Kiểm thử chức năng toàn diện Camera, Voice, và Food Card do DEV team deliver.
* Góp ý cải thiện UI/UX cho trải nghiệm Camera scan.
* Thực hiện pentest nhắm vào cơ chế S3 presigned URL.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Kiểm thử tính năng Camera <br>&emsp; + Kiểm tra luồng chụp ảnh, độ tin cậy upload S3, và pipeline xử lý ảnh <br>&emsp; + Ghi nhận edge cases: hiệu năng thiếu sáng, xử lý xoay ảnh | 26/03/2026 | 26/03/2026 | [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/) |
| 2 | - Kiểm thử tính năng Voice <br>&emsp; + Xác nhận chất lượng ghi âm, upload S3 cho AWS Transcribe xử lý <br>&emsp; + Test giọng nói song ngữ (Tiếng Việt và Tiếng Anh) | 27/03/2026 | 27/03/2026 | [AWS Transcribe](https://docs.aws.amazon.com/transcribe/) |
| 3 | - Đánh giá UI Food Card <br>&emsp; + Kiểm tra hiển thị kết quả dinh dưỡng: calories, protein, carbs, fat <br>&emsp; + Đánh giá độ chính xác dữ liệu và sự rõ ràng trong trình bày | 28/03/2026 | 28/03/2026 | - |
| 4 | - Góp ý Cải thiện UX Camera <br>&emsp; + Tổng hợp đề xuất UX chi tiết: luồng chụp, chất lượng preview, cơ chế crop, tương tác xác nhận <br>&emsp; + Đề xuất cải tiến UI overlay scan và hướng dẫn chỉ dẫn | 30/03/2026 | 30/03/2026 | - |
| 5 | - Pentest #2: Bảo mật S3 Presigned URL <br>&emsp; + Test lỗ hổng bypass bucket policy <br>&emsp; + Kiểm tra giới hạn đường dẫn upload và kiểm soát quyền cấp object | 31/03/2026 | 31/03/2026 | [S3 Security Best Practices](https://000069.awsstudygroup.com) |
| 6 | - Báo cáo Feedback Tổng hợp <br>&emsp; + Tập hợp tất cả findings UI/UX và quan sát bảo mật vào báo cáo có cấu trúc <br>&emsp; + Gửi bug report ưu tiên và đề xuất cải thiện cho DEV team | 01/04/2026 | 01/04/2026 | - |

### Kết quả đạt được trong Tuần 9

* **Xác nhận Tính năng Hoàn chỉnh:**
  * Cả 3 tính năng AI cốt lõi (Camera, Voice, Food Card) được verify về chức năng đúng đắn và chất lượng trải nghiệm người dùng.

* **Đóng góp UI/UX:**
  * Cung cấp feedback thiết thực trực tiếp ảnh hưởng đến cải thiện UX Camera scan.

* **Bảo mật S3 Xác nhận:**
  * Cơ chế presigned URL được xác nhận — đường dẫn upload giới hạn đúng cách và bucket policies thực thi quyền tối thiểu.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Độ chính xác nhận diện giọng nói thay đổi đáng kể giữa môi trường yên tĩnh và ồn ào.
* **Bài học:**
  * QA phải bao phủ điều kiện thực tế, không chỉ lý tưởng. Kiểm thử bảo mật storage endpoints quan trọng không kém API-level testing.

### Kế hoạch Tuần 10

* Thực hiện pentest sâu vào backend serverless NutriTrack.
* Hoàn thành sơ đồ kiến trúc NutriTrack toàn diện.
* Nộp project deliverables.
