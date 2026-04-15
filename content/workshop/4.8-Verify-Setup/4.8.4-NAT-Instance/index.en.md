# 4.8.4 NAT Instance

A NAT Instance is an EC2 configured to **forward traffic** from the private subnet to the internet. Without it, ECS Tasks in the private subnet cannot reach Bedrock, Secrets Manager, or Docker Hub.

> **Prerequisites:** Complete [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) and [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure).

---

## Why NAT Instance instead of NAT Gateway?

| | NAT Gateway | NAT Instance (`t4g.nano`) |
| :--- | :--- | :--- |
| **Cost** | ≈$32–34/month | ≈$3.87/month |
| **High availability** | AWS-managed | Requires ASG configuration |
| **Throughput** | Up to 100 Gbps | 5 Gbps (sufficient for this workshop) |
| **Setup** | Zero config | SSH/SSM to install `iptables` |
| **Savings** | — | **~70%** vs NAT Gateway |

---

## 1. OS and Instance Type

| Criterion | Choice | Reason |
| :--- | :--- | :--- |
| **OS** | Amazon Linux 2023 (AL2023) ARM64 | AWS-optimized, hardened, uses `dnf` |
| **Instance type** | `t4g.nano` | ARM Graviton2, 2 vCPU, 0.5 GB RAM — sufficient for packet forwarding. 5 Gbps bandwidth |
| **Cost (ap-southeast-2)** | ≈$0.0053/hr (≈$3.87/mo × 2 instances) | |

> **Why is t4g.nano enough?** NAT is pure packet forwarding — no heavy CPU or RAM needed. A t4g.nano handles hundreds of MB/s.

---

## 2. Create a Key Pair (for SSH — skip if using SSM)

1. EC2 Console → **Key Pairs** → **Create key pair**.

| Field | Value |
| :--- | :--- |
| **Name** | `nutritrack-api-vpc-pulic-nati-keypair` |
| **Key pair type** | RSA |
| **Private key file format** | `.pem` (Linux/Mac) or `.ppk` (Windows PuTTY) |

1. Click **Create key pair** → the `.pem` file downloads automatically. **Keep it safe — losing it locks you out.**
1. Set permissions: `chmod 400 nutritrack-api-vpc-pulic-nati-keypair.pem`

---

## 3. Launch NAT Instance #1 (AZ ap-southeast-2a)

> 💡 **Two setup approaches — pick one:**
>
> | | Option A: Manual (steps 3→8) | Option B: Launch Template + ASG ⭐ Recommended |
> | :--- | :--- | :--- |
> | **Best for** | Learning, debugging | Production |
> | **NAT config** | Manual via SSH/SSM | Automated via User Data |
> | **Recovery** | ❌ No self-healing | ✅ ASG replaces failed instances |
>
> If you choose **Option B**, skip steps 3→8 and jump to the **NAT Instance HA (ASG)** section.

1. EC2 Console → **Instances** → **Launch instances**.

**General configuration:**

| Field | Value |
| :--- | :--- |
| **Name** | `nutritrack-api-vpc-public-nati01` |
| **Instance type** | `t4g.nano` |
| **Key pair** | `nutritrack-api-vpc-pulic-nati-keypair` |

**Selecting the AMI — important:**

1. Under **Application and OS Images** → type `Amazon Linux 2023`.
1. On the **Quick Start AMIs** tab → select **"Amazon Linux 2023 kernel-6.1 AMI"**.
1. In the **Select** column: choose **`64-bit (Arm), uefi`** ← required for `t4g.nano` (Graviton).

> ⚠️ **Do NOT select from the "AWS Marketplace AMIs" tab.** The "Amazon ECS-Optimized Amazon Linux 2023 arm64 AMI" there costs an additional **$0.045/hr** (≈$33/mo). It includes Docker and ECS Agent — neither needed for a NAT Instance. The correct AMI is on the **Quick Start AMIs** tab and is **free**.

**Network settings:**

| Field | Value |
| :--- | :--- |
| **VPC** | `nutritrack-api-vpc` |
| **Subnet** | `nutritrack-api-vpc-public-alb01` (AZ: ap-southeast-2a) |
| **Auto-assign public IP** | `Enable` ✅ |
| **Security group** | `nutritrack-api-vpc-nat-sg` |

