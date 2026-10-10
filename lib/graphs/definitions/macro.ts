import {
  type ComputedGraph,
  type ControlValues,
  type GraphDefinition,
  horizontalLine,
  linePoints,
  num,
  round1,
  type Scene,
  type SceneCurve,
  sampleCurve,
  str,
  verticalLine,
} from "../engine";
import {
  createMarket,
  demandCurve,
  equilibriumMarkers,
  ghostCurves,
  supplyCurve,
} from "../market";

/* ---------------------------------------------------------------- */
/* AD–AS builder                                                     */
/* ---------------------------------------------------------------- */

type AdAsOptions = {
  adShift?: number;
  srasShift?: number;
  potential?: number;
  showLras?: boolean;
  caption?: string;
  extraAd?: { shift: number; label: string };
};

/**
 * AD intercept of 85 puts the unshifted equilibrium exactly at Y = 50,
 * PL = 47.5 — on the default LRAS, so the neutral graph starts in
 * long-run equilibrium instead of showing a spurious gap.
 */
const AD_INTERCEPT = 85;

function adAsMarket(adShift: number, srasShift = 0) {
  return createMarket({
    dIntercept: AD_INTERCEPT,
    dShift: adShift,
    sShift: srasShift,
    xLabel: "Real GDP",
    yLabel: "Price level",
    demandLabel: "AD",
    supplyLabel: "SRAS",
  });
}

function adAsScene(options: AdAsOptions): {
  scene: Scene;
  output: number;
  priceLevel: number;
  basePriceLevel: number;
  potential: number;
  gap: "recessionary" | "inflationary" | "none";
} {
  const potential = options.potential ?? 50;
  const market = adAsMarket(options.adShift ?? 0, options.srasShift ?? 0);

  const curves: SceneCurve[] = [
    demandCurve(market),
    supplyCurve(market),
    // With an explicit before-policy AD line, the zero-shift ghost is noise.
    ...ghostCurves(market, {
      demand: !options.extraAd,
      supply: true,
    }),
  ];
  if (options.showLras !== false) {
    curves.push({
      id: "lras",
      label: "LRAS",
      style: "tertiary",
      // Stop short of the top edge so the label clears the panel caption.
      points: [
        { x: potential, y: 0 },
        { x: potential, y: market.yMax * 0.93 },
      ],
    });
  }
  if (options.extraAd) {
    const extra = adAsMarket(options.extraAd.shift);
    curves.push(
      demandCurve(extra, {
        id: "ad-extra",
        label: options.extraAd.label,
        style: "muted",
        dashed: true,
      }),
    );
  }

  const markers = equilibriumMarkers(market, { q: "Y₁", p: "PL₁" });
  const output = market.equilibrium.x;
  const gapSize = output - potential;
  const gap =
    gapSize < -1.5 ? "recessionary" : gapSize > 1.5 ? "inflationary" : "none";

  const scene: Scene = {
    caption: options.caption,
    xLabel: "Real GDP",
    yLabel: "Price level",
    xMax: market.xMax,
    yMax: market.yMax,
    curves,
    guides: [
      ...markers.guides,
      ...(options.showLras !== false
        ? [{ id: "yf", x: potential, y: 0.1, xLabel: "Yf" }]
        : []),
    ],
    points: markers.points,
    annotations:
      gap !== "none"
        ? [
            {
              id: "gap",
              x: (output + potential) / 2,
              y: 8,
              text: `${gap} gap`,
            },
          ]
        : [],
  };

  return {
    scene,
    output,
    priceLevel: market.equilibrium.y,
    basePriceLevel: market.originalEquilibrium.y,
    potential,
    gap,
  };
}

function gapText(result: ReturnType<typeof adAsScene>): string {
  if (result.gap === "recessionary")
    return `Output (${round1(result.output)}) is below full employment (${round1(result.potential)}): a recessionary gap with unemployment above its natural rate.`;
  if (result.gap === "inflationary")
    return `Output (${round1(result.output)}) is above full employment (${round1(result.potential)}): an inflationary gap with upward pressure on wages and prices.`;
  return `Output equals full-employment output (${round1(result.potential)}): long-run equilibrium.`;
}

/* ---------------------------------------------------------------- */
/* Money market / loanable funds builders                            */
/* ---------------------------------------------------------------- */

function moneyMarketScene(
  msPosition: number,
  mdShift: number,
  caption?: string,
): { scene: Scene; rate: number } {
  const mdA = 80;
  const mdB = 0.75;
  const rate = Math.max(mdA - mdB * (msPosition - mdShift), 2);
  const scene: Scene = {
    caption,
    xLabel: "Quantity of money",
    yLabel: "Nominal interest rate",
    xMax: 100,
    yMax: 100,
    curves: [
      {
        id: "md",
        label: "MD",
        style: "secondary",
        points: linePoints(mdA + mdB * mdShift, -mdB, 100, 100),
      },
      {
        id: "ms",
        label: "MS",
        style: "primary",
        points: verticalLine(msPosition, 100),
      },
      ...(msPosition !== 50
        ? [
            {
              id: "ms-before",
              label: "MS₀",
              style: "reference" as const,
              dashed: true,
              points: verticalLine(50, 100),
            },
          ]
        : []),
    ],
    guides: [{ id: "r", x: msPosition, y: rate, xLabel: "Q", yLabel: "i" }],
    points: [{ id: "eq", x: msPosition, y: rate, label: "" }],
  };
  return { scene, rate };
}

function loanableFundsScene(
  dShift: number,
  sShift: number,
  caption?: string,
): { scene: Scene; rate: number; quantity: number } {
  const market = createMarket({
    dShift,
    sShift,
    xLabel: "Quantity of loanable funds",
    yLabel: "Real interest rate",
    demandLabel: "D (borrowers)",
    supplyLabel: "S (savers)",
  });
  const markers = equilibriumMarkers(market, { q: "Q", p: "r" });
  const scene: Scene = {
    caption,
    xLabel: market.xLabel,
    yLabel: market.yLabel,
    xMax: 100,
    yMax: 100,
    curves: [
      demandCurve(market),
      supplyCurve(market),
      ...ghostCurves(market, { demand: true, supply: true }),
    ],
    guides: markers.guides,
    points: markers.points,
  };
  return { scene, rate: market.equilibrium.y, quantity: market.equilibrium.x };
}

/* ---------------------------------------------------------------- */
/* Economic Indicators                                                */
/* ---------------------------------------------------------------- */

