import json
import os
from openai import OpenAI

def lambda_handler(event, context):
    answer = event.get('queryStringParameters').get('answer')
    env = os.environ['OPENAI_API_KEY']
    client = OpenAI(api_key=env)

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": answer
            }
        ]
    )
    print(completion.choices[0].message.content)
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": completion.choices[0].message.content,
        }, ensure_ascii=False),
    }