"use client";
import { useState } from "react";
import { journalArticles, journalCategories, type JournalCategory } from "@/lib/journal/articles";
import { ArticleCard } from "./article-card";

export function JournalList() {
  const [category, setCategory] = useState<JournalCategory>("All");
  const visible = journalArticles.filter(article => category === "All" || article.category === category);
  return <><div className="journal-filters" role="group" aria-label="Filter articles by category">{journalCategories.map(name => <button type="button" key={name} className={name === category ? "active" : ""} aria-pressed={name === category} onClick={() => setCategory(name)}>{name}</button>)}</div><div className="journal-results"><span role="status" aria-live="polite">{visible.length} {visible.length === 1 ? 'article' : 'articles'}</span><div className="journal-grid">{visible.map(article => <ArticleCard article={article} key={article.slug}/>)}</div></div></>;
}
