import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "OpenEconomics — A world of possibility", description: "Open education, local leadership and institutional access. Discover the Open Economics Project and OEP Learn.", path: "/" });
export default function Home() { return <PublicPage page="home"/>; }
