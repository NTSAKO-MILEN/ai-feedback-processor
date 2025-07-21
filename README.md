# ai-feedback-processor
Automates feedback analysis using AWS Lambda, S3, and Amazon Bedrock, deployed with Terraform.
# AI Feedback Processor 🧠📦

This project automates feedback analysis using **AWS Cloud** and **Amazon Bedrock**, deployed entirely using **Terraform**.

## 🚀 What It Does

Users submit feedback which is stored in an S3 bucket. This upload triggers a **Lambda function** that:
- Retrieves the feedback file
- Uses a **Python script** to analyze sentiment and summarize the content via **Amazon Bedrock**
- Saves the AI-generated results (summary + sentiment) back into S3

Logs are stored in **CloudWatch**, and all infrastructure is managed as code with **Terraform**.

---

## 🛠️ Tech Stack

| Layer         | Tools & Services                              |
|---------------|-----------------------------------------------|
| Infrastructure| Terraform, AWS IAM, S3, Lambda                |
| AI Services   | Amazon Bedrock (e.g., Claude, Titan)          |
| Compute       | Python, AWS Lambda                            |
| Storage       | Amazon S3                                     |
| Monitoring    | Amazon CloudWatch                             |
| Triggers      | S3 Event Notifications → Lambda               |

---

## 📁 Project Structure

```bash
ai-feedback-processor/
├── terraform/               # All .tf files to provision AWS resources
├── lambda/                 # Python Lambda script that calls Bedrock
├── test-feedback/          # Sample feedback input file for testing
├── .gitignore
└── README.md
