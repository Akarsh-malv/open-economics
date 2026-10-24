import { notFound } from "next/navigation";
import { FounderProfile } from "@/components/people/founder-profile";
import { founderProfiles, type FounderSlug } from "@/lib/people/founder-profiles";
import { buildPublicMetadata } from "@/lib/seo";

export function generateStaticParams() { return Object.keys(founderProfiles).map(slug => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = founderProfiles[slug as FounderSlug];
  return buildPublicMetadata({ title: person?.name || "Profile not found", description: person?.introduction || "OEP leadership profile", path: `/people/${slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in founderProfiles)) notFound();
  return <FounderProfile slug={slug as FounderSlug}/>;
}