const businessCycleDefinition: GraphDefinition = {
  id: "business-cycle",
  course: "ap-macro",
  category: "Economic Indicators",
  title: "The Business Cycle",
  description:
    "Actual GDP swings around a long-run growth trend through expansion, peak, contraction, and trough.",
  controls: [
    {
      kind: "slider",
      id: "time",
      label: "Point in time (years)",
      min: 0,
      max: 12,
      step: 0.25,
      defaultValue: 3,
    },
    {
      kind: "slider",
      id: "amplitude",
      label: "Cycle severity",
      min: 4,
      max: 16,
      step: 1,
      defaultValue: 10,
    },
    {
      kind: "slider",
      id: "growth",
      label: "Trend growth rate",
      min: 2,
      max: 5,
      step: 0.5,
      defaultValue: 3.5,
    },
  ],
  details: {
    interpretation:
      "Potential GDP grows steadily; actual GDP cycles around it. The vertical distance between them is the output gap.",
    mistake:
      "A slowdown in growth is not a contraction — contraction means real GDP is actually falling.",
  },
  compute: (values) => {
    const t = num(values, "time", 3);
    const amp = num(values, "amplitude", 10);
    const g = num(values, "growth", 3.5);
    const trend = (x: number) => 28 + g * x;
    const actual = (x: number) => trend(x) + amp * Math.sin(1.05 * x);

    const s = Math.sin(1.05 * t);
    const c = Math.cos(1.05 * t);
    const phase =
      c > 0.35
        ? "expansion"
        : c < -0.35
          ? "contraction"
          : s > 0
            ? "peak"
            : "trough";
    const gap = actual(t) - trend(t);

    const phaseNote: Record<string, string> = {
      expansion: "Real GDP is rising: employment and incomes grow.",
      peak: "Real GDP tops out above trend: the economy is overheating and inflationary pressure is highest.",
      contraction:
        "Real GDP is falling: unemployment rises as the economy shrinks.",
      trough:
        "Real GDP bottoms out below trend: the turning point where recovery begins.",
    };

    return {
      scenes: [
        {
          xLabel: "Time (years)",
          yLabel: "Real GDP",
          xMax: 12,
          yMax: 100,
          curves: [
            {
              id: "trend",
              label: "Potential GDP",
              style: "tertiary",
              dashed: true,
              points: sampleCurve(trend, 0, 12, 100, 2),
            },
            {
              id: "actual",
              label: "Actual GDP",
              style: "primary",
              points: sampleCurve(actual, 0, 12, 100, 140),
            },
          ],
          guides: [{ id: "now", x: t, y: actual(t), xLabel: "t" }],
          points: [{ id: "now-point", x: t, y: actual(t), label: phase }],
        },
      ],
      explanation: `At year ${round1(t)} the economy is in ${phase === "expansion" || phase === "contraction" ? `a ${phase}` : `a ${phase}`}. ${phaseNote[phase]} The output gap is ${gap >= 0 ? "positive" : "negative"} (${round1(gap)}).`,
      readouts: [
        { label: "Phase", value: phase },
        { label: "Output gap", value: round1(gap) },
      ],
    };
  },
};

const circularFlowDefinition: GraphDefinition = {
  id: "circular-flow",
  course: "ap-macro",
  category: "Economic Indicators",
  title: "Circular Flow Model",
  description:
    "Households, firms, and the two markets that connect them — plus government, banks, and the world.",
  hideStandardToggles: true,
  controls: [
    {
      kind: "segmented",
      id: "view",
      label: "Flows shown",
      options: [
        { value: "both", label: "Both" },
        { value: "money", label: "Money flows" },
        { value: "real", label: "Real flows" },
      ],
      defaultValue: "both",
    },
    {
      kind: "toggle",
      id: "government",
      label: "Include government",
      defaultValue: false,
    },
    {
      kind: "toggle",
      id: "financial",
      label: "Include financial sector",
      defaultValue: false,
    },
    {
      kind: "toggle",
      id: "foreign",
      label: "Include foreign sector",
      defaultValue: false,
    },
  ],
  details: {
    interpretation:
      "Every money flow has a matching real flow in the opposite direction; total spending equals total income.",
  },
  custom: "circular-flow",
};

/* ---------------------------------------------------------------- */
/* Aggregate Demand and Aggregate Supply                              */
/* ---------------------------------------------------------------- */

const adAsDefinition: GraphDefinition = {
  id: "ad-as-model",
  course: "ap-macro",
  category: "Aggregate Demand and Aggregate Supply",
  title: "The AD–AS Model",
  description:
    "Aggregate demand, short-run aggregate supply, and the vertical long-run anchor at full employment.",
  controls: [
    {
      kind: "slider",
      id: "adShift",
      label: "Shift AD",
      min: -20,
      max: 20,
      step: 1,
      defaultValue: 0,
    },
    {
      kind: "slider",
      id: "srasShift",
      label: "Shift SRAS",
      min: -20,
      max: 20,
      step: 1,
      defaultValue: 0,
    },
    {
      kind: "slider",
      id: "potential",
      label: "Full-employment output (LRAS)",
      min: 38,
      max: 62,
      step: 1,
      defaultValue: 50,
    },
  ],
  presets: [
    {
      id: "recession",
      label: "Recessionary gap",
      values: { adShift: -12, srasShift: 0, potential: 50 },
    },
    {
      id: "overheating",
      label: "Inflationary gap",
      values: { adShift: 12, srasShift: 0, potential: 50 },
    },
    {
      id: "supply-shock",
      label: "Negative supply shock",
      values: { adShift: 0, srasShift: -12, potential: 50 },
    },
  ],
  details: {
    interpretation:
      "Demand shocks move output and prices together; supply shocks move them in opposite directions.",
    examTip:
      "Always compare the new equilibrium output with Yf and name the gap before discussing policy.",
  },
  compute: (values) => {
    const result = adAsScene({
      adShift: num(values, "adShift"),
      srasShift: num(values, "srasShift"),
      potential: num(values, "potential", 50),
    });
    return {
      scenes: [result.scene],
      explanation: gapText(result),
      readouts: [
        { label: "Real GDP", value: round1(result.output) },
        { label: "Price level", value: round1(result.priceLevel) },
        { label: "Gap", value: result.gap },
      ],
    };
  },
};

const demandPullDefinition: GraphDefinition = {
  id: "demand-pull-inflation",
  course: "ap-macro",
  category: "Aggregate Demand and Aggregate Supply",
  title: "Demand-Pull Inflation",
  description:
    "Too much spending chasing full-capacity output pulls the price level up.",
  controls: [
    {
      kind: "slider",
      id: "adShift",
      label: "Increase in AD",
      min: 0,
      max: 22,
      step: 1,
      defaultValue: 14,
    },
  ],
  details: {
    examTip:
      "Demand-pull: price level and real GDP rise together in the short run.",
  },
  compute: (values) => {
    const result = adAsScene({ adShift: num(values, "adShift", 14) });
    return {
      scenes: [result.scene],
      explanation: `Aggregate demand rose (consumption, investment, government, or net exports). In the short run real GDP rises to ${round1(result.output)} and the price level is pulled up to ${round1(result.priceLevel)} — demand-pull inflation. ${gapText(result)}`,
      readouts: [
        {
          label: "Δ price level",
          value: round1(result.priceLevel - result.basePriceLevel),
        },
        { label: "Real GDP", value: round1(result.output) },
      ],
    };
  },
};

const costPushDefinition: GraphDefinition = {
  id: "cost-push-inflation",
  course: "ap-macro",
  category: "Aggregate Demand and Aggregate Supply",
  title: "Cost-Push Inflation",
  description:
    "A negative supply shock raises prices while output falls — stagflation.",
  controls: [
    {
      kind: "slider",
      id: "srasShift",
      label: "Decrease in SRAS",
      min: 0,
      max: 22,
      step: 1,
      defaultValue: 14,
    },
  ],
  details: {
    interpretation:
      "Stagflation puts policymakers in a bind: fighting inflation deepens the recession and vice versa.",
  },
  compute: (values) => {
    const result = adAsScene({ srasShift: -num(values, "srasShift", 14) });
    return {
      scenes: [result.scene],
      explanation: `Production costs jumped (energy prices, wages, supply disruption), shifting SRAS left. The price level rises to ${round1(result.priceLevel)} while real GDP falls to ${round1(result.output)} — inflation and recession at once (stagflation).`,
      readouts: [
        { label: "Price level", value: round1(result.priceLevel) },
        { label: "Real GDP", value: round1(result.output) },
      ],
    };
  },
};

