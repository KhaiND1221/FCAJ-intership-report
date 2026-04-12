# 4.8.4 NAT Instance

A NAT Instance is an EC2 configured to **forward traffic** from the private subnet to the internet. Without it, ECS Tasks in the private subnet cannot reach Bedrock, Secrets Manager, or Docker Hub.

> **Prerequisites:** Complete [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) and [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure).

---

## Why NAT Instance instead of NAT Gateway?

| | NAT Gateway | NAT Instance (`t4g.nano`) |
| :--- | :--- | :--- |
| **Cost** | ~$32–34/month | ~$3.87/month |
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
| **Cost (ap-southeast-2)** | ~$0.0053/hr (~$3.87/mo × 2 instances) | |

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

> ⚠️ **Do NOT select from the "AWS Marketplace AMIs" tab.** The "Amazon ECS-Optimized Amazon Linux 2023 arm64 AMI" there costs an additional **$0.045/hr** (~$33/mo). It includes Docker and ECS Agent — neither needed for a NAT Instance. The correct AMI is on the **Quick Start AMIs** tab and is **free**.

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

> **Content coming soon.** This section will cover creating a **Launch Template** and **Auto Scaling Group** so that NAT Instances self-heal when they fail — no manual intervention needed. The ASG uses **User Data** (identical to the script above) to configure NAT automatically on each new instance, and calls `ec2:ReplaceRoute` to update the Route Table.
>
> **HA architecture:**
>
> - 1 Launch Template shared by both AZs
> - 2 separate Auto Scaling Groups (one per AZ), each with `DesiredCapacity=1`
> - User Data installs NAT and updates the correct AZ's Route Table
> - When an instance fails, the ASG creates a replacement and the Route Table is updated automatically via `ec2:ReplaceRoute`

---

## Cross-links

- [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) — VPC, Subnets, Security Groups
- [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure) — S3, Secrets Manager, IAM Roles
- [4.8.2 Fargate & ALB](/workshop/4.8-Verify-Setup/4.8.2-Fargate-ALB) — Next: Deploy ECS Service
