import { TermsOfUse } from "@/components/policies/terms-of-use";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Terms of Use", description: "Terms of Use — OpenEconomics: economic knowledge, open to everyone.", path: "/terms" });
export default function Page() { return <TermsOfUse/>; }
