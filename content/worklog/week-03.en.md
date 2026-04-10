### Week 3 Objectives

* Complete Module 5.
* Assist teammates with lagging modules.
* Deep dive into Identity and Access Management constraints.
* Fix issues with outdated Free Tier architectures.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1-2 | - Lab 25: Amazon FSx File System <br>&emsp; + Re-programmed unsupported nodejs12.x Lambda runtime to nodejs20.x <br>&emsp; + Monitored disk throughput reaching 400MB via CloudWatch <br>&emsp; + Applied Deduplication and User Data Quotas <br> - Understand Shared Responsibility Model | 03/02/2026 | 04/02/2026 | [Lab 25](https://000025.awsstudygroup.com/) |
| 3 | - Module 5 Theory: Amazon Cognito, AWS Organizations, Identity Center (SSO), AWS KMS, Security Hub <br> - Lab 14: Import Custom VM to AMI (Failed unsupported kernel on Ubuntu 24.04, succeeded with Ubuntu 22.04) | 05/02/2026 | 05/02/2026 | [Lab 14 Part 1](https://000014.awsstudygroup.com/) |
| 4 | - Lab 14: Export custom EC2 back to .OVA format <br> - Lab 18: Activated AWS Security Hub and AWS Config | 06/02/2026 | 06/02/2026 | [Lab 14 Part 2](https://000014.awsstudygroup.com/) <br> [Lab 18](https://000018.awsstudygroup.com/) |
| 5 | - Lab 22: Lambda scripting to Auto-Start/Stop EC2 by tags (Slack webhook logging) <br> - Lab 28/30: Set up strict IAM Policies restricting access outside the `ap-southeast-1` region <br> - Lab 18 Result: Achieved 85% Security Score (Identified critical vulnerability: IAM User had raw Administrative Access) <br> - Lab 33: Explore KMS Key Management | 07/02/2026 | 07/02/2026 | [Lab 22](https://000022.awsstudygroup.com/) <br> [Lab 28](https://000028.awsstudygroup.com/) <br> [Lab 30](https://000030.awsstudygroup.com/) <br> [Lab 33](https://000033.awsstudygroup.com/) |
| 6-7 | - Lab 44: Time & IP based limits for IAM roles <br> - Lab 48: Deprecated access keys in favor of dynamic IAM Roles for EC2-S3 access <br> - Lab 12: Structuring AWS Organizations & Service Control Policies (SCPs) <br> - Microsoft Workload: AD troubleshooting & mounting volumes cross-instance | 08/02/2026 | 09/02/2026 | [Lab 44](https://000044.awsstudygroup.com/) <br> [Lab 48](https://000048.awsstudygroup.com/) |

### Week 3 Achievements

* **Runtime Adjustments:**
  * Fixed outdated architectural challenges (Lab 25) by migrating legacy Lambda runtime codes from `nodejs12.x` to actively supported `nodejs20.x` layers.

* **Advanced Storage:**
  * Handled enterprise storage deployments utilizing Amazon FSx, experimenting with User Quotas, continuous availability (CA), and tracking throughput spikes via CloudWatch.

* **Identity & Security Guardrails:**
  * Restrained broad account behavior through Service Control Policies (Lab 12), geographical restrictions limiting server execution strictly to Singapore (Lab 28 & 30).
  * Removed raw IAM Access Keys in favor of robust IAM Instance Profiles (Lab 48).

* **Auditing:**
  * Enabled AWS Security Hub (Lab 18). Mapped the current baseline configuration to a security score of 85%, flagging high-priority issues that required immediate attention (like root-level access policies).

### Challenges & Lessons

* **Challenges:**
  * VM Import/Export pipelines (Lab 14) are incredibly volatile to OS Kernel variations. Newer Ubuntu releases completely halted the import process, forcing a fallback to Ubuntu 22.04 LTS.

* **Lessons Learned:**
  * Just because you can do something in the console doesn't mean it's secure. Earning an 85% on Security Hub reminded me that applying "Least Privilege" is an active duty, not a default setting in AWS.

### Next Week Plan

* Progress fully into my project role as the **Cloud Security Engineer** for NeuraX.
* Establish AWS Cognito architectures specifically tailored for our app.
