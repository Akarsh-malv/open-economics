import { describe, expect, it } from "vitest";
import { allGraphDefinitions, getGraphDefinition } from "@/lib/graphs";
import {
  type ControlValues,
  defaultControlValues,
  type GraphDefinition,
  type Scene,
} from "@/lib/graphs/engine";
import { createMarket } from "@/lib/graphs/market";

/**
 * Some sliders are intentionally inert unless a companion control enables
 * them; the sweep runs with these overrides so every slider is live.
 */
const sweepOverrides: Record<string, ControlValues> = {
  "consumer-producer-surplus": { atEq: false },
  "recessionary-gap": { response: "fiscal" },
  "inflationary-gap": { response: "fiscal" },
};

function baseValues(definition: GraphDefinition): ControlValues {
  const values = defaultControlValues(definition);
  for (const control of definition.controls) {
    if (control.kind === "toggle") values[control.id] = true;
  }
  Object.assign(values, sweepOverrides[definition.id]);
  return values;
}

function fingerprint(
  definition: GraphDefinition,
  values: ControlValues,
): string {
  const computed = definition.compute?.(values);
  if (!computed) throw new Error(`${definition.id} has no compute`);
  return JSON.stringify(computed);
}

function expectSceneBounded(scene: Scene, label: string) {
  const eps = 1e-6;
  for (const curve of scene.curves) {
    for (const point of curve.points) {
      expect(
        Number.isFinite(point.x) && Number.isFinite(point.y),
        `${label}: curve "${curve.id}" has a non-finite point`,
      ).toBe(true);
    }
  }
  for (const point of scene.points ?? []) {
    expect(
      point.x >= -eps &&
        point.x <= scene.xMax + eps &&
        point.y >= -eps &&
        point.y <= scene.yMax + eps,
      `${label}: point "${point.id}" (${point.x}, ${point.y}) is outside the plot [0..${scene.xMax}] x [0..${scene.yMax}]`,
    ).toBe(true);
  }
  for (const guide of scene.guides ?? []) {
    expect(
      guide.x >= -eps &&
        guide.x <= scene.xMax + eps &&
        guide.y >= -eps &&
        guide.y <= scene.yMax + eps,
      `${label}: guide "${guide.id}" (${guide.x}, ${guide.y}) is outside the plot [0..${scene.xMax}] x [0..${scene.yMax}]`,
    ).toBe(true);
  }
}

const sceneDefinitions = allGraphDefinitions.filter(
  (definition) => definition.compute,
);

function readout(
  definition: GraphDefinition,
  values: ControlValues,
  label: string,
): string {
  const computed = definition.compute?.(values);
  const entry = computed?.readouts?.find((item) => item.label === label);
  if (!entry) throw new Error(`${definition.id}: no readout "${label}"`);
  return entry.value;
}

function mustGet(id: string): GraphDefinition {
  const definition = getGraphDefinition(id);
  if (!definition) throw new Error(`missing graph definition: ${id}`);
  return definition;
}

/* ---------------------------------------------------------------- */
/* Interactivity sweep: every control must change the output          */
/* ---------------------------------------------------------------- */

describe("every slider changes the computed graph", () => {
  for (const definition of sceneDefinitions) {
    const sliders = definition.controls.filter(
      (control) => control.kind === "slider",
    );
    for (const slider of sliders) {
      it(`${definition.id} · ${slider.id}`, () => {
        const base = baseValues(definition);
        const low = fingerprint(definition, {
          ...base,
          [slider.id]: slider.min,
        });
        const high = fingerprint(definition, {
          ...base,
          [slider.id]: slider.max,
        });
        expect(low).not.toBe(high);
      });
    }
  }
});

describe("every segmented control changes the computed graph", () => {
  for (const definition of sceneDefinitions) {
    const segments = definition.controls.filter(
      (control) => control.kind === "segmented",
    );
    for (const segment of segments) {
      it(`${definition.id} · ${segment.id}`, () => {
        const base = baseValues(definition);
        const reference = fingerprint(definition, {
          ...base,
          [segment.id]: segment.defaultValue,
        });
        const anyDiffers = segment.options
          .filter((option) => option.value !== segment.defaultValue)
          .some(
            (option) =>
              fingerprint(definition, {
                ...base,
                [segment.id]: option.value,
              }) !== reference,
          );
        expect(anyDiffers).toBe(true);
      });
    }
  }
});

/* ---------------------------------------------------------------- */
/* Bounds: markers stay on the plot at every slider extreme           */
/* ---------------------------------------------------------------- */

