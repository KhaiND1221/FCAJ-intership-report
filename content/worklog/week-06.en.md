### Week 6 Objectives

* Ensure Data at Rest and Data in Transit are encrypted across the NeuraX ecosystem.
* Manage and rotate cryptographic keys using AWS Key Management Service (KMS).
* Eliminate hard-coded secrets by implementing AWS Secrets Manager.
* Enforce strict S3 Security Best Practices for the NutriTrack meal image buckets.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Key Management Setup <br>&emsp; + Create Customer Managed Keys (CMK) in AWS KMS <br>&emsp; + Define Key Policies for access | 05/03/2026 | 05/03/2026 | [Encryption with AWS KMS](https://000033.awsstudygroup.com) |
| 2 | - DynamoDB & S3 Encryption <br>&emsp; + Apply KMS CMKs to NutriTrack's DynamoDB tables <br>&emsp; + Enforce default encryption on all S3 buckets | 06/03/2026 | 06/03/2026 | [AWS Sec Best Practices] |
| 3 | - Secrets Management <br>&emsp; + Store external API keys inside AWS Secrets Manager <br>&emsp; + Remove all plain-text secrets from Lambda Env Vars | 07/03/2026 | 07/03/2026 | [AWS Secrets Manager](https://000096.awsstudygroup.com) |
| 4 | - VPC Endpoints for S3 <br>&emsp; + Prevent Lambda traffic to S3 from traversing the public internet <br>&emsp; + Setup S3 Gateway VPC Endpoint | 08/03/2026 | 08/03/2026 | [Private Access to S3](https://000111.awsstudygroup.com) |
| 5 | - S3 Hardening <br>&emsp; + Enable S3 Block Public Access entirely <br>&emsp; + Implement S3 Bucket Policies restricting non-HTTPS requests (SecureTransport) | 09/03/2026 | 09/03/2026 | [S3 Security Best Practices](https://000069.awsstudygroup.com) |
| 6-7 | - Architecture Review <br>&emsp; + Validate encryption standards with the dev team <br>&emsp; + Ensure Lambda roles have `kms:Decrypt` access | 10/03/2026 | 11/03/2026 | [Architecture Draft] |

### Week 6 Achievements

* **Data Encryption Enforced:**
  * Created robust Customer Managed Keys using **AWS KMS** and successfully encrypted all persistent storage elements (DynamoDB and S3). The risk of data exposure through raw storage theft is mitigated.

* **Secrets Decoupling:**
  * Cleaned up the developer's infrastructure as code (IaC) templates. Hardcoded environment variables containing API tokens were removed and replaced with dynamic fetching from **AWS Secrets Manager**, reducing credential leakage risks in GitHub.

* **S3 Security Standardized:**
  * Sealed the NutriTrack meal image storage by enabling "Block Public Access". All intra-cloud S3 API calls from Lambda now safely traverse the AWS backbone network explicitly through **VPC Endpoints**, cutting off public internet exposure.

### Challenges & Lessons

* **Challenges:**
  * Lambda functions suddenly started throwing `AccessDeniedContext` errors after encrypting DynamoDB tables.
  * Developers experienced local testing failures because AWS SAM local didn't have the KMS Context permissions configured.

* **Solutions:**
  * Traced the KMS CloudTrail logs and discovered that the Lambda Execution Role lacked the `kms:GenerateDataKey` and `kms:Decrypt` permissions for the specific CMK. Added the permissions to resolve.
  * Guided the team to mock KMS integration dynamically during local unit testing.

* **Lessons Learned:**
  * Encryption changes the access paradigm: IAM access to the Data is no longer enough; the identity must also have KMS policy access to decrypt the data.
  * Utilizing Secrets Manager introduces a slight latency spike on the first Lambda cold start, but the security trade-off is absolutely necessary.

### Next Week Plan

* Progress into Continuous Security Monitoring.
* Activate **Amazon GuardDuty** for intelligent threat detection.
* Analyze **VPC Flow Logs** and set up specific CloudWatch Alarms for abnormal API behaviors within the NeuraX app.
