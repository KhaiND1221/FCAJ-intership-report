### Week 3 Objectives

* Complete Module 5: Security services theory (Cognito, Identity Center, KMS, Security Hub).
* Gain hands-on experience with AWS IAM policies, Permission Boundaries, and geographic restrictions.
* Activate AWS Security Hub and establish the first security baseline assessment.
* Assist teammates with lagging lab modules.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1-2 | - Lab 25: Amazon FSx File System <br>&emsp; + Re-programmed unsupported nodejs12.x Lambda runtime to nodejs20.x <br>&emsp; + Monitored disk throughput reaching 400MB via CloudWatch <br>&emsp; + Applied Deduplication and User Data Quotas <br> - Understand Shared Responsibility Model | 03/02/2026 | 04/02/2026 | [Lab 25](https://000025.awsstudygroup.com/) |
| 3 | - Module 5 Theory: Amazon Cognito, Identity Center (SSO), AWS KMS, Security Hub <br> - Lab 14: Import Custom VM to AMI (Failed unsupported kernel on Ubuntu 24.04, succeeded with Ubuntu 22.04) | 05/02/2026 | 05/02/2026 | [Lab 14 Part 1](https://000014.awsstudygroup.com/) |
| 4 | - Lab 14: Export custom EC2 back to .OVA format <br> - Lab 18: Activated AWS Security Hub and AWS Config | 06/02/2026 | 06/02/2026 | [Lab 14 Part 2](https://000014.awsstudygroup.com/) <br> [Lab 18](https://000018.awsstudygroup.com/) |
| 5 | - Lab 22: Lambda scripting to Auto-Start/Stop EC2 by tags (Slack webhook logging) <br> - Lab 28/30: Set up strict IAM Policies restricting access outside the `ap-southeast-1` region <br> - Lab 18 Result: Achieved 85% Security Score (Identified critical vulnerability: IAM User had raw Administrative Access) <br> - Lab 33: Explore KMS Key Management | 07/02/2026 | 07/02/2026 | [Lab 22](https://000022.awsstudygroup.com/) <br> [Lab 28](https://000028.awsstudygroup.com/) <br> [Lab 30](https://000030.awsstudygroup.com/) <br> [Lab 33](https://000033.awsstudygroup.com/) |
| 6 | - Lab 44: Time & IP based limits for IAM roles <br> - Lab 48: Deprecated access keys in favor of dynamic IAM Roles for EC2-S3 access <br> - Microsoft Workload: AD troubleshooting & mounting volumes cross-instance | 09/02/2026 | 09/02/2026 | [Lab 44](https://000044.awsstudygroup.com/) <br> [Lab 48](https://000048.awsstudygroup.com/) |

### Week 3 Achievements

* **Runtime Modernization:**
  * Migrated legacy Lambda runtime from `nodejs12.x` to `nodejs20.x` to complete Lab 25 (Amazon FSx).

* **Enterprise Storage:**
  * Deployed Amazon FSx with User Quotas, continuous availability, and CloudWatch throughput monitoring (400MB spike).

* **Identity & Access Guardrails:**
  * Applied geographic IAM restrictions limiting operations to `ap-southeast-1` (Lab 28/30).
  * Replaced static Access Keys with IAM Instance Profiles (Lab 48).
  * Configured time & IP-based role constraints (Lab 44).

* **Security Auditing:**
  * Enabled AWS Security Hub (Lab 18), achieving an 85% security score — identified critical finding: an IAM User with raw Administrative Access.

### Challenges & Lessons

* **Challenges:**
  * VM Import/Export pipelines (Lab 14) failed on Ubuntu 24.04 due to unsupported kernel, forcing a fallback to Ubuntu 22.04 LTS.
  * Received a warning that enabling AWS Organizations would forfeit Free Tier benefits, so Lab 12 (SCPs) was skipped to protect the team's budget.
* **Lessons Learned:**
  * Security Hub reveals the true security posture — Least Privilege is an ongoing discipline, not a default setting.
  * Always verify OS kernel compatibility before VM import operations, and check Free Tier implications before enabling organization-level services.

### Next Week Plan

* Study AWS WAF, CloudFront, Route 53, and Amazon Bedrock.
* Prepare the security and networking knowledge required for the NutriTrack project.
