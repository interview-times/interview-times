"use client";

import { useArticleResultData } from "@/contexts/article-result-data.context";

export default function Result() {
  const { articleResultData } = useArticleResultData();

  if (!articleResultData) {
    return <div>データがありません</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="space-y-4 w-full">
        <div>{articleResultData?.content}</div>
      </div>
    </div>
  );
}
