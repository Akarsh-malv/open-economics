import { GraphCanvas } from "@/components/graphs/graph-canvas";
import type { Scene } from "@/lib/graphs/engine";

export function QuestionGraph({ topic, id, description, required, revealed, scenes }: {
  topic: string;
  id: number;
  description: string;
  required: boolean;
  revealed: boolean;
  scenes?: Scene[];
}) {
  if (!required || (!revealed && /the correct graph/i.test(description))) return null;
  if (!scenes?.length && !description.trim()) return null;
  return (
    <figure className="practice-graph">
      <div className="practice-graph-label"><span>QUESTION FIGURE</span></div>
      <p className="practice-graph-scroll-hint">Swipe horizontally to see the full figure.</p>
      {scenes?.map((scene, index) => (
        <div className="practice-graph-visual" key={index} tabIndex={0} role="region" aria-label={`Question figure ${index + 1}`}>
          <GraphCanvas scene={scene} graphId={`practice-${topic}-${id}-${index}`}
            showEquilibrium showRegions />
        </div>
      ))}
      <figcaption className="practice-graph-caption">
        <details className="practice-graph-description" open={!scenes?.length}>
          <summary>Read figure description</summary>
          <p>{description.split(/\n\s*\n/)[0]}</p>
        </details>
      </figcaption>
    </figure>
  );
}
