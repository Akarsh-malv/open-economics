import { describe, expect, it, vi } from "vitest";
import { readFile } from "node:fs/promises";
vi.mock("server-only", () => ({}));
import { ibGradingProfile, markBand } from "./ib-profile";
import manifest from "@/lib/ib-paper-one/manifest.json";
import { ibTopicData } from "@/lib/ib-paper-one/topic-data";

describe("IB teacher-reference configuration", () => {
 it("has exactly one band for every attainable mark, with 10 + 15 maxima", () => {
  for (const [part, maximum] of [["a", 10], ["b", 15]] as const) {
   expect(ibGradingProfile.parts[part].maximum).toBe(maximum);
   for (let mark = 0; mark <= maximum; mark++) {
    expect(ibGradingProfile.parts[part].bands.filter(b => mark >= b.minimum && mark <= b.maximum)).toHaveLength(1);
    expect(markBand(part, mark).description).toBeTruthy();
   }
  }
 });
 it("matches all 1,290 question pairs to separate teacher references and source hashes", async () => {
  let count = 0;
  for (const topic of manifest) {
   const guide = JSON.parse(await readFile(`lib/ib-paper-one/grading-guides/${topic.slug}.json`, "utf8"));
   expect(guide.source.teacherSha256).toMatch(/^[a-f0-9]{64}$/);
   expect(guide.source.studentSha256).toMatch(/^[a-f0-9]{64}$/);
   expect(guide.questions.map((q: { id: number }) => q.id)).toEqual(ibTopicData[topic.slug].questions.map(q => q.id));
   for (const reference of guide.questions) {
    expect(reference.answerReferences.a.length).toBeGreaterThan(50);
    expect(reference.answerReferences.b.length).toBeGreaterThan(50);
    expect(reference.text).toContain(reference.answerReferences.a);
    expect(reference.text).toContain(reference.answerReferences.b);
    count++;
   }
  }
  expect(count).toBe(1290);
 });
});
