### Week 9 Objectives

* Aggregate all distributed security signals into a single pane of glass using AWS Security Hub.
* Benchmark the NeuraX architecture against international compliance standards.
* Implement centralized governance using AWS Firewall Manager.
* Conduct vulnerability scanning on compute instances using Amazon Inspector.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Centralized Posture <br>&emsp; + Enable AWS Security Hub <br>&emsp; + Ingest findings from GuardDuty, Macie, and WAF | 26/03/2026 | 26/03/2026 | [Security Compliance with AWS Security Hub](https://000018.awsstudygroup.com) |
| 2 | - Compliance Benchmarking <br>&emsp; + Run CIS AWS Foundations Benchmark checks <br>&emsp; + Identity critical non-compliant resources (e.g., missing MFA, open security groups) | 27/03/2026 | 27/03/2026 | [CIS Benchmark] |
| 3 | - Security Governance <br>&emsp; + Explore centralized WAF rule deployment via AWS Firewall Manager <br>&emsp; + Set consistent security policies across potential multi-account setups | 28/03/2026 | 28/03/2026 | [Security Governance with Firewall Manager](https://000097.awsstudygroup.com) |
| 4 | - Vulnerability Scanning <br>&emsp; + Deploy Amazon Inspector for our EC2 Bastion host / batch containers <br>&emsp; + Review CVE severity rankings | 29/03/2026 | 29/03/2026 | [Systems Patching with EC2 Image Builder](https://000099.awsstudygroup.com) |
| 5 | - Patch Management <br>&emsp; + Test automated patching pipelines <br>&emsp; + Enforce golden image compliance | 30/03/2026 | 30/03/2026 | [Systems Manager] |
| 6-7 | - Pre-Audit Prep <br>&emsp; + Discuss Security Hub severity scores with the team <br>&emsp; + Assign remediation tasks for next week | 31/03/2026 | 01/04/2026 | [Internal Meeting] |

### Week 9 Achievements

* **Automated Compliance:**
  * Enabled **AWS Security Hub**, providing the team with a comprehensive 360-degree view of our security posture. We successfully mapped our resources against the prestigious **CIS AWS Foundations Benchmark** to pinpoint architectural gaps.
  
* **Centralized Perimeter Management:**
  * Adopted the conceptual framework of **AWS Firewall Manager** to automatically apply baseline WAF rules to every new API Gateway the developers spawn, preventing rogue APIs from going public unprotected.

* **Compute Vulnerability Mitigation:**
  * Configured **Amazon Inspector** to continuously assess our EC2 bastion hosts (used for private DB access) for zero-day vulnerabilities. Automated patching is now streamlined.

### Challenges & Lessons

* **Challenges:**
  * Security Hub highlighted over 100+ "High Severity" findings immediately upon activation, overwhelming the team and creating a false sense of panic.
  * Translating compliance requirements (like password rotation or MFA for root) into actionable developer workflows.

* **Solutions:**
  * Filtered the Security Hub findings to focus exclusively on public-facing internet resources and high-risk IAM escalations first. Organized findings by resource instead of timeline.
  * Conducted a mini-workshop with the team to enable MFA on all personal IAM profiles systematically.

* **Lessons Learned:**
  * Compliance score is an iterative metric, not an immediate goal. Attempting to fix every finding on day one is impossible. Triage and prioritization are the hallmarks of a good security engineer.
  * The cloud attack surface is massive. Centralized visibility tools are mandatory, not optional, for an enterprise-level project.

### Next Week Plan

* Move from passive defense to active offense.
* Initiate the **Hands-On Penetration Testing** phase for the NutriTrack backend.
* Attempt simulated attacks using Burp Suite against our API Gateway and Cognito endpoints to find logic flaws.
