### Week 7 Objectives

* Build continuous visibility into the NeuraX infrastructure for potential attacks.
* Deploy Amazon GuardDuty for Machine Learning-backed threat detection.
* Monitor internal network activity using VPC Flow Logs.
* Establish automated alerts via Amazon SNS and CloudWatch Alarms.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Threat Detection Initialization <br>&emsp; + Enable AWS GuardDuty across the specific AWS account <br>&emsp; + Monitor baseline resource behavior | 16/02/2026 | 16/02/2026 | [Threat Detection with GuardDuty](https://000098.awsstudygroup.com) |
| 2 | - Network Visibility <br>&emsp; + Enable VPC Flow Logs for the primary backend VPC <br>&emsp; + Push Flow Logs data to CloudWatch | 17/02/2026 | 17/02/2026 | [Network Monitoring with VPC Flow Logs](https://000074.awsstudygroup.com) |
| 3 | ⭐ **EVENT:** AWS Cloud Mastery 1 <br>&emsp; - Advanced Output Formatting <br>&emsp; + Forced Sonnet to return a structured JSON array of recipes including `macros`, `steps`, and `why_this`. | 18/02/2026 | 18/02/2026 | - |
| 4 | - Alerting Systems <br>&emsp; + Setup Amazon Simple Notification Service (SNS) topics <br>&emsp; + Connect SNS to our internal NeuraX Discord webhook | 19/02/2026 | 19/02/2026 | [Messaging Systems with SNS](https://000077.awsstudygroup.com) |
| 5 | - Security Triggers <br>&emsp; + Configure EventBridge rules to route GuardDuty high-severity findings to SNS <br>&emsp; + Set CloudWatch alarms for an unusual number of 4xx/5xx API Gateway errors | 20/02/2026 | 20/02/2026 | [CloudWatch Advanced Workshop](https://000036.awsstudygroup.com) |
| 6-7 | - Penetration Demo <br>&emsp; + Simulated unusual API calls (Port scanning/Brute force) from an external IP <br>&emsp; + Verified alerts triggering | 21/02/2026 | 22/02/2026 | [Internal Testing] |

### Week 7 Achievements

* **Proactive Security Awareness:**
  * Adopted **Amazon GuardDuty**. Our AWS environment is now continually monitored against compromised credentials, abnormal API data exfiltration, and malicious IP communications without needing custom-built agents.
  * Achieved 100% visibility into network traffic hitting our subnets through **VPC Flow Logs**, enabling the team to detect lateral movement or unauthorized SSH attempts.

* **Real-time Incident Communication:**
  * Successfully piped security events directly from AWS EventBridge to SNS, which perfectly triggers messages into our NeuraX Discord channel. Discovered threats are no longer buried in log screens.

### Challenges & Lessons

* **Challenges:**
  * GuardDuty requires an extended learning period to establish a baseline. Generating meaningful test findings was difficult because it categorizes "safe" test-traffic properly.
  * VPC Flow Logs generate an enormous amount of data, blowing up CloudWatch storage costs during the first 24 hours.

* **Solutions:**
  * Utilized GuardDuty's built-in "Generate Sample Findings" feature to ensure the EventBridge/SNS integration was functioning without needing to actually compromise the platform.
  * Changed the VPC Flow Logs destination from CloudWatch directly to Amazon S3 with an aggregation interval to optimize the retention cost.

* **Lessons Learned:**
  * Too much telemetry without filtering is just noise. Tuning the severity limits before pushing alerts to Discord is critical to avoid "alert fatigue" among the development team.

### Next Week Plan

* Drill down into the specific privacy concerns of medical/fitness data.
* Set up **Amazon Macie** to evaluate S3 bucket privacy patterns.
* Conduct Data Anomaly Detection on our stored backups.
