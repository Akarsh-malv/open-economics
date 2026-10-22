import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { journalArticles, getJournalArticle } from "@/lib/journal/articles";
import { ArticleCard } from "@/components/journal/article-card";
import { JournalArt } from "@/components/journal/journal-art";
import { ArticleNavigation } from "@/components/journal/article-navigation";
import { buildPublicMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return journalArticles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) return {};
  return buildPublicMetadata({ title: article.title, description: article.description, path: `/stories/${article.slug}`, type: "article", robots: { index: false, follow: false } });
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) notFound();
  return <div className="oe-journal"><div className="wrap article-page"><nav aria-label="Breadcrumb" className="article-breadcrumb"><Link href="/stories">Stories &amp; Insights</Link><ChevronRight className="icon" aria-hidden="true"/><span>{article.category}</span></nav><header className="article-heading"><div className="eyebrow">{article.category}</div><h1>{article.title}</h1><p>{article.description}</p><div className="article-byline"><span className="article-author-mark">OE</span><div><strong>{article.author}</strong><span>{article.byline}</span></div></div></header><div className="article-cover"><JournalArt kind={article.art} caption={article.caption}/></div><div className="article-layout"><ArticleNavigation sections={article.sections.map(({ id, title }) => ({ id, title }))} status={article.status}/><article className="article-body">{article.sections.map(section => <section id={section.id} tabIndex={-1} key={section.id}><h2>{section.title}</h2>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>)}<Link className="text-link" href="/stories">All Stories &amp; Insights<ArrowRight className="icon" aria-hidden="true"/></Link></article></div><section className="section section-rule"><div className="section-head"><h2>Keep exploring.</h2></div><div className="journal-grid related">{journalArticles.filter(item => item.slug !== slug).map(item => <ArticleCard key={item.slug} article={item}/>)}</div></section></div></div>;
}
