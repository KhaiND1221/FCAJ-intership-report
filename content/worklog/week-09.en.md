### Week 9 Objectives

* Complete end-to-end testing for all user flows.
* Set up CloudWatch monitoring and alarms.
* Implement performance optimizations.
* Fix remaining bugs and polish UI.

### Tasks carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - End-to-End Testing <br>&emsp; + Created E2E test suite with Playwright <br>&emsp; + Tested auth flow, meal logging, analytics <br>&emsp; + Automated regression tests | 02/03/2026 | 02/03/2026 | [E2E Tests] |
| 2 | - CloudWatch Setup (Part 1) <br>&emsp; + Created CloudWatch dashboards <br>&emsp; + Configured Lambda metrics visualization <br>&emsp; + Set up API Gateway metrics | 03/03/2026 | 03/03/2026 | [CloudWatch Docs](https://docs.aws.amazon.com/cloudwatch/) |
| 3 | - CloudWatch Setup (Part 2) <br>&emsp; + Created alarms for error rates <br>&emsp; + Set up SNS notifications <br>&emsp; + Configured cost monitoring alerts | 04/03/2026 | 04/03/2026 | [Alarm Config] |
| 4 | - Performance Optimization <br>&emsp; + Optimized Lambda cold starts (Provisioned Concurrency) <br>&emsp; + Enabled DynamoDB DAX for caching <br>&emsp; + Implemented CloudFront for static assets | 05/03/2026 | 05/03/2026 | [Optimization Report] |
| 5 | - Bug Fixes <br>&emsp; + Fixed 8 remaining bugs from testing <br>&emsp; + Improved error messages <br>&emsp; + Enhanced mobile responsiveness | 06/03/2026 | 06/03/2026 | [Bug Tracker] |
| 6-7 | - UI Polish <br>&emsp; + Added loading animations <br>&emsp; + Improved accessibility (ARIA labels) <br>&emsp; + Final UI review and fixes | 07/03/2026 | 08/03/2026 | [UI Review] |

### Week 9 Achievements

* **Testing:**
  * E2E test suite with 15 automated scenarios.
  * 95% pass rate on all critical paths.
  * Regression test runs on every deployment.

* **Monitoring:**
  * CloudWatch dashboard with real-time metrics.
  * Alarms configured: Error Rate > 5%, Latency > 3s, Cost > Budget.
  * SNS email notifications for critical alerts.

* **Performance:**
  * Cold start reduced from 3s to 0.5s with Provisioned Concurrency.
  * DynamoDB queries 80% faster with DAX caching.
  * Static assets load 60% faster with CloudFront CDN.

* **Bug Fixes:**
  * 8 bugs fixed, 0 critical issues remaining.
  * Mobile experience significantly improved.

### Challenges & Lessons

* **Challenges:**
  * Provisioned Concurrency increased costs significantly.
  * DAX setup required VPC configuration changes.

* **Solutions:**
  * Used scheduled scaling for Provisioned Concurrency (peak hours only).
  * Created private subnets for DAX within existing VPC.

* **Lessons Learned:**
  * Performance optimization must balance cost vs. speed.
  * Monitoring should be set up early, not as an afterthought.

### Next Week Plan

* Conduct load testing and stress testing.
* Implement cost optimization strategies.
* Prepare demo for stakeholder presentation.
* Start writing technical documentation.
