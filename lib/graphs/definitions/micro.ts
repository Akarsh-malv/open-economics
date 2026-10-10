import {
  bool,
  type ComputedGraph,
  type ControlValues,
  type GraphDefinition,
  horizontalLine,
  linePoints,
  num,
  round1,
  type Scene,
  type SceneCurve,
  type SceneRegion,
  sampleCurve,
  str,
  verticalLine,
} from "../engine";
import {
  createMarket,
  csRegion,
  demandCurve,
  equilibriumMarkers,
  ghostCurves,
  type MarketModel,
  psRegion,
  supplyCurve,
} from "../market";

/* ---------------------------------------------------------------- */
/* Shared builders                                                   */
/* ---------------------------------------------------------------- */

function marketScene(market: MarketModel, extras: Partial<Scene> = {}): Scene {
  const markers = equilibriumMarkers(market);
  return {
    xLabel: market.xLabel,
    yLabel: market.yLabel,
    xMax: market.xMax,
    yMax: market.yMax,
    curves: [demandCurve(market), supplyCurve(market)],
    guides: markers.guides,
    points: markers.points,
    ...extras,
  };
}

const shiftSlider = (
  id: string,
  label: string,
  max = 22,
): GraphDefinition["controls"][number] => ({
  kind: "slider",
  id,
  label,
  min: -max,
  max,
  step: 1,
  defaultValue: 0,
});

function shiftDirectionText(shift: number, name: string): string {
  if (shift > 0) return `${name} increased (shifted right).`;
  if (shift < 0) return `${name} decreased (shifted left).`;
  return `${name} has not shifted.`;
}

/** Firm cost structure: TVC(q) = 10q − 1.2q² + 0.14q³ (+ productivity scale). */
function firmCosts(fixedCost: number, productivity = 1) {
  const scale = 1 / productivity;
  const avc = (q: number) => scale * (10 - 1.2 * q + 0.14 * q * q);
  const mc = (q: number) => scale * (10 - 2.4 * q + 0.42 * q * q);
  const atc = (q: number) => avc(q) + fixedCost / q;
  const minAvcQ = 1.2 / (2 * 0.14);
  /** q where MC(q) = price (larger root of the quadratic). */
  const qAtPrice = (price: number) => {
    const c = 10 - price / scale;
    const disc = 2.4 * 2.4 - 4 * 0.42 * c;
    if (disc < 0) return null;
    return (2.4 + Math.sqrt(disc)) / (2 * 0.42);
  };
  return { avc, mc, atc, minAvcQ, minAvc: avc(minAvcQ), qAtPrice };
}

function profitRegion(q: number, price: number, unitCost: number): SceneRegion {
  const isProfit = price >= unitCost;
  return {
    id: "profit",
    label: isProfit ? "Profit" : "Loss",
    fill: isProfit ? "benefit" : "cost",
    points: [
      { x: 0, y: unitCost },
      { x: 0, y: price },
      { x: q, y: price },
      { x: q, y: unitCost },
    ],
  };
}

/** Competitive firm panel: MC / ATC / AVC with a price line. */
function firmScene(
  price: number,
  fixedCost: number,
  productivity: number,
  caption?: string,
): { scene: Scene; q: number; profit: number; status: string } {
  const xMax = 12;
  const yMax = 40;
  const costs = firmCosts(fixedCost, productivity);
  const shutdown = price < costs.minAvc;
  const q = shutdown ? 0 : (costs.qAtPrice(price) ?? 0);
  const atcAtQ = q > 0 ? costs.atc(q) : 0;
  const profit = q > 0 ? (price - atcAtQ) * q : -fixedCost;

  const curves: SceneCurve[] = [
    {
      id: "mc",
      label: "MC",
      style: "primary",
      points: sampleCurve(costs.mc, 0.4, xMax, yMax),
    },
    {
      id: "atc",
      label: "ATC",
      style: "secondary",
      points: sampleCurve(costs.atc, 1.4, xMax, yMax),
    },
    {
      id: "avc",
      label: "AVC",
      style: "muted",
      points: sampleCurve(costs.avc, 0.4, xMax, yMax),
    },
    {
      id: "price",
      label: "MR = P",
      style: "tertiary",
      points: horizontalLine(price, xMax),
    },
  ];

  const scene: Scene = {
    caption,
    xLabel: "Quantity (firm)",
    yLabel: "Price, cost",
    xMax,
    yMax,
    curves,
    regions:
      q > 0 && Math.abs(price - atcAtQ) > 0.15
        ? [profitRegion(q, price, atcAtQ)]
        : [],
    guides:
      q > 0
        ? [{ id: "firm-q", x: q, y: price, xLabel: "q*", yLabel: "P" }]
        : [],
    points: q > 0 ? [{ id: "firm-choice", x: q, y: price, label: "" }] : [],
    annotations: shutdown
      ? [
          {
            id: "shutdown",
            x: xMax * 0.55,
            y: yMax * 0.9,
            text: "P < min AVC → shut down (q = 0)",
          },
        ]
      : [],
  };

  const status = shutdown
    ? "shut down"
    : Math.abs(profit) < 1
      ? "normal profit"
      : profit > 0
        ? "economic profit"
        : "economic loss";

  return { scene, q, profit, status };
}

/** Monopoly-style panel: D, MR, MC (+ optional ATC), regions. */
function monopolyScene(options: {
  dIntercept: number;
  dSlope: number;
  mcIntercept: number;
  mcSlope: number;
  fixedCost: number;
  showAtc: boolean;
  showProfit: boolean;
  showCs: boolean;
  showDwl: boolean;
  perfectPD?: boolean;
  caption?: string;
}) {
  const { dIntercept: a, dSlope: b, mcIntercept: m, mcSlope: n } = options;
  const xMax = 100;
  const yMax = 100;
  const qm = (a - m) / (2 * b + n);
  const pm = a - b * qm;
  const qc = (a - m) / (b + n);
  const pc = a - b * qc;
  const mcAt = (q: number) => m + n * q;
  const atcAt = (q: number) => options.fixedCost / q + m + (n / 2) * q;

  const curves: SceneCurve[] = [
    {
      id: "demand",
      label: "D",
      style: "secondary",
      points: linePoints(a, -b, xMax, yMax),
    },
    {
      id: "mr",
      label: "MR",
      style: "muted",
      points: linePoints(a, -2 * b, xMax, yMax),
    },
    {
      id: "mc",
      label: "MC",
      style: "primary",
      points: linePoints(m, n, xMax, yMax),
    },
  ];
  if (options.showAtc) {
    curves.push({
      id: "atc",
      label: "ATC",
      style: "tertiary",
      points: sampleCurve(atcAt, 6, xMax, yMax),
    });
  }

  const regions: SceneRegion[] = [];
  if (options.perfectPD) {
    regions.push({
      id: "pd-profit",
      label: "Producer captures all surplus",
      fill: "ps",
      points: [
        { x: 0, y: mcAt(0) },
        { x: 0, y: Math.min(a, yMax) },
        { x: qc, y: pc },
      ],
    });
  } else {
    if (options.showCs) {
      regions.push({
        id: "cs",
        label: "CS",
        fill: "cs",
        points: [
          { x: 0, y: pm },
          { x: 0, y: Math.min(a, yMax) },
          { x: qm, y: pm },
        ],
      });
    }
    if (options.showProfit) {
      const atcQm = atcAt(qm);
      if (Math.abs(pm - atcQm) > 0.4) {
        regions.push(profitRegion(qm, pm, atcQm));
      }
    }
    if (options.showDwl) {
      regions.push({
        id: "dwl",
        label: "DWL",
        fill: "dwl",
        points: [
          { x: qm, y: pm },
          { x: qc, y: pc },
          { x: qm, y: mcAt(qm) },
        ],
      });
    }
  }

  const q = options.perfectPD ? qc : qm;
  const price = options.perfectPD ? pc : pm;
  const scene: Scene = {
    caption: options.caption,
    xLabel: "Quantity",
    yLabel: "Price, cost",
    xMax,
    yMax,
    curves,
    regions,
    guides: [
      {
        id: "choice",
        x: q,
        y: price,
        xLabel: options.perfectPD ? "Q(PD)" : "Qm",
        yLabel: options.perfectPD ? "P = MC" : "Pm",
      },
    ],
    points: [{ id: "choice-point", x: q, y: price, label: "" }],
  };

  return { scene, qm, pm, qc, pc, atcAt };
}

/** Externality market: private vs social curve with DWL and correction. */
function externalityGraph(options: {
  id: string;
  title: string;
  description: string;
  side: "production" | "consumption";
  sign: "negative" | "positive";
  policyLabel: string;
  privateLabel: string;
  socialLabel: string;
}): GraphDefinition {
  const { side, sign } = options;
  return {
    id: options.id,
    course: "ap-micro",
    category: "Market Failure",
    title: options.title,
    description: options.description,
    controls: [
      {
        kind: "slider",
        id: "external",
        label:
          sign === "negative"
            ? "External cost per unit"
            : "External benefit per unit",
        min: 5,
        max: 30,
        step: 1,
        defaultValue: 18,
      },
      {
        kind: "toggle",
        id: "policy",
        label: options.policyLabel,
        defaultValue: false,
      },
    ],
    details: {
      interpretation:
        sign === "negative"
          ? "The market ignores costs imposed on third parties, so it produces past the socially optimal quantity."
          : "The market ignores benefits enjoyed by third parties, so it produces less than the socially optimal quantity.",
      mistake:
        "Do not shade deadweight loss on the wrong side: it always sits between the market quantity and the socially optimal quantity.",
      examTip:
        "Label both curves (private and social), mark both quantities, and state whether the market over- or under-produces.",
    },
    compute: (values) => {
      const ext = num(values, "external", 18);
      const corrected = bool(values, "policy");
      const onSupply = side === "production";
      // Private curves.
      const dA = 80;
      const sA = 10;
      const slope = 0.75;
      // Social curve = private curve shifted by the externality.
      const socialOffset = sign === "negative" ? ext : -ext;
      const privA = onSupply ? sA : dA;
      const socialA = onSupply ? sA + socialOffset : dA - socialOffset;

      const effA = corrected ? socialA : privA;
      const market = createMarket(
        onSupply
          ? { sIntercept: effA, dIntercept: dA }
          : { dIntercept: effA, sIntercept: sA },
      );
      const social = createMarket(
        onSupply
          ? { sIntercept: socialA, dIntercept: dA }
          : { dIntercept: socialA, sIntercept: sA },
      );
      const free = createMarket(
        onSupply
          ? { sIntercept: privA, dIntercept: dA }
          : { dIntercept: privA, sIntercept: sA },
      );

      const qMkt = free.equilibrium.x;
      const qOpt = social.equilibrium.x;

      const privCurve = onSupply
        ? supplyCurve(free, { id: "private", label: options.privateLabel })
        : demandCurve(free, { id: "private", label: options.privateLabel });
      const socialCurve: SceneCurve = {
        id: "social",
        label: options.socialLabel,
        style: "tertiary",
        points: linePoints(socialA, onSupply ? slope : -slope, 100, 100),
      };
      const otherCurve = onSupply
        ? demandCurve(free, { id: "demand", label: "D = MPB" })
        : supplyCurve(free, { id: "supply", label: "S = MPC" });

      // DWL triangle between qOpt and qMkt bounded by the two relevant curves.
      const socialAt = (q: number) =>
        onSupply ? socialA + slope * q : socialA - slope * q;
      const privOppositeAt = (q: number) =>
        onSupply ? free.demandAt(q) : free.supplyAt(q);
      const dwl: SceneRegion = {
        id: "dwl",
        label: "DWL",
        fill: "dwl",
        points: [
          { x: qOpt, y: social.equilibrium.y },
          { x: qMkt, y: socialAt(qMkt) },
          { x: qMkt, y: privOppositeAt(qMkt) },
        ],
      };

      const markers = equilibriumMarkers(market, {
        q: corrected ? "Q(opt)" : "Q(mkt)",
        p: "P",
      });

      const scene: Scene = {
        xLabel: "Quantity",
        yLabel: sign === "negative" ? "Costs, price" : "Benefits, price",
        xMax: 100,
        yMax: 100,
        curves: [otherCurve, privCurve, socialCurve],
        regions: corrected ? [] : [dwl],
        guides: [
          ...markers.guides,
          {
            id: "qopt",
            x: qOpt,
            y: social.equilibrium.y,
            xLabel: "Q(opt)",
          },
        ],
        points: markers.points,
      };

      const overUnder =
        sign === "negative" ? "over-produces" : "under-produces";
      return {
        scenes: [scene],
        explanation: corrected
          ? `The corrective ${sign === "negative" ? "tax" : "subsidy"} internalizes the externality: the market now lands on the socially optimal quantity and the deadweight loss disappears.`
          : `The market ${overUnder}: Q(mkt) ${sign === "negative" ? ">" : "<"} Q(opt) because each unit carries an external ${sign === "negative" ? "cost" : "benefit"} of ${ext}. The shaded triangle is the deadweight loss.`,
        readouts: [
          { label: "Q market", value: round1(qMkt) },
          { label: "Q optimal", value: round1(qOpt) },
          {
            label: sign === "negative" ? "External cost" : "External benefit",
            value: round1(ext),
          },
        ],
      };
    },
  };
}

/* ---------------------------------------------------------------- */
/* Basic Economic Concepts                                           */
/* ---------------------------------------------------------------- */

