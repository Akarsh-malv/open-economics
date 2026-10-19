import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Impact & Accountability", description: "Impact & Accountability — OpenEconomics: economic knowledge, open to everyone.", path: "/impact" });
export default function Page() { return <PublicPage page="impact"/>; }
