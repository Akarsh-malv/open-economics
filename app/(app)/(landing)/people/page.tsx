import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Our People", description: "Our People — OpenEconomics: economic knowledge, open to everyone.", path: "/people" });
export default function Page() { return <PublicPage page="people"/>; }
