"use client";

import { useArticleResultData } from "@/contexts/article-result-data.context";

export default function Result() {
  const { articleResultData } = useArticleResultData();
  const { trigger, crisis, turningPoint, achievement } = JSON.parse(
    articleResultData?.content || ""
  );

  if (!articleResultData) {
    return <div>データがありません</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="lg:container mt-6 p-8">
        <input
          type="text"
          value="タイトル"
          className="text-2xl mb-7 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          value="さぶタイトル"
          className="text-xl mb-9 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="rounded-md border-2 border-sky-800 mt-3 mb-9 p-6">
          <div className="text-sky-900 text-xl font-bold  mb-2">きっかけ</div>
          <div className=" text-sm text-sky-900 font-bold mb-3">
            事業や商品の始まったきっかけを書きます
          </div>
          <input
            type="text"
            value={trigger}
            className="h-16text-xl mb-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="rounded-md border-2 border-sky-800 mb-9 p-6">
          <div className="text-sky-900 text-xl font-bold  mb-2">危機</div>
          <div className=" text-sm text-sky-900 font-bold mb-3">
            会社や商品開発でつまづいた危機を書きます
          </div>
          <input
            type="text"
            value={crisis}
            className="h-16 text-xl mb-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="rounded-md border-2 border-sky-800 mb-9 p-6">
          <div className="text-sky-900 text-xl font-bold  mb-2">転期</div>
          <div className=" text-sm text-sky-900 font-bold mb-3">
            危機を乗り越えるこえた転期を
          </div>
          <input
            type="text"
            value={turningPoint}
            className="h-16 text-xl mb-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="rounded-md border-2 border-sky-800 p-6">
          <div className="text-sky-900 text-xl font-bold  mb-2">成果</div>
          <div className=" text-sm text-sky-900 font-bold mb-3">
            危機を乗り越えるこえた転期を
          </div>
          <input
            type="text"
            value={achievement}
            className="h-16 text-xl mb-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
