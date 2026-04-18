# Cloud Mastery 3

**Ngày:** 11 tháng 4, 2026
**Địa điểm:** Hội trường A - Đại học FPT TP.HCM, TP. Hồ Chí Minh
**Vai trò:** Người tham dự (FCJ Cloud Intern - Team NeuraX)

## Mô tả sự kiện

Sự kiện "Cloud Mastery 3" là buổi meetup cuối cùng trong chuỗi chương trình Cloud Mastery. Buổi chia sẻ tập trung chuyên sâu vào các dịch vụ mạng (Networking) và bảo mật (Security) trên AWS, giúp các thực tập sinh và nhà phát triển xây dựng hệ thống phân quyền an toàn, tối ưu chi phí hạ tầng mạng và bảo vệ ứng dụng khỏi các cuộc tấn công từ bên ngoài.

## Các hoạt động chính

Sự kiện được chia thành 3 phiên trình bày kỹ thuật với các chủ đề từ hạ tầng mạng, quản lý quyền truy cập đến tường lửa ứng dụng:

**Phiên 1: VPC Networking - NAT Gateway, Security Group & NACL**  
Phân tích chi tiết về luồng dữ liệu mạng. Giải thích cơ chế cấp phát cổng tạm thời (ephemeral ports từ 1024-65535) của NAT Gateway và sự khác biệt giữa Zonal/Regional NAT. Đặc biệt, đi sâu vào việc so sánh Security Group (Stateful, gắn ở tầng mạng ENI, tự động nhớ trạng thái kết nối) và Network ACL (Stateless, gắn ở tầng Subnet, tuân thủ nghiêm ngặt các rule đánh số từ thấp đến cao và hỗ trợ cả rule Allow/Deny).

**Phiên 2: IAM Deep Dive, SSO & SCP**  
Tập trung vào Quản lý danh tính và quyền truy cập (IAM). Nhấn mạnh các best practices như nguyên tắc đặc quyền tối thiểu (least privilege), tránh sử dụng wildcard `*`, và thiết lập MFA. Giới thiệu các khái niệm nâng cao như AWS IAM Identity Center (SSO trước đây) để đăng nhập một lần, phân biệt sự khác nhau giữa Permission Boundaries (chỉ định quyền cho user/role) và SCP - Service Control Policies (đóng vai trò như "biển báo giao thông" giới hạn quyền tối đa trong toàn tổ chức AWS Organizations).

**Phiên 3: Application Security & AWS Firewalls**  
Giải quyết bài toán về bảo mật khi mở rộng hệ thống (scale) nhằm tránh bị tiêu tốn hàng chục ngàn đô la do bot hoặc hacker tấn công (như DDoS). Trình bày 4 dịch vụ cốt lõi: AWS WAF (đứng trước CloudFront/ALB để lọc SQL Injection, XSS), AWS Shield (chống DDoS), AWS Network Firewall (kiểm soát luồng Inbound/Outbound ở tầng VPC) và AWS Firewall Manager (quản lý tập trung các rule bảo mật cho nhiều tài khoản trong doanh nghiệp).

## Kết quả

- **Thiết lập tường lửa đa lớp:** Nắm rõ cách kết hợp Security Group để bảo vệ ở mức máy chủ và Network ACL để chặn/mở luồng mạng ở mức Subnet.
- **Quản lý Credentials an toàn:** Hạn chế tối đa việc tạo và sử dụng các Long-term Access Key. Chuyển sang sử dụng Short-term credentials thông qua STS và SSO để tự động hết hạn session, bảo vệ tài nguyên khi bị lộ khóa.
- **Tránh rò rỉ bảo mật chí mạng:** Hiểu được mức độ nguy hiểm của việc commit file `.env` (chứa secret key) lên các nền tảng như GitHub, có thể dẫn đến việc hacker cướp quyền và tống tiền (Ransomware) hoặc đào coin.
- **Bảo vệ chi phí Scale:** Nhận thức được việc ứng dụng tự động mở rộng (Auto Scaling) là con dao hai lưỡi nếu không có AWS WAF và Shield đứng trước chặn các bad request, dẫn đến hóa đơn AWS tăng đột biến do bị DDoS tấn công tầng ứng dụng.
