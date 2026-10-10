import { CustomDiagram } from "@/components/graphs/custom-diagrams";
import { GraphCanvas } from "@/components/graphs/graph-canvas";
import { getGraphDefinition } from "@/lib/graphs";
import {
  type ControlValues,
  defaultControlValues,
  type Scene,
} from "@/lib/graphs/engine";

function graphIdFor(topic: string, description: string): string {
  if (topic === "1-2") return "production-possibilities-curve";
  if (["1-4", "1-5", "1-6"].includes(topic)) return "supply-and-demand";
  if (topic === "2-7") return "business-cycle";
  if (topic === "4-4") return "money-creation";
  if (topic === "4-5") return "money-market";
  if (topic === "4-6")
    return /money|nominal interest rate/i.test(description)
      ? "money-market"
      : "ad-as-model";
  if (topic === "4-7") return "loanable-funds-market";
  if (topic === "3-4" && /two vertical|LRAS₁|LRAS1/i.test(description))
    return "lras-growth";
  return "ad-as-model";
}

function graphValues(
  id: string,
  description: string,
  defaults: ControlValues,
): ControlValues {
  const values = { ...defaults };
  const lower = description.toLowerCase();
  const right = /right|increase|outward|positive/.test(lower);
  const left = /left|decrease|inward|negative/.test(lower);
  if (id === "production-possibilities-curve") {
    if (/outward|growth|expands/.test(lower)) values.resources = 120;
    if (/inward|drought|shrinks/.test(lower)) values.resources = 75;
  } else if (id === "supply-and-demand") {
    if (/demand|d₁|d1/i.test(description) && /shift/.test(lower))
      values.dShift = right && !left ? 15 : left && !right ? -15 : 0;
    if (/supply|s₁|s1/i.test(description) && /shift/.test(lower))
      values.sShift = right && !left ? 15 : left && !right ? -15 : 0;
    if (/surplus|above equilibrium/i.test(description)) {
      values.probe = true;
      values.probePrice = 70;
    }
    if (/shortage|below equilibrium/i.test(description)) {
      values.probe = true;
      values.probePrice = 25;
    }
  } else if (id === "ad-as-model") {
    if (
      /recessionary gap|intersection (?:is |lies )?(?:to the )?left of (?:the )?LRAS|left of (?:the )?LRAS/i.test(
        description,
      )
    )
      values.adShift = -12;
    if (
      /inflationary gap|intersection (?:is |lies )?(?:to the )?right of (?:the )?LRAS|right of (?:the )?LRAS/i.test(
        description,
      )
    )
      values.adShift = 12;
    if (
      /AD₂[^.]{0,70}(?:shifted|shifts|to the) right|AD2[^.]{0,70}(?:shifted|shifts|to the) right/i.test(
        description,
      )
    )
      values.adShift = 12;
    if (
      /AD₂[^.]{0,70}(?:shifted|shifts|to the) left|AD2[^.]{0,70}(?:shifted|shifts|to the) left/i.test(
        description,
      )
    )
      values.adShift = -12;
    if (
      /SRAS₂[^.]{0,70}(?:shifted|shifts|to the) left|SRAS2[^.]{0,70}(?:shifted|shifts|to the) left/i.test(
        description,
      )
    )
      values.srasShift = -12;
    if (
      /SRAS₂[^.]{0,70}(?:shifted|shifts|to the) right|SRAS2[^.]{0,70}(?:shifted|shifts|to the) right/i.test(
        description,
      )
    )
      values.srasShift = 12;
  } else if (id === "money-market") {
    if (/MS₂[^.]{0,50}right|MS2[^.]{0,50}right/i.test(description))
      values.ms = 65;
    if (/MS₂[^.]{0,50}left|MS2[^.]{0,50}left/i.test(description))
      values.ms = 35;
    if (/MD₂[^.]{0,50}right|MD2[^.]{0,50}right/i.test(description))
      values.mdCause = "gdp";
    if (/MD₂[^.]{0,50}left|MD2[^.]{0,50}left/i.test(description))
      values.mdCause = "tech";
  } else if (id === "loanable-funds-market") {
    if (/supply|saving|SLF/i.test(description) && /shift/.test(lower))
      values.saving = right && !left ? 12 : left && !right ? -12 : 0;
    if (/demand|investment|DLF/i.test(description) && /shift/.test(lower))
      values.investment = right && !left ? 12 : left && !right ? -12 : 0;
  }
  return values;
}

function displayScene(scene: Scene, topic: string, description: string): Scene {
  let curves = scene.curves;
  if (topic === "1-4")
    curves = curves.filter((curve) =>
      /demand|^D(?:₁|₂|1|2)?$/i.test(curve.label),
    );
  if (topic === "1-5")
    curves = curves.filter((curve) =>
      /supply|^S(?:₁|₂|1|2)?$/i.test(curve.label),
    );
  if (topic === "3-1")
    curves = curves.filter((curve) => /^AD/.test(curve.label));
  if (topic === "3-3")
    curves = curves.filter((curve) => /^SRAS/.test(curve.label));
  if (topic === "3-4" && !/SRAS/i.test(description))
    curves = curves.filter((curve) => /^LRAS/.test(curve.label));
  // The source questions supply their own numerical values. Keep this shared
  // model illustrative, so generated defaults cannot contradict those values.
  return {
    ...scene,
    curves,
    guides: [],
    points: [],
    annotations: [],
    regions: [],
  };
}

export function QuestionGraph({
  topic,
  id,
  description,
  required,
  revealed,
}: {
  topic: string;
  id: number;
  description: string;
  required: boolean;
  revealed: boolean;
}) {
  if (!required) return null;
  // A few source descriptions explain the solution rather than the prompt.
  // Keep those diagrams with the answer feedback so the quiz does not spoil itself.
  if (!revealed && /the correct graph/i.test(description)) return null;
  const definitionId = graphIdFor(topic, description);
  const definition = getGraphDefinition(definitionId);
  if (!definition) return null;
  const values = graphValues(
    definitionId,
    description,
    defaultControlValues(definition),
  );
  const graph = definition.compute?.(values);
  return (
    <figure className="practice-graph">
      <div className="practice-graph-label">
        <span>{definition.title.toUpperCase()}</span>
        <span>
          {description
            ? "Illustrative model · details below"
            : "Static reference model"}
        </span>
      </div>
      <div className="practice-graph-visual">
        {graph?.scenes.map((scene, index) => (
          <GraphCanvas
            key={`${scene.xLabel}-${scene.yLabel}-${scene.curves.map((curve) => curve.label).join("-")}`}
            scene={displayScene(scene, topic, description)}
            graphId={`practice-${topic}-${id}-${index}`}
            showEquilibrium={false}
            showRegions={false}
          />
        ))}
        {definition.custom && (
          <CustomDiagram kind={definition.custom} values={values} />
        )}
      </div>
      {description && (
        <figcaption className="practice-graph-caption">
          {description}
        </figcaption>
      )}
    </figure>
  );
}
