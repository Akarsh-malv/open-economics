import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Impact Methodology", description: "Impact Methodology — OpenEconomics: economic knowledge, open to everyone.", path: "/methodology" });
export default function Page() { return <PublicPage page="methodology"/>; }
