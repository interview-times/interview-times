"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { interviewNarration } from "@/types/interview-steps";
import { AudioPlayer } from "@/utils/audio-utils";

export default function AudioRecorder() {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [count, setCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [narrationURL, setNarrationURL] = useState<string | null>(
    interviewNarration.TRIGGER.url
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [audioPlayer] = useState(() => new AudioPlayer());

  const addCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (count > 3) {
      setIsFinished(true);
      setIsStarted(false);
      console.log(isFinished);
      return;
    }
  }, [count]);

  const handleClick = () => {
    if (isFinished) {
      router.push("/result");
    } else {
      setIsStarted(true);
    }
  };

  const startRecording = async () => {
    try {
      // 質問を再生
      await audioPlayer.loadAudio(
        count === 0
          ? interviewNarration.TRIGGER.url
          : count === 1
          ? interviewNarration.CRISIS.url
          : count === 2
          ? interviewNarration.TURNING_POINT.url
          : interviewNarration.ACHIEVEMENT.url
      );
      await audioPlayer.play();

      // 録音を開始
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
    addCount();
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());
    setIsRecording(false);
  };

  return (
    <div className="mt-11 w-full p-4 space-y-4 flex flex-col items-center justify-center">
      <div className="mt-11 w-full p-4 space-y-4 flex flex-col items-center justify-center">
        {isStarted ? (
          <>
            {/* インタビューが始まっている場合 */}
            <h1 className="mt-5 text-secondary text-4xl font-bold">
              {isRecording ? "回答を聞いています" : "質問中です…"}
            </h1>
            <div className="mt-12 items-center justify-center">
              {isRecording ? (
                <div className="w-[200] h-[200] bg-secondary rounded-full flex items-center justify-center relative mb-5 mt-5">
                  <div className="w-[150] h-[150] bg-primary rounded-full flex items-center justify-center relative mb-5 mt-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="80px"
                      viewBox="0 -960 960 960"
                      width="80px"
                      className="fill-current text-white"
                    >
                      <path d="m710-362-58-58q14-23 21-48t7-52h80q0 44-13 83.5T710-362ZM480-594Zm112 112-72-72v-206q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v126l-80-80v-46q0-50 35-85t85-35q50 0 85 35t35 85v240q0 11-2.5 20t-5.5 18ZM440-120v-123q-104-14-172-93t-68-184h80q0 83 57.5 141.5T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 39T520-243v123h-80Zm352 64L56-792l56-56 736 736-56 56Z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-[200] h-[200] bg-[#F5F5F5] rounded-full flex items-center justify-center relative mb-5 mt-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="80px"
                    viewBox="0 -960 960 960"
                    width="80px"
                    className="fill-current text-primary"
                  >
                    <path d="m710-362-58-58q14-23 21-48t7-52h80q0 44-13 83.5T710-362ZM480-594Zm112 112-72-72v-206q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v126l-80-80v-46q0-50 35-85t85-35q50 0 85 35t35 85v240q0 11-2.5 20t-5.5 18ZM440-120v-123q-104-14-172-93t-68-184h80q0 83 57.5 141.5T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 39T520-243v123h-80Zm352 64L56-792l56-56 736 736-56 56Z" />
                  </svg>
                </div>
              )}

              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className="mt-24 font-bold text-base px-10 py-5 min-w-70"
              >
                {isRecording ? "録音を止める" : "録音する"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-5 text-secondary text-4xl font-bold">
              {isFinished
                ? "インタビューが終了しました！"
                : "インタビューを始めてください"}
            </h1>
            <div className="mt-12 items-center justify-center flex flex-col">
              <div className="w-[200] h-[200] bg-[#F5F5F5] rounded-full flex items-center justify-center relative mb-5 mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="80px"
                  viewBox="0 -960 960 960"
                  width="80px"
                  className="fill-current text-primary"
                >
                  <path d="m710-362-58-58q14-23 21-48t7-52h80q0 44-13 83.5T710-362ZM480-594Zm112 112-72-72v-206q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v126l-80-80v-46q0-50 35-85t85-35q50 0 85 35t35 85v240q0 11-2.5 20t-5.5 18ZM440-120v-123q-104-14-172-93t-68-184h80q0 83 57.5 141.5T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 39T520-243v123h-80Zm352 64L56-792l56-56 736 736-56 56Z" />
                </svg>
              </div>
              <Button
                onClick={handleClick}
                className="mt-24 font-bold text-base px-10 py-5 min-w-70"
              >
                {isFinished ? "終了して記事を確認する" : "インタビューを始める"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
