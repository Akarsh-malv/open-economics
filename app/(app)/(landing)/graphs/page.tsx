import { GraphLab } from "@/components/graphs/graph-lab";
import { defaultGraphId } from "@/lib/graphs";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata = buildPublicMetadata({
  title: "Interactive Graphs",
  description:
    "An interactive library of every major AP Microeconomics and AP Macroeconomics graph — shift curves, adjust policy, and watch equilibrium move.",
  path: "/graphs",
});

export default function GraphsPage() {
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

        <GraphLab initialGraphId={defaultGraphId} />
      </main>
    </div>
  );
}
