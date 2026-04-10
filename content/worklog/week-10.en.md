### Week 10 Objectives

* Transition from defensive architecture to an offensive security mindset.
* Perform internal penetration testing on the NutriTrack serverless backend.
* Validate the efficacy of Amazon Cognito and AWS WAF configurations.
* Discover and document application-layer vulnerabilities.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Test Environment Setup <br>&emsp; + Spin up a cloned isolated environment (Staging) <br>&emsp; + Configured proxy tools (Burp Suite) to intercept traffic | 09/03/2026 | 09/03/2026 | [Burp Suite Config Docs] |
| 2 | - Authentication & Authorization Testing <br>&emsp; + Attempted Cognito Token manipulation & bypass <br>&emsp; + Tested for Insecure Direct Object Reference (IDOR) on user profiles | 10/03/2026 | 10/03/2026 | [OWASP Auth Testing] |
| 3 | ⭐ **EVENT:** AWS Cloud Mastery 2 (FPT Uni) <br>&emsp; - Lambda Hook-up <br>&emsp; + Finalized `generate_coaching_tip()` tying Boto3 to Qwen3-VL 235B. <br>&emsp; + Pushed to Amplify. | 11/03/2026 | 11/03/2026 | [Amplify Fullstack Docs](https://docs.amplify.aws/gen2/deploy-and-host/fullstack-branching/) |
| 4 | - API Logic Flaws <br>&emsp; + Hunted for Business Logic vulnerabilities in the Lambda API endpoints <br>&emsp; + Checked for Excessive Data Exposure in JSON responses | 12/03/2026 | 12/03/2026 | [REST API Security] |
| 5 | - Privilege Escalation Audit <br>&emsp; + Audited IAM Roles assumed by backend systems <br>&emsp; + Checked for over-permissive `sts:AssumeRole` trusts | 13/03/2026 | 13/03/2026 | [IAM Security Assessment] |
| 6-7 | - Security Report Generation <br>&emsp; + Compiled findings into a structured Vulnerability Assessment Report <br>&emsp; + Ranked findings by CVSS severity score | 14/03/2026 | 15/03/2026 | [Vulnerability Score Matrix] |

### Week 10 Achievements

* **Offensive Security Validation:**
  * Successfully conducted a mock penetration test hitting all layers of the stack (API Gateway, Cognito, Lambda logic, and Database interactions).

* **Vulnerability Discovery:**
  * Discovered a minor IDOR vulnerability in the `GET /meals/{id}` endpoint where a user could potentially enumerate a different user's meal logs if they guessed the ID, due to a missing authorization check inside the Lambda function.
  * Identified an instance where the API response returned overly verbose error traces if a malformed parameter was sent (Information disclosure).

* **WAF Efficacy Proven:**
  * Our customized AWS WAF blocked 100% of standard script-kiddie payloads (SQLi, generic XSS) and successfully throttled the automated Burp Suite fuzzing via rate limits.

### Challenges & Lessons

* **Challenges:**
  * Setting up Burp Suite to man-in-the-middle encrypted API traffic requiring custom root certificates was technically tedious.
  * Differentiating between an infrastructure configuration flaw versus a codebase logic flaw required deep code-review of the Lambda functions.

* **Solutions:**
  * Coordinated with the frontend developer to bypass SSL pinning purely in the Staging client environment for testing purposes.
  * Paired directly with the Backend Developer to trace the IDOR payload from the API Gateway event down to the DynamoDB lookup query.

* **Lessons Learned:**
  * Security is never purely infrastructural. AWS WAF and IAM can be configured perfectly, but flawed application logic (like missing resource ownership checks in Lambda) will fundamentally compromise the system.
  * Penetration testing is incredibly valuable to validate your own defensive assumptions.

### Next Week Plan

* Shift from offensive discovery to the Remediation phase.
* Work alongside developers to patch the IDOR vulnerability and eliminate verbose errors.
* Draft an Incident Response (IR) playbook for NeuraX based on our security audit.
