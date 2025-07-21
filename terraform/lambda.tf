data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../lambda/main.py"
  output_path = "${path.module}/../lambda/main.zip"
}

resource "aws_lambda_function" "feedback_handler" {
  function_name = "${var.project_name}-lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "main.lambda_handler"  # ensure this matches your Python function name
  runtime       = "python3.11"
  filename      = data.archive_file.lambda_zip.output_path
  timeout       = 10

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      BUCKET_NAME = var.s3_bucket_name
    }
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_policy_attachment]
}
