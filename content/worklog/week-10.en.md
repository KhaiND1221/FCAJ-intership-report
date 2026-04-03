### Week 10 Objectives

* Conduct load testing and stress testing.
* Implement cost optimization strategies.
* Prepare demo for stakeholder presentation.
* Start writing technical documentation.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Load Testing <br>&emsp; + Set up Artillery.io for load tests <br>&emsp; + Simulated 100 concurrent users <br>&emsp; + Identified bottlenecks in API endpoints | 09/03/2026 | 09/03/2026 | [Load Test Reports] |
| 2 | - Stress Testing <br>&emsp; + Increased to 500 concurrent users <br>&emsp; + Tested Lambda scaling behavior <br>&emsp; + Verified DynamoDB auto-scaling | 10/03/2026 | 10/03/2026 | [Stress Test Reports] |
| 3 | - Cost Optimization <br>&emsp; + Analyzed AWS Cost Explorer data <br>&emsp; + Implemented Reserved Capacity for DynamoDB <br>&emsp; + Set up S3 Intelligent-Tiering | 11/03/2026 | 11/03/2026 | [Cost Analysis](https://docs.aws.amazon.com/cost-management/) |
| 4 | - Demo Preparation <br>&emsp; + Created demo script and flow <br>&emsp; + Set up demo data in staging <br>&emsp; + Practiced presentation with team | 12/03/2026 | 12/03/2026 | [Demo Script] |
| 5 | - Technical Documentation (Part 1) <br>&emsp; + Started architecture documentation <br>&emsp; + Documented API specifications <br>&emsp; + Created deployment guide | 13/03/2026 | 13/03/2026 | [Tech Docs] |
| 6-7 | - Technical Documentation (Part 2) <br>&emsp; + Wrote developer setup guide <br>&emsp; + Documented troubleshooting steps <br>&emsp; + Created runbook for operations | 14/03/2026 | 15/03/2026 | [Runbook] |

### Week 10 Achievements

* **Load Testing:**
  * System handles 100 concurrent users with <200ms response time.
  * Stress test showed graceful degradation at 500 users.
  * Lambda auto-scaling kicked in at 200 concurrent requests.

* **Cost Optimization:**
  * Estimated 40% cost reduction with optimization strategies.
  * S3 Intelligent-Tiering saves ~$15/month for infrequent data.
  * Bedrock usage optimized with prompt caching.

* **Demo:**
  * Complete demo script covering all NutriTrack features.
  * Staging environment prepared with realistic data.
  * Team rehearsal completed successfully.

* **Documentation:**
  * Architecture document with diagrams completed.
  * API documentation with examples (Postman collection).
  * Deployment and developer setup guides.

### Challenges & Lessons

* **Challenges:**
  * Lambda concurrent execution limits caused 429 errors at high load.
  * Cost optimization required understanding complex pricing models.

* **Solutions:**
  * Requested Lambda quota increase through AWS Support.
  * Used AWS Pricing Calculator to model different scenarios.

* **Lessons Learned:**
  * Always plan for quota limits in serverless architecture.
  * Cost optimization should be considered from design phase.

### Next Week Plan

* Complete Workshop documentation for internship report.
* Prepare final presentation slides.
* Conduct internal demo with mentors.
* Finalize all project documentation.
