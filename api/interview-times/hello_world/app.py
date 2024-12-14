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
                "content": "あなたはインタビューのライターです。次に与えられる文章はインタビューの文字起こしであり、意味に関係のないノイズが含まれています。それらを取り除き、文章をわかりやすい形に修正してください。ただし、要約というよりは、あくまで文章を整えて修正する程度にとどめてください。出力形式は文字列のみの形にしてください。" + answer
            }
        ]
    )
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": completion.choices[0].message.content,
        }, ensure_ascii=False),
    }