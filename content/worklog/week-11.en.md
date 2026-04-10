### Week 11 Objectives

* Remediate vulnerabilities discovered during the Week 10 Penetration Test.
* Enforce strict Application-level authorization checks.
* Fine-tune infrastructure settings (WAF / API Gateway).
* Draft an Incident Response (IR) playbook for the NeuraX team.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Vulnerability Triage <br>&emsp; + Ranked findings and assigned tickets to the team <br>&emsp; + Prioritized the IDOR vulnerability | 16/03/2026 | 16/03/2026 | [Vulnerability Report] |
| 2 | - IDOR Remediation <br>&emsp; + Modified Lambda logic to compare Cognito JWT Claims against the requested Identity ID <br>&emsp; + Wrote unit tests confirming access denial on mismatch | 17/03/2026 | 17/03/2026 | [AWS Lambda Auth context] |
| 3 | ⭐ **EVENT:** AWS Cloud Mastery 3 (FPT Uni) <br>&emsp; - Presentation Deck Draft <br>&emsp; + Extracted the major architecture flow diagrams built earlier. <br>&emsp; + Summarized our Qwen3-VL 235B multimodal architecture strategy. | 18/03/2026 | 18/03/2026 | - |
| 4 | - WAF Rules Tuning <br>&emsp; + Reviewed WAF logs from the Pen-test phase <br>&emsp; + Refined rate-limiting IP exclusions for our CI/CD pipelines | 19/03/2026 | 19/03/2026 | [AWS WAF Console] |
| 5 | - Playbook Drafting <br>&emsp; + Drafted the initial Incident Response (IR) Playbook <br>&emsp; + Documented steps for disabling compromised IAM/Cognito credentials | 20/03/2026 | 20/03/2026 | [IR Playbook Template] |
| 6-7 | - Remediation Testing <br>&emsp; + Conducted a final re-scan and manual test of the patched endpoints <br>&emsp; + Closed the vulnerabilities on our internal tracker | 21/03/2026 | 22/03/2026 | [Re-validation Logs] |

### Week 11 Achievements

* **Zero Critical Vulnerabilities:**
  * Successfully patched the IDOR flaw. The Lambda backend now cross-references the user's requested path parameter against the `cognito:username` attribute embedded strictly within the validated JWT token context. Data enumeration is now impossible.

* **Information Leakage Plugged:**
  * Cleaned up the API Gateway integration responses. Attackers can no longer deduce stack traces or database structures from malformed requests.

* **Incident Readiness:**
  * Delivered Version 1 of the **NeuraX Incident Response Playbook**. The team now has standard operating procedures (SOPs) for isolating Lambda functions, rotating AWS KMS keys, and locking out compromised Cognito users in the event of an imminent breach.

### Challenges & Lessons

* **Challenges:**
  * Decoupling the logic changes securely without breaking the frontend application's expected response structures required tight synchronization.
  * Creating an IR playbook from scratch is daunting; deciding what level of detail to include without making it overly long was tough.

* **Solutions:**
  * Used API Gateway mapping templates to absorb the backend exceptions and cleanly transform them into safe JSON schemas for the frontend.
  * Used a standard SANS Institute template for the IR playbook, modifying it specifically for our Serverless AWS deployment architecture.

* **Lessons Learned:**
  * Remediation is often a collaborative effort between Security and Development. Clear, respectful communication is needed to explain *why* exactly a code block needs to change.
  * An Incident Response plan that has never been tested is just a piece of paper. We must simulate a walk-through in the future.

### Next Week Plan

* Project wrap-up and documentation!
* Finalize the comprehensive Secure Architecture Diagrams.
* Compile the work into the final Internship Report and prepare for the concluding presentation.
