import { notFound } from "next/navigation";
import { buildPublicMetadata } from "@/lib/seo";
import { WorkLearn, WorkPlaceholder, WorkResources, placeholderSlugs, type PlaceholderSlug } from "@/components/work/work-subpages";

const slugs = [...placeholderSlugs, "learn", "resources"] as const;
export function generateStaticParams() { return slugs.map(slug => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug === "learn" ? "OEP Learn" : slug === "resources" ? "Student and Educator Resources" : slug === "case-studies" ? "Economic Case Studies" : slug.charAt(0).toUpperCase() + slug.slice(1).replaceAll("-", " ");
  return buildPublicMetadata({ title, description: `${title} — The Open Economics Project.`, path: `/work/${slug}` });
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "learn") return <WorkLearn/>;
  if (slug === "resources") return <WorkResources/>;
  if (placeholderSlugs.includes(slug as PlaceholderSlug)) return <WorkPlaceholder slug={slug as PlaceholderSlug}/>;
  notFound();
}