**Advanced details:**

| Field | Value |
| :--- | :--- |
| **IAM instance profile** | `nutritrack-api-vpc-nat-instance-role` |

1. Click **Launch instance**.

---

## 4. Launch NAT Instance #2 (AZ ap-southeast-2c)

Repeat step 3 with these changes only:

| Field | Value |
| :--- | :--- |
| **Name** | `nutritrack-api-vpc-public-nati02` |
| **Subnet** | `nutritrack-api-vpc-public-alb02` (AZ: ap-southeast-2c) |

---

## 5. Disable Source/Destination Check — REQUIRED

**Source/Destination Check** is an EC2 security feature: an instance may only send/receive traffic where **it is the source or destination**. A NAT Instance must **forward** traffic on behalf of other machines — that means source/destination won't be the NAT itself. Without disabling this, AWS drops all forwarded packets.

Do this for **both instances**:

1. EC2 Console → Select `nutritrack-api-vpc-public-nati01`.
1. **Actions** → **Networking** → **Change source/destination check**.
1. Check **Stop** → **Save**.
1. Repeat for `nutritrack-api-vpc-public-nati02`.

---

## 6. Connect to the Instance

Wait for both instances to reach `Running`, then connect using either method below.

### 6A. SSH

```bash
# Linux/Mac
ssh -i "nutritrack-api-vpc-pulic-nati-keypair.pem" ec2-user@<PUBLIC_IPv4>

# Windows PowerShell
ssh -i "C:\Users\<username>\Downloads\nutritrack-api-vpc-pulic-nati-keypair.pem" ec2-user@<PUBLIC_IPv4>
```

### 6B. SSM Session Manager (no key pair needed)

**Prerequisite:** The NAT Instance IAM Role must have `AmazonSSMManagedInstanceCore` attached (see [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure), step 3.4).

1. EC2 Console → Select `nutritrack-api-vpc-public-nati01`.
1. Click **Connect** → **Session Manager** tab → **Connect**.
1. A browser terminal opens (user `ssm-user`; `sudo` works normally).

| | SSH | SSM Session Manager |
| :--- | :--- | :--- |
| Port 22 required | ✅ | ❌ |
| Key pair `.pem` required | ✅ | ❌ |
| IAM Role required | ❌ | ✅ `AmazonSSMManagedInstanceCore` |
| CloudTrail audit | ❌ | ✅ |

---

## 7. NAT Setup Script

After connecting (SSH or SSM), paste and run the full script below:

