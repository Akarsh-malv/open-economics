import { ManifestoPage } from "@/components/manifesto/manifesto-page";
import { buildPublicMetadata } from "@/lib/seo";
export const metadata = buildPublicMetadata({
  title: "Our Manifesto",
  description: "Economic knowledge should be open. We're building the ways to make it so. Read the founding conviction of The Open Economics Project.",
  path: "/manifesto",
});
export default function Page() { return <ManifestoPage/>; }
