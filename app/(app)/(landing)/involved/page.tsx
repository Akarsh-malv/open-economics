import { PublicPage } from "@/components/redesign/public-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Get Involved", description: "Get Involved — OpenEconomics: economic knowledge, open to everyone.", path: "/involved" });
export default function Page() { return <PublicPage page="involved"/>; }