function gapPolicyDefinition(
  kind: "recessionary" | "inflationary",
): GraphDefinition {
  const recession = kind === "recessionary";
  return {
    id: `${kind}-gap`,
    course: "ap-macro",
    category: "Aggregate Demand and Aggregate Supply",
    title: recession ? "Recessionary Gap" : "Inflationary Gap",
    description: recession
      ? "Equilibrium below full employment — and three ways out."
      : "Equilibrium above full employment — and how it cools off.",
    controls: [
      {
        kind: "segmented",
        id: "response",
        label: "Response",
        options: [
          { value: "none", label: "None" },
          {
            value: "fiscal",
            label: recession ? "Expansionary fiscal" : "Contractionary fiscal",
          },
          {
            value: "monetary",
            label: recession
              ? "Expansionary monetary"
              : "Contractionary monetary",
          },
          { value: "self", label: "Long-run self-correction" },
        ],
        defaultValue: "none",
      },
      {
        kind: "slider",
        id: "progress",
        label: "Response strength",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 60,
        unit: "%",
      },
    ],
    details: {
      interpretation: recession
        ? "Policy shifts AD right; self-correction waits for wages to fall so SRAS shifts right instead."
        : "Policy shifts AD left; self-correction lets rising wages shift SRAS left instead.",
      examTip:
        "Both routes close the gap, but policy changes the price level in opposite directions from self-correction.",
    },
    compute: (values) => {
      const gapShift = recession ? -14 : 14;
      const response = str(values, "response", "none");
      const strength = num(values, "progress", 60) / 100;
      const usesAd = response === "fiscal" || response === "monetary";
      const adShift = gapShift + (usesAd ? -gapShift * strength : 0);
      const srasShift = response === "self" ? -gapShift * strength : 0;

      const result = adAsScene({ adShift, srasShift });
      const responseNote: Record<string, string> = {
        none: "No response yet — the gap persists in the short run.",
        fiscal: recession
          ? "Government spending rises or taxes fall, shifting AD back right."
          : "Government spending falls or taxes rise, shifting AD back left.",
        monetary: recession
          ? "The central bank eases: lower interest rates lift investment and shift AD right."
          : "The central bank tightens: higher interest rates cut investment and shift AD left.",
        self: recession
          ? "With slack labor markets, nominal wages eventually fall, shifting SRAS right until output returns to Yf at a lower price level."
          : "With overheated labor markets, nominal wages rise, shifting SRAS left until output returns to Yf at a higher price level.",
      };
      return {
        scenes: [result.scene],
        explanation: `${gapText(result)} ${responseNote[response]}`,
        readouts: [
          { label: "Real GDP", value: round1(result.output) },
          { label: "Price level", value: round1(result.priceLevel) },
        ],
      };
    },
  };
}

