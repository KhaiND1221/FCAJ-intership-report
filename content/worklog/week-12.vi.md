### Mục tiêu Tuần 12

* Chốt hạ bản thiết kế Kiến trúc Serverless An toàn (Secure Architecture diagram) cuối cùng cho dự án.
* Biên soạn và trau chuốt Báo cáo Tổng kết Kỳ thực tập FCAJ Internship.
* Chuyển giao toàn quyền và quy trình quản lý rủi ro trên AWS lại cho nội bộ team NeuraX.
* Thuyết trình trọn vẹn màn tổng kết báo cáo vòng đời bảo mật.

### Các công việc thực hiện trong tuần

| Ngày | Công việc | Ngày Bắt Đầu | Ngày Hoàn Thành | Tài Liệu Tham Khảo |
| --- | --- | --- | --- | --- |
| 1 | - Khắc họa Kiến trúc Bảo mật <br>&emsp; + Xuất bản sơ đồ trực quan kết nối WAF, Cognito, và API Gateway <br>&emsp; + Tài liệu hóa mạch luân chuyển khóa mã hóa dữ liệu với AWS KMS | 23/03/2026 | 23/03/2026 | [Draw.io / Visio] |
| 2 | - Bàn giao Quản trị <br>&emsp; + Thuyết minh mô hình AWS Security Hub dashboard cho team dev <br>&emsp; + Bàn giao sổ tay Incident Response Playbook | 24/03/2026 | 24/03/2026 | [Họp Chuyển giao] |
| 3 | - Kiểm kê Tài chính <br>&emsp; + Check lại rổ chi phí đánh đổi (Price-to-performance) của bộ tool GuardDuty, Macie <br>&emsp; + Dọn dẹp và reset lại biểu đồ AWS Budgets | 25/03/2026 | 25/03/2026 | [Cost and Usage Management](https://000064.awsstudygroup.com) |
| 4 | - Soạn và Ghép Báo Cáo <br>&emsp; + Tổng hòa 12 bản báo cáo tuần lẻ tẻ thành văn bản Internship Report cuối cùng <br>&emsp; + Ghi lại cảm nhận dọc hành trình gò ép sang ngành Security | 26/03/2026 | 26/03/2026 | [Mẫu FCAJ] |
| 5 | - Hiệu đính Mentor <br>&emsp; + Đẩy bản phác thảo cuối cho Mentor đọc kiểm duyệt <br>&emsp; + Gia giảm lại lượng từ ngữ học thuật chuyên ngành theo lời khuyên | 27/03/2026 | 27/03/2026 | [Tài liệu Tương tác] |
| 6-7 | - Thuyết trình Bế mạc <br>&emsp; + Hoàn thành buổi trình diễn Đồ thị Sinh thái Bảo mật (Security Lifecycle) <br>&emsp; + Ăn mừng bế mạc chương trình Thực tập sinh FCJ | 28/03/2026 | 29/03/2026 | [Slide Deck] |

### Kết quả đạt được trong Tuần 12

* **Kiện toàn Vòng đời Bảo mật (Security Lifecycle):**
  * Nâng tầm một ý tưởng trên giấy dại khờ NeuraX trở thành một ứng dụng đánh thép chìm nổi, tuân thủ quốc tế. Triết lý phòng thủ chiều sâu (Defense-in-depth) tản đều khắp ba khía cạnh: Danh tính (Cognito/IAM), Cổng Ứng dụng (WAF) và Lưu trữ (KMS/Macie) đã được bàn giao chính thức.

* **Hoàn thiện Hồ sơ Di sản:**
  * Quy chuẩn hóa bộ quy tắc rào cản nền tảng. Hiện tại, anh em trong nhóm đã tường minh về ý thức **Trách nhiệm bảo mật chéo (Shared Responsibility Model)** khi dev hạ tầng Serverless.
  * Đồng bộ toàn diện dữ kiện WAF, Log tấn công và sửa lỗi thành công vào mốc Báo cáo Tổng kết cuối cùng này.

* **Trái ngọt Thực tập sinh:**
  * Đi hết 12 mốc thời gian vất vả thuộc đường đua First Cloud Journey. Lột xác thành công từ một lính mới cưỡi ngựa xem hoa các tab căn bản AWS trở thành một Cloud Security Engineer thực thụ.

### Thách thức & Bài học kinh nghiệm

* **Thách thức:**
  * Việc vắt ép 12 tuần ngập ngụa trong rừng log tấn công và ma trận rules WAF xuống thành một bài tập báo cáo ngắn gọn, dễ thẩm thấu cho cấp quản lý tốn cực nhiều chất xám.
  * Cần thao tác khéo để bàn giao rủi ro cho Dev, tránh trường hợp họ ngứa tay vào console tắt rules WAF hay xóa nhầm khóa KMS khiến hạ tầng sụp đổ.

* **Giải pháp:**
  * Thay vì kể lể "bấm nút này để bật GuardDuty", bài báo cáo đổi tông viết tập trung thẳng vào Giá trị Cốt lõi (Ví dụ: Thắng được vụ lộ data, đáp ứng quy chuẩn CIS).
  * Viết một bộ SCPs (Service Control Policies) đóng đinh từ tầng AWS Organizations cấm tiệt tuyệt đối hành động vô tình (hay cố ý) gỡ bỏ các linh kiện IAM/KMS cấu trúc.

* **Bài học:**
  * Bảo mật không phải là cái khóa ngoắc trên tường chờ ngày xét duyết. Nó là dòng sông luôn chảy không có điểm dừng. Những gì dàn dựng xuyên suốt 12 đọan tuần qua là một bến cảng, chúng phải liên tục nâng tầm cùng nhịp code ứng dụng.
  * Tài liệu đào tạo và phương thức ngoại giao trong Bảo Mật còn quan trọng hơn bản thân cái rào đó. Cả team mà không biết đọc log AWS, thì WAF cũng hóa đồ trang trí.

### Định hướng Tương lai

* Mặc dùng thời hạn báo cáo đã khép lại, tôi vẫn khát khao sử dụng những nhãn quan thực chiến quý báu này để cày cuốc chinh phục chứng chỉ quốc tế uy tín **AWS Certified Security - Specialty**.
* Mang những bài tủ khắc phục lỗ hổng dị hợm gặp phải đi giao lưu truyền dạy tiếp cùng cộng đồng AWS Study Group.