```bash
#!/bin/bash
set -e

echo "=============================================="
echo " NutriTrack NAT Instance Setup"
echo " Host: $(hostname) | $(date)"
echo "=============================================="

# IMDSv2: Fetch token to query instance metadata (required on AL2023)
IMDS_TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" --max-time 3)

# ── [1/7] IP Forwarding ──
echo ""
echo "=== [1/7] Enable IP Forwarding ==="
sudo bash -c 'echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/custom-nat.conf'
sudo sysctl -p /etc/sysctl.d/custom-nat.conf
echo "✅ ip_forward = $(sudo sysctl -n net.ipv4.ip_forward)"

# ── [2/7] iptables ──
echo ""
echo "=== [2/7] Install iptables-services ==="
sudo dnf install iptables-services -y -q
sudo systemctl enable iptables
sudo systemctl start iptables
echo "✅ iptables: $(sudo systemctl is-active iptables)"

# ── [3/7] MASQUERADE ──
echo ""
echo "=== [3/7] NAT MASQUERADE rule ==="
IFACE=$(ip route get 8.8.8.8 | awk '{print $5; exit}')
PRIVATE_IP=$(curl -s -H "X-aws-ec2-metadata-token: $IMDS_TOKEN" \
  --max-time 3 http://169.254.169.254/latest/meta-data/local-ipv4)
echo "   Interface : $IFACE"
echo "   Private IP: $PRIVATE_IP"
sudo iptables -t nat -A POSTROUTING -o "$IFACE" -s 10.0.0.0/16 -j MASQUERADE
echo "✅ MASQUERADE rule added"

# ── [4/7] FORWARD (flush default REJECT first) ──
echo ""
echo "=== [4/7] Flush FORWARD + ACCEPT rules ==="
sudo iptables -F FORWARD
sudo iptables -A FORWARD -i "$IFACE" -o "$IFACE" -m state \
  --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i "$IFACE" -o "$IFACE" -j ACCEPT
ACCEPT_COUNT=$(sudo iptables -L FORWARD -n | grep -c "ACCEPT" || true)
REJECT_COUNT=$(sudo iptables -L FORWARD -n | grep -c "REJECT" || true)
echo "✅ FORWARD: $ACCEPT_COUNT ACCEPT | $REJECT_COUNT REJECT (must be 0)"

# ── [5/7] Persist rules across reboots ──
echo ""
echo "=== [5/7] Save rules ==="
sudo iptables-save | sudo tee /etc/sysconfig/iptables > /dev/null
echo "✅ Saved: $(sudo grep -c 'ACCEPT\|MASQUERADE' /etc/sysconfig/iptables) rules"

# ── [6/7] Verify configuration ──
echo ""
echo "=== [6/7] Verify ==="
echo "   ip_forward    : $(sudo sysctl -n net.ipv4.ip_forward)  → must be 1"
echo "   MASQUERADE    : $(sudo iptables -t nat -L POSTROUTING -n | grep -c MASQUERADE) rule(s)"
echo "   FORWARD ACCEPT: $(sudo iptables -L FORWARD -n | grep -c ACCEPT || echo 0) rule(s)"
echo "   FORWARD REJECT: $(sudo iptables -L FORWARD -n | grep -c REJECT || echo 0) rule(s) → must be 0"

# ── [7/7] Test internet connectivity ──
echo ""
echo "=== [7/7] Test internet connectivity ==="
PUBLIC_IP=$(curl -sf --max-time 5 https://api.ipify.org 2>/dev/null || echo "")

echo ""
echo "=============================================="
if [[ -n "$PUBLIC_IP" ]]; then
    AZ=$(curl -s -H "X-aws-ec2-metadata-token: $IMDS_TOKEN" \
      --max-time 3 http://169.254.169.254/latest/meta-data/placement/availability-zone)
    echo " ✅ NAT Instance READY"
    echo "    Private IP : $PRIVATE_IP"
    echo "    Public IP  : $PUBLIC_IP"
    echo "    Interface  : $IFACE"
    echo "    AZ         : $AZ"
else
    echo " ❌ NAT Instance NOT WORKING"
    echo ""
    echo " DEBUG CHECKLIST:"
    echo " [1] ip_forward    : $(sudo sysctl -n net.ipv4.ip_forward) (must be 1)"
    echo " [2] MASQUERADE    : $(sudo iptables -t nat -L POSTROUTING -n | grep MASQUERADE || echo 'MISSING')"
    echo " [3] FORWARD chain :"
    sudo iptables -L FORWARD -n --line-numbers
    echo " [4] Default route : $(ip route | grep default || echo 'MISSING')"
    echo ""
    echo " Common causes:"
    echo "   A. Source/Destination Check not disabled"
    echo "   B. SG Outbound doesn't allow HTTPS/HTTP to 0.0.0.0/0"
    echo "   C. Public subnet Route Table missing 0.0.0.0/0 → IGW"
    echo "   D. FORWARD chain still has a REJECT rule above ACCEPT"
fi
echo "=============================================="
```

> **Script overview:**
>
> - **IP Forwarding** (`net.ipv4.ip_forward = 1`): Allows the Linux kernel to forward packets from ECS to the internet.
> - **MASQUERADE**: Replaces the source IP of ECS Task packets (10.0.3.x) with the NAT Instance's public IP before sending. Responses are reverse-translated automatically.
> - **Flush FORWARD**: `iptables-services` ships with a default `REJECT` in the FORWARD chain. Without flushing, packets are rejected before reaching the ACCEPT rule.
> - **Persist**: Rules are saved to `/etc/sysconfig/iptables` and auto-loaded on reboot.

**Run the same script on NAT Instance #2.**

---

## 8. Update Route Tables

