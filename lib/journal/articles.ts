import articles from "./articles.json";

export const journalArticles = articles;
export type JournalArticle = typeof articles[number];
export const journalCategories = ["All", "Economics Explained", "People & Perspectives", "Updates from OEP"] as const;
export type JournalCategory = typeof journalCategories[number];
export function getJournalArticle(slug: string) {
  return journalArticles.find(article => article.slug === slug);
}
