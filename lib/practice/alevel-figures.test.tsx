import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GraphCanvas } from "@/components/graphs/graph-canvas";
import { QuestionText } from "@/components/practice/question-text";
import { formatPrompt } from "./prompt-format";
import { alevelTopicImports } from "./alevel-topic-imports";
import type { PracticeQuestion } from "./types";

describe("every A-level published question and figure renders", () => {
  it.each(Object.keys(alevelTopicImports))("validates $0 figure coverage and rendering", async (slug) => {
    const bank = (await alevelTopicImports[slug as keyof typeof alevelTopicImports]()).default as PracticeQuestion[];
    for (const question of bank) {
      expect(question.prompt).not.toMatch(/previous question|preceding question|earlier question/i);
      expect(question.options.map(o => o.text).join(" ")).not.toMatch(/; this (?:confuses|ignores|treats|assumes|makes)/i);
      const blocks = formatPrompt(question.prompt);
      const tableLines = question.prompt.split(/\r?\n/).filter(line => line.trim().startsWith("|"));
      if (tableLines.length >= 2) expect(blocks.some(block => block.kind === "table"), `${slug}/${question.id}: data table not rendered`).toBe(true);
      if (/\b(?:table|row)\b/i.test(question.prompt) && question.options.every(o => /^[A-D]$/.test(o.text)))
        expect(blocks.some(block => block.kind === "table"), `${slug}/${question.id}: row choices without data`).toBe(true);
      expect(renderToStaticMarkup(<QuestionText text={question.prompt} />)).not.toContain("undefined");
      if (!question.graphRequired) continue;
      expect(question.graphScenes?.length).toBeGreaterThan(0);
      const symbolPattern = /\b(?:P[emsw0-9]|Q[emsw0-9]|E[0-9]|B[0-9]|U[0-9]|IC[0-9]|AD[0-9]|SRAS[0-9]|LRAS[0-9]|D[0-9]|S[0-9])\b/g;
      const referenced = new Set((question.prompt + " " + question.options.map(o => o.text).join(" ")).match(symbolPattern) ?? []);
      const rendered = new Set(JSON.stringify(question.graphScenes).match(symbolPattern) ?? []);
      for (const symbol of referenced) expect(rendered.has(symbol), `${slug}/${question.id}: missing figure symbol ${symbol}`).toBe(true);
      for (const [index, scene] of (question.graphScenes ?? []).entries()) {
        if (!scene.diagram) { expect(scene.xLabel.trim()).not.toBe(""); expect(scene.yLabel.trim()).not.toBe(""); }
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
});
