# 4.8.4 NAT Instance

NAT Instance là một EC2 được cấu hình để **forward traffic** từ Private Subnet ra Internet. Không có NAT Instance, ECS Tasks trong Private Subnet không thể gọi Bedrock, Secrets Manager, hay Docker Hub.

> **Điều kiện trước:** Đã hoàn thành [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) và [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure).

---

## Tại sao dùng NAT Instance thay NAT Gateway?

| | NAT Gateway | NAT Instance (`t4g.nano`) |
| :--- | :--- | :--- |
| **Chi phí** | ~$32–34/tháng | ~$4.33/tháng |
| **HA** | Managed bởi AWS | Cần cấu hình ASG |
| **Throughput** | Lên đến 100 Gbps | 5 Gbps (đủ cho workshop) |
| **Setup** | Tạo xong là dùng | Cần SSH/SSM để cài `iptables` |
| **Tiết kiệm** | — | **~70%** so với NAT Gateway |

---

## 1. Lựa chọn OS và Instance Type

| Tiêu chí | Lựa chọn | Lý do |
| :--- | :--- | :--- |
| **OS** | Amazon Linux 2023 (AL2023) ARM64 | AWS-optimized, bảo mật tốt, `dnf` package manager |
| **Instance type** | `t4g.nano` | ARM Graviton2, 2 vCPU, 0.5 GB RAM — đủ cho NAT forwarding. Băng thông 5 Gbps |
| **Giá (ap-southeast-2)** | ~$0.0059/giờ (~$4.33/tháng × 2 instances) | |

> **Tại sao t4g.nano đủ?** NAT chỉ là "chuyển gói tin" (packet forwarding) — không cần nhiều RAM hay CPU. t4g.nano có thể handle hàng trăm MB/s throughput.

---

## 2. Tạo Key Pair (để SSH — bỏ qua nếu dùng SSM)

1. EC2 Console → **Key Pairs** → **Create key pair**.

| Field | Giá trị |
| :--- | :--- |
| **Name** | `nutritrack-api-vpc-pulic-nati-keypair` |
| **Key pair type** | RSA |
| **Private key file format** | `.pem` (Linux/Mac) hoặc `.ppk` (Windows PuTTY) |

2. Nhấn **Create key pair** → File `.pem` tự động tải về. **Lưu file này cẩn thận — mất là không SSH được**.
3. Set permissions: `chmod 400 nutritrack-api-vpc-pulic-nati-keypair.pem`

---

## 3. Tạo NAT Instance #1 (AZ ap-southeast-2a)

> 💡 **Có 2 cách setup NAT Instance:**
>
> | | Cách A: Thủ công (bước 3→8) | Cách B: Launch Template + ASG ⭐ Khuyến nghị |
> | :--- | :--- | :--- |
> | **Phù hợp** | Lần đầu học, hoặc debug | Production |
> | **NAT config** | Làm tay qua SSH/SSM | User Data tự động |
> | **HA / Recovery** | ❌ Không tự phục hồi | ✅ ASG tự tạo instance mới khi sập |
>
> Nếu chọn **Cách B**, bỏ qua bước 3→8 và xem phần **NAT Instance HA (ASG)** bên dưới.

1. EC2 Console → **Instances** → **Launch instances**.

**Cấu hình chung:**

| Field | Giá trị |
| :--- | :--- |
| **Name** | `nutritrack-api-vpc-public-nati01` |
| **Instance type** | `t4g.nano` |
| **Key pair** | `nutritrack-api-vpc-pulic-nati-keypair` |

**Chọn AMI — quan trọng:**

1. Mục **Application and OS Images** → Gõ `Amazon Linux 2023`.
2. Tab **Quick Start AMIs** → Chọn **"Amazon Linux 2023 kernel-6.1 AMI"**.
3. Ở cột **Select**: chọn radio button **`64-bit (Arm), uefi`** ← bắt buộc vì dùng `t4g.nano` (Graviton).