const longRunAdjustmentDefinition: GraphDefinition = {
  id: "long-run-adjustment",
  course: "ap-macro",
  category: "Aggregate Demand and Aggregate Supply",
  title: "Long-Run Adjustment",
  description:
    "Step through a demand shock, the wage response, and the return to full employment.",
  controls: [
    {
      kind: "segmented",
      id: "shock",
      label: "Shock",
      options: [
        { value: "positive", label: "AD increases" },
        { value: "negative", label: "AD decreases" },
      ],
      defaultValue: "positive",
    },
    {
      kind: "segmented",
      id: "step",
      label: "Step",
      options: [
        { value: "1", label: "1. Shock" },
        { value: "2", label: "2. Wages adjust" },
        { value: "3", label: "3. Long run" },
      ],
      defaultValue: "1",
    },
  ],
  details: {
    interpretation:
      "In the long run demand shocks change only the price level; output always returns to Yf.",
  },
  compute: (values) => {
    const positive = str(values, "shock", "positive") === "positive";
    const step = str(values, "step", "1");
    const adShift = positive ? 14 : -14;
    const srasShift =
      step === "1" ? 0 : step === "2" ? -adShift * 0.5 : -adShift;
    const result = adAsScene({ adShift, srasShift });
    const stepNote: Record<string, string> = {
      "1": positive
        ? "Step 1 — AD shifts right: output rises above Yf and the price level rises. Labor markets tighten."
        : "Step 1 — AD shifts left: output falls below Yf and the price level falls. Unemployment rises.",
      "2": positive
        ? "Step 2 — workers demand higher nominal wages; rising costs start shifting SRAS left."
        : "Step 2 — with slack labor markets, nominal wages start falling; lower costs shift SRAS right.",
      "3": positive
        ? "Step 3 — SRAS has fully shifted: output is back at Yf with a permanently higher price level."
        : "Step 3 — SRAS has fully shifted: output is back at Yf with a permanently lower price level.",
    };
    return {
      scenes: [result.scene],
      explanation: stepNote[step],
      readouts: [
        { label: "Real GDP", value: round1(result.output) },
        { label: "Price level", value: round1(result.priceLevel) },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Fiscal Policy                                                      */
/* ---------------------------------------------------------------- */

function fiscalDefinition(
  kind: "expansionary" | "contractionary",
): GraphDefinition {
  const expansionary = kind === "expansionary";
  return {
    id: `${kind}-fiscal-policy`,
    course: "ap-macro",
    category: "Fiscal Policy",
    title: expansionary
      ? "Expansionary Fiscal Policy"
      : "Contractionary Fiscal Policy",
    description: expansionary
      ? "Spending increases or tax cuts, multiplied through the economy, shift AD right."
      : "Spending cuts or tax hikes, multiplied through the economy, shift AD left.",
    controls: [
      {
        kind: "segmented",
        id: "tool",
        label: "Tool",
        options: [
          {
            value: "spending",
            label: expansionary ? "Raise spending" : "Cut spending",
          },
          { value: "taxes", label: expansionary ? "Cut taxes" : "Raise taxes" },
        ],
        defaultValue: "spending",
      },
      {
        kind: "slider",
        id: "size",
        label: "Policy size",
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 5,
      },
      {
        kind: "slider",
        id: "mpc",
        label: "MPC",
        min: 0.5,
        max: 0.9,
        step: 0.05,
        defaultValue: 0.75,
      },
    ],
    details: {
      interpretation:
        "The multiplier amplifies the initial change; the tax multiplier is smaller because part of a tax change is saved.",
      examTip:
        "Spending multiplier = 1/(1−MPC); tax multiplier = MPC/(1−MPC), acting in the opposite direction of the tax change.",
    },
    compute: (values) => {
      const mpc = num(values, "mpc", 0.75);
      const size = num(values, "size", 5);
      const spendingTool = str(values, "tool", "spending") === "spending";
      const multiplier = spendingTool ? 1 / (1 - mpc) : mpc / (1 - mpc);
      const total = size * multiplier;
      const direction = expansionary ? 1 : -1;
      // Start from the opposite gap so the policy is doing something sensible.
      const base = expansionary ? -12 : 12;
      const result = adAsScene({
        adShift: base + direction * Math.min(total, 24),
        extraAd: { shift: base, label: "AD₀" },
      });
      return {
        scenes: [result.scene],
        explanation: `${spendingTool ? `A ${expansionary ? "spending increase" : "spending cut"} of ${size}` : `A ${expansionary ? "tax cut" : "tax increase"} of ${size}`} works through a multiplier of ${round1(multiplier)} (MPC = ${mpc}), moving aggregate demand by about ${round1(total)} in total. ${gapText(result)}`,
        readouts: [
          { label: "Multiplier", value: round1(multiplier) },
          { label: "Total AD change", value: round1(direction * total) },
          { label: "Real GDP", value: round1(result.output) },
        ],
      };
    },
  };
}

const multiplierDefinition: GraphDefinition = {
  id: "spending-multiplier",
  course: "ap-macro",
  category: "Fiscal Policy",
  title: "The Multiplier",
  description:
    "One dollar of new spending becomes income, gets partly re-spent, and ripples through round after round.",
  hideStandardToggles: true,
  controls: [
    {
      kind: "slider",
      id: "initial",
      label: "Initial spending change",
      min: 20,
      max: 100,
      step: 10,
      defaultValue: 100,
    },
    {
      kind: "slider",
      id: "mpc",
      label: "MPC",
      min: 0.4,
      max: 0.9,
      step: 0.05,
      defaultValue: 0.75,
    },
    {
      kind: "segmented",
      id: "type",
      label: "Change type",
      options: [
        { value: "spending", label: "Government spending" },
        { value: "taxes", label: "Tax cut" },
      ],
      defaultValue: "spending",
    },
  ],
  details: {
    interpretation:
      "Each round re-spends the MPC share of the previous round; the geometric series sums to the multiplier.",
    mistake:
      "A tax cut's first round is only MPC × the cut — households save part of it — so the tax multiplier is one round smaller.",
  },
  custom: "multiplier",
};

const crowdingOutDefinition: GraphDefinition = {
  id: "crowding-out",
  course: "ap-macro",
  category: "Fiscal Policy",
  title: "Crowding Out",
  description:
    "Deficit-financed fiscal stimulus raises interest rates and squeezes out private investment.",
  controls: [
    {
      kind: "slider",
      id: "deficit",
      label: "Deficit-financed spending",
      min: 0,
      max: 20,
      step: 1,
      defaultValue: 12,
    },
    {
      kind: "slider",
      id: "sensitivity",
      label: "Investment sensitivity to r",
      min: 0,
      max: 100,
      step: 10,
      defaultValue: 50,
      unit: "%",
    },
  ],
  details: {
    interpretation:
      "Government borrowing shifts the demand for loanable funds right; the higher real rate crowds out some private investment, shrinking the net AD shift.",
    examTip:
      "Draw the loanable-funds market first, then carry the higher interest rate into a smaller AD shift.",
  },
  compute: (values) => {
    const deficit = num(values, "deficit", 12);
    const sensitivity = num(values, "sensitivity", 50) / 100;
    const lf = loanableFundsScene(deficit, 0, "Loanable funds market");
    const baselineRate = 45;
    const rateRise = lf.rate - baselineRate;
    const crowdedOut = Math.max(rateRise * sensitivity * 1.4, 0);
    const netShift = Math.max(deficit - crowdedOut, 0);
    const adas = adAsScene({
      adShift: netShift,
      caption: "AD–AS",
      extraAd: deficit > 0 ? { shift: deficit, label: "AD (full)" } : undefined,
    });

    return {
      scenes: [lf.scene, adas.scene],
      explanation:
        deficit === 0
          ? "No deficit spending: the loanable-funds market and AD are undisturbed."
          : `Borrowing ${deficit} shifts loanable-funds demand right, raising the real rate to ${round1(lf.rate)}. At ${Math.round(sensitivity * 100)}% sensitivity, ${round1(crowdedOut)} of private investment is crowded out — so AD moves right by only ${round1(netShift)} instead of ${deficit} (dashed line).`,
      readouts: [
        { label: "Real interest rate", value: round1(lf.rate) },
        { label: "Investment crowded out", value: round1(crowdedOut) },
        { label: "Net AD shift", value: round1(netShift) },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Monetary Policy                                                    */
/* ---------------------------------------------------------------- */

const moneyMarketDefinition: GraphDefinition = {
  id: "money-market",
  course: "ap-macro",
  category: "Monetary Policy",
  title: "The Money Market",
  description:
    "Money supply set by the central bank meets money demand from spending needs.",
  controls: [
    {
      kind: "slider",
      id: "ms",
      label: "Money supply",
      min: 30,
      max: 70,
      step: 1,
      defaultValue: 50,
    },
    {
      kind: "segmented",
      id: "mdCause",
      label: "Money-demand shifter",
      options: [
        { value: "none", label: "None" },
        { value: "priceLevel", label: "Price level ↑" },
        { value: "gdp", label: "Real GDP ↑" },
        { value: "tech", label: "Payment tech ↑" },
      ],
      defaultValue: "none",
    },
  ],
  details: {
    interpretation:
      "MS is vertical because the central bank fixes it regardless of the interest rate; the rate adjusts to make people willing to hold exactly that much money.",
    mistake:
      "The money market uses the nominal interest rate; the loanable-funds market uses the real rate.",
  },
  compute: (values) => {
    const mdShifts: Record<string, number> = {
      none: 0,
      priceLevel: 12,
      gdp: 12,
      tech: -12,
    };
    const cause = str(values, "mdCause", "none");
    const { scene, rate } = moneyMarketScene(
      num(values, "ms", 50),
      mdShifts[cause],
    );
    const causeNote: Record<string, string> = {
      none: "",
      priceLevel:
        " A higher price level means more money is needed for the same purchases, shifting MD right.",
      gdp: " Higher real GDP means more transactions, shifting MD right.",
      tech: " Better payment technology lets people hold less cash, shifting MD left.",
    };
    return {
      scenes: [scene],
      explanation: `The nominal interest rate settles at ${round1(rate)}, where the fixed money supply equals the quantity of money people want to hold.${causeNote[cause]}`,
      readouts: [{ label: "Nominal rate", value: round1(rate) }],
    };
  },
};

function monetaryPolicyDefinition(
  kind: "expansionary" | "contractionary",
): GraphDefinition {
  const easing = kind === "expansionary";
  return {
    id: `${kind}-monetary-policy`,
    course: "ap-macro",
    category: "Monetary Policy",
    title: easing
      ? "Expansionary Monetary Policy"
      : "Contractionary Monetary Policy",
    description: easing
      ? "More money → lower rates → more investment → AD shifts right."
      : "Less money → higher rates → less investment → AD shifts left.",
    controls: [
      {
        kind: "slider",
        id: "size",
        label: easing ? "Money supply increase" : "Money supply decrease",
        min: 0,
        max: 18,
        step: 1,
        defaultValue: 10,
      },
    ],
    details: {
      examTip:
        "Chain every FRQ answer: tool → interest rate → investment (and interest-sensitive consumption) → AD → real GDP and price level.",
    },
    compute: (values) => {
      const size = num(values, "size", 10) * (easing ? 1 : -1);
      const money = moneyMarketScene(50 + size, 0, "Money market");
      const base = easing ? -12 : 12;
      const adas = adAsScene({
        adShift: base + size * 0.9,
        caption: "AD–AS",
        extraAd: size !== 0 ? { shift: base, label: "AD₀" } : undefined,
      });
      return {
        scenes: [money.scene, adas.scene],
        explanation:
          size === 0
            ? "No policy action yet — move the slider to change the money supply."
            : `The central bank ${easing ? "expands" : "contracts"} the money supply. The nominal rate ${easing ? "falls" : "rises"} to ${round1(money.rate)}, investment ${easing ? "rises" : "falls"}, and AD shifts ${easing ? "right" : "left"}. ${gapText(adas)}`,
        readouts: [
          { label: "Nominal rate", value: round1(money.rate) },
          { label: "Real GDP", value: round1(adas.output) },
          { label: "Price level", value: round1(adas.priceLevel) },
        ],
      };
    },
  };
}

const reserveMarketDefinition: GraphDefinition = {
  id: "reserve-market",
  course: "ap-macro",
  category: "Monetary Policy",
  title: "The Market for Reserves",
  description:
    "How the policy rate is set in scarce-reserves versus ample-reserves systems.",
  controls: [
    {
      kind: "slider",
      id: "supply",
      label: "Reserve supply",
      min: 20,
      max: 85,
      step: 1,
      defaultValue: 65,
    },
    {
      kind: "slider",
      id: "iorb",
      label: "Interest on reserves (IORB)",
      min: 10,
      max: 40,
      step: 1,
      defaultValue: 25,
    },
  ],
  presets: [
    { id: "ample", label: "Ample reserves", values: { supply: 65 } },
    { id: "scarce", label: "Scarce reserves", values: { supply: 32 } },
  ],
  details: {
    interpretation:
      "With ample reserves the demand curve is flat at IORB, so administered rates — not open-market quantity tweaks — move the policy rate.",
    examTip:
      "In an ample-reserves system, changing IORB shifts the flat section directly; small supply changes do nothing.",
  },
  compute: (values) => {
    const supply = num(values, "supply", 65);
    const iorb = num(values, "iorb", 25);
    const discount = 60;
    const demandAt = (q: number) =>
      Math.max(Math.min(95 - 1.6 * q, discount), iorb);
    const rate = demandAt(supply);
    const flatStart = (95 - iorb) / 1.6;
    const inAmple = supply >= flatStart;

    return {
      scenes: [
        {
          xLabel: "Quantity of reserves",
          yLabel: "Federal funds rate",
          xMax: 100,
          yMax: 100,
          curves: [
            {
              id: "demand",
              label: "Demand for reserves",
              style: "secondary",
              points: sampleCurve(demandAt, 0, 100, 100, 120),
            },
            {
              id: "supply",
              label: "Reserve supply",
              style: "primary",
              points: verticalLine(supply, 100),
            },
            {
              id: "iorb",
              label: "IORB",
              style: "muted",
              dashed: true,
              points: horizontalLine(iorb, 100),
            },
            {
              id: "discount",
              label: "Discount rate",
              style: "muted",
              dashed: true,
              points: horizontalLine(discount, 100),
            },
          ],
          guides: [{ id: "rate", x: supply, y: rate, yLabel: "FFR" }],
          points: [{ id: "eq", x: supply, y: rate, label: "" }],
        },
      ],
      explanation: inAmple
        ? `Supply intersects the flat section of reserve demand: the funds rate sits at the IORB floor (${iorb}). This is an ample-reserves system — the central bank steers rates by moving IORB itself.`
        : `Supply intersects the steep section of reserve demand: the funds rate (${round1(rate)}) is above IORB and small changes in reserve supply move it a lot. This is a scarce-reserves system, managed with open-market operations.`,
      readouts: [
        { label: "Federal funds rate", value: round1(rate) },
        { label: "System", value: inAmple ? "ample" : "scarce" },
      ],
    };
  },
};

const transmissionDefinition: GraphDefinition = {
  id: "monetary-policy-transmission",
  course: "ap-macro",
  category: "Monetary Policy",
  title: "Monetary Policy Transmission",
  description:
    "Follow one action from the central bank through interest rates and investment into output and prices.",
  controls: [
    {
      kind: "segmented",
      id: "direction",
      label: "Action",
      options: [
        { value: "ease", label: "Ease (buy bonds)" },
        { value: "tighten", label: "Tighten (sell bonds)" },
      ],
      defaultValue: "ease",
    },
    {
      kind: "slider",
      id: "size",
      label: "Size of action",
      min: 2,
      max: 16,
      step: 1,
      defaultValue: 10,
    },
  ],
  details: {
    interpretation:
      "The transmission chain: policy action → money supply → nominal rate → investment → AD → real GDP and price level.",
  },
  compute: (values) => {
    const ease = str(values, "direction", "ease") === "ease";
    const size = num(values, "size", 10) * (ease ? 1 : -1);
    const money = moneyMarketScene(50 + size, 0, "1. Money market");
    const adas = adAsScene({
      adShift: size * 0.9,
      caption: "2. AD–AS",
    });
    const arrow = ease
      ? `Open-market purchase → MS ↑ → nominal rate ↓ (${round1(money.rate)}) → investment ↑ → AD → real GDP ↑ (${round1(adas.output)}), price level ↑ (${round1(adas.priceLevel)}).`
      : `Open-market sale → MS ↓ → nominal rate ↑ (${round1(money.rate)}) → investment ↓ → AD ← real GDP ↓ (${round1(adas.output)}), price level ↓ (${round1(adas.priceLevel)}).`;
    return {
      scenes: [money.scene, adas.scene],
      explanation: arrow,
      readouts: [
        { label: "Nominal rate", value: round1(money.rate) },
        { label: "Real GDP", value: round1(adas.output) },
        { label: "Price level", value: round1(adas.priceLevel) },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Financial Markets                                                  */
/* ---------------------------------------------------------------- */

const loanableFundsDefinition: GraphDefinition = {
  id: "loanable-funds-market",
  course: "ap-macro",
  category: "Financial Markets",
  title: "The Loanable Funds Market",
  description:
    "Savers supply funds, borrowers demand them, and the real interest rate clears the market.",
  controls: [
    {
      kind: "slider",
      id: "borrowing",
      label: "Government borrowing",
      min: 0,
      max: 18,
      step: 1,
      defaultValue: 0,
    },
    {
      kind: "slider",
      id: "saving",
      label: "Private saving",
      min: -15,
      max: 15,
      step: 1,
      defaultValue: 0,
    },
    {
      kind: "slider",
      id: "foreign",
      label: "Foreign capital inflow",
      min: -15,
      max: 15,
      step: 1,
      defaultValue: 0,
    },
    {
      kind: "slider",
      id: "investment",
      label: "Investment demand",
      min: -15,
      max: 15,
      step: 1,
      defaultValue: 0,
    },
  ],
  presets: [
    {
      id: "deficit",
      label: "Budget deficit",
      values: { borrowing: 12, saving: 0, foreign: 0, investment: 0 },
    },
    {
      id: "inflow",
      label: "Capital inflow",
      values: { borrowing: 0, saving: 0, foreign: 12, investment: 0 },
    },
    {
      id: "optimism",
      label: "Investment boom",
      values: { borrowing: 0, saving: 0, foreign: 0, investment: 12 },
    },
  ],
  details: {
    mistake:
      "This market runs on the REAL interest rate. Only the money market uses the nominal rate.",
  },
  compute: (values) => {
    const dShift = num(values, "borrowing") + num(values, "investment");
    const sShift = num(values, "saving") + num(values, "foreign");
    const lf = loanableFundsScene(dShift, sShift);
    const parts: string[] = [];
    if (num(values, "borrowing") > 0)
      parts.push("government borrowing raises demand for funds");
    if (num(values, "investment") !== 0)
      parts.push(
        `investment demand ${num(values, "investment") > 0 ? "rose" : "fell"}`,
      );
    if (num(values, "saving") !== 0)
      parts.push(
        `private saving ${num(values, "saving") > 0 ? "rose" : "fell"}`,
      );
    if (num(values, "foreign") !== 0)
      parts.push(
        `foreign capital ${num(values, "foreign") > 0 ? "flowed in" : "flowed out"}`,
      );
    return {
      scenes: [lf.scene],
      explanation: `${parts.length ? `${parts.join("; ")}. ` : ""}The real interest rate settles at ${round1(lf.rate)} with ${round1(lf.quantity)} in funds exchanged.`,
      readouts: [
        { label: "Real rate", value: round1(lf.rate) },
        { label: "Funds", value: round1(lf.quantity) },
      ],
    };
  },
};

const bondPricesDefinition: GraphDefinition = {
  id: "bond-prices-and-interest-rates",
  course: "ap-macro",
  category: "Financial Markets",
  title: "Bond Prices and Interest Rates",
  description:
    "A fixed coupon means price and market interest rate must move in opposite directions.",
  controls: [
    {
      kind: "slider",
      id: "rate",
      label: "Market interest rate",
      min: 5,
      max: 20,
      step: 0.5,
      defaultValue: 8,
      unit: "%",
    },
    {
      kind: "slider",
      id: "coupon",
      label: "Annual coupon payment",
      min: 4,
      max: 8,
      step: 0.5,
      defaultValue: 6,
    },
  ],
  details: {
    interpretation:
      "For a perpetuity, price = coupon ÷ interest rate. When rates rise, old bonds' fixed coupons are worth less, so their prices fall.",
    examTip:
      "Central-bank bond purchases raise bond prices and lower interest rates — two descriptions of the same event.",
  },
  compute: (values) => {
    const rate = num(values, "rate", 8);
    const coupon = num(values, "coupon", 6);
    const price = (coupon / rate) * 100;
    const curve = (p: number) => (coupon * 100) / Math.max(p, 20);
    return {
      scenes: [
        {
          xLabel: "Bond price",
          yLabel: "Interest rate (%)",
          xMax: 130,
          yMax: 25,
          curves: [
            {
              id: "relation",
              label: "r = coupon ÷ price",
              style: "secondary",
              points: sampleCurve(curve, 24, 130, 25, 100),
            },
          ],
          guides: [
            { id: "current", x: price, y: rate, xLabel: "P", yLabel: "r" },
          ],
          points: [{ id: "current-pt", x: price, y: rate, label: "" }],
        },
      ],
      explanation: `With a ${coupon} coupon and market rates at ${rate}%, the bond trades at ${round1(price)}. Slide the rate up and watch the price fall along the curve — the inverse relationship is mechanical, not behavioral.`,
      readouts: [
        { label: "Bond price", value: round1(price) },
        { label: "Yield", value: `${round1(rate)}%` },
      ],
    };
  },
};

const moneyCreationDefinition: GraphDefinition = {
  id: "money-creation",
  course: "ap-macro",
  category: "Financial Markets",
  title: "Banks and Money Creation",
  description:
    "A deposit becomes reserves and loans; re-deposited loans multiply the money supply.",
  hideStandardToggles: true,
  controls: [
    {
      kind: "slider",
      id: "deposit",
      label: "Initial deposit",
      min: 100,
      max: 1000,
      step: 50,
      defaultValue: 1000,
    },
    {
      kind: "slider",
      id: "rr",
      label: "Reserve requirement",
      min: 5,
      max: 50,
      step: 5,
      defaultValue: 10,
      unit: "%",
    },
  ],
  details: {
    interpretation:
      "Each bank lends its excess reserves; the money multiplier 1/rr caps total deposit expansion if all loans are re-deposited and banks hold no excess.",
    mistake:
      "The initial deposit itself is not new money — only the loans created on top of it expand M1.",
  },
  custom: "money-creation",
};

/* ---------------------------------------------------------------- */
/* Long-Run Growth                                                    */
/* ---------------------------------------------------------------- */

const ppcGrowthDefinition: GraphDefinition = {
  id: "ppc-and-economic-growth",
  course: "ap-macro",
  category: "Long-Run Growth",
  title: "PPC and Economic Growth",
  description:
    "Growth as an outward shift: investing in capital goods today expands tomorrow's frontier.",
  controls: [
    {
      kind: "slider",
      id: "capitalShare",
      label: "Share of output devoted to capital goods",
      min: 10,
      max: 80,
      step: 5,
      defaultValue: 40,
      unit: "%",
    },
    {
      kind: "slider",
      id: "years",
      label: "Years of growth",
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 4,
    },
  ],
  details: {
    interpretation:
      "Economies that produce more capital goods sacrifice consumption now but shift their PPC out faster.",
  },
  compute: (values) => {
    const share = num(values, "capitalShare", 40) / 100;
    const years = num(values, "years", 4);
    const growthRate = 0.005 + share * 0.02;
    const scale = (1 + growthRate) ** years;
    const base = 62;
    const radius = Math.min(base * scale, 98);

    const arc = (r: number) =>
      sampleCurve(
        (x) => (x >= r ? 0 : r * Math.sqrt(1 - (x / r) ** 2)),
        0,
        r,
        100,
        70,
      );

    const angle = (1 - share) * (Math.PI / 2);
    const px = base * Math.sin(angle);
    const py = base * Math.cos(angle);

    return {
      scenes: [
        {
          xLabel: "Consumer goods",
          yLabel: "Capital goods",
          xMax: 100,
          yMax: 100,
          curves: [
            {
              id: "ppc-now",
              label: "PPC (today)",
              style: "reference",
              dashed: true,
              points: arc(base),
            },
            {
              id: "ppc-future",
              label: `PPC (+${years} yr)`,
              style: "primary",
              points: arc(radius),
            },
          ],
          points: [{ id: "mix", x: px, y: py, label: "current mix" }],
        },
      ],
      explanation: `Devoting ${Math.round(share * 100)}% of production to capital goods grows capacity about ${round1(growthRate * 100)}% per year. After ${years} year${years === 1 ? "" : "s"}, the frontier sits ${round1((scale - 1) * 100)}% farther out — more of BOTH goods becomes attainable.`,
      readouts: [
        { label: "Annual growth", value: `${round1(growthRate * 100)}%` },
        { label: "Frontier expansion", value: `${round1((scale - 1) * 100)}%` },
      ],
    };
  },
};

const lrasGrowthDefinition: GraphDefinition = {
  id: "lras-growth",
  course: "ap-macro",
  category: "Long-Run Growth",
  title: "Long-Run Aggregate Supply Growth",
  description: "What shifts the economy's full-employment output itself.",
  controls: [
    {
      kind: "segmented",
      id: "driver",
      label: "Growth driver",
      options: [
        { value: "capital", label: "Capital stock" },
        { value: "labor", label: "Labor force" },
        { value: "productivity", label: "Productivity" },
        { value: "technology", label: "Technology" },
        { value: "institutions", label: "Institutions" },
      ],
      defaultValue: "technology",
    },
    {
      kind: "slider",
      id: "size",
      label: "Size of improvement",
      min: 0,
      max: 16,
      step: 1,
      defaultValue: 10,
    },
  ],
  details: {
    interpretation:
      "LRAS shifts are true economic growth — more capacity, not just more spending against fixed capacity.",
  },
  compute: (values) => {
    const size = num(values, "size", 10);
    const driver = str(values, "driver", "technology");
    const result = adAsScene({
      // SRAS shifts 2× the LRAS move so, with equal AD/SRAS slopes, the
      // new equilibrium sits exactly on the new LRAS (Y = 50 + size).
      srasShift: size * 2,
      potential: 50 + size,
    });
    result.scene.curves.push({
      id: "lras-before",
      label: "LRAS₀",
      style: "reference",
      dashed: true,
      points: verticalLine(50, 100),
    });
    const driverNote: Record<string, string> = {
      capital:
        "More physical capital per worker raises what full employment can produce.",
      labor: "A larger labor force expands capacity directly.",
      productivity:
        "More output per hour of work shifts capacity out even with the same inputs.",
      technology:
        "Better technology raises output from the same capital and labor.",
      institutions:
        "Stronger property rights and stable institutions make investment and innovation pay off.",
    };
    return {
      scenes: [result.scene],
      explanation: `${driverNote[driver]} LRAS (and SRAS with it) shifts right by ${size}: real GDP rises to ${round1(result.output)} while the price level eases to ${round1(result.priceLevel)}.`,
      readouts: [
        { label: "New potential output", value: round1(50 + size) },
        { label: "Price level", value: round1(result.priceLevel) },
      ],
    };
  },
};

const aggregateProductionFunctionDefinition: GraphDefinition = {
  id: "aggregate-production-function",
  course: "ap-macro",
  category: "Long-Run Growth",
  title: "The Aggregate Production Function",
  description:
    "Output per worker rises with capital per worker — but at a diminishing rate, unless technology shifts the whole curve.",
  controls: [
    {
      kind: "slider",
      id: "capital",
      label: "Capital per worker",
      min: 5,
      max: 90,
      step: 1,
      defaultValue: 40,
    },
    {
      kind: "slider",
      id: "technology",
      label: "Technology / human capital (A)",
      min: 8,
      max: 14,
      step: 0.5,
      defaultValue: 10,
    },
  ],
  details: {
    interpretation:
      "Capital deepening runs into diminishing returns; sustained growth in living standards ultimately requires better technology and human capital.",
  },
  compute: (values) => {
    const k = num(values, "capital", 40);
    const A = num(values, "technology", 10);
    const f = (x: number) => A * Math.sqrt(x);
    const base = (x: number) => 10 * Math.sqrt(x);
    const y = f(k);

    const curves: SceneCurve[] = [
      {
        id: "apf",
        label: "y = A·f(k)",
        style: "primary",
        points: sampleCurve(f, 0, 100, 100, 80),
      },
    ];
    if (Math.abs(A - 10) > 0.01) {
      curves.push({
        id: "apf-base",
        label: "y (A = 10)",
        style: "reference",
        dashed: true,
        points: sampleCurve(base, 0, 100, 100, 80),
      });
    }

    return {
      scenes: [
        {
          xLabel: "Capital per worker",
          yLabel: "Output per worker",
          xMax: 100,
          yMax: 100,
          curves,
          guides: [{ id: "k", x: k, y: y, xLabel: "k", yLabel: "y" }],
          points: [{ id: "k-point", x: k, y: y, label: "" }],
        },
      ],
      explanation: `At k = ${k}, output per worker is ${round1(y)}. Moving right along the curve (capital deepening) adds less and less — the curve flattens. Raising A (technology, human capital) lifts the entire curve instead.`,
      readouts: [
        { label: "Output per worker", value: round1(y) },
        { label: "A", value: round1(A) },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* Inflation and Unemployment                                         */
/* ---------------------------------------------------------------- */

function phillipsCompute(values: ControlValues): ComputedGraph {
  const uNat = num(values, "natural", 5);
  const expected = num(values, "expected", 3);
  const shock = num(values, "shock", 0);
  const demandPressure = num(values, "pressure", 0);

  const u = Math.max(uNat - demandPressure, 0.5);
  const srpc = (x: number) => expected + shock + 1.1 * (uNat - x);
  const inflation = srpc(u);

  const curves: SceneCurve[] = [
    {
      id: "srpc",
      label: "SRPC",
      style: "secondary",
      points: sampleCurve(srpc, 0, 12, 14, 2),
    },
    {
      id: "lrpc",
      label: "LRPC",
      style: "tertiary",
      points: verticalLine(uNat, 14),
    },
  ];
  if (Math.abs(expected - 3) > 0.01 || Math.abs(shock) > 0.01) {
    curves.push({
      id: "srpc-base",
      label: "SRPC₀",
      style: "reference",
      dashed: true,
      points: sampleCurve((x) => 3 + 1.1 * (uNat - x), 0, 12, 14, 2),
    });
  }

  return {
    scenes: [
      {
        xLabel: "Unemployment rate (%)",
        yLabel: "Inflation rate (%)",
        xMax: 12,
        yMax: 14,
        curves,
        guides: [
          {
            id: "point",
            x: u,
            y: Math.max(inflation, 0),
            xLabel: "u",
            yLabel: "π",
          },
        ],
        points: [{ id: "economy", x: u, y: Math.max(inflation, 0), label: "" }],
      },
    ],
    explanation:
      demandPressure !== 0
        ? `Demand pressure moves the economy ALONG the short-run Phillips curve: unemployment ${demandPressure > 0 ? "falls" : "rises"} to ${round1(u)}% while inflation ${demandPressure > 0 ? "rises" : "falls"} to ${round1(inflation)}%. In the long run expectations adjust and the economy returns to the vertical LRPC at ${uNat}%.`
        : Math.abs(expected - 3) > 0.01 || shock !== 0
          ? `Higher expected inflation or a supply shock SHIFTS the whole short-run curve — the same unemployment now comes with ${round1(inflation)}% inflation. The LRPC stays vertical at the natural rate.`
          : `The economy sits at the natural rate of unemployment (${uNat}%) with inflation equal to expectations (${round1(inflation)}%). There is no long-run tradeoff: the LRPC is vertical.`,
    readouts: [
      { label: "Unemployment", value: `${round1(u)}%` },
      { label: "Inflation", value: `${round1(inflation)}%` },
    ],
  };
}

const phillipsControls: GraphDefinition["controls"] = [
  {
    kind: "slider",
    id: "pressure",
    label: "Aggregate demand pressure",
    min: -3,
    max: 3,
    step: 0.25,
    defaultValue: 0,
  },
  {
    kind: "slider",
    id: "expected",
    label: "Expected inflation",
    min: 0,
    max: 8,
    step: 0.5,
    defaultValue: 3,
    unit: "%",
  },
  {
    kind: "slider",
    id: "shock",
    label: "Supply shock",
    min: -3,
    max: 4,
    step: 0.5,
    defaultValue: 0,
  },
  {
    kind: "slider",
    id: "natural",
    label: "Natural rate of unemployment",
    min: 3.5,
    max: 7.5,
    step: 0.5,
    defaultValue: 5,
    unit: "%",
  },
];

const phillipsDefinition: GraphDefinition = {
  id: "phillips-curve",
  course: "ap-macro",
  category: "Inflation and Unemployment",
  title: "Short-Run and Long-Run Phillips Curves",
  description:
    "The short-run inflation–unemployment tradeoff, and why it disappears in the long run.",
  controls: phillipsControls,
  details: {
    interpretation:
      "Movements along SRPC come from demand; shifts of SRPC come from expectations and supply shocks; the LRPC is vertical at the natural rate.",
    mistake:
      "Stagflation is a rightward SRPC shift — not a movement along the curve.",
  },
  compute: phillipsCompute,
};

const phillipsDataViewDefinition: GraphDefinition = {
  id: "phillips-curve-data-view",
  course: "ap-macro",
  category: "Economic Indicators",
  title: "Phillips Curve Data View",
  description:
    "Explore how inflation and unemployment co-move in the short run and decouple in the long run.",
  controls: phillipsControls,
  details: phillipsDefinition.details,
  compute: phillipsCompute,
};

const adasPhillipsDefinition: GraphDefinition = {
  id: "ad-as-and-phillips-curve",
  course: "ap-macro",
  category: "Inflation and Unemployment",
  title: "AD–AS and the Phillips Curve",
  description:
    "One demand shock, two graphs: output and prices on the left, unemployment and inflation on the right.",
  controls: [
    {
      kind: "slider",
      id: "adShift",
      label: "Shift AD",
      min: -15,
      max: 15,
      step: 1,
      defaultValue: 8,
    },
  ],
  details: {
    interpretation:
      "An AD increase raises output (unemployment falls) and raises the price level (inflation rises): a move up-left along the SRPC. The two graphs are mirror images.",
  },
  compute: (values) => {
    const adShift = num(values, "adShift", 8);
    const adas = adAsScene({ adShift, caption: "AD–AS" });
    const phillips = phillipsCompute({
      pressure: adShift * 0.18,
      expected: 3,
      shock: 0,
      natural: 5,
    });
    phillips.scenes[0].caption = "Phillips curve";
    return {
      scenes: [adas.scene, phillips.scenes[0]],
      explanation:
        adShift === 0
          ? "With no shock, the economy sits at full employment and the natural rate of unemployment."
          : `AD shifts ${adShift > 0 ? "right" : "left"}: real GDP ${adShift > 0 ? "rises" : "falls"} and the price level ${adShift > 0 ? "rises" : "falls"} on the left graph, which appears on the right graph as ${adShift > 0 ? "lower" : "higher"} unemployment with ${adShift > 0 ? "higher" : "lower"} inflation — a movement along the SRPC.`,
      readouts: [
        { label: "Real GDP", value: round1(adas.output) },
        { label: "Price level", value: round1(adas.priceLevel) },
      ],
    };
  },
};

/* ---------------------------------------------------------------- */
/* International Economics                                            */
/* ---------------------------------------------------------------- */

function forexScenes(dShift: number, sShift: number, caption?: string) {
  const market = createMarket({
    dShift,
    sShift,
    xLabel: "Quantity of dollars",
    yLabel: "Exchange rate (foreign currency per $)",
    demandLabel: "D ($)",
    supplyLabel: "S ($)",
  });
  const markers = equilibriumMarkers(market, { q: "Q$", p: "e" });
  const scene: Scene = {
    caption,
    xLabel: market.xLabel,
    yLabel: market.yLabel,
    xMax: 100,
    yMax: 100,
    curves: [
      demandCurve(market),
      supplyCurve(market),
      ...ghostCurves(market, { demand: true, supply: true }),
    ],
    guides: markers.guides,
    points: markers.points,
  };
  return { market, scene };
}

const forexDefinition: GraphDefinition = {
  id: "foreign-exchange-market",
  course: "ap-macro",
  category: "International Economics",
  title: "The Foreign Exchange Market",
  description:
    "Demand and supply for a currency set its price — the exchange rate.",
  controls: [
    {
      kind: "segmented",
      id: "cause",
      label: "Determinant",
      options: [
        { value: "interest", label: "US interest rates ↑" },
        { value: "income", label: "US income ↑" },
        { value: "tastes", label: "Taste for US goods ↑" },
        { value: "returns", label: "Expected $ return ↑" },
        { value: "inflation", label: "US inflation ↑" },
      ],
      defaultValue: "interest",
    },
    {
      kind: "slider",
      id: "size",
      label: "Size of change",
      min: 0,
      max: 18,
      step: 1,
      defaultValue: 10,
    },
  ],
  details: {
    interpretation:
      "Anything that makes dollar assets or US goods more attractive raises demand for dollars and appreciates the currency.",
    mistake:
      "Higher US income appreciates nothing — it raises imports, which supplies MORE dollars and depreciates the currency.",
  },
  compute: (values) => {
    const size = num(values, "size", 10);
    const cause = str(values, "cause", "interest");
    const effects: Record<string, { d: number; s: number; note: string }> = {
      interest: {
        d: size,
        s: 0,
        note: "Higher US interest rates attract foreign investors, who need dollars to buy US assets — demand for dollars rises.",
      },
      income: {
        d: 0,
        s: size,
        note: "Higher US income raises imports; Americans supply dollars to buy foreign currency — supply of dollars rises.",
      },
      tastes: {
        d: size,
        s: 0,
        note: "Stronger foreign taste for US exports means foreigners need more dollars — demand rises.",
      },
      returns: {
        d: size,
        s: 0,
        note: "Expecting the dollar to strengthen, investors buy it now — demand rises.",
      },
      inflation: {
        d: -size,
        s: size * 0.5,
        note: "US inflation makes US goods pricier; export demand falls and imports rise — the dollar weakens from both sides.",
      },
    };
    const effect = effects[cause];
    const { market, scene } = forexScenes(effect.d, effect.s);
    const move = market.equilibrium.y - market.originalEquilibrium.y;
    return {
      scenes: [scene],
      explanation: `${effect.note} The dollar ${move > 0.2 ? "appreciates" : move < -0.2 ? "depreciates" : "is roughly unchanged"} (e = ${round1(market.equilibrium.y)}).`,
      readouts: [
        { label: "Exchange rate", value: round1(market.equilibrium.y) },
        {
          label: "Dollar",
          value:
            move > 0.2
              ? "appreciated"
              : move < -0.2
                ? "depreciated"
                : "unchanged",
        },
      ],
    };
  },
};

const currencyEffectsDefinition: GraphDefinition = {
  id: "appreciation-and-depreciation",
  course: "ap-macro",
  category: "International Economics",
  title: "Currency Appreciation and Depreciation",
  description:
    "A stronger or weaker currency feeds straight through exports and imports into aggregate demand.",
  controls: [
    {
      kind: "slider",
      id: "change",
      label: "Demand for the currency",
      min: -15,
      max: 15,
      step: 1,
      defaultValue: 10,
    },
  ],
  details: {
    examTip:
      "Appreciation → exports fall, imports rise → net exports fall → AD shifts left. Depreciation reverses every arrow.",
  },
  compute: (values) => {
    const change = num(values, "change", 10);
    const { market, scene } = forexScenes(change, 0, "Foreign exchange market");
    const appreciated = change > 0;
    const adas = adAsScene({
      adShift: -change * 0.8,
      caption: "AD–AS",
    });
    return {
      scenes: [scene, adas.scene],
      explanation:
        change === 0
          ? "No change in the currency market — net exports and AD are undisturbed."
          : `The dollar ${appreciated ? "appreciates" : "depreciates"} to e = ${round1(market.equilibrium.y)}. US goods become ${appreciated ? "more" : "less"} expensive abroad, so exports ${appreciated ? "fall" : "rise"} and imports ${appreciated ? "rise" : "fall"}. Net exports ${appreciated ? "fall" : "rise"} and AD shifts ${appreciated ? "left" : "right"}.`,
      readouts: [
        { label: "Exchange rate", value: round1(market.equilibrium.y) },
        {
          label: "Net exports",
          value: appreciated ? "↓" : change < 0 ? "↑" : "—",
        },
        { label: "Real GDP", value: round1(adas.output) },
      ],
    };
  },
};

const balanceOfPaymentsDefinition: GraphDefinition = {
  id: "balance-of-payments",
  course: "ap-macro",
  category: "International Economics",
  title: "Balance of Payments",
  description:
    "The current account and the capital/financial account are two sides of one ledger.",
  hideStandardToggles: true,
  controls: [
    {
      kind: "slider",
      id: "exports",
      label: "Exports of goods & services",
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 60,
    },
    {
      kind: "slider",
      id: "imports",
      label: "Imports of goods & services",
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 80,
    },
    {
      kind: "slider",
      id: "netIncome",
      label: "Net income & transfers",
      min: -30,
      max: 30,
      step: 5,
      defaultValue: 0,
    },
  ],
  details: {
    interpretation:
      "A current-account deficit is financed by a capital/financial-account surplus of the same size — foreigners end up holding domestic assets.",
    mistake:
      "A trade deficit is not money 'lost' — every dollar spent abroad returns as foreign investment in domestic assets.",
  },
  custom: "balance-of-payments",
};

const lfForexLinkDefinition: GraphDefinition = {
  id: "loanable-funds-and-foreign-exchange",
  course: "ap-macro",
  category: "International Economics",
  title: "Loanable Funds and Foreign Exchange",
  description:
    "Higher domestic interest rates pull in foreign capital — and the currency appreciates.",
  controls: [
    {
      kind: "slider",
      id: "rateShock",
      label: "Domestic borrowing (raises r)",
      min: 0,
      max: 18,
      step: 1,
      defaultValue: 10,
    },
  ],
  details: {
    interpretation:
      "The chain: r rises → foreign capital flows in → demand for the currency rises → appreciation → net exports fall.",
    examTip:
      "This is the international leg of crowding out: the appreciation crowds out net exports on top of investment.",
  },
  compute: (values) => {
    const shock = num(values, "rateShock", 10);
    const lf = loanableFundsScene(shock, 0, "Loanable funds market");
    const { market, scene } = forexScenes(
      shock * 0.9,
      0,
      "Foreign exchange market",
    );
    return {
      scenes: [lf.scene, scene],
      explanation:
        shock === 0
          ? "No shock: both markets rest at their initial equilibria."
          : `Extra borrowing pushes the real interest rate up to ${round1(lf.rate)}. Foreign investors, chasing that return, buy the currency: demand for it rises and it appreciates to e = ${round1(market.equilibrium.y)}. The stronger currency then squeezes net exports.`,
      readouts: [
        { label: "Real rate", value: round1(lf.rate) },
        { label: "Exchange rate", value: round1(market.equilibrium.y) },
        { label: "Net exports", value: shock > 0 ? "↓" : "—" },
      ],
    };
  },
};

export const macroGraphDefinitions: GraphDefinition[] = [
  businessCycleDefinition,
  circularFlowDefinition,
  phillipsDataViewDefinition,
  adAsDefinition,
  demandPullDefinition,
  costPushDefinition,
  gapPolicyDefinition("recessionary"),
  gapPolicyDefinition("inflationary"),
  longRunAdjustmentDefinition,
  fiscalDefinition("expansionary"),
  fiscalDefinition("contractionary"),
  multiplierDefinition,
  crowdingOutDefinition,
  moneyMarketDefinition,
  monetaryPolicyDefinition("expansionary"),
  monetaryPolicyDefinition("contractionary"),
  reserveMarketDefinition,
  transmissionDefinition,
  loanableFundsDefinition,
  bondPricesDefinition,
  moneyCreationDefinition,
  ppcGrowthDefinition,
  lrasGrowthDefinition,
  aggregateProductionFunctionDefinition,
  phillipsDefinition,
  adasPhillipsDefinition,
  forexDefinition,
  currencyEffectsDefinition,
  balanceOfPaymentsDefinition,
  lfForexLinkDefinition,
];

export const macroCategories = [
  "Economic Indicators",
  "Aggregate Demand and Aggregate Supply",
  "Fiscal Policy",
  "Monetary Policy",
  "Financial Markets",
  "Long-Run Growth",
  "Inflation and Unemployment",
  "International Economics",
];