describe("markers stay inside the plot at control extremes", () => {
  for (const definition of sceneDefinitions) {
    it(definition.id, () => {
      const base = baseValues(definition);
      const variants: ControlValues[] = [base];
      for (const control of definition.controls) {
        if (control.kind === "slider") {
          variants.push({ ...base, [control.id]: control.min });
          variants.push({ ...base, [control.id]: control.max });
        }
        if (control.kind === "segmented") {
          for (const option of control.options) {
            variants.push({ ...base, [control.id]: option.value });
          }
        }
      }
      for (const preset of definition.presets ?? []) {
        variants.push({ ...base, ...preset.values });
      }
      for (const values of variants) {
        const computed = definition.compute?.(values);
        expect(computed).toBeTruthy();
        expect(computed?.scenes.length).toBeGreaterThan(0);
        for (const scene of computed?.scenes ?? []) {
          expectSceneBounded(
            scene,
            `${definition.id} @ ${JSON.stringify(values)}`,
          );
        }
      }
    });
  }
});

/* ---------------------------------------------------------------- */
/* Model correctness: closed-form checks                              */
/* ---------------------------------------------------------------- */

describe("linear market model", () => {
  it("solves the default equilibrium exactly", () => {
    // D: P = 80 − 0.75Q, S: P = 10 + 0.75Q → Q* = 70/1.5, P* = 45.
    const market = createMarket();
    expect(market.equilibrium.x).toBeCloseTo(70 / 1.5, 6);
    expect(market.equilibrium.y).toBeCloseTo(45, 6);
  });

  it("a rightward demand shift raises both price and quantity", () => {
    const market = createMarket({ dShift: 10 });
    expect(market.equilibrium.x).toBeGreaterThan(70 / 1.5);
    expect(market.equilibrium.y).toBeGreaterThan(45);
    // Horizontal shift of exactly +10 at the old price: Q rises by 5 (split by slopes).
    expect(market.equilibrium.x).toBeCloseTo(70 / 1.5 + 5, 6);
    expect(market.equilibrium.y).toBeCloseTo(48.75, 6);
  });

  it("a rightward supply shift raises quantity and lowers price", () => {
    const market = createMarket({ sShift: 10 });
    expect(market.equilibrium.x).toBeCloseTo(70 / 1.5 + 5, 6);
    expect(market.equilibrium.y).toBeCloseTo(41.25, 6);
  });

  it("demand and supply evaluate consistently at equilibrium", () => {
    const market = createMarket({ dShift: -7, sShift: 13 });
    const { x, y } = market.equilibrium;
    expect(market.demandAt(x)).toBeCloseTo(y, 9);
    expect(market.supplyAt(x)).toBeCloseTo(y, 9);
    expect(market.qDemandedAt(y)).toBeCloseTo(x, 9);
    expect(market.qSuppliedAt(y)).toBeCloseTo(x, 9);
  });
});

describe("per-unit tax", () => {
  const definition = mustGet("per-unit-tax");
  const values = { tax: 18, dSlope: 8, sSlope: 8 };

  it("buyer and seller prices differ by exactly the tax", () => {
    // Slider 8 → slope 0.8. S+tax intercept 28: Qt = 52/1.6 = 32.5,
    // Pb = 80 − 0.8·32.5 = 54, Ps = 36 → burden 9 + 9 = 18 = tax.
    expect(readout(definition, values, "Consumer burden/unit")).toBe("9");
    expect(readout(definition, values, "Producer burden/unit")).toBe("9");
    expect(readout(definition, values, "Tax revenue")).toBe("585");
  });

  it("the more inelastic side bears more of the burden", () => {
    const inelasticDemand = { tax: 18, dSlope: 15, sSlope: 5 };
    const consumer = Number(
      readout(definition, inelasticDemand, "Consumer burden/unit"),
    );
    const producer = Number(
      readout(definition, inelasticDemand, "Producer burden/unit"),
    );
    expect(consumer).toBeGreaterThan(producer);
    expect(consumer + producer).toBeCloseTo(18, 1);
  });

  it("no tax means no wedge and no revenue", () => {
    expect(
      readout(definition, { tax: 0, dSlope: 8, sSlope: 8 }, "Tax revenue"),
    ).toBe("0");
  });
});

describe("price controls", () => {
  it("a binding ceiling creates the exact shortage", () => {
    // At Pc = 30: Qd = 66.67, Qs = 26.67 → shortage 40, traded 26.67.
    const definition = mustGet("price-ceiling");
    const values = { control: 30, welfare: true };
    expect(readout(definition, values, "Shortage")).toBe("40");
    expect(readout(definition, values, "Q transacted")).toBe("26.7");
  });

  it("a non-binding ceiling changes nothing", () => {
    const definition = mustGet("price-ceiling");
    const computed = definition.compute?.({ control: 60, welfare: true });
    expect(computed?.explanation).toContain("non-binding");
  });

  it("a binding floor creates the exact surplus", () => {
    // At Pf = 60: Qd = 26.67, Qs = 66.67 → surplus 40.
    const definition = mustGet("price-floor");
    const values = { control: 60, welfare: true };
    expect(readout(definition, values, "Surplus")).toBe("40");
    expect(readout(definition, values, "Q transacted")).toBe("26.7");
  });
});

