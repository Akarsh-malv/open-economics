export type GraphCourse = "ap-micro" | "ap-macro";

export type XY = { x: number; y: number };

/**
 * Curve identity is always carried by the direct label; style only aids it.
 * "reference" curves render dashed and muted (before-states, ghosts).
 */
export type CurveStyle =
  | "primary"
  | "secondary"
  | "tertiary"
  | "muted"
  | "reference";

export type SceneCurve = {
  id: string;
  label: string;
  points: XY[];
  style: CurveStyle;
  dashed?: boolean;
  /** Place the label near the start of the curve instead of the end. */
  labelAtStart?: boolean;
};

export type RegionFill = "cs" | "ps" | "dwl" | "revenue" | "cost" | "benefit";

export type SceneRegion = {
  id: string;
  label?: string;
  points: XY[];
  fill: RegionFill;
};

/** Dashed helper lines from a point to one or both axes, with axis labels. */
export type SceneGuide = {
  id: string;
  x: number;
  y: number;
  xLabel?: string;
  yLabel?: string;
};

export type ScenePoint = {
  id: string;
  x: number;
  y: number;
  label: string;
  muted?: boolean;
};

export type SceneAnnotation = {
  id: string;
  x: number;
  y: number;
  text: string;
};

export type Scene = {
  caption?: string;
  xLabel: string;
  yLabel: string;
  xMax: number;
  yMax: number;
  curves: SceneCurve[];
  regions?: SceneRegion[];
  guides?: SceneGuide[];
  points?: ScenePoint[];
  annotations?: SceneAnnotation[];
};

export type ControlValues = Record<string, number | string | boolean>;

export type SliderControl = {
  kind: "slider";
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  /** Optional suffix shown after the value, e.g. "%". */
  unit?: string;
};

export type SegmentedControl = {
  kind: "segmented";
  id: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue: string;
};

export type ToggleControl = {
  kind: "toggle";
  id: string;
  label: string;
  defaultValue: boolean;
};

export type ControlConfig = SliderControl | SegmentedControl | ToggleControl;

export type ScenarioPreset = {
  id: string;
  label: string;
  values: ControlValues;
};

export type ComputedGraph = {
  scenes: Scene[];
  /** Short "What changed?" explanation derived from the current values. */
  explanation: string;
  /** Optional key figures shown as readout chips. */
  readouts?: { label: string; value: string }[];
};

export type GraphDefinition = {
  id: string;
  course: GraphCourse;
  category: string;
  title: string;
  description: string;
  controls: ControlConfig[];
  presets?: ScenarioPreset[];
  details?: {
    interpretation?: string;
    mistake?: string;
    examTip?: string;
  };
  /** Scene-based graphs implement compute; diagram graphs set custom. */
  compute?: (values: ControlValues) => ComputedGraph;
  custom?:
    | "payoff-matrix"
    | "circular-flow"
    | "multiplier"
    | "money-creation"
    | "balance-of-payments";
  /** Hide the standard Labels / Equilibrium / Areas toggles. */
  hideStandardToggles?: boolean;
};

export function defaultControlValues(
  definition: GraphDefinition,
): ControlValues {
  const values: ControlValues = {};
  for (const control of definition.controls) {
    values[control.id] = control.defaultValue;
  }
  return values;
}

export function num(values: ControlValues, id: string, fallback = 0): number {
  const value = values[id];
  return typeof value === "number" ? value : fallback;
}

export function str(values: ControlValues, id: string, fallback = ""): string {
  const value = values[id];
  return typeof value === "string" ? value : fallback;
}

export function bool(
  values: ControlValues,
  id: string,
  fallback = false,
): boolean {
  const value = values[id];
  return typeof value === "boolean" ? value : fallback;
}

/* ---------------------------------------------------------------- */
/* Geometry helpers                                                  */
/* ---------------------------------------------------------------- */

/** Two-point segment for the line P = intercept + slope * Q, clipped to the plot. */
export function linePoints(
  intercept: number,
  slope: number,
  xMax: number,
  yMax: number,
): XY[] {
  const candidates: XY[] = [];
  const yAt = (x: number) => intercept + slope * x;
  const xAt = (y: number) => (slope === 0 ? 0 : (y - intercept) / slope);

  const edges: XY[] = [
    { x: 0, y: yAt(0) },
    { x: xMax, y: yAt(xMax) },
    { x: xAt(0), y: 0 },
    { x: xAt(yMax), y: yMax },
  ];

  for (const point of edges) {
    if (
      point.x >= -1e-9 &&
      point.x <= xMax + 1e-9 &&
      point.y >= -1e-9 &&
      point.y <= yMax + 1e-9 &&
      Number.isFinite(point.x) &&
      Number.isFinite(point.y)
    ) {
      candidates.push({
        x: Math.min(Math.max(point.x, 0), xMax),
        y: Math.min(Math.max(point.y, 0), yMax),
      });
    }
  }

  candidates.sort((a, b) => a.x - b.x || a.y - b.y);
  const unique = candidates.filter(
    (point, index) =>
      index === 0 ||
      Math.abs(point.x - candidates[index - 1].x) > 1e-6 ||
      Math.abs(point.y - candidates[index - 1].y) > 1e-6,
  );

  if (unique.length < 2) return [];
  return [unique[0], unique[unique.length - 1]];
}

/** Vertical line x = value, stopping short of the top so its label clears panel captions. */
export function verticalLine(x: number, yMax: number): XY[] {
  return [
    { x, y: 0 },
    { x, y: yMax * 0.93 },
  ];
}

/** Horizontal line y = value. */
export function horizontalLine(y: number, xMax: number): XY[] {
  return [
    { x: 0, y },
    { x: xMax, y },
  ];
}

/** Intersection of P = a1 + b1 Q and P = a2 + b2 Q. */
export function intersect(
  a1: number,
  b1: number,
  a2: number,
  b2: number,
): XY | null {
  if (Math.abs(b1 - b2) < 1e-9) return null;
  const x = (a2 - a1) / (b1 - b2);
  return { x, y: a1 + b1 * x };
}

/** Sample a function into a polyline over [x0, x1], clamped to [0, yMax]. */
export function sampleCurve(
  fn: (x: number) => number,
  x0: number,
  x1: number,
  yMax: number,
  samples = 60,
): XY[] {
  const points: XY[] = [];
  for (let index = 0; index <= samples; index++) {
    const x = x0 + ((x1 - x0) * index) / samples;
    const y = fn(x);
    if (!Number.isFinite(y)) continue;
    points.push({ x, y: Math.min(Math.max(y, 0), yMax) });
  }
  return points;
}

export function round1(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}
