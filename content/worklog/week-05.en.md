### Week 5 Objectives

* Shield the NeuraX Application interfaces from typical web exploits.
* Deploy AWS Web Application Firewall (WAF) for the API Gateway and CloudFront.
* Implement Rate Limiting to mitigate basic DDoS architectures.
* Validate the WAF rules handling through practical payload testing.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Application Protection Setup <br>&emsp; + Provision AWS WAF Web ACLs <br>&emsp; + Attach Web ACLs to CloudFront distribution | 02/02/2026 | 02/02/2026 | [Application Protection with AWS WAF](https://000026.awsstudygroup.com) |
| 2 | - Common Vulnerability Defense <br>&emsp; + Import AWS Managed Rules (Core rule set, SQLi, XSS) <br>&emsp; + Customize rules to reduce false positives for the API | 03/02/2026 | 03/02/2026 | [AWS Sec Best Practices] |
| 3 | - DDoS Mitigation <br>&emsp; + Configure rate-based rules (e.g., 500 requests / 5 mins) <br>&emsp; + Enable AWS Shield Standard to protect against Layer 3/4 attacks | 04/02/2026 | 04/02/2026 | [WAF Rate Limiting Docs] |
| 4 | - WAF Logging & Analytics <br>&emsp; + Route WAF logs to CloudWatch logs / S3 <br>&emsp; + Explore requests visualization | 05/02/2026 | 05/02/2026 | [CloudWatch Logs] |
| 5 | - WAF Policy Testing <br>&emsp; + Manually test payloads using `curl` and Burp Suite <br>&emsp; + Verify 403 Forbidden responses on malevolent requests | 06/02/2026 | 06/02/2026 | [OWASP Top 10 Testing] |
| 6-7 | - Rule Optimization <br>&emsp; + Review flagged logs from the dev team's traffic <br>&emsp; + Adjust filtering modes properly | 07/02/2026 | 08/02/2026 | [Audit Logs] |

### Week 5 Achievements

* **Implemented Cloud Perimeter Security:**
  * Successfully deployed and attached **AWS WAF** to our CloudFront edges and the regional API Gateway, establishing a layer-7 security checkpoint for all incoming traffic.
  * AWS Managed rule sets completely block attempts of SQL injection, Cross-Site Scripting (XSS), and bad bot signatures.
  
* **DDoS Resiliency:**
  * Created custom rate-based rules that block IPs if they exceed 500 requests within a 5-minute sliding window, successfully preventing brute-force attacks on our Cognito login endpoints.

* **Monitoring Integration:**
  * Enabled full-request logging. If a payload is dropped, the team can analyze the headers and body in CloudWatch to determine if it was a false positive.

### Challenges & Lessons

* **Challenges:**
  * The WAF rules initially blocked valid API traffic (`false positives`) because some NutriTrack meal logging formats triggered the SQLi pattern match.
  * Parsing standard WAF JSON logs in CloudWatch was tedious and hard to read.

* **Solutions:**
  * Switched the aggressive rule to "Count" mode, studied the blocked parameters, and created an exclusion rule exception for the specific JSON payload field.
  * Used CloudWatch Log Insights queries to extract and format the blocked request URIs and client IPs quickly.

* **Lessons Learned:**
  * Never deploy WAF rules in strict "Block" mode immediately. Always use "Count" mode for a few days to establish a traffic baseline and eliminate false positives before enforcing blocks.
  * Security tools must not block legitimate business functionality.

### Next Week Plan

* Shift focus to **Data Protection**.
* Implement data-at-rest encryption for S3 buckets and DynamoDB using **AWS KMS**.
* Remove configuration secrets from code by migrating to **AWS Secrets Manager**.
