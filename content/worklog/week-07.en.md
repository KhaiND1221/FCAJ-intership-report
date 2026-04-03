### Week 7 Objectives

* Implement Cognito authentication for NutriTrack.
* Complete remaining Lambda functions for AI features.
* Set up CI/CD pipeline with GitHub Actions.
* Start frontend development with React.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Amazon Cognito Setup <br>&emsp; + Created User Pool for NutriTrack <br>&emsp; + Configured password policies <br>&emsp; + Set up email verification | 16/02/2026 | 16/02/2026 | [Cognito Docs](https://docs.aws.amazon.com/cognito/) |
| 2 | - Cognito Integration <br>&emsp; + Integrated Cognito with API Gateway <br>&emsp; + Created JWT authorizer <br>&emsp; + Tested protected endpoints | 17/02/2026 | 17/02/2026 | [Auth Config] |
| 3 | - AI Lambda Functions <br>&emsp; + Created Bedrock integration Lambda <br>&emsp; + Implemented meal suggestion endpoint <br>&emsp; + Added nutrition analysis function | 18/02/2026 | 18/02/2026 | [Bedrock Integration](https://docs.aws.amazon.com/bedrock/) |
| 4 | - CI/CD Pipeline Setup <br>&emsp; + Created GitHub Actions workflow <br>&emsp; + Configured SAM deploy steps <br>&emsp; + Set up dev/staging environments | 19/02/2026 | 19/02/2026 | [GitHub Actions] |
| 5 | - Frontend Project Setup <br>&emsp; + Initialized React + Vite project <br>&emsp; + Configured Tailwind CSS <br>&emsp; + Set up project structure | 20/02/2026 | 20/02/2026 | [Frontend Repo] |
| 6-7 | - Frontend Development (Part 1) <br>&emsp; + Created authentication pages (Login, Register) <br>&emsp; + Integrated AWS Amplify for Cognito <br>&emsp; + Tested auth flow end-to-end | 21/02/2026 | 22/02/2026 | [UI Components] |

### Week 7 Achievements

* **Authentication:**
  * Cognito User Pool created with secure password policy.
  * API Gateway protected with JWT authorizer.
  * Email verification flow working.

* **AI Integration:**
  * Bedrock Claude 3 Sonnet integrated for meal suggestions.
  * Nutrition analysis function providing calorie/macro breakdown.
  * Rate limiting configured to manage Bedrock API costs.

* **CI/CD:**
  * Automated deployment pipeline: Push → Test → Deploy.
  * Separate stacks for dev and staging environments.
  * Rollback mechanism configured.

* **Frontend:**
  * React + Vite + Tailwind project initialized.
  * Login and Registration pages completed.
  * AWS Amplify configured for Cognito integration.

### Challenges & Lessons

* **Challenges:**
  * Bedrock API responses are async; needed proper error handling.
  * Cognito token refresh flow was complex to implement.

* **Solutions:**
  * Implemented retry logic with exponential backoff for Bedrock.
  * Used AWS Amplify library which handles token refresh automatically.

* **Lessons Learned:**
  * Bedrock prompts need careful engineering for consistent outputs.
  * AWS Amplify simplifies frontend auth integration significantly.

### Next Week Plan

* Complete all frontend pages (Dashboard, Meal Log, Analytics).
* Implement image upload and meal photo analysis.
* Integrate frontend with all backend APIs.
* Begin unit testing for Lambda functions.
