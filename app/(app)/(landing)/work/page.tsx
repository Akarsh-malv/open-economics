import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Our Work", description: "Our Work — OpenEconomics: economic knowledge, open to everyone.", path: "/work" });
export default function Page() { return <PublicPage page="work"/>; }
