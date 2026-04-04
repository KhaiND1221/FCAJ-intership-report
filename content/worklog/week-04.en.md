### Week 4 Objectives

* Transition fully into the **Security Engineer** role for the NeuraX (NutriTrack) project.
* Secure infrastructure access for the development team using AWS IAM Identity Center.
* Implement end-user Identity Management using Amazon Cognito.
* Enforce strict IAM policies across the development environment.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Developer Access Security <br>&emsp; + Setup Identity Federation with AWS Single Sign-On (SSO) <br>&emsp; + Assign permission sets for the Dev team | 26/01/2026 | 26/01/2026 | [Identity Federation with SSO](https://000012.awsstudygroup.com) |
| 2 | - IAM Guardrails <br>&emsp; + Configure IAM Permission Boundaries <br>&emsp; + Ensure developers cannot elevate their own privileges | 27/01/2026 | 27/01/2026 | [IAM Permission Boundaries](https://000030.awsstudygroup.com) |
| 3 | - User Authentication Setup <br>&emsp; + Create an Amazon Cognito User Pool for NutriTrack <br>&emsp; + Configure password policies and MFA for end-users | 28/01/2026 | 28/01/2026 | [Auth with Cognito](https://000081.awsstudygroup.com/) |
| 4 | - Identity Pools & Access <br>&emsp; + Setup Cognito Identity Pool <br>&emsp; + Map IAM roles for authenticated and unauthenticated users | 29/01/2026 | 29/01/2026 | [Cognito Auth Docs] |
| 5 | - Cross-Domain Identity <br>&emsp; + Test Cross-Domain Authentication with Amazon Cognito <br>&emsp; + Validate JWT tokens issued by Cognito | 30/01/2026 | 30/01/2026 | [Cross-Domain Cognito](https://000141.awsstudygroup.com) |
| 6-7 | - Security Audit & Sync <br>&emsp; + Audit all current Lambda execution roles and prune excessive permissions <br>&emsp; + Weekly sync with the development team | 31/01/2026 | 01/02/2026 | [Audit Logs] |

### Week 4 Achievements

* **Robust Developer Access:**
  * Replaced manual IAM user creations with **AWS IAM Identity Center (SSO)**, allowing the team to log in using centralized credentials.
  * Successfully applied **IAM Permission Boundaries** preventing developers from accidentally granting administrative permissions to the Lambda functions they deploy.

* **Client Authentication Layer:**
  * Provisioned the **Amazon Cognito** architecture (User Pools + Identity Pools).
  * Enforced strict password standards (min 8 chars, uppercase, lowercase, special characters) and enabled optional MFA for NutriTrack users.
  * Verified JWT token generation and access controls for downstream API calls.

* **Security Posture:**
  * The first architectural component of the Secure Serverless backend is live. User authentication is decoupled from the business logic.
  * Completed the first audit of the team's Lambda execution roles, enforcing the Principle of Least Privilege.

### Challenges & Lessons

* **Challenges:**
  * Configuring Cognito to correctly issue tokens and mapping them to AWS credentials via Identity Pools was complex due to the interplay between the two pool types.
  * Debugging `AccessDenied` errors caused by the newly implemented Permission Boundaries frustrated the developers initially.

* **Solutions:**
  * Created a brief internal guide explaining the difference between User Pools (for authentication) and Identity Pools (for AWS resource authorization).
  * Used CloudTrail to pinpoint exactly which API calls were hitting the boundary limits and modified policies accordingly.

* **Lessons Learned:**
  * Implementing security guardrails often causes initial friction with developers. Communication and clear logging are essential to resolve disputes.
  * Offloading authentication to managed services like Cognito significantly reduces security liability compared to writing custom login logic.

### Next Week Plan

* Move from Access Management to Application Protection.
* Deploy **AWS Web Application Firewall (WAF)** to protect the team's API Gateway.
* Analyze and mitigate common OWASP Top 10 vulnerabilities (like SQLi or XSS) hitting our endpoints.
