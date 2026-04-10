### Mục tiêu Tuần 10

* Đảo bước tư duy từ Thiết kế Xây dựng sang Đánh chặn và Xâm nhập (Offensive Security).
* Triển khai chiến dịch Kiểm thử Xâm nhập (Penetration testing) nội bộ đánh thẳng vào hệ thống Serverless của NutriTrack.
* Thẩm định uy lực thực tế của kiến trúc Amazon Cognito và mạng rào AWS WAF.
* Khai phá và Ghi chú cặn kẽ các lỗ hổng tìm thấy tại tầng Ứng dụng.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Khởi tạo Môi trường Test <br>&emsp; + Cấp mới một bản sao môi trường (Staging environment) tách biệt <br>&emsp; + Setup Burp Suite làm cọc rào chặn luồng traffic (Proxy) | 02/04/2026 | 02/04/2026 | [Burp Suite Config Docs] |
| 2 | - Nhắm bắn vào Định danh & Phân quyền <br>&emsp; + Sửa đổi cắt ghép Token do Cognito cung cấp <br>&emsp; + Săn lỗi IDOR (Quyền tham chiếu đối tượng trực tiếp) tại API hồ sơ user | 03/04/2026 | 03/04/2026 | [OWASP Auth Testing] |
| 3 | ⭐ **SỰ KIỆN:** AWS Cloud Mastery 2 (ĐH FPT) <br>&emsp; - Bắn Code lên mây <br>&emsp; + Chốt cấu trúc `generate_coaching_tip()`. <br>&emsp; + Deploy qua Amplify. | 04/04/2026 | 04/04/2026 | [Amplify Fullstack Docs](https://docs.amplify.aws/gen2/deploy-and-host/fullstack-branching/) |
| 4 | - Lỗ hổng Logic API <br>&emsp; + Dò xét điểm yếu nghiệp vụ (Business Logic flaws) dính trên file code Lambda <br>&emsp; + Săn lỗi Phơi bày Thông tin dữ liệu nhạy cảm (Excessive Data Exposure) trên format trả về JSON | 05/04/2026 | 05/04/2026 | [REST API Security] |
| 5 | - Soi xét Đặc quyền Leo thang <br>&emsp; + Thẩm định chéo (Audit) tất cả IAM Roles của chuỗi Backend <br>&emsp; + Cảnh cáo các Policy cho phép kết nối `sts:AssumeRole` quá tùy tiện | 06/04/2026 | 06/04/2026 | [IAM Security Assessment] |
| 6-7 | - Xuất bản Báo cáo Xâm nhập <br>&emsp; + Tóm gọn đống tàn tích vào biên bản Vulnerability Assessment Report <br>&emsp; + Xếp hạng "màu cờ" ưu tiên sửa đổi theo khung điểm CVSS | 07/04/2026 | 08/04/2026 | [Vulnerability Score Matrix] |

### Kết quả đạt được trong Tuần 10

* **Xác thực Đạn Đạo (Offensive Validation):**
  * Mock Test thành công từ ngoài vào trong, cắt phăng qua từng vành đai: Phễu API Gateway, Lưới Cognito, Ruột Lambda và Tầng Đáy DB. 

* **Thám báo Lỗ hổng:**
  * Giác ngộ ra một kẽ hở IDOR thuộc tầm trung bình-nhẹ tại nhánh `GET /meals/{id}`. Nếu lanh tay đổi biến ID bằng dãy số người khác, hàm Lambda không tiến hành so khớp ID chủ thể mà trả thẳng raw data, gây dò dỉ thông tin chéo.
  * Đánh hơi thấy ứng dụng có thói quen trả về nguyên cục bã lỗi (verbose error traces) thay vì mã độc lập lúc nhận request lạ, tạo ngòi nổ "khai tâm" hạ tầng (Information disclosure).

* **Minh chứng của WAF:**
  * Phân đoạn lá chắn WAF mà tôi đã triển khai trước đó hạ đo ván hoàn toàn 100% rác payload phổ biến (SQLi/XSS). Kể cả tính năng Fuzzing tự động của máy Burp Suite cũng bị bẻ thẳng nhờ chế tài Rate Limits mạnh mẽ.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Nhét custom Certificate của Burp Suite can thiệp vào tầng mã hóa SSL là một chuỗi hành động cực kì dị tật với một đống bẫy lỗi ở local.
  * Khi API lỗi, phải mất sức đọc thẳng tới Source code tận tầng Lambda mới dám chắc nó là do hạ tầng sai thiết kế hay dev code hời hợt.

* **Giải pháp:**
  * Gọi Dev Frontend sang phá chung: Lệnh cho app Client nhắm mắt làm ngơ (Bypass SSL pinning) tạm thời dưới vỏ bọc nhánh code Staging để lấy đường móc nối traffic test.
  * Ngồi pair-coding trực tiếp cùng Backend Developer. Cùng nhau dò lại sự kiện của API Gateway chuyền xuống hàm query DB để khoanh vùng IDOR.

* **Bài học:**
  * Bảo mật không bao giờ là câu chuyện độc quyền của hạ tầng. WAF dựng tường đồng vách sắt, IAM thắt cổ chai tối đa... nhưng nếu logic code của Dev quên bước chặn kiểm định (Missing authorization check), ứng dụng vẫn sập hoàn toàn.
  * Bắn súng thử (Penetration testing) gỡ bỏ mọi hoang tưởng bọc đường rằng "chỉ cần bật tính năng bảo mật là xong".

### Kế hoạch Tuần 11

* Trả lại hiện thực "Phòng Thủ": Sang phase Chuẩn Đoán & Khắc Phục (Remediation).
* Vào hùa cùng nhóm Dev lập tức vá víu rò rỉ IDOR và dọn dẹp tin báo lỗi.
* Phác thảo và ban hành cẩm nang Phản Ứng Khẩn Cấp (Incident Response Playbook).
