import paragraphs from "@/lib/policies/terms.json";
import { PolicyDocument } from "./policy-document";

export function TermsOfUse() {
    return <PolicyDocument paragraphs={paragraphs} policyKey="terms"/>;
}
