import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Accessibility", description: "Accessibility — OpenEconomics: economic knowledge, open to everyone.", path: "/accessibility" });
export default function Page() { return <PublicPage page="accessibility"/>; }
