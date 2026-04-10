### Week 2 Objectives

* Complete AWS Module 3 & 4.
* Research the AWS Well-Architected Framework.
* Set up advanced load testing and databases.
* Attend the AWS Cloud Day event.

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | ⭐ **EVENT:** AWS re:Invent 2025 Recap - Vietnam Edition <br>&emsp; - NutriTrack Proposal Drafting <br>&emsp; + Wrote Problem Statement & AI Solutions <br>&emsp; + Defined my AI-1 scope | 12/01/2026 | 12/01/2026 | - |
| 2 | - Lab 6: RDS Database & EC2 <br>&emsp; + Install MySQL on EC2 <br>&emsp; + Create Load Balancer & Target Groups <br>&emsp; + Use "Siege" to run load testing (50 concurrent users) on ALBs | 13/01/2026 | 13/01/2026 | [Lab 6](https://000006.awsstudygroup.com/) |
| 3 | - Lab 5: DB connectivity <br>&emsp; + Fixed missing steps in the provided lab manual regarding connecting RDS to MySQL | 14/01/2026 | 14/01/2026 | [Lab 5](https://000005.awsstudygroup.com/) |
| 4 | - Participate in **AWS Cloud Day** (Gen AI & Data Track) | 15/01/2026 | 15/01/2026 | [AWS Cloud Day] |
| 5-6 | - Lab 10: Retry Route 53 hybrid DNS & Microsoft AD <br> - Lab 8: CloudWatch Metrics & Dashboards <br> - Lab 14: Ubuntu config setup <br> - Research: AWS Well-Architected Framework (6 pillars) | 16/01/2026 | 17/01/2026 | [Lab 8](https://000008.awsstudygroup.com/) <br> [Well-Architected Docs] |

### Week 2 Achievements

* **Database & Load Balancing:**
  * Successfully hosted a database utilizing RDS (Lab 6) and connected a MySQL node on EC2.
  * Installed `Siege` on an EC2 instance to simulate intense HTTP Load Testing leading to Auto-scaling/ALB failovers.

* **Monitoring Fundamentals:**
  * Mastered Amazon CloudWatch (Lab 8), configuring robust ALARMS and monitoring graphical dashboards for tracking resource strains.
  
* **Architecture Design Theory:**
  * Synthesized the 6 Pillars of the AWS Well-Architected Framework (Operational Excellence, Security, Reliability, Performance, Cost, Sustainability), utilizing the AWS Well-Architected Tool concept to evaluate workloads.

### Challenges & Lessons

* **Challenges:**
  * Old lab scripts (e.g., Paessler Webstress) were disabled/unavailable, requiring me to find open-source alternatives like Siege for Linux.
  * Incomplete instructions during Lab 5 caused DB connection strings to fail initially.

* **Lessons Learned:**
  * You cannot blindly follow cloud tutorials. Technical intuition (such as manually CD'ing into the application directory or adjusting the connection string protocol) is mandatory to succeed in real engineering tasks.

### Next Week Plan

* Complete Module 5 (Advanced Storage & IAM Concepts).
* Restrict IAM and EC2 behaviors.
* Participate in Lab 18 (AWS Security Hub).