describe("monopoly", () => {
  const definition = mustGet("monopoly");
  const values = { demand: 80, mc: 10, fc: 250, atc: true };

  it("chooses MR = MC output and prices off demand", () => {
    // Qm = 70/2.1 = 33.33, Pm = 80 − 0.8·33.33 = 53.33.
    expect(readout(definition, values, "Qm")).toBe("33.3");
    expect(readout(definition, values, "Pm")).toBe("53.3");
  });

  it("produces less than the allocatively efficient quantity", () => {
    const computed = definition.compute?.(values);
    // Qc solves 80 − 0.8Q = 10 + 0.5Q → 53.85.
    expect(computed?.explanation).toContain("53.8");
  });
});

describe("perfectly competitive firm", () => {
  const definition = mustGet("perfect-competition-firm");

  it("produces where MC = P", () => {
    // 0.42q² − 2.4q + (10 − 20) = 0 → q = 8.51; MC(8.51) ≈ 20.
    const values = { price: 20, fc: 40, productivity: 10 };
    expect(readout(definition, values, "q*")).toBe("8.5");
  });

  it("shuts down below minimum AVC and loses only fixed cost", () => {
    // min AVC = 7.43 at q = 4.29.
    const values = { price: 6, fc: 40, productivity: 10 };
    expect(readout(definition, values, "Status")).toBe("shut down");
    expect(readout(definition, values, "q*")).toBe("0");
    expect(readout(definition, values, "Profit")).toBe("-40");
  });
});

describe("AD–AS and Phillips", () => {
  it("classifies gaps correctly", () => {
    const definition = mustGet("ad-as-model");
    const gapOf = (adShift: number) =>
      readout(definition, { adShift, srasShift: 0, potential: 50 }, "Gap");
    expect(gapOf(12)).toBe("inflationary");
    expect(gapOf(-12)).toBe("recessionary");
    expect(gapOf(0)).toBe("none");
  });

  it("at zero demand pressure the economy sits at the natural rate", () => {
    const definition = mustGet("phillips-curve");
    const values = { pressure: 0, expected: 3, shock: 0, natural: 5 };
    expect(readout(definition, values, "Unemployment")).toBe("5%");
    expect(readout(definition, values, "Inflation")).toBe("3%");
  });
});

describe("fiscal and monetary policy", () => {
  it("computes the spending multiplier as 1/(1−MPC)", () => {
    const definition = mustGet("expansionary-fiscal-policy");
    const values = { tool: "spending", size: 5, mpc: 0.75 };
    expect(readout(definition, values, "Multiplier")).toBe("4");
    expect(readout(definition, values, "Total AD change")).toBe("20");
  });

  it("computes the tax multiplier as MPC/(1−MPC)", () => {
    const definition = mustGet("expansionary-fiscal-policy");
    const values = { tool: "taxes", size: 5, mpc: 0.75 };
    expect(readout(definition, values, "Multiplier")).toBe("3");
    expect(readout(definition, values, "Total AD change")).toBe("15");
  });

  it("expansionary monetary policy lowers the nominal rate", () => {
    const definition = mustGet("expansionary-monetary-policy");
    const before = Number(readout(definition, { size: 0 }, "Nominal rate"));
    const after = Number(readout(definition, { size: 10 }, "Nominal rate"));
    expect(after).toBeLessThan(before);
  });
});

describe("foreign exchange", () => {
  const definition = mustGet("foreign-exchange-market");

  it("higher US interest rates appreciate the dollar", () => {
    expect(readout(definition, { cause: "interest", size: 10 }, "Dollar")).toBe(
      "appreciated",
    );
  });

  it("higher US income depreciates the dollar (more imports)", () => {
    expect(readout(definition, { cause: "income", size: 10 }, "Dollar")).toBe(
      "depreciated",
    );
  });
});

describe("bond prices", () => {
  it("price and rate are exact inverses (perpetuity pricing)", () => {
    const definition = mustGet("bond-prices-and-interest-rates");
    expect(readout(definition, { rate: 8, coupon: 6 }, "Bond price")).toBe(
      "75",
    );
    expect(readout(definition, { rate: 12, coupon: 6 }, "Bond price")).toBe(
      "50",
    );
  });
});
