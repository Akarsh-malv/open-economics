import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GraphCanvas } from "@/components/graphs/graph-canvas";
import { QuestionText } from "@/components/practice/question-text";
import { topicImports } from "./topic-imports";
import type { PracticeQuestion } from "./types";

describe("every published question and figure renders", () => {
  it.each(Object.keys(topicImports))("validates $0 figure coverage and rendering", async (slug) => {
    const bank = (await topicImports[slug as keyof typeof topicImports]()).default as PracticeQuestion[];
    for (const question of bank) {
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
              expect(coordinate.y).toBeGreaterThanOrEqual(-1e-8);
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
  it("quotes the correct currency and preserves the supplied reciprocal-rate data", async () => {
    const bank = (await topicImports["6-2"]()).default as PracticeQuestion[];
    const question = bank.find((item) => item.id === 75);
    expect(question?.graphScenes?.[0].yLabel).toBe("EUR per USD");
    expect(question?.graphScenes?.[0].curves[0].points).toEqual([{ x: 1, y: 0.75 }, { x: 2, y: 0.9 }]);
  });
});
