# 4.8.1 VPC & Network Setup

This section builds the AWS network foundation for the NutriTrack API: a dedicated VPC, 4 subnets across 2 AZs, Internet Gateway, Route Tables, 3 Security Groups, and an S3 Gateway VPC Endpoint.

> **Region:** `ap-southeast-2` (Sydney) | **Estimated time:** 45–60 minutes

## Why this architecture?

| Decision | Reason |
| :--- | :--- |
| **ECS Private Subnet** | Containers have no public IP — no direct attack surface |
| **ALB Internet-facing** | Single ingress point from the internet, hides container IPs |
| **NAT Instance** (vs NAT Gateway) | **~70% cost savings** (~$10/mo vs ~$34/mo) |
| **S3 Gateway VPCE** | **Free** S3 access — no internet, no NAT |
| **2 × NAT Instance (1 per AZ)** | True HA: one AZ fails, the other keeps serving |
| **Fargate SPOT ARM64** | Additional ~70% compute cost savings |

## Internet egress per component

| Component | How it reaches the internet | Cost |
| :--- | :--- | :--- |
| S3 `nutritrack-cache-*` | **S3 Gateway VPCE** — private path, bypasses NAT | **Free** |
| Bedrock Runtime | NAT Instance → Internet | Data transfer charges apply |
| Secrets Manager | NAT Instance → Internet | Data transfer charges apply |
| CloudWatch Logs | NAT Instance → Internet | Data transfer charges apply |
| Docker Hub image pull | NAT Instance → Internet | Data transfer charges apply |

---

## 1. Create the VPC

A **VPC (Virtual Private Cloud)** is your private network on AWS. Every resource (ECS, ALB, NAT Instance) lives inside it.

### 1.1 Create VPC

1. Sign in to the **AWS Console** → Region **`ap-southeast-2`** (Sydney).
1. Search for **VPC** → Click **VPC**.
1. Left panel → **Your VPCs** → Click **Create VPC**.
1. Configure:

| Field | Value |
| :--- | :--- |
| **Resources to create** | `VPC only` |
| **Name tag** | `nutritrack-api-vpc` |
| **IPv4 CIDR** | `10.0.0.0/16` |
| **IPv6 CIDR** | No IPv6 CIDR block |
| **Tenancy** | Default |

1. Click **Create VPC**.

### 1.2 Enable DNS for the VPC

After creation, enable two DNS features so ECS and VPC Endpoints work correctly:

1. Select VPC `nutritrack-api-vpc` → **Actions** → **Edit VPC settings**.
1. Enable both checkboxes:
   - ✅ `Enable DNS resolution` — allows internal hostname resolution
   - ✅ `Enable DNS hostnames` — assigns hostnames to EC2/ENIs inside the VPC
1. Click **Save**.

> **Why enable DNS?** VPC Interface Endpoints use private DNS to resolve AWS service addresses (e.g., `s3.ap-southeast-2.amazonaws.com`). Without this, endpoints won't work.

---

## 2. Create Subnets

The system uses **4 subnets** across **2 Availability Zones** (`ap-southeast-2a` and `ap-southeast-2c`):

