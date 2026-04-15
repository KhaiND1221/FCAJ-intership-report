# 4.8.3 Infrastructure

This section provisions the three supporting services for ECS Fargate: an S3 Bucket for API result caching, Secrets Manager for API key storage, and IAM Roles that grant ECS the permissions it needs.

> **Prerequisite:** Complete [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) first.

---

## 1. S3 Bucket

The `nutritrack-cache-01apr26` bucket stores cached results from the USDA, OpenFoodFacts, and Avocavo Nutrition APIs — reducing latency and external API call costs.

> **S3 bucket names are globally unique.** `nutritrack-cache-01apr26` means "created on 01 Apr 2026". Append your own date or suffix to avoid conflicts.

### 1.1 Create the S3 Bucket

1. AWS Console → **S3** → **Create bucket**.

| Field | Value |
| :--- | :--- |
| **Bucket name** | `nutritrack-cache-01apr26` *(or append your creation date)* |
| **AWS Region** | `ap-southeast-2` (Sydney) |
| **Object Ownership** | `ACLs disabled (recommended)` |
| **Block all public access** | ✅ Enabled |
| **Bucket Versioning** | Disabled |
| **Default encryption** | SSE-S3 (default) |

1. Click **Create bucket**.

---

## 2. Secrets Manager

Secrets Manager stores API keys encrypted at rest. The container reads keys at startup through its IAM Role — no plaintext secrets in code or environment variables.

### 2.1 Create the Secret

1. AWS Console → **Secrets Manager** → **Store a new secret**.
1. **Secret type**: `Other type of secret`.
1. **Key/value pairs** — Add the following keys:

| Key | Value |
| :--- | :--- |
| `USDA_API_KEY` | `<your USDA API key>` |
| `AVOCAVO_API_KEY` | `<your Avocavo API key>` |
| `OPENFOODFACTS_API_KEY` | `<API key if applicable, or leave empty>` |
| `NUTRITRACK_API_KEY` | `<JWT signing secret shared between scan-image Lambda and ECS>` |

> **Do not** store AWS Access Keys/Secret Keys here — use IAM Roles for that.
> **`ECS_BASE_URL`** (`http://nutritrack-api-vpc-alb-xxxxxxxxx.ap-southeast-2.elb.amazonaws.com`) is **not** a secret — inject it as a plain `environment` entry in the ECS Task Definition, or override it in the `scanImage` Lambda via the CDK property override for `ECS_BASE_URL`.

1. **Encryption key**: Keep `aws/secretsmanager` (default, free).
1. Click **Next**.

### 2.2 Name the Secret

| Field | Value |
| :--- | :--- |
| **Secret name** | `nutritrack/prod/api-keys` |
| **Description** | `API Keys for NutriTrack production ECS` |

1. Click **Next** → Skip Auto-rotation → **Next** → **Store**.
1. Click the secret name → Copy the **Secret ARN** (needed for the IAM policy below).

---

## 3. IAM Roles

ECS uses **two separate roles** with completely different purposes:

| Role | Used by | Purpose |
| :--- | :--- | :--- |
| **`ecsTaskExecutionRole`** | ECS Agent (AWS system) | Pull Docker image, write CloudWatch logs, read Secrets Manager to inject env vars |
| **`ecsTaskRole`** | Python code inside the container | Call Bedrock, read/write S3 cache |

A third role, **`nutritrack-api-vpc-nat-instance-role`**, is for the NAT Instance EC2.

### 3.1 Configure `ecsTaskExecutionRole`

This role usually already exists in the account. You only need to add Secrets Manager read access.

1. AWS Console → **IAM** → **Roles** → Search `ecsTaskExecutionRole`.
1. If it **doesn't exist**, create it:
   - **Create role** → **AWS service** → **Elastic Container Service Task**
   - Attach policy: `AmazonECSTaskExecutionRolePolicy`
   - Role name: `ecsTaskExecutionRole`
