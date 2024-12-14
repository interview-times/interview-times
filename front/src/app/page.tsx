"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button"

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("録音の開始に失敗しました:", err);
    }
  };

  const stopRecording = () => {
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
    <div className="w-full h-full p-4 space-y-4 flex flex-col items-center justify-center">
      <div className="flex gap-4">
        <Button>テスト</Button>
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
