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
    <GraphLab initialGraphId={defaultGraphId} />
  );
}
