# Project Regulations

## 1. Mandatory Project Content

The Project (final report) must be written in two languages: **English and Vietnamese**.
The report/project must contain the following minimum sections:

### 1.1. Student Information

* Full Name
* Phone Number
* Email
* University
* Major
* Internship Company
* Internship Position
* Internship Period

### 1.2. Worklog (Weekly Diary)

* **Duration:** Specify clearly from **Week 1 → Week 12**.
* **Weekly Description:**
* Work completed.
* Results achieved.



### 1.3. Proposal

* Project Overview
* Objectives
* Problem Statement
* Solution Architecture
* Timeline
* Budget (if any)
* Risks
* *Example: IoT Weather Platform on AWS*

### 1.4. Events Participated

For each event (Event 1, Event 2, ...), include:

* Event Name
* Time
* Location
* Role
* Main Content
* Key Takeaways / Personal Contributions

### 1.5. Workshop (Main Technical Project)

* Overview
* Prerequisites
* Architecture Description
* **Practice Steps (Example):**
* Access S3 from VPC / on-prem
* Configure VPC Endpoint
* IAM Policy
* Test
* Clean-up



### 1.6. Self-evaluation

Evaluate based on the criteria below. For each criterion, select **Good / Fair / Average** and provide comments:

* Knowledge
* Learning Ability
* Proactivity
* Discipline
* Communication
* Teamwork
* Problem Solving
* Contribution to Project

### 1.7. Sharing and Feedback

* Feelings about the program.
* Satisfaction level.
* Areas for improvement.
* Would you recommend the program to friends? Why?

---

## 2. Format and Tools

### 2.1. Recommended Format

* **Workshop Website:** Use the **Hugo template**.
* **Suggested Template:** `fcj-workshop-template` on GitHub.

### 2.2. Mandatory Requirements

* Must include **full content in both languages (VI / EN)** for the main sections.
* **Clear structure** following the mentioned sections:
* Illustrative images.
* Architecture diagrams.
* Code snippets.
* Attachments (CloudFormation, Dockerfile, scripts, etc.) if suitable.


* You may refer to the **sample project** (link provided in documentation).
* **Note:** The project must be self-written; copying the sample project verbatim is prohibited.

---

## 3. Technical Project Requirements (Workshop)

**The project should:**

* Be a **real-world use case on AWS**:
* Serverless application
* Data pipeline
* Monitoring system
* IoT
* ...


* Use **at least 3 AWS services**.

### 3.1. The project must demonstrate

* **Architecture Design:**
* Architecture diagram.
* Services used.
* Reasoning for service selection.


* **End-to-end Deployment:**
* Detailed steps.
* Reproducible by others.


* **Testing & Measurement:**
* Logs
* Metrics
* Alerts


* **Optimization:**
* Cost
* Basic Security


* **Clean-up:** To avoid incurring costs.

---

## 4. Sample Grading Rubric

### 4.1. Idea & Objectives (1.0 point)

* **Context & Problem:**
* What is the system used for?
* Who are the customers?
* What problem does it solve?
* *Example: weather monitoring, logging, monitoring microservices.*


* **Specific Objectives:**
* Desired output (dashboard, API, alert, ...).
* Success criteria.


* **Program Suitability:**
* Use-case aligned with FCAJ / AWS.
* Not too generic; must not deviate from the cloud topic.



### 4.2. Architecture & Technical Design (2.0 points)

* **Architecture Diagram:**
* Clear diagram (draw.io, PowerPoint, Excalidraw, ...).
* Fully represents AWS services and data flow.


* **Service Selection:**
* Explain why specific services were chosen (S3 / Lambda / API Gateway / DynamoDB, ...).
* Justification based on cost, simplicity, serverless, managed service.


* **Security & Basic IAM:**
* IAM Role.
* Principle of Least Privilege.
* Limit public resources.
* No hard-coded access keys.


* **Scalability & Operations:**
* Scale: Auto Scaling, event-driven, SQS, ...
* Logging / Monitoring: CloudWatch, Alarms.



### 4.3. Deployment & Step-by-Step Lab (2.0 points)

* **Prerequisites:**
* AWS Account.
* Region.
* Tools: AWS CLI, SAM / CDK / Terraform (if any).
* Necessary IAM permissions.


* **Detailed Guide:**
* Clearly divided steps (Step 1, Step 2, ...).
* Includes screenshots / CLI / console guide.
* Execute end-to-end successfully.


* **Test & Validation:**
* Send requests.
* View logs.
* Check metrics.
* Error testing.
* Expected results.


* **Clean-up:**
* Delete resources.
* Delete stack.
* Delete bucket.
* Delete alarms.



### 4.4. Workshop Documentation & Presentation (0.5 points)

* **Bilingual:**
* Main content available in both Vietnamese and English.
* Accurate translation; no serious deviations in meaning.


* **Website Structure:**
* Follows template layout.
* Clear Table of Contents.
* Logical navigation.


* **Presentation:**
* Readable text.
* Includes code blocks.
* Includes illustrations.
* Minimal spelling errors.



### 4.5. Personal Contribution (0.5 points)

* **Level of Effort:**
* Not just copying the sample.


* **Customization:**
* Added features.
* Added services.
* Different data.
* Different testing methods.


* **Short Reflection:**
* Challenges encountered.
* How they were resolved.
* Future development directions.