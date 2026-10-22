import { GetInvolved } from "@/components/involved/get-involved";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Get Involved", description: "Get Involved — OpenEconomics: economic knowledge, open to everyone.", path: "/involved" });
export default function Page() { return <GetInvolved/>; }
