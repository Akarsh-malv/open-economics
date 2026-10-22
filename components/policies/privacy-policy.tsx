import paragraphs from "@/lib/policies/privacy.json";
import { PolicyDocument } from "./policy-document";

export function PrivacyPolicy() {
    return <PolicyDocument paragraphs={paragraphs} policyKey="privacy"/>;
}
