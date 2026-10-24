import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GraphLab } from "@/components/graphs/graph-lab";
import { allGraphDefinitions, getGraphDefinition } from "@/lib/graphs";
import { buildNoIndexMetadata, buildPublicMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return allGraphDefinitions.map((graph) => ({ graphId: graph.id }));
}

type Args = {
  params: Promise<{ graphId: string }>;
};

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { graphId } = await params;
  const graph = getGraphDefinition(graphId);
  if (!graph) {
    return buildNoIndexMetadata({
      title: "Graph Not Found",
      description: "The graph you are looking for does not exist.",
    });
  }
  return buildPublicMetadata({
    title: `${graph.title} — Interactive Graph`,
    description: graph.description,
    path: `/graphs/${graphId}`,
  });
}

export default async function GraphPage({ params }: Args) {
  const { graphId } = await params;
  const graph = getGraphDefinition(graphId);
  if (!graph) notFound();

  return (
    <GraphLab initialGraphId={graphId} />
  );
}
