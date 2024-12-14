import json

def lambda_handler(event, context):
    answer = event.get('queryStringParameters').get('answer')

    return {
        "statusCode": 200,
        "body": json.dumps({
            "answer": answer,
        }),
    }
