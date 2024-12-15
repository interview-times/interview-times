import json
import os
from openai import OpenAI

def lambda_handler(event, context):
    answer = event.get('queryStringParameters').get('answer')
    env = os.environ['OPENAI_API_KEY']
    client = OpenAI(api_key=env)

    completion = client.chat.completions.create(
        model="gpt-4o",
#         temperatureの値を追加して0.0に設定した方が良い。0以外だとノイズが入ることがある
#         以下のようにした方がjsonのリクエストはバグりにくい
#         最終応答は、'{'で始まり'}'で終わる、または'['で始まり']'で終わるJSONのみを出力し、JSON以外の文字は一切応答に含めないでください。

        messages=[
            {
                "role": "system", 
                "content": "\n".join([
                    "あなたは非常に親切なライティングアシスタント、もしくはインタビュアです。",
                    "ある商品を開発した人や団体に対して、その内容を深堀りし、コストパフォーマンスのみではない、ブランドとしての請求ができるような記事を書こうとしています。",
                    "「きっかけ(trriger)」「危機(crisis)」「転機(turning_point)」「達成(achievement)」の4カテゴリの質問にターゲットが答えてくれます。",
                    "質問の回答について、各カテゴリ名をプロパティ名に持つjsonで送信します。",
                    "値が空のときはその質問には回答していないものと考えてください。",
                    "同じjsonの形式で開発者の回答内容を返してください。"
                ])
            },
            {
                "role": "user",
                "content": "" + answer
            }
        ]
    )
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": completion.choices[0].message.content,
        }, ensure_ascii=False),
    }
