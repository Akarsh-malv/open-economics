import { notFound } from "next/navigation";
import { ActivityPage } from "@/components/work/activity-page";
import { activities, type ActivitySlug } from "@/lib/work/activities";
import { buildPublicMetadata } from "@/lib/seo";

export function generateStaticParams() { return Object.keys(activities).map(activity => ({ activity })); }
export async function generateMetadata({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  const title = activities[activity as ActivitySlug]?.title ?? "Starter Activity";
  return buildPublicMetadata({ title, description: `${title} starter activity — The Open Economics Project.`, path: `/work/resources/${activity}` });
}
export default async function Page({ params }: { params: Promise<{ activity: string }> }) {
  const { activity } = await params;
  if (!(activity in activities)) notFound();
  return <ActivityPage slug={activity as ActivitySlug}/>;
}
