### Week 11 Objectives

* Remediate all vulnerabilities discovered during the penetration testing phase.
* Execute a comprehensive quality assurance pass across all user flows.
* Close all outstanding security and bug tickets.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - IDOR Vulnerability Remediation <br>&emsp; + Injected `cognito:username` JWT claim validation into the Lambda authorization logic <br>&emsp; + Wrote unit tests confirming 403 rejection on identity mismatch | 09/04/2026 | 09/04/2026 | [Cognito JWT Claims](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html) |
| 2 | - Frontend Stability Fixes <br>&emsp; + Resolved state synchronization issues in Zustand stores <br>&emsp; + Fixed AsyncStorage persistence edge cases causing data loss on app restart | 10/04/2026 | 10/04/2026 | [Zustand](https://github.com/pmndrs/zustand) |
| 3 | ⭐ **EVENT:** AWS Cloud Mastery 3 (FPT Uni) | 11/04/2026 | 11/04/2026 | - |
| 4 | - Full Quality Assurance Pass <br>&emsp; + Manual end-to-end testing: Auth → Food Log → AI Coach → Gamification → Leaderboard <br>&emsp; + Validated cross-feature interactions and data consistency | 13/04/2026 | 13/04/2026 | - |
| 5 | - Security Re-validation <br>&emsp; + Re-executed all previous pentest scenarios against patched endpoints <br>&emsp; + Confirmed zero regression in vulnerability remediation | 14/04/2026 | 14/04/2026 | [OWASP Re-testing](https://owasp.org/www-project-web-security-testing-guide/) |
| 6 | - Ticket Closure & Documentation <br>&emsp; + Closed all penetration testing and bug fix tickets <br>&emsp; + Prepared technical documentation for the final presentation week | 15/04/2026 | 15/04/2026 | - |

### Week 11 Achievements

* **Zero Critical Vulnerabilities:**
  * IDOR flaw fully patched — Lambda now cross-references JWT claims against requested resource ownership.

* **Application Stability:**
  * Resolved all frontend state management issues, ensuring reliable data persistence across sessions.

* **Clean Slate:**
  * All security and QA tickets closed. Application verified stable and ready for final presentation.

### Challenges & Lessons

* **Challenges:**
  * Decoupling authorization logic changes without breaking the frontend's expected response format required tight coordination.
* **Lessons Learned:**
  * Remediation is a collaborative effort between Security and Development. Clear communication accelerates ticket resolution.

### Next Week Plan

* Deliver the concluding project presentation to FCJ Mentors.
* Finalize budget reconciliation with the IA-1 teammate.
* Complete knowledge handover and project documentation.