After both NAT Instances are set up and confirmed working, add the `0.0.0.0/0 → NAT Instance` route to each private Route Table.

### 8.1 Get Instance IDs

```bash
NAT1_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc-public-nati01" \
            "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text --region ap-southeast-2)

NAT2_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc-public-nati02" \
            "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text --region ap-southeast-2)
```

### 8.2 Get Route Table IDs

```bash
RT01_ID=$(aws ec2 describe-route-tables \
  --filters "Name=tag:Name,Values=nutritrack-api-private-rt-01" \
  --query 'RouteTables[0].RouteTableId' \
  --output text --region ap-southeast-2)

RT02_ID=$(aws ec2 describe-route-tables \
  --filters "Name=tag:Name,Values=nutritrack-api-private-rt-02" \
  --query 'RouteTables[0].RouteTableId' \
  --output text --region ap-southeast-2)
```

### 8.3 Add NAT routes

```bash
# AZ-2a private subnet → NAT Instance #1
aws ec2 create-route \
  --route-table-id "$RT01_ID" \
  --destination-cidr-block 0.0.0.0/0 \
  --instance-id "$NAT1_ID" \
  --region ap-southeast-2

# AZ-2c private subnet → NAT Instance #2
aws ec2 create-route \
  --route-table-id "$RT02_ID" \
  --destination-cidr-block 0.0.0.0/0 \
  --instance-id "$NAT2_ID" \
  --region ap-southeast-2
```

Or via Console:

1. VPC Console → **Route tables** → Select `nutritrack-api-private-rt-01`.
1. **Routes** tab → **Edit routes** → **Add route**:
   - **Destination**: `0.0.0.0/0` | **Target**: `Instance` → `nutritrack-api-vpc-public-nati01`
1. Repeat for `nutritrack-api-private-rt-02` → `nutritrack-api-vpc-public-nati02`.

---

## 9. NAT Instance HA (Auto Scaling Group)

A single NAT Instance is a **single point of failure** — if it crashes, all ECS Tasks in that AZ lose internet. An Auto Scaling Group (ASG) solves this:

1. Continuously health-checks the instance.
2. When the instance dies → **creates a replacement** in 2–3 minutes.
3. The new instance runs the **User Data script** → NAT is configured automatically.
4. The script calls `aws ec2 replace-route` to update the Route Table to point at the new instance ID.

**Why a separate ASG per AZ?** A shared ASG can put both instances in the same AZ, leaving the other AZ without NAT. Each AZ needs exactly one instance as its default route — so each needs its own ASG.

### 9.1 Create Launch Template

The Launch Template stores the full config so each ASG-launched instance is identical.

1. EC2 Console → **Launch Templates** → **Create launch template**.

| Field | Value |
| :---- | :---- |
| **Launch template name** | `nutritrack-api-vpc-nati-lt` |
| **Template version description** | `NAT Instance AL2023 ARM64 t4g.nano` |
| **Auto Scaling guidance** | ✅ tick the checkbox |

- **AMI**: Search `Amazon Linux 2023 AMI` → select the latest **Arm 64-bit** version.
- **Instance type**: `t4g.nano`
- **Key pair**: `nutritrack-api-vpc-pulic-nati-keypair`
- **Security groups**: `nutritrack-api-vpc-nat-sg`

**Advanced details:**

- **IAM instance profile**: `nutritrack-api-vpc-nat-instance-role`
- **User data**: paste the script below.

> Before pasting, replace the two Route Table ID placeholders with the real IDs from your VPC Console → **Route tables**:
>
> - `rtb-REPLACE_WITH_RT01_ID` → Route Table ID of `nutritrack-api-private-rt-01`
> - `rtb-REPLACE_WITH_RT02_ID` → Route Table ID of `nutritrack-api-private-rt-02`

