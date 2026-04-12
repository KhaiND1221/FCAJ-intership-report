# 4.8 ECS Deployment

The ECS Fargate tier runs a containerized FastAPI service alongside the serverless Amplify backend. It handles workloads that don't fit Lambda: long-running operations, custom ML inference, third-party API proxying, or tasks that benefit from a persistent process.

## Architecture

``![Architecture Diagram](/FCAJ-intership-report/workshop-images/4.1-Workshop-overview/architect_v3.drawio.png)``

Fargate tasks run in private subnets; the ALB sits in public subnets. Tasks reach AWS services via NAT Instance (70% cheaper than NAT Gateway) or the S3 Gateway VPCE (free).

## Cost breakdown

| Component | Estimated monthly cost |
| :--- | :--- |
| 2× NAT Instance `t4g.nano` | ~$9 |
| 2× Fargate Task (0.5 vCPU / 1 GB) | ~$17 |
| ALB | ~$16 |
| CloudWatch Logs (5 GB, 30 days) | ~$2 |
| **Total** | **~$44** |

Using NAT Gateway instead of NAT Instance adds ~$32/month (total ~$76).

The ECS tier makes sense when you need:

- Persistent WebSocket connections.
- More than 15 minutes of compute (Lambda max).
- A pre-warmed process to avoid Lambda cold starts on latency-sensitive paths.
- A familiar Python/FastAPI deployment model.

## Sub-sections

- [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) — Network design, VPC, Subnets, Security Groups, S3 VPCE.
- [4.8.2 Fargate & ALB](/workshop/4.8-Verify-Setup/4.8.2-Fargate-ALB) — ECS Cluster, Task Definition, Service, Load Balancer, JWT auth.
- [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure) — S3 Bucket, Secrets Manager, IAM Roles.
- [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance) — NAT Instance setup, Route Table wiring, HA with ASG.
