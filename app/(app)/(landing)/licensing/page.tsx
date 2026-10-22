import paragraphs from "@/lib/policies/licensing.json";
import { PolicyDocument } from "@/components/policies/policy-document";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Content Licensing", description: "Content Licensing — OpenEconomics: economic knowledge, open to everyone.", path: "/licensing" });
export default function Page() { return <PolicyDocument paragraphs={paragraphs} policyKey="licensing"/>; }