function ppcCompute(values: ControlValues): ComputedGraph {
  const shape = str(values, "shape", "bowed");
  const resources = num(values, "resources", 100);
  const technology = num(values, "technology", 100);
  const position = num(values, "position", 55);
  const utilization = num(values, "utilization", 100);
  const scale = (resources / 100) * (technology / 100);
  const radius = 88 * scale;

  const curveFor = (r: number) =>
    shape === "bowed"
      ? sampleCurve(
          (x) => (x >= r ? 0 : r * Math.sqrt(1 - (x / r) ** 2)),
          0,
          Math.min(r, 100),
          100,
          80,
        )
      : (
          [
            { x: 0, y: Math.min(r, 100) },
            { x: Math.min(r, 100), y: 0 },
          ] as const
        ).slice();

  const curves: SceneCurve[] = [
    { id: "ppc", label: "PPC", style: "primary", points: curveFor(radius) },
  ];
  if (Math.abs(scale - 1) > 0.01) {
    curves.push({
      id: "ppc-before",
      label: "PPC₀",
      style: "reference",
      dashed: true,
      points: curveFor(88),
    });
  }

  const angle = (position / 100) * (Math.PI / 2);
  const r = radius * (utilization / 100);
  const px = r * Math.sin(angle);
  const py =
    shape === "bowed"
      ? r * Math.cos(angle)
      : (utilization / 100) * (radius - (px / Math.max(radius, 1e-6)) * radius);
  const onCurve = utilization >= 99.5;
  const classification = onCurve ? "efficient" : "inefficient";

  const oppCost =
    shape === "bowed"
      ? "Opportunity cost rises as production tilts toward one good (bowed-out PPC: resources are specialized)."
      : "Opportunity cost is constant along a straight-line PPC (resources are equally suited to both goods).";

  const growthText =
    scale > 1.01
      ? "More resources or better technology shifted the PPC outward — growth."
      : scale < 0.99
        ? "Fewer resources shifted the PPC inward — contraction."
        : "The frontier is at its base position.";

  return {
    scenes: [
      {
        xLabel: "Consumer goods",
        yLabel: "Capital goods",
        xMax: 100,
        yMax: 100,
        curves,
        points: [
          { id: "prod", x: px, y: Math.max(py, 0), label: "A" },
          ...(bool(values, "showUnattainable")
            ? [
                {
                  id: "unattainable",
                  x: Math.min(radius * 0.85 + 18, 97),
                  y: Math.min(radius * 0.75 + 18, 97),
                  label: "U",
                  muted: true,
                },
              ]
            : []),
        ],
        guides: [
          {
            id: "prod-guide",
            x: px,
            y: Math.max(py, 0),
            xLabel: "Cx",
            yLabel: "Ky",
          },
        ],
        annotations: bool(values, "showUnattainable")
          ? [
              {
                id: "un-note",
                x: Math.min(radius * 0.85 + 18, 90),
                y: Math.min(radius * 0.75 + 26, 99),
                text: "unattainable",
              },
            ]
          : [],
      },
    ],
    explanation: `Point A is ${classification} (${utilization}% of capacity in use). ${growthText} ${oppCost}`,
    readouts: [
      { label: "Point A", value: classification },
      { label: "Frontier", value: `${Math.round(scale * 100)}% of base` },
    ],
  };
}

const ppcDefinition: GraphDefinition = {
  id: "production-possibilities-curve",
  course: "ap-micro",
  category: "Basic Economic Concepts",
  title: "Production Possibilities Curve",
  description:
    "Scarcity, tradeoffs, efficiency, and growth on one frontier between two goods.",
  controls: [
    {
      kind: "segmented",
      id: "shape",
      label: "Curve shape",
      options: [
        { value: "bowed", label: "Bowed-out" },
        { value: "linear", label: "Straight line" },
      ],
      defaultValue: "bowed",
    },
    {
      kind: "slider",
      id: "resources",
      label: "Resources",
      min: 70,
      max: 130,
      step: 5,
      defaultValue: 100,
      unit: "%",
    },
    {
      kind: "slider",
      id: "technology",
      label: "Technology",
      min: 100,
      max: 130,
      step: 5,
      defaultValue: 100,
      unit: "%",
    },
    {
      kind: "slider",
      id: "position",
      label: "Point A: consumer-goods mix",
      min: 5,
      max: 95,
      step: 1,
      defaultValue: 55,
    },
    {
      kind: "slider",
      id: "utilization",
      label: "Point A: resource utilization",
      min: 50,
      max: 100,
      step: 1,
      defaultValue: 100,
      unit: "%",
    },
    {
      kind: "toggle",
      id: "showUnattainable",
      label: "Show an unattainable point",
      defaultValue: true,
    },
  ],
  presets: [
    {
      id: "efficient",
      label: "Efficient point",
      values: { utilization: 100, position: 55 },
    },
    {
      id: "inefficient",
      label: "Inefficient point",
      values: { utilization: 70 },
    },
    {
      id: "growth",
      label: "Economic growth",
      values: { resources: 120, technology: 115 },
    },
    {
      id: "contraction",
      label: "Contraction",
      values: { resources: 75, technology: 100 },
    },
  ],
  details: {
    interpretation:
      "Points on the frontier are efficient, inside is inefficient, outside is unattainable with current resources and technology.",
    mistake:
      "Growth is an outward shift of the whole curve — moving along the curve is not growth.",
    examTip:
      "When asked about opportunity cost shape, tie bowed-out to increasing opportunity cost from specialized resources.",
  },
  compute: ppcCompute,
};

