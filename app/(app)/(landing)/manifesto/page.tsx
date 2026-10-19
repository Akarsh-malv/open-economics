import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Our Manifesto", description: "Our Manifesto — OpenEconomics: economic knowledge, open to everyone.", path: "/manifesto" });
export default function Page() { return <PublicPage page="manifesto"/>; }