1. Click the role → **Add permissions** → **Create inline policy**.
1. **JSON** tab → Paste the policy below (replace `<SECRET_ARN>` with the ARN you copied):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSecretsManagerRead",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "<SECRET_ARN>"
      ]
    },
    {
      "Sid": "AllowCloudWatchLogs",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": "arn:aws:logs:ap-southeast-2:*:log-group:/ecs/arm-nutritrack-api-task:*"
    }
  ]
}
```

> **Note on Docker Hub vs ECR:**
> This policy **does not include** `ecr:GetAuthorizationToken` because this setup uses **Docker Hub** (`<dockerhub-username>/nutritrack-api-image`), not Amazon ECR. The ECS Agent pulls the image directly from `registry-1.docker.io` through the NAT Instance — no AWS IAM auth required. If you switch to ECR, add `ecr:GetAuthorizationToken` with `Resource: "*"`.

1. **Policy name**: `NutriTrackExecutionPolicy` → **Create policy**.

### 3.2 Create `ecsTaskRole`

1. IAM → **Roles** → **Create role**.
1. **Trusted entity type**: `AWS service` → **Use case**: `Elastic Container Service Task`.
1. Click **Next** → **Next** (skip attaching managed policies).
1. **Role name**: `ecsTaskRole` → **Create role**.
1. Click `ecsTaskRole` → **Add permissions** → **Create inline policy**.
1. **JSON** tab → Paste (update bucket name if different):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBedrockInvoke",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:ListFoundationModels"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowS3CacheAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::nutritrack-cache-01apr26",
        "arn:aws:s3:::nutritrack-cache-01apr26/*"
      ]
    }
  ]
}
```

1. **Policy name**: `NutriTrackTaskPolicy` → **Create policy**.

### 3.3 Create the NAT Instance IAM Role

The NAT Instance needs permission to **update its Route Table** when Auto Scaling creates a replacement (see [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance)).

1. IAM → **Roles** → **Create role**.
1. **Trusted entity type**: `AWS service` → **Use case**: `EC2`.
1. Click **Next** → **Next**.
1. **Role name**: `nutritrack-api-vpc-nat-instance-role` → **Create role**.
1. Click the role → **Add permissions** → **Create inline policy** → **JSON** tab:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowRouteTableUpdate",
      "Effect": "Allow",
      "Action": [
        "ec2:ReplaceRoute",
        "ec2:CreateRoute",
        "ec2:DescribeRouteTables",
        "ec2:DescribeInstances",
        "ec2:DescribeSubnets"
      ],
      "Resource": "*"
    }
  ]
}
```

1. **Policy name**: `NutriTrackNATRoutePolicy` → **Create policy**.

### 3.4 Add SSM Policy to the NAT Instance Role (optional)

To manage NAT Instances via SSM Session Manager (no SSH key pair needed):

1. Click `nutritrack-api-vpc-nat-instance-role` → **Add permissions** → **Attach policies**.
1. Search `AmazonSSMManagedInstanceCore` → **Add permissions**.

---

## Resources created

| Resource | Name | Purpose |
| :--- | :--- | :--- |
| S3 Bucket | `nutritrack-cache-01apr26` | Cache USDA/OpenFoodFacts/Avocavo results |
| Secrets Manager | `nutritrack/prod/api-keys` | Encrypted API key storage |
| IAM Role | `ecsTaskExecutionRole` | ECS Agent pulls images and writes logs |
| IAM Role | `ecsTaskRole` | Container calls Bedrock and reads/writes S3 |
| IAM Role | `nutritrack-api-vpc-nat-instance-role` | NAT Instance updates Route Tables |

---

## Cross-links

- [4.8.1 VPC & Network](/workshop/4.8-Verify-Setup/4.8.1-VPC-ECR) — Previous step: VPC, Subnets, Security Groups
- [4.8.4 NAT Instance](/workshop/4.8-Verify-Setup/4.8.4-NAT-Instance) — Next step: NAT Instance setup
- [4.8.2 Fargate & ALB](/workshop/4.8-Verify-Setup/4.8.2-Fargate-ALB) — ECS Cluster and Service deployment
