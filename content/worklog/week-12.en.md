### Week 12 Objectives

* Finalize the comprehensive Secure Serverless Architecture diagram for the project.
* Compile and finalize the FCAJ Internship Experience Report.
* Transfer the ownership of security postures and IAM guardrails to the broader NeuraX team.
* Conduct a concluding presentation reviewing the security lifecycle.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Architecture Documentation <br>&emsp; + Finalized diagram showcasing the integration of WAF, Cognito, and API Gateway <br>&emsp; + Documented the Data-at-rest encryption flows using AWS KMS | 16/04/2026 | 16/04/2026 | [Draw.io / Visio] |
| 2 | - Governance Handover <br>&emsp; + Walked the team through the AWS Security Hub dashboard <br>&emsp; + Handed over the Incident Response Playbook | 17/04/2026 | 17/04/2026 | [Internal Meeting] |
| 3 | - Cost Evaluation <br>&emsp; + Evaluated the price-to-performance ratio for security tools (GuardDuty, Macie) <br>&emsp; + Ensured AWS Budgets were fully clear | 18/04/2026 | 18/04/2026 | [Cost and Usage Management](https://000064.awsstudygroup.com) |
| 4 | - Report Compilation <br>&emsp; + Synthesized the 12-week worklog into the central Internship Report <br>&emsp; + Wrote reflections regarding the Cloud Security transition | 19/04/2026 | 19/04/2026 | [FCAJ Template] |
| 5 | - Mentorship Review <br>&emsp; + Sent the final draft of the internship report to the mentor <br>&emsp; + Adjusted the technical verbosity based on feedback | 20/04/2026 | 20/04/2026 | [Feedback Doc] |
| 6-7 | - Final Presentation <br>&emsp; + Delivered the Security Lifecycle closing presentation <br>&emsp; + Celebrated the completion of the FCJ Internship program | 21/04/2026 | 22/04/2026 | [Slide Deck] |

### Week 12 Achievements

* **Security Lifecycle Delivered:**
  * Transformed the raw NeuraX project idea into a robust, compliant, and fortified cloud application. The defense-in-depth approach spanning Identity (Cognito/IAM), Application (WAF), and Data (KMS/Macie) was formally handed over.

* **Documentation Complete:**
  * Standardized the cloud security models. The team now understands the **Shared Responsibility Model** practically, not just theoretically.
  * Successfully merged all security configurations, logs, and remediation notes into the final FCAJ Internship Report (this document).

* **Internship Success:**
  * Successfully completed the 12-week First Cloud Journey program. Transitioned effectively from basic AWS administration to specialized Cloud Security Engineering.

### Challenges & Lessons

* **Challenges:**
  * Condensing 12 weeks of intense AWS Security architecture iterations into an easy-to-read, high-level management report was challenging.
  * Ensuring the operations handover was smooth so that developers wouldn't accidentally break WAF rules or delete KMS keys later.

* **Solutions:**
  * Shifted the report's focus from "how to click buttons in the console" to the *business value* of the security implementations (e.g., stopping data leaks, achieving compliance).
  * Enforced SCPs (Service Control Policies) via AWS Organizations to strictly deny the deletion of core IAM and KMS infrastructure components permanently.

* **Lessons Learned:**
  * Security is a continuous process, not an end state. The architecture built over these 12 weeks is a phenomenal baseline, but it must evolve with the application.
  * Communication and technical documentation are just as important as configuring the infrastructure. If the rest of the team cannot operate the security tools, the tools fail.

### Future Perspectives

* Although the official internship is over, I plan to pursue the **AWS Certified Security - Specialty** certification based on the hands-on experience gained.
* Continue to engage with the AWS Study Group community and share these practical threat-remediation scenarios with fellow learners.
