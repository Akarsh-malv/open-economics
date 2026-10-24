import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildPublicMetadata } from "@/lib/seo";
import { SiteShell } from "@/components/redesign/site-shell";

export const metadata = buildPublicMetadata({ title: "IB Economics · SL & HL", description: "Explore Standard Level and Higher Level economics with OEP Learn.", path: "/course/ib-economics" });

export default function IBEconomicsPage() {
  return <SiteShell><div className="academy-content"><div className="eyebrow">OEP LEARN · IB ECONOMICS</div><h1>IB Economics · SL &amp; HL</h1><p>Explore the shared foundations of IB Economics, then choose the level that matches your course.</p><div className="oe-course-grid a-section"><Link className="panel" href="/course/sl-economics"><span className="eyebrow">STANDARD LEVEL</span><h2>SL Economics</h2><p>Core concepts, diagrams, examples, and exam-style practice.</p><span className="text-link">Explore SL <ArrowRight size={17}/></span></Link><Link className="panel" href="/course/hl-economics"><span className="eyebrow">HIGHER LEVEL</span><h2>HL Economics</h2><p>Further analysis, evaluation, and policy applications.</p><span className="text-link">Explore HL <ArrowRight size={17}/></span></Link></div><div className="panel a-section"><h2>Practice across both levels</h2><p>Work through IB Economics questions and explanations in the question bank.</p><Link className="text-link" href="/practice/ib">Open IB question bank <ArrowRight size={17}/></Link></div></div></SiteShell>;
}
