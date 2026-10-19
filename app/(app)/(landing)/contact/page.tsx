import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Contact", description: "Contact — OpenEconomics: economic knowledge, open to everyone.", path: "/contact" });
export default function Page() { return <PublicPage page="contact"/>; }
