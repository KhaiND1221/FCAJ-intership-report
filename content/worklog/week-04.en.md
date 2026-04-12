### Week 4 Objectives

* Study AWS WAF (Web Application Firewall) and common web attack mitigation techniques.
* Learn Amazon CloudFront CDN distribution concepts and HTTPS/SSL configuration.
* Explore Route 53 DNS management and hosted zone architecture.
* Introduction to Amazon Bedrock — Foundation Model catalog and access procedures.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - AWS WAF Fundamentals <br>&emsp; + Studied Web ACL structure: Rules, Rule Groups, and managed rule sets <br>&emsp; + Learned OWASP Top 10 attack vectors (SQLi, XSS, CSRF) and how WAF mitigates them | 10/02/2026 | 10/02/2026 | [AWS WAF Docs](https://docs.aws.amazon.com/waf/) |
| 2 | - Amazon CloudFront CDN <br>&emsp; + Explored CloudFront distribution concepts: edge locations, origins, cache behaviors <br>&emsp; + Studied HTTPS/SSL certificate integration with AWS Certificate Manager (ACM) | 11/02/2026 | 11/02/2026 | [CloudFront Docs](https://docs.aws.amazon.com/cloudfront/) |
| 3 | - WAF + CloudFront Integration <br>&emsp; + Researched how WAF Web ACLs attach to CloudFront distributions <br>&emsp; + Studied rate-based rules and geo-restriction configurations | 12/02/2026 | 12/02/2026 | [WAF + CloudFront](https://000039.awsstudygroup.com) |
| 4 | - Route 53 DNS Deep Dive <br>&emsp; + Explored hosted zones, record types (A, CNAME, ALIAS), and routing policies <br>&emsp; + Studied DNS failover and health check mechanisms | 13/02/2026 | 13/02/2026 | [Route 53 Docs](https://docs.aws.amazon.com/route53/) |
| 5 | - Amazon Bedrock Introduction <br>&emsp; + Explored the Foundation Model catalog and pricing models <br>&emsp; + Researched Qwen3-VL capabilities for food image recognition use cases | 14/02/2026 | 14/02/2026 | [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/) |
| 6 | - Week Review & Project Preparation <br>&emsp; + Consolidated notes on WAF, CloudFront, Route 53, and Bedrock <br>&emsp; + Outlined the NutriTrack infrastructure requirements for the project kickoff | 16/02/2026 | 16/02/2026 | [OWASP Top 10](https://owasp.org/www-project-top-ten/) |

### Week 4 Achievements

* **Web Security Foundation:**
  * Gained comprehensive understanding of AWS WAF — rule groups, managed rules, and integration patterns with CloudFront for OWASP Top 10 protection.

* **CDN & DNS Mastery:**
  * Studied CloudFront distribution architecture and Route 53 DNS management, understanding the full request flow from DNS resolution → CDN edge → origin server.

* **AI Service Awareness:**
  * Introduced to Amazon Bedrock's Foundation Model ecosystem, identifying Qwen3-VL as the target model for NutriTrack's food recognition pipeline.

### Challenges & Lessons

* **Challenges:**
  * The breadth of services (WAF, CloudFront, Route 53, Bedrock) made it challenging to go deep into any single topic within one week.
* **Lessons Learned:**
  * A broad understanding of AWS services before project start enables better architectural decisions. Knowing WAF + CloudFront integration patterns early prevents security gaps in production.

### Next Week Plan

* Begin the NutriTrack project infrastructure phase with the IA-1 teammate.
* Set up the AWS Amplify sandbox environment.
* Develop the AWS cost estimation based on market pricing.
