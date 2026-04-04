### Week 3 Objectives

* Complete the basic Cloud Journey series with DynamoDB and CLI.
* Finalize the NeuraX (NutriTrack) project idea and assign specific technical roles.
* Transition from basic training to the official Role-Based tasks (Security Engineer role).
* Draft the initial Architecture Design for the NeuraX backend.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - NoSQL Database <br>&emsp; + NoSQL Database Essentials with Amazon DynamoDB | 19/01/2026 | 19/01/2026 | [DynamoDB Essentials](https://000060.awsstudygroup.com) |
| 2 | - System Operators & Edge Computing <br>&emsp; + Command Line Operations with AWS CLI <br>&emsp; + Content Delivery with Amazon CloudFront | 20/01/2026 | 20/01/2026 | [AWS CLI & CloudFront](https://cloudjourney.awsstudygroup.com/) |
| 3 | - Project Brainstorming <br>&emsp; + Confirmed "NutriTrack" as the core application (NeuraX Project) <br>&emsp; + Discussed Serverless Architecture (Lambda/API Gateway) | 21/01/2026 | 21/01/2026 | [Meeting Notes] |
| 4 | - Architecture & Role Assignment <br>&emsp; + Assigned to the **Cloud Security Engineer** role <br>&emsp; + Scoped the initial security boundaries for the project | 22/01/2026 | 22/01/2026 | [Architecture Draft] |
| 5 | - Initial Proposal <br>&emsp; + Drafted the Security section of the NutriTrack Proposal <br>&emsp; + Prepared to move into specialized security tracks (WAF, Cognito) | 23/01/2026 | 23/01/2026 | [Draft Document] |
| 6-7 | - Weekend Self-Study <br>&emsp; + Explored security best practices for API Gateway and DynamoDB | 24/01/2026 | 25/01/2026 | [AWS Sec Docs] |

### Week 3 Achievements

* **Completed Basic Cloud Journey Training:**
  * Mastered NoSQL concepts using DynamoDB.
  * Successfully navigated and managed AWS resources using the AWS CLI.
  * Understand how CloudFront accelerates content delivery globally.

* **Project Foundation:**
  * 100% of the team agreed on the "NutriTrack" project idea (A serverless diet tracking app under the NeuraX namespace).
  * Officially assumed the **Cloud Security Engineer** role for the project, responsible for protecting user data and application APIs.

* **Documentation:**
  * Co-authored the project proposal, specifically detailing the Shared Responsibility Model application for our Serverless components.

### Challenges & Lessons

* **Challenges:**
  * Using the AWS CLI initially resulted in frequent syntax errors compared to clicking through the Management Console.
  * Transitioning from a generalist learner to a specialized Security Role required shifting the mindset from "how to build" to "how to break and protect".

* **Solutions:**
  * Leveraged `aws help` commands extensively to learn required parameters.
  * Started reviewing the AWS Well-Architected Framework (Security Pillar).

* **Lessons Learned:**
  * While Serverless abstracts the infrastructure, it does *not* mean you can ignore security. API Gateway and Lambda require strict identity and resource policies.

### Next Week Plan

* Shift completely to customized security tasks for NeuraX.
* Week 4 Focus: Identity & Access Management for end-users using **Amazon Cognito**.
* Implement IAM Permission Boundaries for other developers on the team.