const comparativeAdvantageDefinition: GraphDefinition = {
  id: "comparative-advantage",
  course: "ap-micro",
  category: "Basic Economic Concepts",
  title: "Comparative Advantage and Trade",
  description:
    "Two straight-line PPCs, opportunity costs, specialization, and gains from trade.",
  controls: [
    {
      kind: "slider",
      id: "aWheat",
      label: "Country A: max wheat",
      min: 30,
      max: 100,
      step: 5,
      defaultValue: 90,
    },
    {
      kind: "slider",
      id: "aCloth",
      label: "Country A: max cloth",
      min: 30,
      max: 100,
      step: 5,
      defaultValue: 45,
    },
    {
      kind: "slider",
      id: "bWheat",
      label: "Country B: max wheat",
      min: 30,
      max: 100,
      step: 5,
      defaultValue: 40,
    },
    {
      kind: "slider",
      id: "bCloth",
      label: "Country B: max cloth",
      min: 30,
      max: 100,
      step: 5,
      defaultValue: 80,
    },
    {
      kind: "slider",
      id: "terms",
      label: "Terms of trade (wheat per cloth)",
      min: 5,
      max: 30,
      step: 1,
      defaultValue: 12,
      unit: " ÷10",
    },
    {
      kind: "toggle",
      id: "showTrade",
      label: "Show consumption after trade",
      defaultValue: true,
    },
  ],
  details: {
    interpretation:
      "The country with the lower opportunity cost of a good has the comparative advantage in it and should specialize there.",
    mistake:
      "Absolute advantage (producing more) is not comparative advantage (giving up less).",
    examTip:
      "Mutually beneficial terms of trade must sit between the two countries' opportunity costs.",
  },
  compute: (values) => {
    const aW = num(values, "aWheat", 90);
    const aC = num(values, "aCloth", 45);
    const bW = num(values, "bWheat", 40);
    const bC = num(values, "bCloth", 80);
    const terms = num(values, "terms", 12) / 10;
    const showTrade = bool(values, "showTrade", true);

    // Opportunity cost of one cloth, measured in wheat.
    const aCost = aW / aC;
    const bCost = bW / bC;
    const clothCountry = aCost < bCost ? "A" : "B";
    const wheatCountry = clothCountry === "A" ? "B" : "A";
    const tradeFeasible =
      terms > Math.min(aCost, bCost) && terms < Math.max(aCost, bCost);

    const panel = (
      name: string,
      wheatMax: number,
      clothMax: number,
      specializesInCloth: boolean,
    ): Scene => {
      const curves: SceneCurve[] = [
        {
          id: "ppc",
          label: `PPC (${name})`,
          style: "primary",
          points: [
            { x: 0, y: wheatMax },
            { x: clothMax, y: 0 },
          ],
        },
      ];
      if (showTrade && tradeFeasible) {
        // Specialize at one axis end, then trade at the terms-of-trade slope.
        const start = specializesInCloth
          ? { x: clothMax, y: 0 }
          : { x: 0, y: wheatMax };
        const end = specializesInCloth
          ? { x: 0, y: Math.min(clothMax * terms, 100) }
          : { x: Math.min(wheatMax / terms, 100), y: 0 };
        curves.push({
          id: "trade",
          label: "Trade line",
          style: "tertiary",
          dashed: true,
          points: [start, end],
        });
      }
      return {
        caption: `Country ${name}`,
        xLabel: "Cloth",
        yLabel: "Wheat",
        xMax: 100,
        yMax: 100,
        curves,
      };
    };

    return {
      scenes: [
        panel("A", aW, aC, clothCountry === "A"),
        panel("B", bW, bC, clothCountry === "B"),
      ],
      explanation: tradeFeasible
        ? `Country ${clothCountry} gives up less wheat per cloth (${round1(Math.min(aCost, bCost))} vs ${round1(Math.max(aCost, bCost))}), so it specializes in cloth while Country ${wheatCountry} specializes in wheat. At ${round1(terms)} wheat per cloth, the dashed trade lines lie outside each PPC — both countries consume beyond their own frontiers.`
        : `At ${round1(terms)} wheat per cloth, the terms of trade fall outside the range between the two opportunity costs (${round1(Math.min(aCost, bCost))} to ${round1(Math.max(aCost, bCost))}), so at least one country refuses to trade.`,
      readouts: [
        { label: "A: cost of 1 cloth", value: `${round1(aCost)} wheat` },
        { label: "B: cost of 1 cloth", value: `${round1(bCost)} wheat` },
        { label: "Comp. adv. in cloth", value: `Country ${clothCountry}` },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Supply, Demand, and Elasticity                                    */
/* ---------------------------------------------------------------- */

const supplyDemandDefinition: GraphDefinition = {
  id: "supply-and-demand",
  course: "ap-micro",
  category: "Supply, Demand, and Elasticity",
  title: "Supply and Demand",
  description:
    "The core market model: shift either curve, adjust slopes, and probe prices off equilibrium.",
  controls: [
    shiftSlider("dShift", "Shift demand"),
    shiftSlider("sShift", "Shift supply"),
    {
      kind: "slider",
      id: "dSlope",
      label: "Demand steepness",
      min: 4,
      max: 14,
      step: 1,
      defaultValue: 8,
      unit: " ÷10",
    },
    {
      kind: "slider",
      id: "sSlope",
      label: "Supply steepness",
      min: 4,
      max: 14,
      step: 1,
      defaultValue: 8,
      unit: " ÷10",
    },
    {
      kind: "toggle",
      id: "probe",
      label: "Probe a non-equilibrium price",
      defaultValue: false,
    },
    {
      kind: "slider",
      id: "probePrice",
      label: "Probed price",
      min: 15,
      max: 85,
      step: 1,
      defaultValue: 65,
    },
  ],
  presets: [
    {
      id: "demand-up",
      label: "Demand increases",
      values: { dShift: 15, sShift: 0 },
    },
    {
      id: "supply-down",
      label: "Supply decreases",
      values: { dShift: 0, sShift: -15 },
    },
    {
      id: "surplus",
      label: "Price above equilibrium",
      values: { probe: true, probePrice: 70, dShift: 0, sShift: 0 },
    },
    {
      id: "shortage",
      label: "Price below equilibrium",
      values: { probe: true, probePrice: 25, dShift: 0, sShift: 0 },
    },
  ],
  details: {
    interpretation:
      "Equilibrium is where quantity demanded equals quantity supplied; prices above it create surpluses, below it shortages.",
    mistake:
      "A change in the good's own price moves you along a curve — it never shifts the curve.",
    examTip:
      "Always label the shift direction with an arrow and mark both the old and new equilibrium.",
  },
  compute: (values) => {
    const market = createMarket({
      dShift: num(values, "dShift"),
      sShift: num(values, "sShift"),
      dSlope: num(values, "dSlope", 8) / 10,
      sSlope: num(values, "sSlope", 8) / 10,
    });
    const scene = marketScene(market, {
      curves: [
        demandCurve(market),
        supplyCurve(market),
        ...ghostCurves(market, { demand: true, supply: true }),
      ],
    });

    let probeText = "";
    if (bool(values, "probe")) {
      const p = num(values, "probePrice", 65);
      const qd = Math.max(market.qDemandedAt(p), 0);
      const qs = Math.max(market.qSuppliedAt(p), 0);
      const gap = Math.abs(qd - qs);
      const kind = qd > qs ? "shortage" : qd < qs ? "surplus" : "equilibrium";
      scene.curves.push({
        id: "probe-price",
        label: "P̄",
        style: "tertiary",
        dashed: true,
        points: horizontalLine(p, market.xMax),
      });
      scene.annotations = [
        {
          id: "probe-note",
          x: (qd + qs) / 2,
          y: Math.min(p + 6, 97),
          text:
            kind === "equilibrium"
              ? "market clears"
              : `${kind}: ${round1(gap)}`,
        },
      ];
      probeText =
        kind === "equilibrium"
          ? " At the probed price the market clears."
          : ` At the probed price of ${p}, ${kind === "shortage" ? "quantity demanded exceeds quantity supplied" : "quantity supplied exceeds quantity demanded"} by ${round1(gap)} — a ${kind} that pushes price ${kind === "shortage" ? "up" : "down"}.`;
    }

    return {
      scenes: [scene],
      explanation:
        `${shiftDirectionText(num(values, "dShift"), "Demand")} ${shiftDirectionText(num(values, "sShift"), "Supply")} Equilibrium is now P* = ${round1(market.equilibrium.y)}, Q* = ${round1(market.equilibrium.x)}.` +
        probeText,
      readouts: [
        { label: "P*", value: round1(market.equilibrium.y) },
        { label: "Q*", value: round1(market.equilibrium.x) },
      ],
    };
  },
};

function shiftCauseDefinition(options: {
  id: string;
  title: string;
  curve: "demand" | "supply";
  causes: { value: string; label: string; note: string; invert?: boolean }[];
}): GraphDefinition {
  const isDemand = options.curve === "demand";
  return {
    id: options.id,
    course: "ap-micro",
    category: "Supply, Demand, and Elasticity",
    title: options.title,
    description: `What shifts ${options.curve}, in which direction, and what happens to price and quantity.`,
    controls: [
      {
        kind: "segmented",
        id: "cause",
        label: "Determinant",
        options: options.causes.map(({ value, label }) => ({ value, label })),
        defaultValue: options.causes[0].value,
      },
      {
        kind: "segmented",
        id: "direction",
        label: "Change",
        options: [
          { value: "increase", label: "Increase" },
          { value: "decrease", label: "Decrease" },
        ],
        defaultValue: "increase",
      },
      {
        kind: "slider",
        id: "size",
        label: "Size of shift",
        min: 5,
        max: 25,
        step: 1,
        defaultValue: 15,
      },
    ],
    details: {
      mistake: isDemand
        ? "A price change never shifts demand — only the non-price determinants listed here do."
        : "A price change never shifts supply — only production conditions do.",
    },
    compute: (values) => {
      const cause =
        options.causes.find(
          (candidate) => candidate.value === str(values, "cause"),
        ) ?? options.causes[0];
      const increase = str(values, "direction", "increase") === "increase";
      const sign = (increase ? 1 : -1) * (cause.invert ? -1 : 1);
      const size = num(values, "size", 15) * sign;

      const market = createMarket(
        isDemand ? { dShift: size } : { sShift: size },
      );
      const scene = marketScene(market, {
        curves: [
          demandCurve(market),
          supplyCurve(market),
          ...ghostCurves(market, { demand: isDemand, supply: !isDemand }),
        ],
      });

      const dP = market.equilibrium.y - market.originalEquilibrium.y;
      const dQ = market.equilibrium.x - market.originalEquilibrium.x;
      return {
        scenes: [scene],
        explanation: `${cause.note} ${options.curve === "demand" ? "Demand" : "Supply"} shifts ${size > 0 ? "right" : "left"}: price ${dP > 0 ? "rises" : "falls"} and quantity ${dQ > 0 ? "rises" : "falls"}.`,
        readouts: [
          { label: "ΔP*", value: round1(dP) },
          { label: "ΔQ*", value: round1(dQ) },
        ],
      };
    },
  };
}

const demandShiftsDefinition = shiftCauseDefinition({
  id: "change-in-demand",
  title: "Change in Demand",
  curve: "demand",
  causes: [
    {
      value: "income",
      label: "Income",
      note: "Higher income raises demand for a normal good.",
    },
    {
      value: "preferences",
      label: "Preferences",
      note: "Stronger preferences raise willingness to pay at every price.",
    },
    {
      value: "expectations",
      label: "Expectations",
      note: "Expecting higher future prices raises demand today.",
    },
    {
      value: "population",
      label: "Buyers",
      note: "More buyers add quantity demanded at every price.",
    },
    {
      value: "substitute",
      label: "Substitute price",
      note: "A pricier substitute pushes buyers into this market.",
    },
    {
      value: "complement",
      label: "Complement price",
      note: "A pricier complement pulls buyers out of this market.",
      invert: true,
    },
  ],
});

const supplyShiftsDefinition = shiftCauseDefinition({
  id: "change-in-supply",
  title: "Change in Supply",
  curve: "supply",
  causes: [
    {
      value: "inputs",
      label: "Input prices",
      note: "Cheaper inputs lower costs and raise supply.",
    },
    {
      value: "technology",
      label: "Technology",
      note: "Better technology raises output per unit of input.",
    },
    {
      value: "taxes",
      label: "Taxes",
      note: "Higher per-unit taxes raise costs and cut supply.",
      invert: true,
    },
    {
      value: "subsidies",
      label: "Subsidies",
      note: "Subsidies lower effective costs and raise supply.",
    },
    {
      value: "expectations",
      label: "Expectations",
      note: "Expecting higher future prices, sellers withhold output today.",
      invert: true,
    },
    {
      value: "sellers",
      label: "Sellers",
      note: "More sellers add quantity supplied at every price.",
    },
  ],
});

const simultaneousShiftsDefinition: GraphDefinition = {
  id: "simultaneous-shifts",
  course: "ap-micro",
  category: "Supply, Demand, and Elasticity",
  title: "Simultaneous Shifts",
  description:
    "Shift demand and supply at the same time and see which outcome becomes indeterminate.",
  controls: [
    shiftSlider("dShift", "Shift demand", 20),
    shiftSlider("sShift", "Shift supply", 20),
  ],
  presets: [
    {
      id: "both-up",
      label: "Both increase",
      values: { dShift: 14, sShift: 14 },
    },
    {
      id: "d-up-s-down",
      label: "D up, S down",
      values: { dShift: 14, sShift: -14 },
    },
    {
      id: "both-down",
      label: "Both decrease",
      values: { dShift: -14, sShift: -14 },
    },
  ],
  details: {
    examTip:
      "State the determinate variable confidently, then say the other is indeterminate 'depending on the relative sizes of the shifts.'",
  },
  compute: (values) => {
    const dShift = num(values, "dShift");
    const sShift = num(values, "sShift");
    const market = createMarket({ dShift, sShift });
    const scene = marketScene(market, {
      curves: [
        demandCurve(market),
        supplyCurve(market),
        ...ghostCurves(market, { demand: true, supply: true }),
      ],
    });

    let verdict =
      "With a single shift, both price and quantity move predictably.";
    if (dShift !== 0 && sShift !== 0) {
      const sameDirection = Math.sign(dShift) === Math.sign(sShift);
      verdict = sameDirection
        ? `Quantity is certain (${dShift > 0 ? "rises" : "falls"}); price is indeterminate — it depends on which shift is larger. In this drawing price happens to ${market.equilibrium.y > market.originalEquilibrium.y ? "rise" : "fall"}.`
        : `Price is certain (${dShift > 0 ? "rises" : "falls"}); quantity is indeterminate — it depends on which shift is larger. In this drawing quantity happens to ${market.equilibrium.x > market.originalEquilibrium.x ? "rise" : "fall"}.`;
    }

    return {
      scenes: [scene],
      explanation: `${shiftDirectionText(dShift, "Demand")} ${shiftDirectionText(sShift, "Supply")} ${verdict}`,
      readouts: [
        { label: "P*", value: round1(market.equilibrium.y) },
        { label: "Q*", value: round1(market.equilibrium.x) },
      ],
    };
  },
};

const elasticityDemandDefinition: GraphDefinition = {
  id: "price-elasticity-of-demand",
  course: "ap-micro",
  category: "Supply, Demand, and Elasticity",
  title: "Price Elasticity of Demand",
  description:
    "Five demand shapes and how a price change moves total revenue in each.",
  controls: [
    {
      kind: "segmented",
      id: "case",
      label: "Elasticity",
      options: [
        { value: "elastic", label: "Elastic" },
        { value: "unit", label: "Unit" },
        { value: "inelastic", label: "Inelastic" },
        { value: "perfectly-elastic", label: "Perfectly elastic" },
        { value: "perfectly-inelastic", label: "Perfectly inelastic" },
      ],
      defaultValue: "elastic",
    },
    {
      kind: "slider",
      id: "price",
      label: "Selected price",
      min: 20,
      max: 80,
      step: 1,
      defaultValue: 50,
    },
    {
      kind: "toggle",
      id: "showRevenue",
      label: "Shade total revenue",
      defaultValue: true,
    },
  ],
  details: {
    interpretation:
      "Elasticity compares percentage changes; flat curves respond a lot to price, steep curves respond little.",
    mistake:
      "Slope is not elasticity — a straight demand curve has different elasticities along its length.",
    examTip:
      "Inelastic demand + price increase → total revenue rises; elastic demand + price increase → total revenue falls.",
  },
  compute: (values) => {
    const kase = str(values, "case", "elastic");
    const price = num(values, "price", 50);
    const xMax = 100;
    const yMax = 100;

    let curve: SceneCurve;
    let qAt: (p: number) => number;
    switch (kase) {
      case "inelastic":
        curve = {
          id: "d",
          label: "D (inelastic)",
          style: "secondary",
          points: linePoints(140, -1.8, xMax, yMax),
        };
        qAt = (p) => (140 - p) / 1.8;
        break;
      case "unit":
        curve = {
          id: "d",
          label: "D (unit elastic)",
          style: "secondary",
          points: sampleCurve((q) => 2500 / Math.max(q, 8), 8, xMax, yMax),
        };
        qAt = (p) => 2500 / p;
        break;
      case "perfectly-elastic":
        curve = {
          id: "d",
          label: "D (perfectly elastic)",
          style: "secondary",
          points: horizontalLine(price, xMax),
        };
        qAt = () => 55;
        break;
      case "perfectly-inelastic":
        curve = {
          id: "d",
          label: "D (perfectly inelastic)",
          style: "secondary",
          points: verticalLine(50, yMax),
        };
        qAt = () => 50;
        break;
      default:
        curve = {
          id: "d",
          label: "D (elastic)",
          style: "secondary",
          points: linePoints(85, -0.35, xMax, yMax),
        };
        qAt = (p) => (85 - p) / 0.35;
    }

    const q = Math.min(Math.max(qAt(price), 0), xMax);
    const revenue = price * q;
    const regions: SceneRegion[] = bool(values, "showRevenue", true)
      ? [
          {
            id: "tr",
            label: "Total revenue",
            fill: "revenue",
            points: [
              { x: 0, y: 0 },
              { x: 0, y: price },
              { x: q, y: price },
              { x: q, y: 0 },
            ],
          },
        ]
      : [];

    const trNote: Record<string, string> = {
      elastic:
        "Raising price shrinks the revenue rectangle: the quantity loss outweighs the price gain.",
      unit: "Along a unit-elastic curve the revenue rectangle keeps a constant area as price changes.",
      inelastic:
        "Raising price grows the revenue rectangle: the price gain outweighs the small quantity loss.",
      "perfectly-elastic":
        "Any price above the line loses every buyer; revenue exists only at exactly this price.",
      "perfectly-inelastic":
        "Quantity never changes, so revenue moves one-for-one with price.",
    };

    return {
      scenes: [
        {
          xLabel: "Quantity",
          yLabel: "Price",
          xMax,
          yMax,
          curves: [curve],
          regions,
          guides: [{ id: "sel", x: q, y: price, xLabel: "Q", yLabel: "P" }],
          points: [{ id: "sel-point", x: q, y: price, label: "" }],
        },
      ],
      explanation: trNote[kase],
      readouts: [
        { label: "P", value: round1(price) },
        { label: "Q", value: round1(q) },
        { label: "TR = P × Q", value: round1(revenue) },
      ],
    };
  },
};

const elasticitySupplyDefinition: GraphDefinition = {
  id: "price-elasticity-of-supply",
  course: "ap-micro",
  category: "Supply, Demand, and Elasticity",
  title: "Price Elasticity of Supply",
  description:
    "How responsive sellers are to price, from perfectly inelastic to perfectly elastic.",
  controls: [
    {
      kind: "segmented",
      id: "case",
      label: "Elasticity",
      options: [
        { value: "elastic", label: "Elastic" },
        { value: "inelastic", label: "Inelastic" },
        { value: "perfectly-elastic", label: "Perfectly elastic" },
        { value: "perfectly-inelastic", label: "Perfectly inelastic" },
      ],
      defaultValue: "elastic",
    },
    {
      kind: "slider",
      id: "price",
      label: "Selected price",
      min: 20,
      max: 80,
      step: 1,
      defaultValue: 50,
    },
  ],
  details: {
    interpretation:
      "Supply elasticity mostly reflects time: the longer producers have to adjust, the more elastic supply becomes.",
  },
  compute: (values) => {
    const kase = str(values, "case", "elastic");
    const price = num(values, "price", 50);
    let curve: SceneCurve;
    let qAt: (p: number) => number;
    switch (kase) {
      case "inelastic":
        curve = {
          id: "s",
          label: "S (inelastic)",
          style: "primary",
          points: linePoints(-50, 2.2, 100, 100),
        };
        qAt = (p) => (p + 50) / 2.2;
        break;
      case "perfectly-elastic":
        curve = {
          id: "s",
          label: "S (perfectly elastic)",
          style: "primary",
          points: horizontalLine(price, 100),
        };
        qAt = () => 55;
        break;
      case "perfectly-inelastic":
        curve = {
          id: "s",
          label: "S (perfectly inelastic)",
          style: "primary",
          points: verticalLine(50, 100),
        };
        qAt = () => 50;
        break;
      default:
        curve = {
          id: "s",
          label: "S (elastic)",
          style: "primary",
          points: linePoints(20, 0.4, 100, 100),
        };
        qAt = (p) => (p - 20) / 0.4;
    }
    const q = Math.min(Math.max(qAt(price), 0), 100);
    const note: Record<string, string> = {
      elastic:
        "A flat supply curve: a small price rise draws out a large increase in quantity supplied.",
      inelastic:
        "A steep supply curve: even large price changes barely move quantity supplied — typical in the short run.",
      "perfectly-elastic":
        "Sellers supply any amount at this price and nothing below it.",
      "perfectly-inelastic":
        "Quantity supplied is fixed regardless of price — think of tickets to a stadium with fixed seats.",
    };
    return {
      scenes: [
        {
          xLabel: "Quantity",
          yLabel: "Price",
          xMax: 100,
          yMax: 100,
          curves: [curve],
          guides: [{ id: "sel", x: q, y: price, xLabel: "Q", yLabel: "P" }],
          points: [{ id: "sel-point", x: q, y: price, label: "" }],
        },
      ],
      explanation: note[kase],
      readouts: [
        { label: "P", value: round1(price) },
        { label: "Qs", value: round1(q) },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Government Intervention                                           */
/* ---------------------------------------------------------------- */

function priceControlDefinition(kind: "ceiling" | "floor"): GraphDefinition {
  const isCeiling = kind === "ceiling";
  return {
    id: `price-${kind}`,
    course: "ap-micro",
    category: "Government Intervention",
    title: isCeiling ? "Price Ceiling" : "Price Floor",
    description: isCeiling
      ? "A legal maximum price: binding ceilings sit below equilibrium and create shortages."
      : "A legal minimum price: binding floors sit above equilibrium and create surpluses.",
    controls: [
      {
        kind: "slider",
        id: "control",
        label: isCeiling ? "Ceiling price" : "Floor price",
        min: 15,
        max: 85,
        step: 1,
        defaultValue: isCeiling ? 30 : 65,
      },
      {
        kind: "toggle",
        id: "welfare",
        label: "Shade welfare areas",
        defaultValue: true,
      },
    ],
    presets: [
      {
        id: "binding",
        label: "Binding",
        values: { control: isCeiling ? 30 : 65 },
      },
      {
        id: "nonbinding",
        label: "Non-binding",
        values: { control: isCeiling ? 65 : 30 },
      },
    ],
    details: {
      interpretation: isCeiling
        ? "Only ceilings below equilibrium bind. Quantity transacted falls to quantity supplied."
        : "Only floors above equilibrium bind. Quantity transacted falls to quantity demanded.",
      mistake:
        "A non-binding control changes nothing — the market stays at its equilibrium.",
      examTip:
        "Quantity transacted under a binding control is always the smaller of Qd and Qs.",
    },
    compute: (values) => {
      const market = createMarket();
      const control = num(values, "control", isCeiling ? 30 : 65);
      const pStar = market.equilibrium.y;
      const binding = isCeiling ? control < pStar : control > pStar;
      const showWelfare = bool(values, "welfare", true);

      const scene = marketScene(market);
      scene.curves.push({
        id: "control-line",
        label: isCeiling ? "Ceiling" : "Floor",
        style: "tertiary",
        dashed: true,
        points: horizontalLine(control, market.xMax),
      });

      let explanation = `The ${kind} at ${control} is non-binding (${isCeiling ? "above" : "below"} the equilibrium price of ${round1(pStar)}), so the market stays at equilibrium.`;
      const readouts = [
        { label: "P*", value: round1(pStar) },
        { label: isCeiling ? "Ceiling" : "Floor", value: round1(control) },
      ];

      if (binding) {
        // Clamp at zero: a floor above the choke price (or a ceiling below
        // the supply intercept) drives one side of the market to nothing.
        const qd = Math.max(market.qDemandedAt(control), 0);
        const qs = Math.max(market.qSuppliedAt(control), 0);
        const qTraded = Math.min(qd, qs);
        const gap = Math.abs(qd - qs);

        scene.guides = [
          {
            id: "qt",
            x: qTraded,
            y: control,
            xLabel: isCeiling ? "Qs" : "Qd",
            yLabel: isCeiling ? "Pc" : "Pf",
          },
          {
            id: "qother",
            x: Math.max(qd, qs),
            y: control,
            xLabel: isCeiling ? "Qd" : "Qs",
          },
        ];
        scene.points = [];
        scene.annotations = [
          {
            id: "gap",
            x: (qd + qs) / 2,
            y: Math.max(control - 6, 4),
            text: `${isCeiling ? "shortage" : "surplus"}: ${round1(gap)}`,
          },
        ];

        if (showWelfare) {
          const demandAtQt = market.demandAt(qTraded);
          const supplyAtQt = market.supplyAt(qTraded);
          scene.regions = [
            {
              id: "cs",
              label: "CS",
              fill: "cs",
              points: [
                { x: 0, y: isCeiling ? control : demandAtQt },
                { x: 0, y: market.dA },
                { x: qTraded, y: demandAtQt },
                { x: qTraded, y: isCeiling ? control : demandAtQt },
              ],
            },
            {
              id: "ps",
              label: "PS",
              fill: "ps",
              points: [
                { x: 0, y: isCeiling ? supplyAtQt : control },
                { x: qTraded, y: isCeiling ? supplyAtQt : control },
                { x: qTraded, y: supplyAtQt },
                { x: 0, y: market.sA },
              ],
            },
            {
              id: "dwl",
              label: "DWL",
              fill: "dwl",
              points: [
                { x: qTraded, y: demandAtQt },
                { x: market.equilibrium.x, y: pStar },
                { x: qTraded, y: supplyAtQt },
              ],
            },
          ];
        }

        explanation = `The binding ${kind} moves price to ${control}. Quantity transacted falls to ${round1(qTraded)}, leaving a ${isCeiling ? "shortage" : "surplus"} of ${round1(gap)}. The lost trades between ${round1(qTraded)} and ${round1(market.equilibrium.x)} are the deadweight loss.`;
        readouts.push(
          { label: "Q transacted", value: round1(qTraded) },
          { label: isCeiling ? "Shortage" : "Surplus", value: round1(gap) },
        );
      }

      return { scenes: [scene], explanation, readouts };
    },
  };
}

const taxDefinition: GraphDefinition = {
  id: "per-unit-tax",
  course: "ap-micro",
  category: "Government Intervention",
  title: "Per-Unit Tax",
  description:
    "A tax wedge between what buyers pay and sellers keep — with incidence set by elasticity.",
  controls: [
    {
      kind: "slider",
      id: "tax",
      label: "Tax per unit",
      min: 0,
      max: 36,
      step: 1,
      defaultValue: 18,
    },
    {
      kind: "slider",
      id: "dSlope",
      label: "Demand steepness",
      min: 3,
      max: 16,
      step: 1,
      defaultValue: 8,
      unit: " ÷10",
    },
    {
      kind: "slider",
      id: "sSlope",
      label: "Supply steepness",
      min: 3,
      max: 16,
      step: 1,
      defaultValue: 8,
      unit: " ÷10",
    },
  ],
  presets: [
    {
      id: "inelastic-demand",
      label: "Inelastic demand",
      values: { tax: 18, dSlope: 15, sSlope: 5 },
    },
    {
      id: "elastic-demand",
      label: "Elastic demand",
      values: { tax: 18, dSlope: 4, sSlope: 12 },
    },
  ],
  details: {
    interpretation:
      "The side of the market that is more inelastic bears more of the tax, regardless of who legally pays it.",
    mistake:
      "The price buyers pay rises by less than the tax (unless demand is perfectly inelastic).",
    examTip:
      "Tax revenue is the wedge times the after-tax quantity; DWL is the triangle of trades that no longer happen.",
  },
  compute: (values) => {
    const tax = num(values, "tax", 18);
    const dSlope = num(values, "dSlope", 8) / 10;
    const sSlope = num(values, "sSlope", 8) / 10;
    const market = createMarket({ dSlope, sSlope });
    const taxed = createMarket({ dSlope, sSlope, sIntercept: 10 + tax });

    const qt = taxed.equilibrium.x;
    const pb = taxed.equilibrium.y;
    const ps = pb - tax;
    const pStar = market.equilibrium.y;

    const scene = marketScene(market, {
      curves: [
        demandCurve(market),
        supplyCurve(market),
        ...(tax > 0
          ? [
              supplyCurve(taxed, {
                id: "supply-tax",
                label: "S + tax",
                style: "tertiary",
              }),
            ]
          : []),
      ],
    });

    if (tax > 0) {
      scene.guides = [
        { id: "pb", x: qt, y: pb, xLabel: "Qt", yLabel: "Pb" },
        { id: "ps-guide", x: qt, y: ps, yLabel: "Ps" },
      ];
      scene.points = [{ id: "taxed-eq", x: qt, y: pb, label: "" }];
      scene.regions = [
        {
          id: "consumer-burden",
          label: "Consumer burden",
          fill: "cs",
          points: [
            { x: 0, y: pStar },
            { x: 0, y: pb },
            { x: qt, y: pb },
            { x: qt, y: pStar },
          ],
        },
        {
          id: "producer-burden",
          label: "Producer burden",
          fill: "ps",
          points: [
            { x: 0, y: ps },
            { x: 0, y: pStar },
            { x: qt, y: pStar },
            { x: qt, y: ps },
          ],
        },
        {
          id: "dwl",
          label: "DWL",
          fill: "dwl",
          points: [
            { x: qt, y: pb },
            { x: market.equilibrium.x, y: pStar },
            { x: qt, y: ps },
          ],
        },
      ];
    }

    const consumerShare = pb - pStar;
    const producerShare = pStar - ps;
    const heavier =
      consumerShare > producerShare + 0.2
        ? "Consumers bear more of this tax because demand is relatively more inelastic here."
        : producerShare > consumerShare + 0.2
          ? "Producers bear more of this tax because supply is relatively more inelastic here."
          : "The burden is split roughly evenly at these elasticities.";

    return {
      scenes: [scene],
      explanation:
        tax === 0
          ? "No tax: the market trades at its untaxed equilibrium."
          : `The ${tax}-per-unit tax shifts supply up to S + tax. Buyers pay Pb = ${round1(pb)}, sellers keep Ps = ${round1(ps)}, and quantity falls to ${round1(qt)}. ${heavier}`,
      readouts: [
        { label: "Tax revenue", value: round1(tax * Math.max(qt, 0)) },
        {
          label: "Consumer burden/unit",
          value: round1(Math.max(consumerShare, 0)),
        },
        {
          label: "Producer burden/unit",
          value: round1(Math.max(producerShare, 0)),
        },
      ],
    };
  },
};

const subsidyDefinition: GraphDefinition = {
  id: "subsidy",
  course: "ap-micro",
  category: "Government Intervention",
  title: "Per-Unit Subsidy",
  description:
    "A payment per unit that lowers consumer price, raises producer receipts, and costs the government.",
  controls: [
    {
      kind: "slider",
      id: "subsidy",
      label: "Subsidy per unit",
      min: 0,
      max: 30,
      step: 1,
      defaultValue: 15,
    },
  ],
  details: {
    interpretation:
      "A subsidy pushes quantity past the free-market equilibrium; the units beyond Q* cost more to make than buyers value them, which is the DWL.",
    examTip:
      "Government expenditure is the full wedge times the new quantity — usually the largest rectangle on the graph.",
  },
  compute: (values) => {
    const subsidy = num(values, "subsidy", 15);
    const market = createMarket();
    const subsidized = createMarket({ sIntercept: 10 - subsidy });

    const qs = subsidized.equilibrium.x;
    const pc = subsidized.equilibrium.y;
    const pp = pc + subsidy;

    const scene = marketScene(market, {
      curves: [
        demandCurve(market),
        supplyCurve(market),
        ...(subsidy > 0
          ? [
              supplyCurve(subsidized, {
                id: "s-subsidy",
                label: "S − subsidy",
                style: "tertiary",
              }),
            ]
          : []),
      ],
    });

    if (subsidy > 0) {
      scene.guides = [
        { id: "pc", x: qs, y: pc, xLabel: "Qs", yLabel: "Pc" },
        { id: "pp", x: qs, y: pp, yLabel: "Pp" },
      ];
      scene.points = [{ id: "sub-eq", x: qs, y: pc, label: "" }];
      scene.regions = [
        {
          id: "gov-cost",
          label: "Government expenditure",
          fill: "revenue",
          points: [
            { x: 0, y: pc },
            { x: 0, y: pp },
            { x: qs, y: pp },
            { x: qs, y: pc },
          ],
        },
        {
          id: "dwl",
          label: "DWL",
          fill: "dwl",
          points: [
            { x: market.equilibrium.x, y: market.equilibrium.y },
            { x: qs, y: pp },
            { x: qs, y: pc },
          ],
        },
      ];
    }

    return {
      scenes: [scene],
      explanation:
        subsidy === 0
          ? "No subsidy: the market trades at its free-market equilibrium."
          : `The ${subsidy}-per-unit subsidy shifts supply down. Consumers now pay Pc = ${round1(pc)}, producers receive Pp = ${round1(pp)}, and quantity rises to ${round1(qs)}. The government pays the wedge on every unit.`,
      readouts: [
        { label: "Gov. expenditure", value: round1(subsidy * qs) },
        { label: "ΔQ", value: round1(qs - market.equilibrium.x) },
      ],
    };
  },
};

const tariffDefinition: GraphDefinition = {
  id: "import-tariff",
  course: "ap-micro",
  category: "Government Intervention",
  title: "Import Tariff",
  description:
    "A tax on imports: domestic price rises, imports shrink, and two DWL triangles appear.",
  controls: [
    {
      kind: "slider",
      id: "world",
      label: "World price",
      min: 15,
      max: 40,
      step: 1,
      defaultValue: 25,
    },
    {
      kind: "slider",
      id: "tariff",
      label: "Tariff per unit",
      min: 0,
      max: 18,
      step: 1,
      defaultValue: 8,
    },
  ],
  details: {
    interpretation:
      "Producers gain and the government collects revenue, but consumers lose more than both combined — the difference is the two DWL triangles.",
    examTip:
      "Imports are always the horizontal gap between domestic demand and domestic supply at the going price.",
  },
  compute: (values) => {
    const market = createMarket();
    const world = num(values, "world", 25);
    const tariff = Math.min(
      num(values, "tariff", 8),
      Math.max(market.equilibrium.y - world - 1, 0),
    );
    const pt = world + tariff;

    const qs0 = market.qSuppliedAt(world);
    const qd0 = market.qDemandedAt(world);
    const qs1 = market.qSuppliedAt(pt);
    const qd1 = market.qDemandedAt(pt);

    const scene = marketScene(market, {
      curves: [
        demandCurve(market, { label: "D (domestic)" }),
        supplyCurve(market, { label: "S (domestic)" }),
        {
          id: "world-price",
          label: "Pw",
          style: "muted",
          dashed: true,
          points: horizontalLine(world, market.xMax),
        },
        ...(tariff > 0
          ? [
              {
                id: "tariff-price",
                label: "Pw + t",
                style: "tertiary" as const,
                points: horizontalLine(pt, market.xMax),
              },
            ]
          : []),
      ],
    });

    scene.points = [];
    scene.guides = [
      { id: "qs1", x: qs1, y: pt, xLabel: "Qs₁" },
      {
        id: "qd1",
        x: qd1,
        y: pt,
        xLabel: "Qd₁",
        yLabel: tariff > 0 ? "Pt" : "Pw",
      },
    ];
    scene.annotations = [
      {
        id: "imports",
        x: (qs1 + qd1) / 2,
        y: Math.min(pt + 6, 96),
        text: `imports: ${round1(qd1 - qs1)}`,
      },
    ];

    if (tariff > 0) {
      scene.regions = [
        {
          id: "revenue",
          label: "Tariff revenue",
          fill: "revenue",
          points: [
            { x: qs1, y: world },
            { x: qs1, y: pt },
            { x: qd1, y: pt },
            { x: qd1, y: world },
          ],
        },
        {
          id: "dwl-production",
          label: "DWL",
          fill: "dwl",
          points: [
            { x: qs0, y: world },
            { x: qs1, y: pt },
            { x: qs1, y: world },
          ],
        },
        {
          id: "dwl-consumption",
          label: "DWL",
          fill: "dwl",
          points: [
            { x: qd1, y: world },
            { x: qd1, y: pt },
            { x: qd0, y: world },
          ],
        },
      ];
    }

    return {
      scenes: [scene],
      explanation:
        tariff === 0
          ? `At the world price of ${world}, the country imports ${round1(qd0 - qs0)} units — the gap between domestic demand and domestic supply.`
          : `The tariff raises the domestic price to ${round1(pt)}. Imports shrink from ${round1(qd0 - qs0)} to ${round1(qd1 - qs1)}. Producer surplus grows, the government collects the shaded revenue, and the two amber triangles are lost outright.`,
      readouts: [
        { label: "Imports", value: round1(Math.max(qd1 - qs1, 0)) },
        {
          label: "Tariff revenue",
          value: round1(Math.max(tariff * (qd1 - qs1), 0)),
        },
      ],
    };
  },
};

const quotaDefinition: GraphDefinition = {
  id: "import-quota",
  course: "ap-micro",
  category: "Government Intervention",
  title: "Import Quota",
  description:
    "A quantity limit on imports: like a tariff, but the revenue becomes quota rent for license holders.",
  controls: [
    {
      kind: "slider",
      id: "world",
      label: "World price",
      min: 15,
      max: 40,
      step: 1,
      defaultValue: 25,
    },
    {
      kind: "slider",
      id: "quota",
      label: "Import quota",
      min: 0,
      max: 60,
      step: 2,
      defaultValue: 20,
    },
  ],
  details: {
    interpretation:
      "A quota that equals free-trade imports changes nothing; tightening it raises the domestic price above the world price.",
    mistake:
      "With a quota the wedge income is quota rent to importers, not government revenue (unless licenses are auctioned).",
  },
  compute: (values) => {
    const market = createMarket();
    const world = num(values, "world", 25);
    const freeImports = market.qDemandedAt(world) - market.qSuppliedAt(world);
    const quota = Math.min(num(values, "quota", 20), Math.floor(freeImports));

    // Domestic price where demand minus supply equals the quota.
    const priceWithQuota =
      (market.dA / market.dB + market.sA / market.sB - quota) /
      (1 / market.dB + 1 / market.sB);
    const p1 = Math.max(priceWithQuota, world);
    const binding = p1 > world + 0.1;

    const qs1 = market.qSuppliedAt(p1);
    const qd1 = market.qDemandedAt(p1);
    const qs0 = market.qSuppliedAt(world);
    const qd0 = market.qDemandedAt(world);

    const scene = marketScene(market, {
      curves: [
        demandCurve(market, { label: "D (domestic)" }),
        supplyCurve(market, { label: "S (domestic)" }),
        {
          id: "world-price",
          label: "Pw",
          style: "muted",
          dashed: true,
          points: horizontalLine(world, market.xMax),
        },
        ...(binding
          ? [
              {
                id: "quota-price",
                label: "P (quota)",
                style: "tertiary" as const,
                points: horizontalLine(p1, market.xMax),
              },
            ]
          : []),
      ],
    });
    scene.points = [];
    scene.guides = [
      { id: "qs1", x: qs1, y: p1, xLabel: "Qs₁" },
      {
        id: "qd1",
        x: qd1,
        y: p1,
        xLabel: "Qd₁",
        yLabel: binding ? "Pq" : undefined,
      },
    ];
    scene.annotations = [
      {
        id: "quota-note",
        x: (qs1 + qd1) / 2,
        y: Math.min(p1 + 6, 96),
        text: `imports = quota: ${round1(qd1 - qs1)}`,
      },
    ];

    if (binding) {
      scene.regions = [
        {
          id: "rent",
          label: "Quota rent",
          fill: "revenue",
          points: [
            { x: qs1, y: world },
            { x: qs1, y: p1 },
            { x: qd1, y: p1 },
            { x: qd1, y: world },
          ],
        },
        {
          id: "dwl-a",
          label: "DWL",
          fill: "dwl",
          points: [
            { x: qs0, y: world },
            { x: qs1, y: p1 },
            { x: qs1, y: world },
          ],
        },
        {
          id: "dwl-b",
          label: "DWL",
          fill: "dwl",
          points: [
            { x: qd1, y: world },
            { x: qd1, y: p1 },
            { x: qd0, y: world },
          ],
        },
      ];
    }

    return {
      scenes: [scene],
      explanation: binding
        ? `Limiting imports to ${quota} units pushes the domestic price up to ${round1(p1)}. The shaded rectangle is quota rent captured by whoever holds import licenses, and the amber triangles are deadweight loss.`
        : `The quota of ${quota} is at or above free-trade imports (${round1(freeImports)}), so it does not bind — price stays at the world price.`,
      readouts: [
        { label: "Domestic price", value: round1(p1) },
        {
          label: "Quota rent",
          value: round1(Math.max((p1 - world) * quota, 0)),
        },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Market Failure                                                    */
/* ---------------------------------------------------------------- */

const surplusDefinition: GraphDefinition = {
  id: "consumer-producer-surplus",
  course: "ap-micro",
  category: "Market Failure",
  title: "Consumer and Producer Surplus",
  description:
    "Willingness to pay above price, price above willingness to sell — and what disequilibrium destroys.",
  controls: [
    {
      kind: "toggle",
      id: "atEq",
      label: "Trade at equilibrium",
      defaultValue: true,
    },
    {
      kind: "slider",
      id: "price",
      label: "Market price (if off equilibrium)",
      min: 20,
      max: 80,
      step: 1,
      defaultValue: 65,
    },
  ],
  details: {
    interpretation:
      "Total surplus is maximized at equilibrium; any other price shrinks the pie, not just re-slices it.",
  },
  compute: (values) => {
    const market = createMarket();
    const atEq = bool(values, "atEq", true);
    const price = atEq ? market.equilibrium.y : num(values, "price", 65);
    const q = Math.min(market.qDemandedAt(price), market.qSuppliedAt(price));

    const scene = marketScene(market);
    scene.regions = [csRegion(market, price, q), psRegion(market, price, q)];

    if (!atEq) {
      scene.curves.push({
        id: "price-line",
        label: "P̄",
        style: "tertiary",
        dashed: true,
        points: horizontalLine(price, market.xMax),
      });
      scene.regions.push({
        id: "dwl",
        label: "DWL",
        fill: "dwl",
        points: [
          { x: q, y: market.demandAt(q) },
          { x: market.equilibrium.x, y: market.equilibrium.y },
          { x: q, y: market.supplyAt(q) },
        ],
      });
    }

    const cs =
      0.5 * (market.dA - price) * Math.max(market.qDemandedAt(price), 0);
    const csActual = atEq
      ? cs
      : (market.demandAt(0) - market.demandAt(q)) * q * 0.5 +
        (market.demandAt(q) - price) * q;
    const psActual = atEq
      ? 0.5 * (price - market.sA) * q
      : (price - market.supplyAt(q)) * q +
        0.5 * (market.supplyAt(q) - market.sA) * q;

    return {
      scenes: [scene],
      explanation: atEq
        ? "At equilibrium every mutually beneficial trade happens: consumer surplus is the triangle under demand above price, producer surplus the triangle above supply below price."
        : `At a price of ${price}, only ${round1(q)} units trade. Surplus is redistributed between the shaded areas and the amber triangle of missed trades is destroyed outright.`,
      readouts: [
        { label: "CS (approx.)", value: round1(Math.max(csActual, 0)) },
        { label: "PS (approx.)", value: round1(Math.max(psActual, 0)) },
      ],
    };
  },
};

const negativeProductionExternality = externalityGraph({
  id: "negative-production-externality",
  title: "Negative Production Externality",
  description:
    "Pollution-style costs: marginal social cost sits above marginal private cost.",
  side: "production",
  sign: "negative",
  policyLabel: "Apply corrective (Pigouvian) tax",
  privateLabel: "S = MPC",
  socialLabel: "MSC",
});

const positiveProductionExternality = externalityGraph({
  id: "positive-production-externality",
  title: "Positive Production Externality",
  description:
    "Spillover benefits from production: marginal social cost sits below marginal private cost.",
  side: "production",
  sign: "positive",
  policyLabel: "Apply corrective subsidy",
  privateLabel: "S = MPC",
  socialLabel: "MSC",
});

const negativeConsumptionExternality = externalityGraph({
  id: "negative-consumption-externality",
  title: "Negative Consumption Externality",
  description:
    "Costs imposed by consumption: marginal social benefit sits below marginal private benefit.",
  side: "consumption",
  sign: "negative",
  policyLabel: "Apply corrective tax",
  privateLabel: "D = MPB",
  socialLabel: "MSB",
});

const positiveConsumptionExternality = externalityGraph({
  id: "positive-consumption-externality",
  title: "Positive Consumption Externality",
  description:
    "Vaccination-style benefits: marginal social benefit sits above marginal private benefit.",
  side: "consumption",
  sign: "positive",
  policyLabel: "Apply corrective subsidy",
  privateLabel: "D = MPB",
  socialLabel: "MSB",
});

const publicGoodsDefinition: GraphDefinition = {
  id: "public-goods",
  course: "ap-micro",
  category: "Market Failure",
  title: "Public Goods and the Free-Rider Problem",
  description:
    "Demands add vertically for a nonrival good — and private markets underprovide it.",
  controls: [
    {
      kind: "slider",
      id: "wtp1",
      label: "Person 1: willingness to pay",
      min: 20,
      max: 50,
      step: 2,
      defaultValue: 35,
    },
    {
      kind: "slider",
      id: "wtp2",
      label: "Person 2: willingness to pay",
      min: 20,
      max: 50,
      step: 2,
      defaultValue: 45,
    },
    {
      kind: "slider",
      id: "cost",
      label: "Marginal cost of provision",
      min: 20,
      max: 60,
      step: 2,
      defaultValue: 40,
    },
  ],
  details: {
    interpretation:
      "Because everyone consumes the same unit, society's demand is the vertical sum of individual willingness to pay.",
    mistake:
      "Private-good market demand adds horizontally; public-good demand adds vertically. Mixing these up is the classic error.",
  },
  compute: (values) => {
    const a1 = num(values, "wtp1", 35);
    const a2 = num(values, "wtp2", 45);
    const mc = num(values, "cost", 40);
    const slope = 0.55;
    const xMax = 100;
    const yMax = 100;

    const sum = (q: number) =>
      Math.max(a1 - slope * q, 0) + Math.max(a2 - slope * q, 0);
    const qOpt = (() => {
      // Solve sum(q) = mc on the kinked aggregate curve.
      const both = (a1 + a2 - mc) / (2 * slope);
      if (a1 - slope * both > 0 && a2 - slope * both > 0) return both;
      const single = (Math.max(a1, a2) - mc) / slope;
      return Math.max(single, 0);
    })();
    const qPrivate = Math.max((Math.max(a1, a2) - mc) / slope, 0);

    return {
      scenes: [
        {
          xLabel: "Quantity of the public good",
          yLabel: "Willingness to pay, cost",
          xMax,
          yMax,
          curves: [
            {
              id: "d1",
              label: "D₁",
              style: "muted",
              points: linePoints(a1, -slope, xMax, yMax),
            },
            {
              id: "d2",
              label: "D₂",
              style: "muted",
              dashed: true,
              points: linePoints(a2, -slope, xMax, yMax),
            },
            {
              id: "dsum",
              label: "ΣD (vertical sum)",
              style: "secondary",
              points: sampleCurve(sum, 0, xMax, yMax, 80),
            },
            {
              id: "mc",
              label: "MC",
              style: "primary",
              points: horizontalLine(mc, xMax),
            },
          ],
          guides: [
            { id: "qopt", x: qOpt, y: mc, xLabel: "Q(opt)" },
            ...(qPrivate > 0.5
              ? [{ id: "qpriv", x: qPrivate, y: mc, xLabel: "Q(private)" }]
              : []),
          ],
          points: [{ id: "opt", x: qOpt, y: mc, label: "" }],
        },
      ],
      explanation: `Adding both people's willingness to pay vertically, the efficient quantity is ${round1(qOpt)}. Acting alone, even the highest-value person would only buy ${round1(qPrivate)} — everyone else free-rides, so the market underprovides.`,
      readouts: [
        { label: "Q optimal", value: round1(qOpt) },
        { label: "Q private", value: round1(qPrivate) },
      ],
    };
  },
};

const commonResourcesDefinition: GraphDefinition = {
  id: "common-resources",
  course: "ap-micro",
  category: "Market Failure",
  title: "Common Resources",
  description:
    "Rival but nonexcludable: users ignore the cost they impose on others, so the resource is overused.",
  controls: [
    {
      kind: "slider",
      id: "external",
      label: "Cost imposed on other users",
      min: 5,
      max: 30,
      step: 1,
      defaultValue: 16,
    },
  ],
  details: {
    interpretation:
      "Each fisher weighs private cost only; the crowding/depletion cost to others drives a wedge between MPC and MSC.",
    examTip:
      "Treat 'tragedy of the commons' questions exactly like a negative externality: mark Q(mkt) > Q(opt).",
  },
  compute: (values) => {
    const ext = num(values, "external", 16);
    const market = createMarket();
    const social = createMarket({ sIntercept: 10 + ext });
    const scene = marketScene(market, {
      curves: [
        demandCurve(market, { label: "MB (users)" }),
        supplyCurve(market, { label: "MPC" }),
        supplyCurve(social, { id: "msc", label: "MSC", style: "tertiary" }),
      ],
    });
    const markers = equilibriumMarkers(market, { q: "Q(use)", p: "P" });
    scene.guides = [
      ...markers.guides,
      {
        id: "qopt",
        x: social.equilibrium.x,
        y: social.equilibrium.y,
        xLabel: "Q(opt)",
      },
    ];
    scene.points = markers.points;
    scene.regions = [
      {
        id: "dwl",
        label: "DWL",
        fill: "dwl",
        points: [
          { x: social.equilibrium.x, y: social.equilibrium.y },
          {
            x: market.equilibrium.x,
            y: market.supplyAt(market.equilibrium.x) + ext,
          },
          { x: market.equilibrium.x, y: market.equilibrium.y },
        ],
      },
    ];
    return {
      scenes: [scene],
      explanation: `Users equate their benefit with private cost and use ${round1(market.equilibrium.x)} units, but once the ${ext}-per-unit cost to other users is counted, only ${round1(social.equilibrium.x)} is efficient. The commons is overused by ${round1(market.equilibrium.x - social.equilibrium.x)}.`,
      readouts: [
        { label: "Q used", value: round1(market.equilibrium.x) },
        { label: "Q optimal", value: round1(social.equilibrium.x) },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Production and Costs                                              */
/* ---------------------------------------------------------------- */

const productionFunctionDefinition: GraphDefinition = {
  id: "production-function",
  course: "ap-micro",
  category: "Production and Costs",
  title: "The Production Function",
  description:
    "Total and marginal product of labor, and where diminishing returns set in.",
  controls: [
    {
      kind: "slider",
      id: "labor",
      label: "Workers hired",
      min: 1,
      max: 18,
      step: 1,
      defaultValue: 8,
    },
  ],
  details: {
    interpretation:
      "Marginal product rises at first (specialization), peaks, then falls as more workers share fixed capital.",
    mistake:
      "Diminishing marginal returns start where MP peaks — long before total product starts falling.",
  },
  compute: (values) => {
    const labor = num(values, "labor", 8);
    const tp = (l: number) => 20 * l + 6 * l * l - 0.25 * l ** 3;
    const mp = (l: number) => 20 + 12 * l - 0.75 * l * l;
    const mpPeak = 8;

    return {
      scenes: [
        {
          caption: "Total product",
          xLabel: "Labor",
          yLabel: "Output",
          xMax: 20,
          yMax: 900,
          curves: [
            {
              id: "tp",
              label: "TP",
              style: "primary",
              points: sampleCurve(tp, 0, 20, 900),
            },
          ],
          guides: [
            { id: "l", x: labor, y: tp(labor), xLabel: "L", yLabel: "TP" },
          ],
          points: [{ id: "tp-point", x: labor, y: tp(labor), label: "" }],
        },
        {
          caption: "Marginal product",
          xLabel: "Labor",
          yLabel: "Output per worker",
          xMax: 20,
          yMax: 90,
          curves: [
            {
              id: "mp",
              label: "MP",
              style: "secondary",
              points: sampleCurve(mp, 0, 20, 90),
            },
          ],
          guides: [
            {
              id: "l2",
              x: labor,
              y: Math.max(mp(labor), 0),
              xLabel: "L",
              yLabel: "MP",
            },
          ],
          points: [
            { id: "mp-point", x: labor, y: Math.max(mp(labor), 0), label: "" },
          ],
          annotations: [
            { id: "dim", x: mpPeak, y: 86, text: "diminishing returns begin" },
          ],
        },
      ],
      explanation:
        labor < mpPeak
          ? `With ${labor} workers, each additional worker still adds more than the last (MP is rising) — specialization gains dominate.`
          : labor === mpPeak
            ? `At ${labor} workers marginal product peaks: the next worker will add less than this one. Diminishing marginal returns begin here.`
            : mp(labor) > 0
              ? `Beyond ${mpPeak} workers each extra worker adds less output than the previous one (diminishing marginal returns), though total product still rises.`
              : `With ${labor} workers, marginal product has fallen to zero or below — total product is no longer growing.`,
      readouts: [
        { label: "Total product", value: round1(tp(labor)) },
        { label: "Marginal product", value: round1(mp(labor)) },
      ],
    };
  },
};

const totalCostsDefinition: GraphDefinition = {
  id: "total-cost-curves",
  course: "ap-micro",
  category: "Production and Costs",
  title: "Total Cost Curves",
  description: "Fixed, variable, and total cost as output grows.",
  controls: [
    {
      kind: "slider",
      id: "fc",
      label: "Total fixed cost",
      min: 10,
      max: 80,
      step: 5,
      defaultValue: 40,
    },
    {
      kind: "slider",
      id: "q",
      label: "Output",
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 6,
    },
  ],
  details: {
    interpretation:
      "TC and TVC are vertical shifts of each other — the gap between them is always exactly TFC.",
  },
  compute: (values) => {
    const fc = num(values, "fc", 40);
    const q = num(values, "q", 6);
    const tvc = (x: number) => 10 * x - 1.2 * x * x + 0.14 * x ** 3;
    const tc = (x: number) => fc + tvc(x);
    const yMax = 200;

    return {
      scenes: [
        {
          xLabel: "Quantity",
          yLabel: "Cost",
          xMax: 10,
          yMax,
          curves: [
            {
              id: "tc",
              label: "TC",
              style: "primary",
              points: sampleCurve(tc, 0, 10, yMax),
            },
            {
              id: "tvc",
              label: "TVC",
              style: "secondary",
              points: sampleCurve(tvc, 0, 10, yMax),
            },
            {
              id: "tfc",
              label: "TFC",
              style: "muted",
              dashed: true,
              points: horizontalLine(fc, 10),
            },
          ],
          guides: [{ id: "q", x: q, y: tc(q), xLabel: "Q", yLabel: "TC" }],
          points: [
            { id: "tc-pt", x: q, y: tc(q), label: "" },
            { id: "tvc-pt", x: q, y: tvc(q), label: "", muted: true },
          ],
        },
      ],
      explanation: `At Q = ${q}: TFC = ${fc} regardless of output, TVC = ${round1(tvc(q))}, so TC = ${round1(tc(q))}. The vertical gap between TC and TVC equals TFC everywhere.`,
      readouts: [
        { label: "TFC", value: round1(fc) },
        { label: "TVC", value: round1(tvc(q)) },
        { label: "TC", value: round1(tc(q)) },
      ],
    };
  },
};

const perUnitCostsDefinition: GraphDefinition = {
  id: "per-unit-cost-curves",
  course: "ap-micro",
  category: "Production and Costs",
  title: "Per-Unit Cost Curves",
  description:
    "MC, ATC, AVC, and AFC — and why MC cuts both averages at their minimums.",
  controls: [
    {
      kind: "slider",
      id: "fc",
      label: "Total fixed cost",
      min: 20,
      max: 80,
      step: 5,
      defaultValue: 40,
    },
    { kind: "toggle", id: "showAfc", label: "Show AFC", defaultValue: true },
  ],
  details: {
    interpretation:
      "When the marginal unit costs less than the average, it drags the average down; when it costs more, it pulls it up — so MC must cross ATC and AVC exactly at their minimums.",
    examTip:
      "The gap between ATC and AVC is AFC, which shrinks as output rises but never reaches zero.",
  },
  compute: (values) => {
    const fc = num(values, "fc", 40);
    const costs = firmCosts(fc);
    const xMax = 12;
    const yMax = 42;
    // Min ATC numerically.
    let minAtcQ = 1;
    for (let q = 1; q <= xMax; q += 0.05) {
      if (costs.atc(q) < costs.atc(minAtcQ)) minAtcQ = q;
    }

    const curves: SceneCurve[] = [
      {
        id: "mc",
        label: "MC",
        style: "primary",
        points: sampleCurve(costs.mc, 0.3, xMax, yMax),
      },
      {
        id: "atc",
        label: "ATC",
        style: "secondary",
        points: sampleCurve(costs.atc, 1.3, xMax, yMax),
      },
      {
        id: "avc",
        label: "AVC",
        style: "tertiary",
        points: sampleCurve(costs.avc, 0.3, xMax, yMax),
      },
    ];
    if (bool(values, "showAfc", true)) {
      curves.push({
        id: "afc",
        label: "AFC",
        style: "muted",
        dashed: true,
        points: sampleCurve((q) => fc / q, 1.1, xMax, yMax),
      });
    }

    return {
      scenes: [
        {
          xLabel: "Quantity",
          yLabel: "Cost per unit",
          xMax,
          yMax,
          curves,
          points: [
            {
              id: "min-avc",
              x: costs.minAvcQ,
              y: costs.minAvc,
              label: "min AVC",
            },
            {
              id: "min-atc",
              x: minAtcQ,
              y: costs.atc(minAtcQ),
              label: "min ATC",
            },
          ],
        },
      ],
      explanation: `MC crosses AVC at its minimum (Q ≈ ${round1(costs.minAvcQ)}) and ATC at its minimum (Q ≈ ${round1(minAtcQ)}). Raising fixed cost lifts ATC and AFC but leaves MC and AVC untouched.`,
      readouts: [
        { label: "min AVC", value: round1(costs.minAvc) },
        { label: "min ATC", value: round1(costs.atc(minAtcQ)) },
      ],
    };
  },
};

const lratcDefinition: GraphDefinition = {
  id: "long-run-average-total-cost",
  course: "ap-micro",
  category: "Production and Costs",
  title: "Short-Run and Long-Run Costs",
  description:
    "SRATC curves for different plant sizes and the LRATC envelope beneath them.",
  controls: [
    {
      kind: "segmented",
      id: "highlight",
      label: "Highlight region",
      options: [
        { value: "none", label: "None" },
        { value: "economies", label: "Economies of scale" },
        { value: "constant", label: "Constant returns" },
        { value: "diseconomies", label: "Diseconomies" },
      ],
      defaultValue: "none",
    },
    {
      kind: "toggle",
      id: "showSratc",
      label: "Show plant-size SRATCs",
      defaultValue: true,
    },
  ],
  details: {
    interpretation:
      "In the long run every input is variable, so the firm picks the plant size that minimizes cost for its output.",
    examTip:
      "Minimum efficient scale is the smallest output where LRATC reaches its minimum — the start of the flat section.",
  },
  compute: (values) => {
    const xMax = 200;
    const yMax = 60;
    const lratc = (q: number) =>
      q < 80
        ? 12 + 0.0045 * (q - 80) ** 2
        : q <= 120
          ? 12
          : 12 + 0.0045 * (q - 120) ** 2;
    const sratc = (center: number) => (q: number) =>
      lratc(center) + 1.5 + 0.012 * (q - center) ** 2;

    const curves: SceneCurve[] = [
      {
        id: "lratc",
        label: "LRATC",
        style: "primary",
        points: sampleCurve(lratc, 0, xMax, yMax, 120),
      },
    ];
    if (bool(values, "showSratc", true)) {
      for (const [index, center] of [45, 100, 160].entries()) {
        curves.push({
          id: `sratc-${center}`,
          label: `SRATC${index + 1}`,
          style: "muted",
          dashed: true,
          points: sampleCurve(sratc(center), center - 34, center + 34, yMax),
        });
      }
    }

    const highlight = str(values, "highlight", "none");
    const regionRange: Record<string, [number, number] | null> = {
      none: null,
      economies: [0, 80],
      constant: [80, 120],
      diseconomies: [120, 200],
    };
    const range = regionRange[highlight];
    const regions: SceneRegion[] = range
      ? [
          {
            id: "scale-region",
            label:
              highlight === "economies"
                ? "Economies of scale"
                : highlight === "constant"
                  ? "Constant returns"
                  : "Diseconomies of scale",
            fill: "benefit",
            points: [
              { x: range[0], y: 0 },
              { x: range[0], y: yMax * 0.92 },
              { x: range[1], y: yMax * 0.92 },
              { x: range[1], y: 0 },
            ],
          },
        ]
      : [];

    return {
      scenes: [
        {
          xLabel: "Quantity",
          yLabel: "Cost per unit",
          xMax,
          yMax,
          curves,
          regions,
          guides: [{ id: "mes", x: 80, y: 12, xLabel: "MES" }],
          annotations: [
            {
              id: "eos",
              x: 38,
              y: 47,
              text: "falling LRATC: economies of scale",
            },
            { id: "dos", x: 168, y: 47, text: "rising LRATC: diseconomies" },
          ],
        },
      ],
      explanation:
        "LRATC is the envelope of every plant size's SRATC. It falls while bigger plants lower unit costs (economies of scale), flattens over the constant-returns range starting at minimum efficient scale (MES), and rises when coordination costs dominate (diseconomies).",
      readouts: [{ label: "MES", value: "Q = 80" }],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Market Structures                                                 */
/* ---------------------------------------------------------------- */

const pcFirmDefinition: GraphDefinition = {
  id: "perfect-competition-firm",
  course: "ap-micro",
  category: "Market Structures",
  title: "Perfect Competition: The Firm",
  description:
    "A price-taking firm chooses q where MC = MR, earning profit, breaking even, taking a loss, or shutting down.",
  controls: [
    {
      kind: "slider",
      id: "price",
      label: "Market price",
      min: 5,
      max: 32,
      step: 0.5,
      defaultValue: 20,
    },
    {
      kind: "slider",
      id: "fc",
      label: "Fixed cost",
      min: 20,
      max: 80,
      step: 5,
      defaultValue: 40,
    },
    {
      kind: "slider",
      id: "productivity",
      label: "Productivity",
      min: 8,
      max: 13,
      step: 1,
      defaultValue: 10,
      unit: " ÷10",
    },
  ],
  presets: [
    {
      id: "profit",
      label: "Economic profit",
      values: { price: 24, fc: 40, productivity: 10 },
    },
    {
      id: "loss",
      label: "Loss (keep operating)",
      values: { price: 11, fc: 40, productivity: 10 },
    },
    {
      id: "shutdown",
      label: "Shutdown",
      values: { price: 6, fc: 40, productivity: 10 },
    },
  ],
  details: {
    interpretation:
      "For a price taker, P = MR = AR, so the profit rule MR = MC becomes P = MC.",
    mistake:
      "A firm with a loss should still operate if P covers AVC — shutting down means losing all of fixed cost.",
    examTip:
      "Shutdown point: minimum of AVC. Break-even point: minimum of ATC.",
  },
  compute: (values) => {
    const { scene, q, profit, status } = firmScene(
      num(values, "price", 20),
      num(values, "fc", 40),
      num(values, "productivity", 10) / 10,
    );
    return {
      scenes: [scene],
      explanation:
        status === "shut down"
          ? "Price is below minimum AVC: every unit sold fails to cover even its variable cost, so the firm produces nothing and loses only its fixed cost."
          : `The firm produces q* = ${round1(q)} where P = MC and earns ${status === "normal profit" ? "roughly zero economic profit (normal profit)" : `${status} of about ${round1(Math.abs(profit))} (the shaded rectangle)`}.`,
      readouts: [
        { label: "q*", value: round1(q) },
        { label: "Profit", value: round1(profit) },
        { label: "Status", value: status },
      ],
    };
  },
};

/** Market + firm side-by-side, linked through the market price. */
function marketFirmScenes(dShift: number, sShift: number, fc: number) {
  const market = createMarket({
    dShift,
    sShift,
    dIntercept: 44,
    sIntercept: 4,
    dSlope: 0.4,
    sSlope: 0.4,
    yMax: 40,
    xLabel: "Quantity (market)",
    yLabel: "Price",
  });
  const price = market.equilibrium.y;
  const marketPanel = marketScene(market, { caption: "Market" });
  marketPanel.curves.push(
    ...ghostCurves(market, { demand: true, supply: true }),
  );
  const firm = firmScene(price, fc, 1, "Representative firm");
  return { market, price, marketPanel, firm };
}

const pcMarketFirmDefinition: GraphDefinition = {
  id: "perfect-competition-market-and-firm",
  course: "ap-micro",
  category: "Market Structures",
  title: "Perfect Competition: Market and Firm",
  description:
    "Two linked panels: the market sets the price, the firm takes it.",
  controls: [
    shiftSlider("dShift", "Shift market demand", 12),
    {
      kind: "slider",
      id: "fc",
      label: "Firm fixed cost",
      min: 20,
      max: 80,
      step: 5,
      defaultValue: 40,
    },
  ],
  details: {
    examTip:
      "Side-by-side graphs share the same vertical axis meaning: draw the market price straight across into the firm panel as its MR line.",
  },
  compute: (values) => {
    const { price, marketPanel, firm } = marketFirmScenes(
      num(values, "dShift"),
      0,
      num(values, "fc", 40),
    );
    return {
      scenes: [marketPanel, firm.scene],
      explanation: `The market clears at P = ${round1(price)}, which the firm takes as its horizontal MR line. The firm responds by producing q* = ${round1(firm.q)} (${firm.status}).`,
      readouts: [
        { label: "Market price", value: round1(price) },
        { label: "Firm q*", value: round1(firm.q) },
        { label: "Firm profit", value: round1(firm.profit) },
      ],
    };
  },
};

const pcLongRunDefinition: GraphDefinition = {
  id: "perfect-competition-long-run",
  course: "ap-micro",
  category: "Market Structures",
  title: "Long-Run Perfect Competition",
  description:
    "Profits attract entry, losses force exit — until price returns to minimum ATC.",
  controls: [
    {
      kind: "segmented",
      id: "start",
      label: "Starting point",
      options: [
        { value: "profit", label: "Short-run profit" },
        { value: "loss", label: "Short-run loss" },
      ],
      defaultValue: "profit",
    },
    {
      kind: "slider",
      id: "progress",
      label: "Entry / exit progress",
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 0,
      unit: "%",
    },
  ],
  details: {
    interpretation:
      "Entry shifts market supply right (lowering price); exit shifts it left (raising price). Adjustment stops at zero economic profit.",
  },
  compute: (values) => {
    const startProfit = str(values, "start", "profit") === "profit";
    const progress = num(values, "progress") / 100;
    // Demand level that produces profit or loss; entry/exit moves supply.
    const dShift = startProfit ? 10 : -10;
    const fullAdjustment = startProfit ? 10 : -10;
    const sShift = fullAdjustment * progress;
    const { price, marketPanel, firm } = marketFirmScenes(dShift, sShift, 40);

    const phase =
      progress === 0
        ? startProfit
          ? "Existing firms earn economic profit, which attracts entrants."
          : "Existing firms take losses, which pushes some to exit."
        : progress < 1
          ? startProfit
            ? "Entry is underway: market supply shifts right and price falls toward minimum ATC."
            : "Exit is underway: market supply shifts left and price rises toward minimum ATC."
          : "Adjustment is complete: price equals minimum ATC and economic profit is zero — no one else wants to enter or exit.";

    return {
      scenes: [marketPanel, firm.scene],
      explanation: phase,
      readouts: [
        { label: "Price", value: round1(price) },
        { label: "Firm profit", value: round1(firm.profit) },
      ],
    };
  },
};

const monopolyDefinition: GraphDefinition = {
  id: "monopoly",
  course: "ap-micro",
  category: "Market Structures",
  title: "Monopoly",
  description:
    "One seller sets output where MR = MC, prices off the demand curve, and creates deadweight loss.",
  controls: [
    {
      kind: "slider",
      id: "demand",
      label: "Demand level",
      min: 60,
      max: 95,
      step: 5,
      defaultValue: 80,
    },
    {
      kind: "slider",
      id: "mc",
      label: "Marginal cost level",
      min: 5,
      max: 25,
      step: 1,
      defaultValue: 10,
    },
    {
      kind: "slider",
      id: "fc",
      label: "Fixed cost",
      min: 0,
      max: 700,
      step: 50,
      defaultValue: 250,
    },
    { kind: "toggle", id: "atc", label: "Show ATC", defaultValue: true },
  ],
  details: {
    interpretation:
      "Compared with perfect competition, the monopolist restricts output (Qm < Qc) and charges more (Pm > Pc).",
    mistake:
      "Price comes from the demand curve at Qm — never from the MR = MC intersection itself.",
    examTip:
      "DWL is the triangle between demand and MC from Qm out to the allocatively efficient quantity.",
  },
  compute: (values) => {
    const result = monopolyScene({
      dIntercept: num(values, "demand", 80),
      dSlope: 0.8,
      mcIntercept: num(values, "mc", 10),
      mcSlope: 0.5,
      fixedCost: num(values, "fc", 250),
      showAtc: bool(values, "atc", true),
      showProfit: true,
      showCs: true,
      showDwl: true,
    });
    const profit = (result.pm - result.atcAt(result.qm)) * result.qm;
    return {
      scenes: [result.scene],
      explanation: `The monopolist produces Qm = ${round1(result.qm)} (where MR = MC) and charges Pm = ${round1(result.pm)} off the demand curve. Allocative efficiency would require Q = ${round1(result.qc)}; the units between them are the deadweight loss.`,
      readouts: [
        { label: "Qm", value: round1(result.qm) },
        { label: "Pm", value: round1(result.pm) },
        { label: "Profit", value: round1(profit) },
      ],
    };
  },
};

const naturalMonopolyDefinition: GraphDefinition = {
  id: "natural-monopoly",
  course: "ap-micro",
  category: "Market Structures",
  title: "Natural Monopoly and Regulation",
  description:
    "Huge fixed costs make ATC fall over the whole market — compare unregulated, fair-return, and socially optimal pricing.",
  controls: [
    {
      kind: "segmented",
      id: "pricing",
      label: "Pricing rule",
      options: [
        { value: "unregulated", label: "Unregulated" },
        { value: "fair", label: "Fair return (P = ATC)" },
        { value: "optimal", label: "Socially optimal (P = MC)" },
      ],
      defaultValue: "unregulated",
    },
    {
      kind: "slider",
      id: "fc",
      label: "Fixed cost",
      min: 800,
      max: 2000,
      step: 100,
      defaultValue: 1400,
    },
  ],
  details: {
    interpretation:
      "Marginal-cost pricing is efficient but sits below ATC, so the regulated firm needs a subsidy; average-cost pricing lets it break even instead.",
  },
  compute: (values) => {
    const fc = num(values, "fc", 1400);
    const a = 80;
    const b = 0.8;
    const mc = 8;
    const atc = (q: number) => fc / q + mc;

    const qUnreg = (a - mc) / (2 * b);
    const pUnreg = a - b * qUnreg;
    // Fair return: a - bQ = fc/Q + mc → bQ² - (a - mc)Q + fc = 0 (larger root).
    const disc = (a - mc) ** 2 - 4 * b * fc;
    const qFair = disc > 0 ? (a - mc + Math.sqrt(disc)) / (2 * b) : qUnreg;
    const pFair = a - b * qFair;
    const qOpt = (a - mc) / b;
    const pOpt = mc;

    const pricing = str(values, "pricing", "unregulated");
    const chosen =
      pricing === "fair"
        ? {
            q: qFair,
            p: pFair,
            note: "The firm breaks even (P = ATC): more output than an unregulated monopoly, no subsidy needed, but still short of allocative efficiency.",
          }
        : pricing === "optimal"
          ? {
              q: qOpt,
              p: pOpt,
              note: `P = MC is allocatively efficient, but price sits below ATC, so the firm loses ${round1((atc(qOpt) - mc) * qOpt)} — a regulator must subsidize the loss (shaded).`,
            }
          : {
              q: qUnreg,
              p: pUnreg,
              note: "Left alone, the natural monopolist behaves like any monopolist: MR = MC output and a high price off the demand curve.",
            };

    const scene: Scene = {
      xLabel: "Quantity",
      yLabel: "Price, cost",
      xMax: 100,
      yMax: 100,
      curves: [
        {
          id: "d",
          label: "D",
          style: "secondary",
          points: linePoints(a, -b, 100, 100),
        },
        {
          id: "mr",
          label: "MR",
          style: "muted",
          points: linePoints(a, -2 * b, 100, 100),
        },
        {
          id: "mc",
          label: "MC",
          style: "primary",
          points: horizontalLine(mc, 100),
        },
        {
          id: "atc",
          label: "ATC",
          style: "tertiary",
          points: sampleCurve(atc, 12, 100, 100),
        },
      ],
      regions:
        pricing === "optimal"
          ? [
              {
                id: "loss",
                label: "Loss (needs subsidy)",
                fill: "cost",
                points: [
                  { x: 0, y: pOpt },
                  { x: 0, y: atc(qOpt) },
                  { x: qOpt, y: atc(qOpt) },
                  { x: qOpt, y: pOpt },
                ],
              },
            ]
          : [],
      guides: [
        { id: "chosen", x: chosen.q, y: chosen.p, xLabel: "Q", yLabel: "P" },
      ],
      points: [{ id: "chosen-pt", x: chosen.q, y: chosen.p, label: "" }],
    };

    return {
      scenes: [scene],
      explanation: chosen.note,
      readouts: [
        { label: "Q", value: round1(chosen.q) },
        { label: "P", value: round1(chosen.p) },
      ],
    };
  },
};

const priceDiscriminationDefinition: GraphDefinition = {
  id: "price-discrimination",
  course: "ap-micro",
  category: "Market Structures",
  title: "Price Discrimination",
  description:
    "From one price for everyone to a different price for every buyer.",
  controls: [
    {
      kind: "segmented",
      id: "mode",
      label: "Pricing",
      options: [
        { value: "single", label: "Single price" },
        { value: "perfect", label: "Perfect discrimination" },
      ],
      defaultValue: "single",
    },
  ],
  details: {
    interpretation:
      "A perfectly discriminating monopolist charges each buyer their willingness to pay, so MR equals demand and output expands to the efficient quantity — but consumers keep no surplus.",
    examTip:
      "Perfect price discrimination eliminates deadweight loss and consumer surplus at the same time.",
  },
  compute: (values) => {
    const perfect = str(values, "mode", "single") === "perfect";
    const result = monopolyScene({
      dIntercept: 80,
      dSlope: 0.8,
      mcIntercept: 10,
      mcSlope: 0.5,
      fixedCost: 250,
      showAtc: false,
      showProfit: false,
      showCs: true,
      showDwl: true,
      perfectPD: perfect,
    });
    if (perfect) {
      result.scene.curves = result.scene.curves.filter((c) => c.id !== "mr");
    }
    return {
      scenes: [result.scene],
      explanation: perfect
        ? `Charging every buyer their exact willingness to pay, the firm sells all the way out to Q = ${round1(result.qc)} (where D meets MC). Output is efficient and DWL vanishes — but the entire surplus becomes producer profit.`
        : `With one price, the firm restricts output to Qm = ${round1(result.qm)} and charges Pm = ${round1(result.pm)}. Consumers keep the CS triangle and the amber DWL triangle goes unrealized.`,
      readouts: [
        { label: "Output", value: round1(perfect ? result.qc : result.qm) },
        { label: "Consumer surplus", value: perfect ? "0" : "positive" },
        { label: "DWL", value: perfect ? "0" : "positive" },
      ],
    };
  },
};

const monopolisticCompetitionDefinition: GraphDefinition = {
  id: "monopolistic-competition",
  course: "ap-micro",
  category: "Market Structures",
  title: "Monopolistic Competition",
  description:
    "Differentiated products give a little market power; entry erodes profit to the tangency long run.",
  controls: [
    {
      kind: "slider",
      id: "demand",
      label: "Demand for this brand",
      min: 55,
      max: 90,
      step: 1,
      defaultValue: 80,
    },
    {
      kind: "slider",
      id: "fc",
      label: "Fixed cost",
      min: 300,
      max: 1100,
      step: 25,
      defaultValue: 500,
    },
  ],
  presets: [
    {
      id: "sr-profit",
      label: "Short-run profit",
      values: { demand: 80, fc: 500 },
    },
    { id: "sr-loss", label: "Short-run loss", values: { demand: 62, fc: 800 } },
    {
      id: "long-run",
      label: "Long-run equilibrium",
      values: { demand: 70, fc: 855 },
    },
  ],
  details: {
    interpretation:
      "In the long run entry shifts each firm's demand left until ATC is tangent to demand: zero economic profit with excess capacity.",
    mistake:
      "Long-run monopolistic competitors are NOT productively efficient — they produce left of minimum ATC (excess capacity).",
  },
  compute: (values) => {
    const result = monopolyScene({
      dIntercept: num(values, "demand", 80),
      dSlope: 0.8,
      mcIntercept: 10,
      mcSlope: 0.5,
      fixedCost: num(values, "fc", 500),
      showAtc: true,
      showProfit: true,
      showCs: false,
      showDwl: false,
    });
    const profit = (result.pm - result.atcAt(result.qm)) * result.qm;
    const state =
      Math.abs(profit) < 25
        ? "This is (approximately) the long-run tangency: price equals average cost, profit is zero, and the firm produces left of minimum ATC — excess capacity."
        : profit > 0
          ? "Short-run profit: the shaded rectangle will attract new entrants, shifting this firm's demand left over time."
          : "Short-run loss: some firms will exit, shifting the survivors' demand right over time.";
    return {
      scenes: [result.scene],
      explanation: `The firm produces where MR = MC (Q = ${round1(result.qm)}) and charges ${round1(result.pm)}. ${state}`,
      readouts: [
        { label: "Q", value: round1(result.qm) },
        { label: "P", value: round1(result.pm) },
        { label: "Profit", value: round1(profit) },
      ],
    };
  },
};

const oligopolyDefinition: GraphDefinition = {
  id: "oligopoly-game-theory",
  course: "ap-micro",
  category: "Market Structures",
  title: "Oligopoly and Game Theory",
  description:
    "A 2×2 payoff matrix: dominant strategies, Nash equilibrium, and why collusion breaks down.",
  hideStandardToggles: true,
  controls: [
    {
      kind: "segmented",
      id: "scenario",
      label: "Game",
      options: [
        { value: "prisoners", label: "Prisoner's dilemma" },
        { value: "no-dominant", label: "No dominant strategy" },
      ],
      defaultValue: "prisoners",
    },
    {
      kind: "segmented",
      id: "aStrategy",
      label: "Firm A chooses",
      options: [
        { value: "high", label: "High price" },
        { value: "low", label: "Low price" },
      ],
      defaultValue: "high",
    },
    {
      kind: "segmented",
      id: "bStrategy",
      label: "Firm B chooses",
      options: [
        { value: "high", label: "High price" },
        { value: "low", label: "Low price" },
      ],
      defaultValue: "high",
    },
  ],
  details: {
    interpretation:
      "A Nash equilibrium is a cell where neither firm can do better by changing only its own strategy.",
    examTip:
      "Check each player's best response to each rival strategy — a dominant strategy is a best response to everything.",
  },
  custom: "payoff-matrix",
};

/* ---------------------------------------------------------------- */
/* Factor Markets                                                    */
/* ---------------------------------------------------------------- */

const laborMarketDefinition: GraphDefinition = {
  id: "labor-market",
  course: "ap-micro",
  category: "Factor Markets",
  title: "The Labor Market",
  description:
    "Labor demand and supply set the wage — and a binding minimum wage creates unemployment.",
  controls: [
    shiftSlider("dShift", "Shift labor demand", 18),
    shiftSlider("sShift", "Shift labor supply", 18),
    {
      kind: "toggle",
      id: "minWage",
      label: "Impose a minimum wage",
      defaultValue: false,
    },
    {
      kind: "slider",
      id: "wage",
      label: "Minimum wage",
      min: 30,
      max: 85,
      step: 1,
      defaultValue: 62,
    },
  ],
  details: {
    interpretation:
      "Labor demand is derived demand — it comes from the value of what workers produce.",
    examTip:
      "A binding minimum wage sits above equilibrium; unemployment is Qs − Qd of labor at that wage.",
  },
  compute: (values) => {
    const market = createMarket({
      dShift: num(values, "dShift"),
      sShift: num(values, "sShift"),
      xLabel: "Quantity of labor",
      yLabel: "Wage",
      demandLabel: "D (labor)",
      supplyLabel: "S (labor)",
    });
    const scene = marketScene(market, {
      curves: [
        demandCurve(market),
        supplyCurve(market),
        ...ghostCurves(market, { demand: true, supply: true }),
      ],
    });
    const markers = equilibriumMarkers(market, { q: "L*", p: "W*" });
    scene.guides = markers.guides;
    scene.points = markers.points;

    let extra = "";
    if (bool(values, "minWage")) {
      const wage = num(values, "wage", 62);
      scene.curves.push({
        id: "min-wage",
        label: "Wmin",
        style: "tertiary",
        dashed: true,
        points: horizontalLine(wage, market.xMax),
      });
      if (wage > market.equilibrium.y) {
        const ld = market.qDemandedAt(wage);
        const ls = market.qSuppliedAt(wage);
        scene.annotations = [
          {
            id: "unemployment",
            x: (ld + ls) / 2,
            y: Math.min(wage + 6, 96),
            text: `unemployment: ${round1(ls - ld)}`,
          },
        ];
        extra = ` The minimum wage of ${wage} binds: employment falls to ${round1(ld)} while ${round1(ls)} people want to work — unemployment of ${round1(ls - ld)}.`;
      } else {
        extra =
          " The minimum wage sits below the equilibrium wage, so it changes nothing.";
      }
    }

    return {
      scenes: [scene],
      explanation:
        `The labor market clears at W* = ${round1(market.equilibrium.y)} and L* = ${round1(market.equilibrium.x)}.` +
        extra,
      readouts: [
        { label: "W*", value: round1(market.equilibrium.y) },
        { label: "L*", value: round1(market.equilibrium.x) },
      ],
    };
  },
};

const mrpDefinition: GraphDefinition = {
  id: "marginal-revenue-product",
  course: "ap-micro",
  category: "Factor Markets",
  title: "Marginal Revenue Product",
  description:
    "Hire workers until the last one's revenue contribution just covers the wage.",
  controls: [
    {
      kind: "slider",
      id: "productPrice",
      label: "Output price",
      min: 1,
      max: 4,
      step: 0.5,
      defaultValue: 2,
    },
    {
      kind: "slider",
      id: "wage",
      label: "Market wage",
      min: 10,
      max: 60,
      step: 2,
      defaultValue: 30,
    },
  ],
  details: {
    interpretation:
      "MRP = MP × price of output. It slopes down because of diminishing marginal product.",
    mistake:
      "A higher output price shifts the whole MRP curve — it is not a movement along it.",
  },
  compute: (values) => {
    const price = num(values, "productPrice", 2);
    const wage = num(values, "wage", 30);
    const mrp = (l: number) => price * (40 - 2.4 * l);
    const lStar = Math.max((40 - wage / price) / 2.4, 0);

    return {
      scenes: [
        {
          xLabel: "Quantity of labor",
          yLabel: "Dollars",
          xMax: 20,
          yMax: 170,
          curves: [
            {
              id: "mrp",
              label: "MRP = MP × P",
              style: "secondary",
              points: sampleCurve(mrp, 0, 17, 170),
            },
            {
              id: "wage",
              label: "Wage = MFC",
              style: "primary",
              points: horizontalLine(wage, 20),
            },
          ],
          guides: [
            { id: "lstar", x: lStar, y: wage, xLabel: "L*", yLabel: "W" },
          ],
          points: [{ id: "hire", x: lStar, y: wage, label: "" }],
        },
      ],
      explanation: `Each worker up to L* = ${round1(lStar)} adds more revenue than the ${wage} wage they cost; beyond that, workers cost more than they bring in. Raising the output price rotates MRP outward and raises hiring.`,
      readouts: [
        { label: "L*", value: round1(lStar) },
        { label: "MRP at L*", value: round1(wage) },
      ],
    };
  },
};

const monopsonyDefinition: GraphDefinition = {
  id: "monopsony",
  course: "ap-micro",
  category: "Factor Markets",
  title: "Monopsony",
  description:
    "One dominant employer faces the whole labor supply curve — so hiring more raises every worker's wage.",
  controls: [
    {
      kind: "slider",
      id: "mrpLevel",
      label: "Labor demand (MRP) level",
      min: 55,
      max: 85,
      step: 1,
      defaultValue: 70,
    },
    {
      kind: "toggle",
      id: "compare",
      label: "Show competitive comparison",
      defaultValue: true,
    },
  ],
  details: {
    interpretation:
      "MFC lies above supply because hiring the marginal worker raises the wage for everyone already employed.",
    examTip:
      "Monopsony wage comes from the supply curve at the chosen employment level — not from MFC or MRP.",
  },
  compute: (values) => {
    const a = num(values, "mrpLevel", 70);
    const supply = (l: number) => 10 + 0.8 * l;
    const mfcLine = (l: number) => 10 + 1.6 * l;
    const mrp = (l: number) => a - 0.8 * l;

    const lM = (a - 10) / 2.4;
    const wM = supply(lM);
    const lC = (a - 10) / 1.6;
    const wC = supply(lC);
    const compare = bool(values, "compare", true);

    return {
      scenes: [
        {
          xLabel: "Quantity of labor",
          yLabel: "Wage",
          xMax: 100,
          yMax: 100,
          curves: [
            {
              id: "s",
              label: "S (labor)",
              style: "primary",
              points: sampleCurve(supply, 0, 100, 100, 2),
            },
            {
              id: "mfc",
              label: "MFC",
              style: "tertiary",
              points: sampleCurve(mfcLine, 0, 56, 100, 2),
            },
            {
              id: "mrp",
              label: "MRP",
              style: "secondary",
              points: sampleCurve(mrp, 0, 100, 100, 2),
            },
          ],
          guides: [
            { id: "monopsony", x: lM, y: wM, xLabel: "Lm", yLabel: "Wm" },
            ...(compare
              ? [
                  {
                    id: "competitive",
                    x: lC,
                    y: wC,
                    xLabel: "Lc",
                    yLabel: "Wc",
                  },
                ]
              : []),
          ],
          points: [
            { id: "hire-rule", x: lM, y: mfcLine(lM), label: "MRP = MFC" },
            { id: "wage-point", x: lM, y: wM, label: "" },
            ...(compare
              ? [{ id: "comp-point", x: lC, y: wC, label: "", muted: true }]
              : []),
          ],
        },
      ],
      explanation: `The monopsonist hires where MRP = MFC (Lm = ${round1(lM)}) but pays only the supply-curve wage Wm = ${round1(wM)}.${compare ? ` A competitive market would hire ${round1(lC)} at wage ${round1(wC)} — monopsony employs fewer workers at a lower wage.` : ""}`,
      readouts: [
        { label: "Lm", value: round1(lM) },
        { label: "Wm", value: round1(wM) },
        ...(compare ? [{ label: "Competitive W", value: round1(wC) }] : []),
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* International Trade                                               */
/* ---------------------------------------------------------------- */

function worldPriceDefinition(kind: "imports" | "exports"): GraphDefinition {
  const importing = kind === "imports";
  return {
    id: `world-price-${kind}`,
    course: "ap-micro",
    category: "International Trade",
    title: importing
      ? "World Price Below Equilibrium (Imports)"
      : "World Price Above Equilibrium (Exports)",
    description: importing
      ? "Opening to trade at a low world price: consumers gain more than producers lose."
      : "Opening to trade at a high world price: producers gain more than consumers lose.",
    controls: [
      {
        kind: "slider",
        id: "world",
        label: "World price",
        min: importing ? 15 : 50,
        max: importing ? 42 : 80,
        step: 1,
        defaultValue: importing ? 28 : 62,
      },
      {
        kind: "toggle",
        id: "welfare",
        label: "Shade surplus changes",
        defaultValue: true,
      },
    ],
    details: {
      interpretation: importing
        ? "The net gain from trade is the triangle between demand and supply over the imported units."
        : "The net gain from trade is the triangle between supply and demand over the exported units.",
    },
    compute: (values) => {
      const market = createMarket();
      const world = num(values, "world", importing ? 28 : 62);
      const qd = market.qDemandedAt(world);
      const qs = market.qSuppliedAt(world);
      const traded = Math.abs(qd - qs);

      const scene = marketScene(market, {
        curves: [
          demandCurve(market, { label: "D (domestic)" }),
          supplyCurve(market, { label: "S (domestic)" }),
          {
            id: "pw",
            label: "Pw",
            style: "tertiary",
            points: horizontalLine(world, market.xMax),
          },
        ],
      });
      scene.guides = [
        { id: "qs", x: qs, y: world, xLabel: "Qs" },
        { id: "qd", x: qd, y: world, xLabel: "Qd", yLabel: "Pw" },
      ];
      scene.annotations = [
        {
          id: "traded",
          x: (qd + qs) / 2,
          y: Math.min(world + 6, 96),
          text: `${kind}: ${round1(traded)}`,
        },
      ];
      if (bool(values, "welfare", true)) {
        scene.regions = [
          csRegion(market, world, qd),
          psRegion(market, world, qs),
          {
            id: "gain",
            label: "Gain from trade",
            fill: "benefit",
            points: importing
              ? [
                  { x: qs, y: world },
                  { x: market.equilibrium.x, y: market.equilibrium.y },
                  { x: qd, y: world },
                ]
              : [
                  { x: qd, y: world },
                  { x: market.equilibrium.x, y: market.equilibrium.y },
                  { x: qs, y: world },
                ],
          },
        ];
      }

      return {
        scenes: [scene],
        explanation: importing
          ? `At the world price of ${world}, domestic buyers consume ${round1(qd)} but domestic firms only produce ${round1(qs)} — the gap of ${round1(traded)} is imported. Consumer surplus expands by more than producer surplus shrinks; the green triangle is the net national gain.`
          : `At the world price of ${world}, domestic firms produce ${round1(qs)} but domestic buyers only take ${round1(qd)} — the gap of ${round1(traded)} is exported. Producer surplus expands by more than consumer surplus shrinks; the green triangle is the net national gain.`,
        readouts: [
          { label: importing ? "Imports" : "Exports", value: round1(traded) },
          { label: "Domestic production", value: round1(qs) },
          { label: "Domestic consumption", value: round1(qd) },
        ],
      };
    },
  };
}

export const microGraphDefinitions: GraphDefinition[] = [
  ppcDefinition,
  comparativeAdvantageDefinition,
  supplyDemandDefinition,
  demandShiftsDefinition,
  supplyShiftsDefinition,
  simultaneousShiftsDefinition,
  elasticityDemandDefinition,
  elasticitySupplyDefinition,
  priceControlDefinition("ceiling"),
  priceControlDefinition("floor"),
  taxDefinition,
  subsidyDefinition,
  tariffDefinition,
  quotaDefinition,
  surplusDefinition,
  negativeProductionExternality,
  positiveProductionExternality,
  negativeConsumptionExternality,
  positiveConsumptionExternality,
  publicGoodsDefinition,
  commonResourcesDefinition,
  productionFunctionDefinition,
  totalCostsDefinition,
  perUnitCostsDefinition,
  lratcDefinition,
  pcFirmDefinition,
  pcMarketFirmDefinition,
  pcLongRunDefinition,
  monopolyDefinition,
  naturalMonopolyDefinition,
  priceDiscriminationDefinition,
  monopolisticCompetitionDefinition,
  oligopolyDefinition,
  laborMarketDefinition,
  mrpDefinition,
  monopsonyDefinition,
  worldPriceDefinition("imports"),
  worldPriceDefinition("exports"),
];

export const microCategories = [
  "Basic Economic Concepts",
  "Supply, Demand, and Elasticity",
  "Government Intervention",
  "Market Failure",
  "Production and Costs",
  "Market Structures",
  "Factor Markets",
  "International Trade",
];
