# AI-feedback-processor

### AI-Powered User Feedback Processor with Bedrock, Lambda, and Terraform

## 🧠 Problem Statement
Users often leave feedback through forms, but most systems just store it passively. There’s no intelligence applied — no analysis, no response, no real insight generation. The goal was to turn raw feedback into actionable insights, using AI and serverless architecture, while keeping the system scalable, secure, and easy to manage with infrastructure-as-code.

## 🛠️ Tech Stack

| Layer        | Tool                        | Purpose                          |
|--------------|-----------------------------|----------------------------------|
| Frontend     | HTML/CSS (S3 Static Site)   | Collect user feedback            |
| Backend      | AWS Lambda + API Gateway    | Process and analyze feedback     |
| AI Layer     | Amazon Bedrock              | Generate summaries/insights      |
| Storage      | S3                          | Store raw feedback + logs        |
| Infra as Code| Terraform                   | Automate AWS resource setup      |
| Monitoring   | CloudWatch                  | Track Lambda metrics             |

## 🔁 Workflow Overview
1. User submits feedback via HTML form (hosted on S3).
2. Feedback is sent via API Gateway to AWS Lambda.
3. Lambda invokes an Amazon Bedrock model to analyze the text.
4. Insights or summaries are generated and returned to the user.
5. Feedback and AI output are stored in S3.
6. All resources are managed and deployed using Terraform.

## 🧱 Step-by-Step Infrastructure Build (using Terraform)

### 🔹 1. VPC Setup
- Created a custom VPC with:
  - 1 public subnet (for Lambda access to internet)
  - 1 private subnet (for future isolated resources)
  - Internet Gateway for public subnet

### 🔹 2. IAM Setup
- Created an IAM Role with permissions for:
  - Amazon S3
  - Lambda execution
  - Amazon Bedrock invocation

### 🔹 3. S3 Bucket Setup
- Configured an S3 bucket to:
  - Host the HTML/CSS frontend
  - Store raw feedback and AI-generated results

### 🔹 4. Lambda Function
- Wrote a Python Lambda script to:
  - Receive feedback from the frontend
  - Call Bedrock for analysis
  - Return AI-generated insights or summaries
  - Log/store responses in S3

### 🔹 5. Amazon Bedrock Integration
- Used Bedrock models (e.g. Claude ) to:
  - Summarize feedback
  - Generate intelligent, human-like responses
- Lambda integrates directly with Bedrock using `boto3`

### 🔹 6. API Gateway
- Created a REST API endpoint using API Gateway
- Exposed the Lambda function securely to the frontend

### 🔹 7. Monitoring (CloudWatch)
- CloudWatch is used to:
  - Track errors and latency in Lambda
  - Log AI-generated insights for transparency

## 💡 AI-Enhanced Workflow (Amazon Bedrock Use Case)
- Input: “The checkout process is slow and keeps crashing.”
- Output via Bedrock:
  > "Users are experiencing slow and unstable checkout performance. Recommend optimizing payment API calls and increasing error handling coverage."

## 🧪 DevOps + Terraform Advantage
With Terraform, I ensured:
- Reproducible environments (same config across dev/staging/prod)
- Easy teardown to avoid costs
- Version-controlled infrastructure
- Easy CI/CD integration in future

## 🌐 Frontend Hosting (S3)
- Simple, responsive HTML form for collecting feedback
- Deployed as a static site on S3 with public read access
- CORS enabled to allow frontend-backend communication

## 📊 Optional Features (can be expanded later)
- ✅ Add Cognito for user login (secure feedback)
- ✅ Integrate DynamoDB for structured feedback tracking
- ✅ Add SNS for real-time alerts on negative feedback
- ✅ Use Sagemaker or fine-tuned Bedrock models for domain-specific insight generation

## 🧾 Demo Script (if live)
1. Go to the feedback form.
2. Submit: “The delivery is slow and unpredictable.”
3. See AI-generated summary + suggestion.
4. Show entry stored in S3.
5. View logs + metrics in CloudWatch.

## 🎯 Key Skills Demonstrated
- Serverless app architecture
- AI integration using Amazon Bedrock
- Terraform IAC principles
- Secure IAM configurations
- S3 static hosting
- Real-world use case with measurable business value

## 📌 Summary
This project solves a real business pain point — turning feedback into value. It shows how to:
- Design a serverless pipeline
- Apply generative AI with minimal overhead
- Manage cloud resources with best practices
- Tie together frontend + backend + AI into one cohesive experience