> ⚠️ **KHÔNG chọn AMI từ tab "AWS Marketplace AMIs"!** AMI "Amazon ECS-Optimized Amazon Linux 2023 arm64" trong Marketplace tốn thêm **$0.045/giờ** (~$33/tháng). AMI đúng ở tab **Quick Start AMIs** — hoàn toàn miễn phí, chỉ trả tiền instance.

**Network settings:**

| Field | Giá trị |
| :--- | :--- |
| **VPC** | `nutritrack-api-vpc` |
| **Subnet** | `nutritrack-api-vpc-public-alb01` (AZ: ap-southeast-2a) |
| **Auto-assign public IP** | `Enable` ✅ |
| **Security group** | `nutritrack-api-vpc-nat-sg` |

**Advanced details:**

| Field | Giá trị |
| :--- | :--- |
| **IAM instance profile** | `nutritrack-api-vpc-nat-instance-role` |

2. Nhấn **Launch instance**.

---

## 4. Tạo NAT Instance #2 (AZ ap-southeast-2c)

Lặp lại bước 3, chỉ thay đổi:

| Field | Giá trị |
| :--- | :--- |
| **Name** | `nutritrack-api-vpc-public-nati02` |
| **Subnet** | `nutritrack-api-vpc-public-alb02` (AZ: ap-southeast-2c) |

---

## 5. Tắt Source/Destination Check — BẮT BUỘC

**Source/Destination Check** là tính năng bảo mật mặc định của EC2: Instance chỉ được gửi/nhận traffic mà **nó là nguồn hoặc đích**. NAT Instance cần **forward traffic** cho máy khác nên phải tắt tính năng này. Nếu không tắt, AWS sẽ **drop tất cả gói tin** được forward.

Thực hiện cho **cả 2 instances**:

1. EC2 Console → Chọn `nutritrack-api-vpc-public-nati01`.
2. **Actions** → **Networking** → **Change source/destination check**.
3. Tick **Stop** (Dừng kiểm tra source/destination) → **Save**.
4. Lặp lại cho `nutritrack-api-vpc-public-nati02`.

---

## 6. Cài đặt NAT trên Instance

Đợi cả 2 instances chuyển sang `Running`, sau đó cài đặt NAT. Có 2 cách kết nối — chọn một trong hai.

### 6A. SSH vào NAT Instance #1

```bash
# Linux/Mac
ssh -i "nutritrack-api-vpc-pulic-nati-keypair.pem" ec2-user@<PUBLIC_IPv4>

# Windows PowerShell
ssh -i "C:\Users\<username>\Downloads\nutritrack-api-vpc-pulic-nati-keypair.pem" ec2-user@<PUBLIC_IPv4>
```

### 6B. SSM Session Manager (không cần Key Pair)

**Điều kiện:** IAM Role của NAT Instance đã có policy `AmazonSSMManagedInstanceCore` (xem [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure), bước 3.4).

1. EC2 Console → Chọn `nutritrack-api-vpc-public-nati01`.
2. Nhấn **Connect** → tab **Session Manager** → **Connect**.
3. Terminal mở trong browser (user `ssm-user`, `sudo` hoạt động bình thường).

| | SSH | SSM Session Manager |
| :--- | :--- | :--- |
| Port 22 cần mở | ✅ | ❌ |
| Key pair `.pem` | ✅ | ❌ |
| IAM Role cần | ❌ | ✅ `AmazonSSMManagedInstanceCore` |
| Audit CloudTrail | ❌ | ✅ |

---

## 7. Script cài đặt NAT (SSH hoặc SSM)

Sau khi kết nối vào instance, paste và chạy toàn bộ script sau:

