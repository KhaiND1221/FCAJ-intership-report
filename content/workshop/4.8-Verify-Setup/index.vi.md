# 4.8 Triển Khai ECS

Tầng ECS Fargate chạy một FastAPI service containerized song song với Amplify serverless backend. Nó xử lý workload không phù hợp với Lambda: tác vụ dài, custom ML inference, proxy API bên thứ ba, hoặc cần tiến trình persistent.

## Kiến trúc

![Architecture Diagram](/FCAJ-intership-report/workshop-images/4.1-Workshop-overview/architect_v3.drawio.png)

Fargate task chạy trong private subnet; ALB nằm trong public subnet. Task tiếp cận AWS service qua NAT Instance (tiết kiệm 70% so với NAT Gateway) hoặc S3 Gateway VPCE (miễn phí).

## Lưu ý chi phí

| Thành phần | Chi phí ước tính/tháng |
| :--- | :--- |
| 2× NAT Instance `t4g.nano` | ~$9 |
| 2× Fargate Task (0.5 vCPU / 1 GB) | ~$17 |
| ALB | ~$16 |
| CloudWatch Logs (5 GB, 30 ngày) | ~$2 |
| **Tổng** | **~$44** |

So sánh: dùng NAT Gateway thay NAT Instance sẽ tốn thêm ~$32/tháng (tổng ~$76).

Tầng ECS có giá trị khi bạn cần:

- Kết nối WebSocket persistent.
- Hơn 15 phút compute (giới hạn Lambda).
- Tiến trình pre-warmed để tránh Lambda cold start.
- Mô hình triển khai Python/FastAPI quen thuộc.

## Các trang con

- [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) — Thiết kế mạng, VPC, Subnets, Security Groups, S3 VPCE.
- [4.8.2 Fargate & ALB](/workshop/4.8-Verify-Setup/4.8.2-Fargate-ALB) — ECS Cluster, Task Definition, Service, Load Balancer, JWT auth.
- [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure) — S3 Bucket, Secrets Manager, IAM Roles.
- [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance) — Setup NAT Instance, cập nhật Route Tables, HA với ASG.
