"use client";

import { useArticleResultData } from "@/contexts/article-result-data.context";
import { getApiUtils } from "@/utils/api-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setArticleResultData } = useArticleResultData();
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setCompanyName(
      (document.getElementById("companyName") as HTMLInputElement)?.value || ""
    );
    setProductName(
      (document.getElementById("productName") as HTMLInputElement)?.value || ""
    );
    setIsConfirmed(true);
  };

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
          trigger: `このインタビューは${companyName}様の${productName}について行われたものです。${trigger}`,
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
      {isLoading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4 w-full p-4">
          <div className="w-1/2 mx-auto h-64 flex flex-col items-center justify-center space-y-4 border-2 border-gray-300 rounded-md p-4 mb-16">
            <p className="text-xl font-bold">
              最初に会社名とプロダクト名を入力してください
            </p>
            <input
              type="text"
              className="text-xl font-bold p-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="companyName"
              placeholder="会社名"
              defaultValue="株式会社だいなぽんず"
              disabled={isConfirmed}
            />
            <input
              type="text"
              className="text-xl font-bold p-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="productName"
              placeholder="プロダクト名"
              defaultValue="INTERVIEW TIMES"
              disabled={isConfirmed}
            />
            <button
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg"
              onClick={handleConfirm}
            >
              確定
            </button>
          </div>
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
            disabled={isLoading || !isConfirmed}
          >
            {isLoading ? "送信中..." : "送信"}
          </button>
        </div>
      )}
    </div>
  );
}
