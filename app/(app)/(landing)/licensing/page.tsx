import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Content Licensing", description: "Content Licensing — OpenEconomics: economic knowledge, open to everyone.", path: "/licensing" });
export default function Page() { return <PublicPage page="licensing"/>; }
