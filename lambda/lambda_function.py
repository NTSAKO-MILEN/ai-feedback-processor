import json
import boto3
import os
import uuid
from datetime import datetime

s3 = boto3.client('s3')
BUCKET_NAME = os.environ['BUCKET_NAME']

def lambda_handler(event, context):
    try:
        # Get feedback text from event (JSON format)
        feedback = event.get('feedback')
        if not feedback:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing feedback'})
            }

        # Generate unique filename
        filename = f"feedback_{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}_{uuid.uuid4().hex}.txt"
        
        # Upload feedback to S3
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=feedback.encode('utf-8'),
            ContentType='text/plain'
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Feedback saved', 'file': filename})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
