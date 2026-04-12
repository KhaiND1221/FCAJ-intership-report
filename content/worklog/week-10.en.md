### Week 10 Objectives

* Execute deep penetration testing against the NutriTrack serverless backend.
* Complete the comprehensive NutriTrack architecture diagram.
* Submit the project deliverables.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Pentest #3: IDOR Vulnerability Assessment <br>&emsp; + Tested `GET /meals/{id}` endpoint for cross-user data access exploitation <br>&emsp; + Verified authorization boundary enforcement at the Lambda level | 02/04/2026 | 02/04/2026 | [OWASP IDOR Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References) |
| 2 | - Pentest #4: API Gateway Security <br>&emsp; + Intercepted and fuzzed AppSync GraphQL queries using Burp Suite <br>&emsp; + Tested for injection attacks and excessive data exposure in API responses | 03/04/2026 | 03/04/2026 | [Burp Suite](https://portswigger.net/burp) |
| 3 | ⭐ **EVENT:** AWS Cloud Mastery 2 (FPT Uni) | 04/04/2026 | 04/04/2026 | - |
| 4 | 🎨 Architecture Diagram Completion + 📦 Project Submission <br>&emsp; + Finalized the full NutriTrack infrastructure diagram (Cognito → AppSync → Lambda → Bedrock → DynamoDB → S3) <br>&emsp; + Submitted the complete project deliverables | 05/04/2026 | 05/04/2026 | - |
| 5 | - Vulnerability Assessment Report <br>&emsp; + Compiled all penetration findings into a structured report <br>&emsp; + Ranked vulnerabilities using CVSS severity scoring methodology | 07/04/2026 | 07/04/2026 | [CVSS v3.1](https://www.first.org/cvss/calculator/3.1) |
| 6 | - Remediation Implementation <br>&emsp; + Patched verbose error responses exposing internal stack traces <br>&emsp; + Tightened Lambda execution role permissions following Principle of Least Privilege | 08/04/2026 | 08/04/2026 | - |

### Week 10 Achievements

* **Architecture Diagram Delivered:**
  * Comprehensive visual documentation of the entire NutriTrack serverless infrastructure completed and submitted.

* **IDOR Vulnerability Discovered:**
  * Identified a medium-severity IDOR flaw in `GET /meals/{id}` where missing authorization checks allowed potential cross-user data enumeration.

* **WAF Efficacy Proven:**
  * AWS WAF successfully blocked 100% of standard injection payloads and rate-limited automated fuzzing attempts.

### Challenges & Lessons

* **Challenges:**
  * Differentiating between infrastructure misconfigurations and application logic flaws required deep Lambda source code review.
* **Lessons Learned:**
  * Security is never purely infrastructural. Perfect WAF and IAM configurations are undermined by flawed application logic.

### Next Week Plan

* Remediate all vulnerabilities discovered during the penetration testing phase.
* Execute a comprehensive quality assurance pass across all user flows.
* Close all outstanding security and bug tickets.
