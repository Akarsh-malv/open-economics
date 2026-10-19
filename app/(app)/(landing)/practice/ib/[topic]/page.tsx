import { notFound } from "next/navigation";
import { IbPaperOneBank } from "@/components/ib-paper-one/bank";
import ibManifest from "@/lib/ib-paper-one/manifest.json";
import { ibTopicData } from "@/lib/ib-paper-one/topic-data";
import { buildPublicMetadata } from "@/lib/seo";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return ibManifest.map(({ slug }) => ({ topic: slug }));
}

export async function generateMetadata({ params }: Props) {
  const { topic: slug } = await params;
  const topic = ibManifest.find(item => item.slug === slug);
  if (!topic) return {};
  return buildPublicMetadata({
    title: `IB Economics Topic ${topic.number} Paper 1 Practice`,
    description: `${topic.count} original IB Economics Paper 1-style question pairs on ${topic.title}.`,
    path: `/practice/ib/${slug}`,
  });
}

export default async function IbTopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = ibTopicData[slug];
  if (!topic) notFound();
  return <IbPaperOneBank key={slug} topic={topic} slug={slug}/>;
}
