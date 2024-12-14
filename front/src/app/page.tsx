"use client";

import { getApiUtils } from "@/utils/api-utils";
import { useState } from "react";

export default function Home() {
  const [hello, setHello] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onClickSend = async () => {
    try {
      setIsLoading(true);
      const answer = (document.getElementById("answer") as HTMLInputElement)
        ?.value;
      const res = await getApiUtils().getHello(answer);
      setHello(res.message);
    } catch (error) {
      console.error("エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="space-y-4 w-full">
        <textarea
          className="border border-gray-300 rounded-md p-2 w-full h-64"
          name="answer"
          id="answer"
          disabled={isLoading}
          placeholder="ここにきっかけを入力してください"
        />
        <button
          onClick={onClickSend}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "送信中..." : "送信"}
        </button>
        <div className="mt-4 p-2 border-2 border-gray-300 rounded-md w-full h-64 overflow-auto">
          {hello}
        </div>
      </div>
    </div>
  );
}
