### Week 5 Objectives

* Provision the AWS Amplify sandbox environment collaboratively with the IA-1 teammate.
* Generate and synchronize `amplify_outputs.json` for Frontend consumption.
* Develop the AWS cost estimation based on market pricing and configure budget alert thresholds.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Infrastructure Analysis (with IA-1) <br>&emsp; + Deep-dive into `backend.ts`, `data/resource.ts`, `auth/`, `storage/` <br>&emsp; + Mapped CDK resource definitions to corresponding AWS services | 26/02/2026 | 26/02/2026 | [AWS Amplify Docs](https://docs.amplify.aws/) |
| 2 | - Sandbox Provisioning (with IA-1) <br>&emsp; + Executed first `npx ampx sandbox` deployment <br>&emsp; + Verified auto-provisioned Cognito User Pool, DynamoDB tables, and S3 buckets | 27/02/2026 | 27/02/2026 | [Amplify Sandbox](https://docs.amplify.aws/gen2/deploy-and-host/sandbox-environments/) |
| 3 | - Frontend Configuration Sync (with IA-1) <br>&emsp; + Generated `amplify_outputs.json` via `npx ampx generate outputs --outputs-out-dir ../frontend` <br>&emsp; + Validated endpoint schema for AppSync, Cognito, and S3 | 28/02/2026 | 28/02/2026 | [Amplify CLI Reference](https://docs.amplify.aws/gen2/reference/cli-commands/) |
| 4 | - Production Cost Estimation <br>&emsp; + Calculated AWS service costs at market pricing: Lambda, DynamoDB, S3, Cognito, Bedrock (Qwen3-VL 235B) <br>&emsp; + Projected monthly operational costs for both workshop (1-day) and production (1-month) scenarios | 02/03/2026 | 02/03/2026 | [AWS Pricing Calculator](https://calculator.aws/) |
| 5 | - Budget Guardrails Configuration <br>&emsp; + Established AWS Budgets with multi-threshold monthly alerts <br>&emsp; + Configured Cost Explorer dashboards segmented by service category | 03/03/2026 | 03/03/2026 | [Cost and Usage Management](https://000064.awsstudygroup.com) |
| 6 | - End-to-End Sandbox Validation (with IA-1) <br>&emsp; + Tested Cognito sign-up/sign-in authentication flow <br>&emsp; + Verified S3 upload permissions and measured Lambda cold start latency | 04/03/2026 | 04/03/2026 | - |

### Week 5 Achievements

* **Infrastructure Baseline:**
  * Successfully provisioned the Amplify sandbox with the IA-1 teammate. The full backend stack (Cognito, DynamoDB, S3, Lambda) was auto-generated from CDK definitions.

* **Frontend-Backend Sync:**
  * Generated and validated `amplify_outputs.json`, enabling the frontend to connect to all backend services without manual endpoint configuration.

* **Cost Governance:**
  * Estimated production costs at market pricing and deployed proactive budget alerts, providing the team with clear financial visibility throughout the development lifecycle.

### Challenges & Lessons

* **Challenges:**
  * The `npx ampx sandbox` command failed on the first attempt due to missing Node.js dependencies and an outdated AWS CLI version.
* **Solutions:**
  * Upgraded Node.js to v22 LTS and reinstalled the AWS CLI v2, which resolved the sandbox provisioning errors.
* **Lessons Learned:**
  * Amplify is CDK-based, requiring a deeper understanding of Infrastructure as Code. Cost estimation should use real market pricing rather than Free Tier assumptions to ensure accurate budget planning for production.

### Next Week Plan

* Bootstrap the React Native (Expo Router) frontend project.
* Connect the frontend application to the Amplify backend.
* Build the core tab navigation with the team.
