### Week 6 Objectives

* Submit and get approval for NutriTrack Proposal.
* Begin backend implementation with Lambda functions.
* Set up SAM CLI for local development.
* Create OpenAPI specification for all endpoints.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Proposal Submission <br>&emsp; + Finalized NutriTrack Proposal document <br>&emsp; + Submitted for mentor review <br>&emsp; + Prepared presentation slides | 09/02/2026 | 09/02/2026 | [Final Proposal] |
| 2 | - SAM CLI Setup <br>&emsp; + Installed AWS SAM CLI <br>&emsp; + Created sample template.yaml <br>&emsp; + Tested local Lambda invocation | 10/02/2026 | 10/02/2026 | [SAM Docs](https://docs.aws.amazon.com/serverless-application-model/) |
| 3 | - OpenAPI Specification <br>&emsp; + Defined all 12 API endpoints <br>&emsp; + Documented request/response schemas <br>&emsp; + Created Swagger documentation | 11/02/2026 | 11/02/2026 | [OpenAPI Spec] |
| 4 | - Lambda Functions (Part 1) <br>&emsp; + Created user management functions <br>&emsp; + POST /users, GET /users/{id} <br>&emsp; + Integrated with DynamoDB | 12/02/2026 | 12/02/2026 | [Lambda Code] |
| 5 | - Lambda Functions (Part 2) <br>&emsp; + Created meal logging functions <br>&emsp; + POST /meals, GET /meals <br>&emsp; + Image upload to S3 presigned URL | 13/02/2026 | 13/02/2026 | [Lambda Code] |
| 6-7 | - API Gateway Integration <br>&emsp; + Connected Lambda functions to API Gateway <br>&emsp; + Configured CORS settings <br>&emsp; + Tested endpoints with Postman | 14/02/2026 | 15/02/2026 | [API Tests] |

### Week 6 Achievements

* **Proposal:**
  * ✅ NutriTrack Proposal submitted and **approved by mentor**.
  * Received positive feedback on serverless architecture choice.
  * Minor suggestions: add more detail on AI integration.

* **Development Environment:**
  * SAM CLI configured for local Lambda development.
  * Local testing working with Docker and DynamoDB Local.

* **Backend Progress:**
  * 6 Lambda functions implemented and tested.
  * API Gateway configured with proper CORS and authorization.
  * OpenAPI documentation generated with Swagger UI.

### Challenges & Lessons

* **Challenges:**
  * SAM CLI on Windows had some path issues with Docker.
  * Presigned URL generation required specific IAM permissions.

* **Solutions:**
  * Used WSL2 for SAM CLI development instead of native Windows.
  * Added S3 PutObject permission to Lambda execution role.

* **Lessons Learned:**
  * WSL2 + SAM CLI is the recommended setup for Windows developers.
  * Always test IAM permissions with a minimal policy first.

### Next Week Plan

* Implement remaining Lambda functions (nutrition calculation, AI recommendations).
* Set up Amazon Cognito for user authentication.
* Create CI/CD pipeline with GitHub Actions.
* Begin frontend development structure.