| Subnet | AZ | CIDR | Type |
| :--- | :--- | :--- | :--- |
| `nutritrack-api-vpc-public-alb01` | ap-southeast-2a | `10.0.1.0/24` | Public (ALB + NAT Instance #1) |
| `nutritrack-api-vpc-public-alb02` | ap-southeast-2c | `10.0.2.0/24` | Public (ALB + NAT Instance #2) |
| `nutritrack-api-vpc-private-ecs01` | ap-southeast-2a | `10.0.3.0/24` | Private (ECS Tasks) |
| `nutritrack-api-vpc-private-ecs02` | ap-southeast-2c | `10.0.4.0/24` | Private (ECS Tasks) |

### 2.1 Create all 4 subnets

1. VPC Console → **Subnets** → **Create subnet**.
1. **VPC ID**: Select `nutritrack-api-vpc`.
1. Use the **Add new subnet** button to configure each subnet per the table above.
1. Click **Create subnet** to create all 4 at once.

### 2.2 Enable Auto-assign Public IP for public subnets

NAT Instances need a public IP to reach the internet. Enable this for both public subnets:

1. Select `nutritrack-api-vpc-public-alb01` → **Actions** → **Edit subnet settings**.
1. Check **Enable auto-assign public IPv4 address** → **Save**.
1. Repeat for `nutritrack-api-vpc-public-alb02`.

> **Do not enable** this for the 2 private subnets — ECS Tasks must not have public IPs.

---

## 3. Internet Gateway & Route Tables

### 3.1 Create the Internet Gateway

1. VPC Console → **Internet gateways** → **Create internet gateway**.
1. **Name tag**: `nutritrack-api-igw` → **Create internet gateway**.
1. After creation → **Actions** → **Attach to VPC** → Select `nutritrack-api-vpc` → **Attach internet gateway**.

### 3.2 Public Route Table

1. VPC Console → **Route tables** → **Create route table**.

| Field | Value |
| :--- | :--- |
| **Name** | `nutritrack-api-public-rt` |
| **VPC** | `nutritrack-api-vpc` |

1. Click **Create route table**.
1. Select `nutritrack-api-public-rt` → **Routes** tab → **Edit routes** → **Add route**:
   - **Destination**: `0.0.0.0/0` | **Target**: `Internet Gateway` → `nutritrack-api-igw`
1. **Subnet associations** tab → **Edit subnet associations** → Check both public subnets:
   - ✅ `nutritrack-api-vpc-public-alb01`
   - ✅ `nutritrack-api-vpc-public-alb02`
1. Click **Save associations**.

### 3.3 Private Route Table AZ-2a

> ⚠️ Create the route table now but **do not add the NAT route yet**. The NAT route (`0.0.0.0/0 → NAT Instance`) is added after the NAT Instances are created (see [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance)).

1. Create a route table with **Name**: `nutritrack-api-private-rt-01`, **VPC**: `nutritrack-api-vpc`.
1. **Subnet associations** → Associate `nutritrack-api-vpc-private-ecs01`.

### 3.4 Private Route Table AZ-2c

1. Create a route table with **Name**: `nutritrack-api-private-rt-02`, **VPC**: `nutritrack-api-vpc`.
1. **Subnet associations** → Associate `nutritrack-api-vpc-private-ecs02`.

---

## 4. Security Groups

A Security Group is a **virtual firewall** at the port/protocol level. Create them in this exact order — later SGs reference earlier ones.

**Order:** ALB SG → ECS SG → NAT SG → Update ALB SG Outbound

### 4.1 ALB Security Group — `nutritrack-api-vpc-alb-sg`

Attached to the **Application Load Balancer**. Accepts HTTP from the internet, forwards to ECS Tasks.

1. VPC Console → **Security groups** → **Create security group**.

| Field | Value |
| :--- | :--- |
| **Security group name** | `nutritrack-api-vpc-alb-sg` |
| **Description** | `ALB Security Group - receives HTTP from internet` |
| **VPC** | `nutritrack-api-vpc` |

**Inbound Rules:**

| Type | Protocol | Port | Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| HTTP | TCP | 80 | `0.0.0.0/0` | Accept HTTP from anywhere |

**Outbound Rules:** Keep the default `All traffic 0.0.0.0/0` for now — update in step 4.4 once the ECS SG exists.

1. Click **Create security group**.

---

### 4.2 ECS Security Group — `nutritrack-api-vpc-ecs-sg`

Attached to **ECS Fargate Tasks**. Tasks accept traffic only from the ALB; they send traffic only to NAT Instance or S3 VPCE.

| Field | Value |
| :--- | :--- |
| **Security group name** | `nutritrack-api-vpc-ecs-sg` |
| **Description** | `ECS Task SG - only from ALB, out to NAT or S3 VPCE` |
| **VPC** | `nutritrack-api-vpc` |

**Inbound Rules:**

| Type | Protocol | Port | Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| Custom TCP | TCP | 8000 | `nutritrack-api-vpc-alb-sg` | Accept requests from ALB only |

> **Why reference an SG instead of an IP?** ALB IPs change over time (one IP per AZ). An SG reference always tracks the correct addresses.

**Outbound Rules:**

| Type | Protocol | Port | Destination | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| HTTPS | TCP | 443 | `nutritrack-api-vpc-nat-sg` | Bedrock, Secrets Manager, CloudWatch, Docker Hub |
| HTTP | TCP | 80 | `nutritrack-api-vpc-nat-sg` | Fallback for external APIs using HTTP |
| HTTPS | TCP | 443 | S3 prefix list (step 5.3) | S3 access via Gateway VPCE |

> ⚠️ The S3 prefix list rule can't be added yet. After creating the S3 VPCE in Section 5, return here and add a rule with Destination set to the **Managed prefix list**: `com.amazonaws.ap-southeast-2.s3`.

---

### 4.3 NAT Instance Security Group — `nutritrack-api-vpc-nat-sg`

Attached to **NAT Instances**. Forwards traffic from ECS to the internet; allows SSH/SSM for setup.

| Field | Value |
| :--- | :--- |
| **Security group name** | `nutritrack-api-vpc-nat-sg` |
| **Description** | `NAT Instance SG - forward ECS outbound, allow SSH from admin` |
| **VPC** | `nutritrack-api-vpc` |

**Inbound Rules:**

| Type | Protocol | Port | Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| All traffic | All | All | `nutritrack-api-vpc-ecs-sg` | Receive all ECS traffic to forward |
| SSH | TCP | 22 | `<YOUR_PC_IP>/32` | SSH access for setup |

> **Get your IP:** Visit [https://checkip.amazonaws.com](https://checkip.amazonaws.com). Replace `<YOUR_PC_IP>` with your IP (e.g., `123.45.67.89/32`). **Never open SSH to `0.0.0.0/0`.**

**Outbound Rules:**

| Type | Protocol | Port | Destination | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| All traffic | All | All | `0.0.0.0/0` | Forward traffic to the internet |

---

### 4.4 Update ALB SG Outbound

Now that the ECS SG exists, update the ALB SG outbound rule:

1. VPC Console → **Security groups** → Select `nutritrack-api-vpc-alb-sg`.
1. **Outbound rules** tab → **Edit outbound rules** → **Add rule**:
   - Type: `Custom TCP` | Port: `8000` | Destination: `nutritrack-api-vpc-ecs-sg`
1. **Delete** the default `All traffic 0.0.0.0/0` rule if present.
1. Click **Save rules**.

### 4.5 Security Group Chain Diagram

``![Architecture Diagram](/FCAJ-intership-report/workshop-images/4.1-Workshop-overview/architect_v3.drawio.png)``

---

## 5. S3 Gateway VPC Endpoint

The S3 Gateway VPC Endpoint lets ECS Tasks call S3 **via AWS's internal private link** — no internet, no NAT Instance → **completely free**, and faster.

### 5.1 Create the S3 Gateway Endpoint

1. VPC Console → **Endpoints** → **Create endpoint**.

| Field | Value |
| :--- | :--- |
| **Name tag** | `nutritrack-api-vpc-s3-vpce` |
| **Service category** | `AWS services` |
| **Services** | Search `com.amazonaws.ap-southeast-2.s3` → select **Type: Gateway** |
| **VPC** | `nutritrack-api-vpc` |

1. **Route tables** — Check both private route tables:
   - ✅ `nutritrack-api-private-rt-01`
   - ✅ `nutritrack-api-private-rt-02`

> AWS automatically adds an S3 route to each selected route table. ECS Tasks in both AZs can access S3 through the VPCE.

1. **Policy**: Keep `Full access` (default) → Click **Create endpoint**.

### 5.2 Verify

1. VPC Console → **Route tables** → Select `nutritrack-api-private-rt-01` → **Routes** tab.
1. Confirm a route like `pl-xxxxxxxx (com.amazonaws.ap-southeast-2.s3)` → Target: `vpce-xxx` is present.
1. Repeat for `nutritrack-api-private-rt-02`.

### 5.3 Update ECS SG Outbound for S3

1. **Security groups** → `nutritrack-api-vpc-ecs-sg` → **Outbound rules** tab → **Edit outbound rules**.
1. Add rule: Type `HTTPS` | Port `443` | Destination: **Prefix list** → `com.amazonaws.ap-southeast-2.s3`.
1. **Save rules**.

---

## Cross-links

- [4.8.2 Fargate & ALB](/workshop/4.8-Verify-Setup/4.8.2-Fargate-ALB) — ECS Cluster, Task Definition, Service, Load Balancer
- [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure) — S3 Bucket, Secrets Manager, IAM Roles
- [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance) — NAT Instance setup and Route Table wiring
