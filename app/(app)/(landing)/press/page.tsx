import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "News & Press", description: "News & Press — OpenEconomics: economic knowledge, open to everyone.", path: "/press" });
export default function Page() { return <PublicPage page="press"/>; }
