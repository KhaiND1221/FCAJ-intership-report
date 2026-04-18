# Cloud Mastery 3

**Date:** April 11, 2026
**Location:** Hall A - FPT University HCMC, Ho Chi Minh City
**Role:** Attendee (FCJ Cloud Intern - Team NeuraX)

## Event Description

"Cloud Mastery 3" was the final meetup in the Cloud Mastery series. The session focused in-depth on AWS Networking and Security services, helping interns and developers build secure access control systems, optimize network infrastructure costs, and protect applications from external attacks.

## Main Activities

The event was divided into 3 technical sessions covering network infrastructure, identity and access management, and application firewalls:

**Session 1: VPC Networking - NAT Gateway, Security Group & NACL**  
Detailed analysis of network data flow. Explained the ephemeral port allocation mechanism (ports 1024–65535) of NAT Gateway and the differences between Zonal and Regional NAT. Deep dive into comparing Security Groups (Stateful, attached at the ENI network layer, automatically tracks connection state) versus Network ACLs (Stateless, attached at the Subnet layer, strictly follows numbered rules in ascending order and supports both Allow/Deny rules).

**Session 2: IAM Deep Dive, SSO & SCP**
Focused on Identity and Access Management (IAM). Emphasized best practices such as the principle of least privilege, avoiding wildcard `*` usage, and enforcing MFA. Introduced advanced concepts including AWS IAM Identity Center (formerly SSO) for single sign-on, and distinguished between Permission Boundaries (scoping permissions for users/roles) and SCPs - Service Control Policies (acting as "traffic signs" that limit maximum permissions across an entire AWS Organizations structure).

**Session 3: Application Security & AWS Firewalls**
Addressed the security challenge of scaling systems to prevent tens of thousands of dollars in losses from bot or hacker attacks (such as DDoS). Presented 4 core services: AWS WAF (placed in front of CloudFront/ALB to filter SQL Injection and XSS), AWS Shield (DDoS protection), AWS Network Firewall (controls Inbound/Outbound traffic at the VPC level), and AWS Firewall Manager (centrally manages security rules across multiple accounts in an enterprise).

## Outcomes

- **Multi-layer firewall setup:** Gained a clear understanding of how to combine Security Groups for host-level protection with Network ACLs for blocking and opening network flows at the Subnet level.
- **Secure credentials management:** Minimized the creation and use of Long-term Access Keys. Shifted toward Short-term credentials via STS and SSO so sessions automatically expire, protecting resources in the event of a key leak.
- **Avoiding critical security leaks:** Understood the severity of committing `.env` files (containing secret keys) to platforms like GitHub, which can lead to hackers hijacking resources and demanding ransom (Ransomware) or using them for crypto mining.
- **Protecting scale costs:** Recognized that Auto Scaling is a double-edged sword without AWS WAF and Shield in front to block bad requests, leading to sudden AWS bill spikes from application-layer DDoS attacks.
