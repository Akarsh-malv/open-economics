import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Terms of Use", description: "Terms of Use — OpenEconomics: economic knowledge, open to everyone.", path: "/terms" });
export default function Page() { return <PublicPage page="terms"/>; }
