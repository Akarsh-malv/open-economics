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
    <div className="min-h-screen bg-oe-background text-oe-text">
      <main className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-oe-text sm:text-4xl">
            Interactive Graphs
          </h1>
          <p className="mt-2 max-w-2xl text-base text-oe-text-muted">
            An economics laboratory: pick a model, move its levers, and watch
            equilibrium respond.
          </p>
        </header>

        <GraphLab initialGraphId={graphId} />
      </main>
    </div>
  );
}
