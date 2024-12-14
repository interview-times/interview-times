export interface ArticleResultData {
  content: string;
}

export interface ArticleResultDataContextType {
  articleResultData: ArticleResultData | null;
  setArticleResultData: (data: ArticleResultData) => void;
  clearData: () => void;
}
