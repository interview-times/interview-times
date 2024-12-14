"use client";

import {
  ArticleResultData,
  ArticleResultDataContextType,
} from "@/types/article-result-data";
import { createContext, useContext, useState } from "react";

const DataContext = createContext<ArticleResultDataContextType | undefined>(
  undefined
);

export const ArticleResultDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [articleResultData, setArticleResultData] =
    useState<ArticleResultData | null>(null);

  const clearData = () => {
    setArticleResultData(null);
  };

  return (
    <DataContext.Provider
      value={{ articleResultData, setArticleResultData, clearData }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useArticleResultData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error(
      "useArticleResultData must be used within a ArticleResultDataProvider"
    );
  }
  return context;
}
