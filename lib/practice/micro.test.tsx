import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GraphCanvas } from "@/components/graphs/graph-canvas";
import { QuestionText } from "@/components/practice/question-text";
import { microTopicImports } from "./micro-topic-imports";
import type { PracticeQuestion } from "./types";

describe("every Micro published question and figure renders", () => {
  it.each(Object.keys(microTopicImports))("validates $0 figure coverage and rendering", async (slug) => {
    const bank = (await microTopicImports[slug as keyof typeof microTopicImports]()).default as PracticeQuestion[];
    for (const question of bank) {
      expect(question.prompt).not.toMatch(/previous question|preceding question|earlier question/i);
      expect(renderToStaticMarkup(<QuestionText text={question.prompt} />)).not.toContain("undefined");
      if (!question.graphRequired) continue;
      expect(question.graphScenes?.length).toBeGreaterThan(0);
      for (const [index, scene] of (question.graphScenes ?? []).entries()) {
        expect(scene.xLabel.trim()).not.toBe("");
        expect(scene.yLabel.trim()).not.toBe("");
        for (const elements of [scene.curves, scene.points ?? [], scene.guides ?? [], scene.annotations ?? []]) {
          expect(new Set(elements.map((element) => element.id)).size).toBe(elements.length);
          for (const element of elements) {
            const coordinates = "points" in element ? element.points : [element];
            for (const coordinate of coordinates) {
              expect(Number.isFinite(coordinate.x) && Number.isFinite(coordinate.y)).toBe(true);
              expect(coordinate.x).toBeGreaterThanOrEqual(-1e-8);
              expect(coordinate.x).toBeLessThanOrEqual(scene.xMax + 1e-8);
              expect(coordinate.y).toBeGreaterThanOrEqual((scene.yMin ?? 0) - 1e-8);
              expect(coordinate.y).toBeLessThanOrEqual(scene.yMax + 1e-8);
            }
          }
        }
        const svg = renderToStaticMarkup(<GraphCanvas scene={scene} graphId={`${slug}-${question.id}-${index}`} />);
        expect(svg).toContain('role="img"');
        expect(svg).not.toMatch(/NaN|Infinity|undefined/);
      }
    }
  });
  it("preserves payoff cells as a semantic table", async () => {
    const bank = (await microTopicImports["4-5"]()).default;
    const html = renderToStaticMarkup(<QuestionText text={bank[10].prompt} />);
    expect(html).toContain('scope="col"');
    expect(html).toContain("80, 80");
    expect(html).toContain("20, 120");
  });
  it("draws the stated supply percentage changes accurately", async () => {
    const bank = (await microTopicImports["2-4"]()).default;
    for (const [id, quantityChange, priceChange] of [[24, 0.2, 0.1], [98, 0.08, 0.2]]) {
      const points = bank[id - 1].graphScenes?.[0].points ?? [];
      const a = points.find(point => point.label === "A")!;
      const b = points.find(point => point.label === "B")!;
      expect((b.x - a.x) / a.x).toBeCloseTo(quantityChange);
      expect((b.y - a.y) / a.y).toBeCloseTo(priceChange);
    }
  });
  it("removes deadweight loss from the perfect-discrimination panel", async () => {
    const bank = (await microTopicImports["4-3"]()).default;
    const scenes = bank[11].graphScenes!;
    expect(scenes[0].regions.some(region => region.fill === "dwl")).toBe(true);
    expect(scenes[1].regions.some(region => region.fill === "dwl")).toBe(false);
    expect(scenes[1].regions.some(region => region.fill === "ps")).toBe(true);
    expect(scenes[1].guides.some(guide => guide.xLabel === "Qpd")).toBe(true);
    expect(scenes[1].curves.some(curve => curve.label === "D = MR")).toBe(true);
    expect(scenes[1].curves.some(curve => curve.label === "MR")).toBe(false);
  });
  it("pays the monopsony supply wage below marginal factor cost", async () => {
    const bank = (await microTopicImports["5-4"]()).default;
    const points = bank[8].graphScenes![0].points;
    const hiring = points[0];
    const wage = points[1];
    expect(hiring.y).toBeCloseTo(50 - 4 * hiring.x); // MRP
    expect(hiring.y).toBeCloseTo(10 + 4 * hiring.x); // MFC
    expect(wage.x).toBe(hiring.x);
    expect(wage.y).toBeCloseTo(10 + 2 * wage.x); // Labor supply
    expect(wage.y).toBeLessThan(hiring.y);
  });
});
