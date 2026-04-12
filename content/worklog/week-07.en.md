### Week 7 Objectives

* Develop the complete Authentication UI (Sign Up, Sign In, OTP Verification).
* Integrate Amazon Cognito with dual authentication methods (Email OTP + Google OAuth).
* Conduct the first penetration test targeting the authentication and token management flow.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Authentication UI Development <br>&emsp; + Built Sign Up, Sign In, and OTP Verification screens <br>&emsp; + Integrated Cognito Email + OTP authentication flow | 12/03/2026 | 12/03/2026 | [Auth with Cognito](https://000081.awsstudygroup.com/) |
| 2 | - Google OAuth Integration <br>&emsp; + Configured OAuth 2.0 redirect URIs in `auth/resource.ts` <br>&emsp; + Set up Google Cloud Console OAuth Client credentials | 13/03/2026 | 13/03/2026 | [Google Cloud Console](https://console.cloud.google.com/welcome/new?pli=1) |
| 3 | ⭐ **EVENT:** AWS Cloud Mastery 1 | 14/03/2026 | 14/03/2026 | - |
| 4 | - Secure Token Storage <br>&emsp; + Implemented JWT token persistence using `expo-secure-store` <br>&emsp; + Designed session lifecycle management (token refresh, expiry handling) | 16/03/2026 | 16/03/2026 | [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) |
| 5 | - Authentication Functional Testing <br>&emsp; + End-to-end validation of sign-up, sign-in, OTP verification, and Google OAuth flows <br>&emsp; + Verified session persistence across app restarts | 17/03/2026 | 17/03/2026 | - |
| 6 | - Pentest #1: Token Security Assessment <br>&emsp; + Attempted JWT token manipulation and signature bypass <br>&emsp; + Evaluated token expiration enforcement and refresh token rotation | 18/03/2026 | 18/03/2026 | [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) |

### Week 7 Achievements

* **Complete Auth Flow:**
  * Full authentication pipeline operational — Email+OTP and Google OAuth both verified end-to-end.

* **Security Validated:**
  * Initial pentest confirmed that Cognito-issued JWTs resist manipulation attempts and enforce proper expiration policies.

### Challenges & Lessons

* **Challenges:**
  * Configuring Google OAuth redirect URIs for the Expo development environment required multiple iterations due to platform-specific URL scheme differences.
* **Lessons Learned:**
  * Authentication is the most critical attack surface. Testing token security early prevents cascading vulnerabilities downstream.

### Next Week Plan

* Collaborate with DEV team to research and prototype the Pet evolution UI.
* Design and demonstrate the Streak system and XP accumulation mechanics.
* Expand the penetration testing toolkit.
