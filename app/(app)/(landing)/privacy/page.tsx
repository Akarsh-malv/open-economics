import { PrivacyPolicy } from "@/components/policies/privacy-policy";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Privacy Policy", description: "Privacy Policy — OpenEconomics: economic knowledge, open to everyone.", path: "/privacy" });
export default function Page() { return <PrivacyPolicy/>; }
