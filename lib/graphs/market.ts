import {
  intersect,
  linePoints,
  round1,
  type SceneCurve,
  type SceneGuide,
  type ScenePoint,
  type SceneRegion,
  type XY,
} from "./engine";

/**
 * Linear market model on a 100x100 plot.
 * Demand: P = dIntercept - dSlope * Q, Supply: P = sIntercept + sSlope * Q.
 * Horizontal shifts move the curve right (+) or left (-) in quantity units.
 */
export type MarketParams = {
  dIntercept?: number;
  dSlope?: number;
  sIntercept?: number;
  sSlope?: number;
  dShift?: number;
  sShift?: number;
  xMax?: number;
  yMax?: number;
  xLabel?: string;
  yLabel?: string;
  demandLabel?: string;
  supplyLabel?: string;
};

export type MarketModel = {
  xMax: number;
  yMax: number;
  xLabel: string;
  yLabel: string;
  /** Effective intercepts after shifts. */
  dA: number;
  dB: number;
  sA: number;
  sB: number;
  /** Original (pre-shift) intercepts. */
  dA0: number;
  sA0: number;
  demandLabel: string;
  supplyLabel: string;
  equilibrium: XY;
  originalEquilibrium: XY;
  demandAt: (q: number) => number;
  supplyAt: (q: number) => number;
  qDemandedAt: (p: number) => number;
  qSuppliedAt: (p: number) => number;
};

const DEFAULTS = {
  dIntercept: 80,
  dSlope: 0.75,
  sIntercept: 10,
  sSlope: 0.75,
};

export function createMarket(params: MarketParams = {}): MarketModel {
  const xMax = params.xMax ?? 100;
  const yMax = params.yMax ?? 100;
  const dSlope = params.dSlope ?? DEFAULTS.dSlope;
  const sSlope = params.sSlope ?? DEFAULTS.sSlope;
  const dA0 = params.dIntercept ?? DEFAULTS.dIntercept;
  const sA0 = params.sIntercept ?? DEFAULTS.sIntercept;
  const dA = dA0 + dSlope * (params.dShift ?? 0);
  const sA = sA0 - sSlope * (params.sShift ?? 0);

  const equilibrium = intersect(dA, -dSlope, sA, sSlope) ?? { x: 50, y: 50 };
  const originalEquilibrium = intersect(dA0, -dSlope, sA0, sSlope) ?? {
    x: 50,
    y: 50,
  };

  return {
    xMax,
    yMax,
    xLabel: params.xLabel ?? "Quantity",
    yLabel: params.yLabel ?? "Price",
    dA,
    dB: dSlope,
    sA,
    sB: sSlope,
    dA0,
    sA0,
    demandLabel: params.demandLabel ?? "D",
    supplyLabel: params.supplyLabel ?? "S",
    equilibrium,
    originalEquilibrium,
    demandAt: (q) => dA - dSlope * q,
    supplyAt: (q) => sA + sSlope * q,
    qDemandedAt: (p) => (dSlope === 0 ? xMax : (dA - p) / dSlope),
    qSuppliedAt: (p) => (sSlope === 0 ? xMax : (p - sA) / sSlope),
  };
}

export function demandCurve(
  market: MarketModel,
  overrides: Partial<SceneCurve> = {},
): SceneCurve {
  return {
    id: "demand",
    label: market.demandLabel,
    style: "secondary",
    points: linePoints(market.dA, -market.dB, market.xMax, market.yMax),
    ...overrides,
  };
}

export function supplyCurve(
  market: MarketModel,
  overrides: Partial<SceneCurve> = {},
): SceneCurve {
  return {
    id: "supply",
    label: market.supplyLabel,
    style: "primary",
    points: linePoints(market.sA, market.sB, market.xMax, market.yMax),
    ...overrides,
  };
}

/** Dashed, muted copies of the pre-shift curves (before-state ghosts). */
export function ghostCurves(
  market: MarketModel,
  which: { demand?: boolean; supply?: boolean },
): SceneCurve[] {
  const curves: SceneCurve[] = [];
  if (which.demand && Math.abs(market.dA - market.dA0) > 1e-9) {
    curves.push({
      id: "demand-before",
      label: `${market.demandLabel}₀`,
      style: "reference",
      dashed: true,
      points: linePoints(market.dA0, -market.dB, market.xMax, market.yMax),
    });
  }
  if (which.supply && Math.abs(market.sA - market.sA0) > 1e-9) {
    curves.push({
      id: "supply-before",
      label: `${market.supplyLabel}₀`,
      style: "reference",
      dashed: true,
      points: linePoints(market.sA0, market.sB, market.xMax, market.yMax),
    });
  }
  return curves;
}

export function equilibriumMarkers(
  market: MarketModel,
  labels: { point?: string; q?: string; p?: string } = {},
): { guides: SceneGuide[]; points: ScenePoint[] } {
  const { x, y } = market.equilibrium;
  if (x <= 0 || x >= market.xMax || y <= 0 || y >= market.yMax) {
    return { guides: [], points: [] };
  }
  return {
    guides: [
      {
        id: "equilibrium-guide",
        x,
        y,
        xLabel: labels.q ?? "Q*",
        yLabel: labels.p ?? "P*",
      },
    ],
    points: [{ id: "equilibrium", x, y, label: labels.point ?? "E" }],
  };
}

/** Consumer surplus triangle above price, below demand, up to quantity q. */
export function csRegion(
  market: MarketModel,
  price: number,
  q: number,
  label = "CS",
): SceneRegion {
  return {
    id: "cs",
    label,
    fill: "cs",
    points: [
      { x: 0, y: price },
      { x: 0, y: Math.min(market.dA, market.yMax) },
      { x: q, y: market.demandAt(q) },
      { x: q, y: price },
    ],
  };
}

/** Producer surplus region below price, above supply, up to quantity q. */
export function psRegion(
  market: MarketModel,
  price: number,
  q: number,
  label = "PS",
): SceneRegion {
  return {
    id: "ps",
    label,
    fill: "ps",
    points: [
      { x: 0, y: price },
      { x: q, y: price },
      { x: q, y: market.supplyAt(q) },
      { x: 0, y: Math.max(market.sA, 0) },
    ],
  };
}

export function fmtQty(value: number): string {
  return round1(Math.max(value, 0));
}
