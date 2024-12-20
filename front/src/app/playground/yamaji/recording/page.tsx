"use client";

import { getApiUtils } from "@/utils/api-utils";
import { useState, useRef } from "react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { postRecord } = getApiUtils();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm", // ブラウザ互換性のためwebmを使用
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        try {
          const resp = await postRecord(blob);
          console.log(resp);
        } catch (error) {
          console.error(error);
        }
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("録音の開始に失敗しました:", err);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());
    setIsRecording(false);
  };

  const handleDownload = () => {
    if (!audioURL) return;

    // ダウンロードリンクを作成
    const a = document.createElement("a");
    a.href = audioURL;
    a.download = `recording-${new Date().toISOString()}.webm`; // ファイル名を設定
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            録音開始
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            録音停止
          </button>
        )}
      </div>

      {audioURL && (
        <div className="space-y-4">
          <audio src={audioURL} controls className="w-full" />
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            録音データをダウンロード
          </button>
        </div>
      )}
    </div>
  );
}
