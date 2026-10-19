import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Ambassador Program", description: "Ambassador Program — OpenEconomics: economic knowledge, open to everyone.", path: "/ambassadors" });
export default function Page() { return <PublicPage page="ambassadors"/>; }
