### Week 9 Objectives

* Perform comprehensive functional testing of Camera, Voice, and Food Card features delivered by the DEV team.
* Provide actionable UI/UX improvement recommendations for the Camera scanning experience.
* Conduct a targeted penetration test against S3 presigned URL mechanisms.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Camera Feature Testing <br>&emsp; + Validated photo capture workflow, S3 upload reliability, and image processing pipeline <br>&emsp; + Documented edge cases: low-light performance, orientation handling | 26/03/2026 | 26/03/2026 | [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/) |
| 2 | - Voice Feature Testing <br>&emsp; + Verified audio recording quality, S3 upload for AWS Transcribe processing <br>&emsp; + Tested bilingual voice input (Vietnamese and English) | 27/03/2026 | 27/03/2026 | [AWS Transcribe](https://docs.aws.amazon.com/transcribe/) |
| 3 | - Food Card UI Review <br>&emsp; + Assessed nutrition result display: calories, protein, carbs, fat breakdown <br>&emsp; + Evaluated data accuracy and presentation clarity | 28/03/2026 | 28/03/2026 | - |
| 4 | - Camera UX Improvement Feedback <br>&emsp; + Compiled detailed UX recommendations: capture flow, preview quality, crop mechanics, confirm interaction <br>&emsp; + Proposed UI refinements for scan overlay and guidance indicators | 30/03/2026 | 30/03/2026 | - |
| 5 | - Pentest #2: S3 Presigned URL Security <br>&emsp; + Tested for bucket policy bypass vulnerabilities <br>&emsp; + Verified upload path restrictions and object-level access controls | 31/03/2026 | 31/03/2026 | [S3 Security Best Practices](https://000069.awsstudygroup.com) |
| 6 | - Consolidated Feedback Report <br>&emsp; + Aggregated all UI/UX findings and security observations into a structured report <br>&emsp; + Delivered prioritized bug report and improvement recommendations to DEV team | 01/04/2026 | 01/04/2026 | - |

### Week 9 Achievements

* **Feature Validation Complete:**
  * All three core AI-powered features (Camera, Voice, Food Card) verified for functional correctness and user experience quality.

* **UI/UX Contribution:**
  * Delivered actionable feedback that directly influenced Camera scanning UX improvements.

* **S3 Security Confirmed:**
  * Presigned URL mechanisms validated — upload paths correctly restricted and bucket policies enforce least-privilege access.

### Challenges & Lessons

* **Challenges:**
  * Voice recognition accuracy varied significantly between quiet and noisy environments during testing.
* **Lessons Learned:**
  * QA must cover real-world conditions, not just ideal scenarios. Security testing of storage endpoints is as critical as API-level testing.

### Next Week Plan

* Execute deep penetration testing against the NutriTrack serverless backend.
* Complete the comprehensive NutriTrack architecture diagram.
* Submit the project deliverables.
