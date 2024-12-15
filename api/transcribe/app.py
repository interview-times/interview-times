import json
import time
import boto3
import urllib.request
import base64
from datetime import datetime

BUCKET_NAME = 'transcribe-20241214'

s3_client = boto3.client('s3')
transcribe_client = boto3.client('transcribe')

def lambda_handler(event, context):
    print(event, context)
    try:
        # API Gatewayからのリクエストボディを取得
        print("USER_LOG", json.loads(event['body'])['record'])

        record_base64 = json.loads(event['body'])['record']
        if not record_base64:
            raise ValueError('音声データが見つかりません')

        # Base64をデコード
        record_data = base64.b64decode(record_base64)

        # ファイル名を生成
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        file_name = f'recording-{timestamp}.webm'

        # S3にアップロード
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=record_data,
            ContentType='audio/webm'
        )
        
        # アップロードしたファイルに対してtranscribe jobを発行
        file_url = f'https://s3.amazonaws.com/{BUCKET_NAME}/{file_name}'

        job_name = context.aws_request_id 
        job_uri = file_url
        transcribe_client.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': job_uri},
            LanguageCode='ja-JP',
            MediaFormat='wav'
        )
        
        # transcribe jobの終了を待つ
        while True:
            status = transcribe_client.get_transcription_job(TranscriptionJobName=job_name)
            if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
                break
            print("Not ready yet...")
            time.sleep(5)
        
        if status['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED':
            response_uri = status['TranscriptionJob']['Transcript']['TranscriptFileUri']
            response = urllib.request.urlopen(response_uri).read().decode('utf-8')
            json_response = json.loads(response)
            transcript = json_response['results']['transcripts'][0]['transcript']
        else:
            transcript = "Transcription job failed"
        print('Transcript result:' + transcript)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # CORSの設定
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'message': 'ファイルのアップロードに成功しました',
                'transcript': transcript,
                'file_name': file_name
            })
        }

    except Exception as e:
        print(f'エラー: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'error': 'Internal server error'
            })
        }