```bash
#!/bin/bash
set -e
# ============================================================
# NutriTrack NAT Instance Auto-Setup Script
# Runs automatically at instance boot (User Data / ASG recovery)
# All output logged to /var/log/user-data.log for debugging
# ============================================================
exec > >(tee /var/log/user-data.log) 2>&1

echo "=============================================="
echo " NAT Instance Auto-Setup started: $(date)"
echo "=============================================="

# --- [0] Fetch instance metadata (IMDSv2 required on AL2023) ---
REGION="ap-southeast-2"
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
    -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" --max-time 5)
INSTANCE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    --max-time 5 http://169.254.169.254/latest/meta-data/instance-id)
AZ=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    --max-time 5 http://169.254.169.254/latest/meta-data/placement/availability-zone)
PRIVATE_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    --max-time 5 http://169.254.169.254/latest/meta-data/local-ipv4)
echo "[0] Instance: $INSTANCE_ID | AZ: $AZ | Private IP: $PRIVATE_IP"

# --- [1] Determine Route Table ID by AZ ---
if [[ "$AZ" == "ap-southeast-2a" ]]; then
    ROUTE_TABLE_ID="rtb-REPLACE_WITH_RT01_ID"   # nutritrack-api-private-rt-01
elif [[ "$AZ" == "ap-southeast-2c" ]]; then
    ROUTE_TABLE_ID="rtb-REPLACE_WITH_RT02_ID"   # nutritrack-api-private-rt-02
else
    echo "[ERROR] Unknown AZ: $AZ — stopping"
    exit 1
fi
echo "[1] Route Table: $ROUTE_TABLE_ID (AZ: $AZ)"

# --- [2] Enable IP Forwarding ---
echo "[2] Enabling IP forwarding..."
echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/custom-nat.conf
sysctl -p /etc/sysctl.d/custom-nat.conf
echo "    ip_forward = $(sysctl -n net.ipv4.ip_forward)"

# --- [3] Install and start iptables-services ---
echo "[3] Installing iptables-services..."
dnf install iptables-services -y -q
systemctl enable iptables
systemctl start iptables
echo "    iptables: $(systemctl is-active iptables)"

# --- [4] Configure NAT MASQUERADE ---
echo "[4] Configuring NAT MASQUERADE..."
IFACE=$(ip route get 8.8.8.8 | awk '{print $5; exit}')
echo "    Interface: $IFACE"
iptables -t nat -A POSTROUTING -o "$IFACE" -s 10.0.0.0/16 -j MASQUERADE

# --- [5] FORWARD rules — flush default REJECT first ---
# iptables-services ships with -A FORWARD -j REJECT
# Appending ACCEPT after REJECT would have no effect
echo "[5] Flush FORWARD + add ACCEPT rules..."
iptables -F FORWARD
iptables -A FORWARD -i "$IFACE" -o "$IFACE" -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i "$IFACE" -o "$IFACE" -j ACCEPT
echo "    FORWARD ACCEPT: $(iptables -L FORWARD -n | grep -c ACCEPT) | REJECT: $(iptables -L FORWARD -n | grep -c REJECT || echo 0)"

# --- [6] Persist rules across reboots ---
echo "[6] Saving iptables rules..."
iptables-save > /etc/sysconfig/iptables
echo "    Saved $(grep -c 'ACCEPT\|MASQUERADE' /etc/sysconfig/iptables) rules"

# --- [7] Disable Source/Destination Check (required for NAT) ---
echo "[7] Disabling Source/Dest Check..."
aws ec2 modify-instance-attribute \
    --instance-id "$INSTANCE_ID" \
    --no-source-dest-check \
    --region "$REGION"
echo "    Source/Dest Check: disabled"

# --- [8] Update Route Table to point at this instance ---
echo "[8] Updating Route Table $ROUTE_TABLE_ID..."
aws ec2 replace-route \
    --route-table-id "$ROUTE_TABLE_ID" \
    --destination-cidr-block "0.0.0.0/0" \
    --instance-id "$INSTANCE_ID" \
    --region "$REGION" 2>/dev/null || \
aws ec2 create-route \
    --route-table-id "$ROUTE_TABLE_ID" \
    --destination-cidr-block "0.0.0.0/0" \
    --instance-id "$INSTANCE_ID" \
    --region "$REGION"
echo "    Route updated: 0.0.0.0/0 → $INSTANCE_ID"

# --- [9] Test internet connectivity ---
echo "[9] Testing internet connectivity..."
sleep 3
PUBLIC_IP=$(curl -sf --max-time 10 https://api.ipify.org 2>/dev/null || echo "")

echo ""
echo "=============================================="
if [[ -n "$PUBLIC_IP" ]]; then
    echo " ✅ NAT Instance READY"
    echo "    Instance ID : $INSTANCE_ID"
    echo "    AZ          : $AZ"
    echo "    Private IP  : $PRIVATE_IP"
    echo "    Public IP   : $PUBLIC_IP  ← ECS Tasks will egress via this IP"
    echo "    Interface   : $IFACE"
    echo "    Route Table : $ROUTE_TABLE_ID"
    echo "    Completed at: $(date)"
else
    echo " ❌ Internet test FAILED — see /var/log/user-data.log"
    echo "    ip_forward   : $(sysctl -n net.ipv4.ip_forward)"
    echo "    MASQUERADE   : $(iptables -t nat -L POSTROUTING -n | grep MASQUERADE || echo 'MISSING')"
    echo ""
    echo " Common causes:"
    echo "   A. Source/Dest Check not disabled"
    echo "   B. SG Outbound missing HTTPS/HTTP to 0.0.0.0/0"
    echo "   C. Public subnet Route Table missing 0.0.0.0/0 → IGW"
    echo "   D. FORWARD chain still has a REJECT rule above ACCEPT"
fi
echo "=============================================="
```