```bash
#!/bin/bash
set -e

echo "=============================================="
echo " NutriTrack NAT Instance Setup"
echo " Host: $(hostname) | $(date)"
echo "=============================================="

# IMDSv2: Lấy token để query metadata (AL2023 bắt buộc)
IMDS_TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" --max-time 3)

# ── [1/7] IP Forwarding ──
echo ""
echo "=== [1/7] Bật IP Forwarding ==="
sudo bash -c 'echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/custom-nat.conf'
sudo sysctl -p /etc/sysctl.d/custom-nat.conf
echo "✅ ip_forward = $(sudo sysctl -n net.ipv4.ip_forward)"

# ── [2/7] iptables ──
echo ""
echo "=== [2/7] Cài iptables-services ==="
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
echo "✅ MASQUERADE rule thêm thành công"

# ── [4/7] FORWARD (flush REJECT mặc định trước) ──
echo ""
echo "=== [4/7] Flush FORWARD + ACCEPT rules ==="
sudo iptables -F FORWARD
sudo iptables -A FORWARD -i "$IFACE" -o "$IFACE" -m state \
  --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i "$IFACE" -o "$IFACE" -j ACCEPT
ACCEPT_COUNT=$(sudo iptables -L FORWARD -n | grep -c "ACCEPT" || true)
REJECT_COUNT=$(sudo iptables -L FORWARD -n | grep -c "REJECT" || true)
echo "✅ FORWARD: $ACCEPT_COUNT ACCEPT | $REJECT_COUNT REJECT (REJECT phải = 0)"

# ── [5/7] Lưu rules persist qua reboot ──
echo ""
echo "=== [5/7] Lưu rules ==="
sudo iptables-save | sudo tee /etc/sysconfig/iptables > /dev/null
echo "✅ Saved: $(sudo grep -c 'ACCEPT\|MASQUERADE' /etc/sysconfig/iptables) rules"

# ── [6/7] Verify cấu hình ──
echo ""
echo "=== [6/7] Verify ==="
echo "   ip_forward    : $(sudo sysctl -n net.ipv4.ip_forward)  → phải là 1"
echo "   MASQUERADE    : $(sudo iptables -t nat -L POSTROUTING -n | grep -c MASQUERADE) rule(s)"
echo "   FORWARD ACCEPT: $(sudo iptables -L FORWARD -n | grep -c ACCEPT || echo 0) rule(s)"
echo "   FORWARD REJECT: $(sudo iptables -L FORWARD -n | grep -c REJECT || echo 0) rule(s) → phải là 0"

# ── [7/7] Test kết nối Internet ──
echo ""
echo "=== [7/7] Test kết nối Internet ==="
PUBLIC_IP=$(curl -sf --max-time 5 https://api.ipify.org 2>/dev/null || echo "")

echo ""
echo "=============================================="
if [[ -n "$PUBLIC_IP" ]]; then
    AZ=$(curl -s -H "X-aws-ec2-metadata-token: $IMDS_TOKEN" \
      --max-time 3 http://169.254.169.254/latest/meta-data/placement/availability-zone)
    echo " ✅ NAT Instance HOẠT ĐỘNG"
    echo "    Private IP : $PRIVATE_IP"
    echo "    Public IP  : $PUBLIC_IP"
    echo "    Interface  : $IFACE"
    echo "    AZ         : $AZ"
else
    echo " ❌ NAT Instance CHƯA HOẠT ĐỘNG"
    echo ""
    echo " DEBUG CHECKLIST:"
    echo " [1] ip_forward    : $(sudo sysctl -n net.ipv4.ip_forward) (phải là 1)"
    echo " [2] MASQUERADE    : $(sudo iptables -t nat -L POSTROUTING -n | grep MASQUERADE || echo 'KHÔNG CÓ')"
    echo " [3] FORWARD chain :"
    sudo iptables -L FORWARD -n --line-numbers
    echo " [4] Default route : $(ip route | grep default || echo 'KHÔNG CÓ')"
    echo ""
    echo " Nguyên nhân thường gặp:"
    echo "   A. Source/Dest Check chưa tắt"
    echo "   B. SG Outbound không cho HTTPS/HTTP ra 0.0.0.0/0"
    echo "   C. Route Table public subnet thiếu 0.0.0.0/0 → IGW"
    echo "   D. FORWARD chain còn REJECT rule ở trên ACCEPT"
fi
echo "=============================================="
```

