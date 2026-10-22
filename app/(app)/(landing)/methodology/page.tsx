import paragraphs from "@/lib/policies/methodology.json";
import { PolicyDocument } from "@/components/policies/policy-document";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Impact Methodology", description: "Impact Methodology — OpenEconomics: economic knowledge, open to everyone.", path: "/methodology" });
export default function Page() { return <PolicyDocument paragraphs={paragraphs} policyKey="methodology"/>; }
