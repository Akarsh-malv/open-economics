import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Safeguarding", description: "Safeguarding — OpenEconomics: economic knowledge, open to everyone.", path: "/safeguarding" });
export default function Page() { return <PublicPage page="safeguarding"/>; }
