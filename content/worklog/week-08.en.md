### Week 8 Objectives

* Enforce Data Privacy controls over the NutriTrack user health and image data.
* Automate the discovery of exposed Personally Identifiable Information (PII) using Amazon Macie.
* Formalize the data backup and snapshot lifecycle policies to guarantee resilience.
* Mitigate ransomware risks via automated backup anomaly detection.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Data Privacy Management <br>&emsp; + Enable Amazon Macie across the account <br>&emsp; + Configure Macie to scan S3 buckets for sensitive PII | 23/02/2026 | 23/02/2026 | [Data Protection with Amazon Macie](https://000090.awsstudygroup.com) |
| 2 | - PII Discovery <br>&emsp; + Uploaded mock PII data (Names, Emails, Health statuses) to test buckets <br>&emsp; + Verified Macie findings report | 24/02/2026 | 24/02/2026 | [Macie PII Scan] |
| 3 | - Automated Backups <br>&emsp; + Implement Snapshot Automation with Amazon EBS Data Lifecycle Manager (DLM) <br>&emsp; + Define cross-region copy rules for disaster recovery | 25/02/2026 | 25/02/2026 | [Snapshot Automation](https://000088.awsstudygroup.com) |
| 4 | - Backup Anomaly Detection <br>&emsp; + Explore Anomaly Detection for EBS Backups <br>&emsp; + Learn mechanisms for locking backups against ransomware | 26/02/2026 | 26/02/2026 | [Anomaly Detection](https://000089.awsstudygroup.com) |
| 5 | - Compliance Reporting <br>&emsp; + Use AWS Backup to establish central policies for DynamoDB <br>&emsp; + Generate initial compliance reports for the Dev team | 27/02/2026 | 27/02/2026 | [Data Protection with AWS Backup](https://000013.awsstudygroup.com) |
| 6-7 | - Architecture Fine-tuning <br>&emsp; + Review Data Flow diagrams regarding PII handling <br>&emsp; + Update the team on required data anonymization prior to analytics | 28/02/2026 | 01/03/2026 | [Architecture Draft] |

### Week 8 Achievements

* **Data Privacy Secured:**
  * Adopted **Amazon Macie**, setting up continuous evaluation of our S3 data storage. We can now automatically detect if developers accidentally log plain-text user emails, phone numbers, or health credentials into the NutriTrack cloud storage.

* **Automated Resilience:**
  * Solidified the Disaster Recovery strategy by applying **AWS Backup** and **EBS Data Lifecycle Manager**. Database states are now snapped securely on a set schedule with cross-region replication activated, preventing data loss from unexpected outages.

* **Ransomware Mitigation:**
  * Enabled Anomaly Detection on our backups. If a malicious actor injects ransomware payload which encrypts our files prior to a snapshot, the system detects the anomaly pattern and immediately alerts the administrative team.

### Challenges & Lessons

* **Challenges:**
  * Initial Macie scans were financially taxing because they processed the *entire* historical bucket contents rather than just the new/changed files.
  * AWS Backup configurations struggled to tag resources appropriately to fall under the required backup vault policies.

* **Solutions:**
  * Configured Macie to only run automated targeted jobs scoped down to highly sensitive prefixes instead of evaluating completely raw, untagged images.
  * Enforced global Resource Tagging policies (e.g., `BackupPlan: Daily`) using AWS Organizations to guarantee resources were cleanly targeted.

* **Lessons Learned:**
  * Security tools like Macie are incredibly powerful but can become expensive if not scoped. Data classification (tagging what is Public, Internal, or Confidential) prior to scanning is necessary to manage costs effectively.
  * Backups are meaningless unless they are completely immutable and guarded against insider threats.

### Next Week Plan

* Step into Governance and Automating Security Postures at scale.
* Activate **AWS Security Hub** to aggregate security findings horizontally.
* Contrast our current setup against the **CIS AWS Foundations Benchmark**.
* Start preparing the final Security Penetration test for the NutriTrack backend.
