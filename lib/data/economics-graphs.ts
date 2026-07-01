import type { EconomicsGraphConfig } from "@/components/interactive-economics-graph";

export const ppcGraphConfig = {
  type: "ppc",
  title: "Production Possibilities Curve",
  xAxisLabel: "Consumer Goods",
  yAxisLabel: "Capital Goods",
  xMax: 100,
  yMax: 100,
  curves: [
    {
      id: "ppc",
      label: "PPC",
      tone: "accent",
      points: [
        { x: 0, y: 92 },
        { x: 18, y: 86 },
        { x: 36, y: 72 },
        { x: 55, y: 50 },
        { x: 73, y: 25 },
        { x: 88, y: 0 },
      ],
    },
  ],
  points: [
    { id: "efficient-a", label: "A", x: 55, y: 50, kind: "efficient" },
    { id: "inefficient-b", label: "B", x: 38, y: 35, kind: "inefficient" },
    { id: "unattainable-c", label: "C", x: 76, y: 62, kind: "unattainable" },
  ],
  annotations: [
    { id: "scarcity", label: "limited resources", x: 30, y: 89 },
    { id: "growth", label: "growth shifts outward", x: 72, y: 88 },
  ],
} satisfies EconomicsGraphConfig;

const ppcIntroGraphConfig = {
  ...ppcGraphConfig,
  points: [],
  annotations: [
    { id: "frontier", label: "maximum possible combinations", x: 44, y: 82 },
  ],
} satisfies EconomicsGraphConfig;

const ppcEfficientGraphConfig = {
  ...ppcGraphConfig,
  points: ppcGraphConfig.points?.filter((point) => point.id === "efficient-a"),
  annotations: [
    { id: "efficient-note", label: "on the curve is efficient", x: 56, y: 67 },
  ],
} satisfies EconomicsGraphConfig;

const ppcInefficientGraphConfig = {
  ...ppcGraphConfig,
  points: ppcGraphConfig.points?.filter(
    (point) => point.id === "inefficient-b",
  ),
  annotations: [
    { id: "inefficient-note", label: "inside means unused resources", x: 39, y: 49 },
  ],
} satisfies EconomicsGraphConfig;

const ppcUnattainableGraphConfig = {
  ...ppcGraphConfig,
  points: ppcGraphConfig.points?.filter(
    (point) => point.id === "unattainable-c",
  ),
  annotations: [
    { id: "unattainable-note", label: "outside is not possible yet", x: 75, y: 75 },
  ],
} satisfies EconomicsGraphConfig;

export type PpcLessonStep = {
  title: string;
  content: string[];
  showGraph?: boolean;
  graphConfig?: EconomicsGraphConfig;
  activePointId?: string;
  type?: "content" | "classify" | "complete";
};

export const ppcLessonSteps: PpcLessonStep[] = [
  {
    title: "Every choice has a tradeoff",
    content: [
      "A society cannot produce unlimited amounts of every good.",
      "Choosing more of one category usually means giving up some of another.",
    ],
    type: "content",
  },
  {
    title: "Scarcity and production choices",
    content: [
      "A PPC models the combinations an economy can produce with limited resources and current technology.",
      "Here, the economy chooses between consumer goods and capital goods.",
    ],
    type: "content",
  },
  {
    title: "The PPC graph",
    content: [
      "The curve shows the economy's production frontier: the maximum combinations it can currently produce.",
    ],
    showGraph: true,
    graphConfig: ppcIntroGraphConfig,
    type: "content",
  },
  {
    title: "Efficient points",
    content: [
      "A point on the curve is efficient. The economy is using its available resources fully.",
      "Producing more of one good requires producing less of the other.",
    ],
    showGraph: true,
    graphConfig: ppcEfficientGraphConfig,
    activePointId: "efficient-a",
    type: "content",
  },
  {
    title: "Inefficient points",
    content: [
      "A point inside the curve is inefficient. The economy could produce more without giving anything up.",
      "This can happen when resources are unemployed or poorly used.",
    ],
    showGraph: true,
    graphConfig: ppcInefficientGraphConfig,
    activePointId: "inefficient-b",
    type: "content",
  },
  {
    title: "Unattainable points",
    content: [
      "A point outside the curve is unattainable with current resources and technology.",
      "Economic growth can make some unattainable points possible in the future.",
    ],
    showGraph: true,
    graphConfig: ppcUnattainableGraphConfig,
    activePointId: "unattainable-c",
    type: "content",
  },
  {
    title: "Classify point B",
    content: [
      "Point B is shown inside the PPC. What kind of production point is it?",
    ],
    showGraph: true,
    graphConfig: ppcGraphConfig,
    activePointId: "inefficient-b",
    type: "classify",
  },
  {
    title: "PPC complete",
    content: [
      "You can now read the PPC as a model of scarcity, tradeoffs, efficiency, inefficiency, and unattainable production.",
    ],
    type: "complete",
  },
];

export const supplyDemandGraphConfig = {
  type: "supply-demand",
  title: "Demand and Supply",
  xAxisLabel: "Quantity",
  yAxisLabel: "Price",
  xMax: 100,
  yMax: 100,
  curves: [
    {
      id: "demand",
      label: "D",
      tone: "secondary",
      points: [
        { x: 10, y: 88 },
        { x: 90, y: 18 },
      ],
    },
    {
      id: "supply",
      label: "S",
      tone: "accent",
      points: [
        { x: 12, y: 18 },
        { x: 90, y: 86 },
      ],
    },
  ],
  points: [{ id: "equilibrium", label: "E", x: 51, y: 52, kind: "equilibrium" }],
} satisfies EconomicsGraphConfig;

export const marginalGraphConfig = {
  type: "marginal",
  title: "Marginal Benefit and Marginal Cost",
  xAxisLabel: "Quantity",
  yAxisLabel: "Dollars",
  xMax: 100,
  yMax: 100,
  curves: [
    {
      id: "mb",
      label: "MB",
      tone: "secondary",
      points: [
        { x: 8, y: 82 },
        { x: 90, y: 24 },
      ],
    },
    {
      id: "mc",
      label: "MC",
      tone: "accent",
      points: [
        { x: 8, y: 18 },
        { x: 90, y: 78 },
      ],
    },
  ],
  points: [{ id: "choice", label: "Q*", x: 50, y: 52, kind: "equilibrium" }],
} satisfies EconomicsGraphConfig;
