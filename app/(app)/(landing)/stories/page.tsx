import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JournalList } from "@/components/journal/journal-list";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata = buildPublicMetadata({ title: "Stories & Insights", description: "Economics explained, community perspectives and updates from the Open Economics Project.", path: "/stories", robots: { index: false, follow: false } });

export default function StoriesPage() {
  return <div className="oe-journal"><div className="wrap journal-index"><header className="subhero oe-page-hero"><div className="eyebrow">THE OPENECONOMICS JOURNAL</div><h1>Stories &amp; Insights</h1><p>Clear ideas. Different perspectives. The work behind wider access to economics.</p></header><JournalList/><section className="journal-story-invite"><div><div className="eyebrow">BEHIND THE INITIATIVE</div><h2>The question that<br/>brings us together.</h2></div><div><p>Explore the purpose behind OpenEconomics and the story we’re building around it.</p><Link className="btn light" href="/#about">Our Story<ArrowRight className="icon" aria-hidden="true"/></Link></div></section></div></div>;
}
