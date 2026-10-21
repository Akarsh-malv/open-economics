import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { JournalArticle } from "@/lib/journal/articles";
import { JournalArt } from "./journal-art";

export function ArticleCard({ article }: { article: JournalArticle }) {
  return <article className="journal-card"><Link aria-label={`Read ${article.title}`} href={`/stories/${article.slug}`}><JournalArt kind={article.art} caption={article.caption}/><div className="journal-card-body"><span className="eyebrow">{article.category}</span><h3>{article.title}</h3><p>{article.description}</p><div className="journal-card-meta"><span>{article.status}</span><ArrowRight className="icon" aria-hidden="true"/></div></div></Link></article>;
}
