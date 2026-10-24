import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildPublicMetadata } from "@/lib/seo";
import { SiteShell } from "@/components/redesign/site-shell";

export const metadata = buildPublicMetadata({ title: "A-Level Economics", description: "Cambridge AS and A Level economics learning resources from OEP Learn.", path: "/course/a-level-economics" });

export default function ALevelEconomicsPage() {
  return <SiteShell><div className="academy-content"><div className="eyebrow">OEP LEARN · CAMBRIDGE</div><h1>A-Level Economics</h1><p>Develop economic analysis and evaluation for Cambridge AS and A Level study.</p><div className="panel a-section"><h2>Lessons are coming soon</h2><p>We’re preparing the course. You can already explore the A-Level question bank and practice by topic.</p><Link className="text-link" href="/practice/a-level">Open A-Level question bank <ArrowRight size={17}/></Link></div></div></SiteShell>;
}