> **Script giải thích:**
> - **IP Forwarding** (`net.ipv4.ip_forward = 1`): Cho phép kernel Linux forward gói tin từ ECS ra Internet.
> - **MASQUERADE**: Thay IP nguồn của ECS Task (10.0.3.x) bằng IP public của NAT Instance trước khi gửi ra Internet. Response về, NAT dịch ngược lại.
> - **Flush FORWARD**: `iptables-services` cài sẵn rule `REJECT` mặc định trong FORWARD chain. Nếu không flush, gói tin bị reject trước khi đến rule ACCEPT.
> - **Persist**: Lưu rules vào `/etc/sysconfig/iptables` để tự động load khi reboot.

**Lặp lại script trên cho NAT Instance #2.**

---

## 8. Cập nhật Route Tables

Sau khi cả 2 NAT Instances đã setup và xác nhận hoạt động, thêm route `0.0.0.0/0 → NAT Instance` cho mỗi Private Route Table.

### 8.1 Lấy Instance ID

```bash
# Lấy Instance ID của NAT #1
NAT1_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc-public-nati01" \
            "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text \
  --region ap-southeast-2)
echo "NAT Instance #1: $NAT1_ID"

# Lấy Instance ID của NAT #2
NAT2_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=nutritrack-api-vpc-public-nati02" \
            "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text \
  --region ap-southeast-2)
echo "NAT Instance #2: $NAT2_ID"
```

### 8.2 Lấy Route Table IDs

```bash
# Route Table cho AZ-2a
RT01_ID=$(aws ec2 describe-route-tables \
  --filters "Name=tag:Name,Values=nutritrack-api-private-rt-01" \
  --query 'RouteTables[0].RouteTableId' \
  --output text \
  --region ap-southeast-2)

# Route Table cho AZ-2c
RT02_ID=$(aws ec2 describe-route-tables \
  --filters "Name=tag:Name,Values=nutritrack-api-private-rt-02" \
  --query 'RouteTables[0].RouteTableId' \
  --output text \
  --region ap-southeast-2)
```

### 8.3 Thêm routes

```bash
# Route Table AZ-2a → NAT Instance #1
aws ec2 create-route \
  --route-table-id "$RT01_ID" \
  --destination-cidr-block 0.0.0.0/0 \
  --instance-id "$NAT1_ID" \
  --region ap-southeast-2

# Route Table AZ-2c → NAT Instance #2
aws ec2 create-route \
  --route-table-id "$RT02_ID" \
  --destination-cidr-block 0.0.0.0/0 \
  --instance-id "$NAT2_ID" \
  --region ap-southeast-2
```

Hoặc thực hiện trong Console:

1. VPC Console → **Route tables** → Chọn `nutritrack-api-private-rt-01`.
2. Tab **Routes** → **Edit routes** → **Add route**:
   - **Destination**: `0.0.0.0/0` | **Target**: `Instance` → `nutritrack-api-vpc-public-nati01`
3. Lặp lại cho `nutritrack-api-private-rt-02` → `nutritrack-api-vpc-public-nati02`.

---

## 9. NAT Instance HA (Auto Scaling Group)

> **Nội dung đang cập nhật.** Phần này sẽ hướng dẫn tạo **Launch Template** và **Auto Scaling Group** để NAT Instance tự phục hồi khi sập — không cần can thiệp thủ công. ASG sẽ dùng **User Data** (giống script trên) để tự động setup NAT khi instance mới được tạo, và tự động gọi `ReplaceRoute` để cập nhật Route Table.
>
> **Kiến trúc HA:**
> - 1 Launch Template dùng chung cho cả 2 AZ
> - 2 Auto Scaling Group riêng biệt (1 per AZ), mỗi ASG giữ `DesiredCapacity=1`
> - User Data tự cài NAT + cập nhật Route Table của AZ tương ứng
> - Khi instance sập, ASG tạo instance mới và Route Table tự được cập nhật qua `ec2:ReplaceRoute`

---

## Liên kết

- [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) — VPC, Subnets, Security Groups
- [4.8.3 Infrastructure](/workshop/4.8-Verify-Setup/4.8.3-Infrastructure) — S3, Secrets Manager, IAM Roles
- [4.8.2 Fargate & ALB](/workshop/4.8-Verify-Setup/4.8.2-Fargate-ALB) — Tiếp theo: Deploy ECS Service
