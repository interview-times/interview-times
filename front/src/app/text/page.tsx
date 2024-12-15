"use client";

import { useArticleResultData } from "@/contexts/article-result-data.context";
import { getApiUtils } from "@/utils/api-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setArticleResultData } = useArticleResultData();

  const onClickSend = async () => {
    try {
      setIsLoading(true);
      const trigger = (document.getElementById("trigger") as HTMLInputElement)
        ?.value;
      const crisis = (document.getElementById("crisis") as HTMLInputElement)
        ?.value;
      const turningPoint = (
        document.getElementById("turningPoint") as HTMLInputElement
      )?.value;
      const achievement = (
        document.getElementById("achievement") as HTMLInputElement
      )?.value;
      const res = await getApiUtils().getHello(
        JSON.stringify({
          trigger,
          crisis,
          turningPoint,
          achievement,
        })
      );
      setArticleResultData({ content: res.message });
      router.push("/result");
    } catch (error) {
      console.error("エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="space-y-4 w-full">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">きっかけ</h2>
          <p className="text-sm text-gray-500">
            今回ご紹介いただく商品の開発を始めたきっかけや、その際の背景について教えてください。
          </p>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full h-32"
            name="trigger"
            id="trigger"
            disabled={isLoading}
            placeholder="ここにきっかけを入力してください"
            defaultValue="PR TIMESが地方の中小企業様からあまり利用いただけていない点について、ハッカソンをする機会があった"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">危機</h2>
          <p className="text-sm text-gray-500">
            その時の課題や問題は何でしたか？
          </p>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full h-32"
            name="crisis"
            id="crisis"
            disabled={isLoading}
            placeholder="ここに危機を入力してください"
            defaultValue="そもそも、プレスリリースとして発信できる新規性の強い事象が地方中小企業では多く起こらないこと。"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">転機</h2>
          <p className="text-sm text-gray-500">
            どのように解決したのか、転期となった出来事を教えてください。
          </p>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full h-32"
            name="turning-point"
            id="turningPoint"
            disabled={isLoading}
            placeholder="ここに転機を入力してください"
            defaultValue="PR TIMES STORYというサービスがあるのを発見し、「成果の裏側にあるストーリーをメディアに届ける」というテーマに強く共感した。"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">達成</h2>
          <p className="text-sm text-gray-500">
            危機や困難を乗り越え、どのように製品開発に成功しましたか？
          </p>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full h-32"
            name="achievement"
            id="achievement"
            disabled={isLoading}
            placeholder="ここに達成を入力してください"
            defaultValue="AIチャットボットを活用した音声による入出力を繰り返すことで、PR TIMES STORYで発信できる記事の作成をサポートする「INTERVIEW TIMES」を開発した。"
          />
        </div>
        <button
          onClick={onClickSend}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "送信中..." : "送信"}
        </button>
      </div>
    </div>
  );
}