After filling in the Route Table IDs, click **Create launch template**.

> To verify User Data after the ASG creates an instance: EC2 Console → select the instance → **Connect** → **Session Manager** → run `sudo cat /var/log/user-data.log`.

### 9.2 Create ASG for NAT Instance #1 (AZ ap-southeast-2a)

1. EC2 Console → **Auto Scaling** → **Auto Scaling Groups** → **Create Auto Scaling group**.

| Field | Value |
| :---- | :---- |
| **Auto Scaling group name** | `nutritrack-api-vpc-nati-asg01` |
| **Launch template** | `nutritrack-api-vpc-nati-lt` |
| **Version** | Default (Latest) |

1. **Network**:
   - **VPC**: `nutritrack-api-vpc`
   - **Availability Zones**: `ap-southeast-2a` **only** ← critical, one AZ per ASG
   - **Subnets**: `nutritrack-api-vpc-public-alb01`

1. **Configure group size**:
   - **Desired capacity**: `1`
   - **Minimum capacity**: `1`
   - **Maximum capacity**: `1`

> Keep min = max = desired = 1. NAT Instances don't need to scale — they just need to always be present.

1. **Health checks**:
   - **Health check type**: `EC2`
   - **Health check grace period**: `60` seconds

1. No further configuration needed → click **Create Auto Scaling group**.

### 9.3 Create ASG for NAT Instance #2 (AZ ap-southeast-2c)

Repeat step 9.2 with only these values changed:

| Field | Value |
| :---- | :---- |
| **Auto Scaling group name** | `nutritrack-api-vpc-nati-asg02` |
| **Availability Zones** | `ap-southeast-2c` **only** |
| **Subnets** | `nutritrack-api-vpc-public-alb02` |

### 9.4 What happens when a NAT Instance crashes?

```text
NAT Instance #1 (AZ-2a) crashes
        │
        ▼
ASG health check detects failure (after 60–120 seconds)
        │
        ▼
ASG terminates old instance + launches new one from Launch Template
    (~2–3 minutes)
        │
        ▼
New instance boots → User Data runs automatically:
  1. Enable IP forwarding
  2. Install iptables + NAT rules
  3. Disable Source/Dest Check
  4. aws ec2 replace-route → Private RT-01 points to new instance ID
        │
        ▼
ECS Tasks in AZ-2a automatically use new NAT (route updated)
        │
        ▼
Internet connectivity restored — no manual intervention needed

Total downtime: ~3–4 minutes

Note: ECS Tasks in AZ-2c are completely unaffected (separate NAT instance)
```

---

## Cross-links

- [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) — VPC, Subnets, Security Groups
- [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure) — S3, Secrets Manager, IAM Roles
- [4.8.2 Fargate & ALB](/workshop/4.8-Verify-Setup/4.8.2-Fargate-ALB) — Next: Deploy ECS Service
