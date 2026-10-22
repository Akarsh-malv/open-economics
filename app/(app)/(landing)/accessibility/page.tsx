import paragraphs from "@/lib/policies/accessibility.json";
import { PolicyDocument } from "@/components/policies/policy-document";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Accessibility", description: "Accessibility — OpenEconomics: economic knowledge, open to everyone.", path: "/accessibility" });
export default function Page() { return <PolicyDocument paragraphs={paragraphs} policyKey="accessibility"/>; }
