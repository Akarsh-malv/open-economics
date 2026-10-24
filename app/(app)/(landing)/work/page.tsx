import { WorkPage } from "@/components/work/work-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({ title: "Our Work", description: "Our Work — OpenEconomics: economic knowledge, open to everyone.", path: "/work" });
export default function Page() { return <WorkPage/>; }
