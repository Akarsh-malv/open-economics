import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { gradeAnswer, getPracticeQuestions } from "./bank";
import { alevelPracticeTopics as practiceTopics } from "./topics";
import { alevelTopicImports as topicImports } from "./alevel-topic-imports";

describe("audited A-level practice banks", () => {
  it("exposes the complete eleven units and 5,300 questions", () => {
    expect([...new Set(practiceTopics.map((topic) => topic.unit))]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(practiceTopics.reduce((total, topic) => total + topic.count, 0)).toBe(5300);
  });

  it.each(practiceTopics)("$slug keeps answers private and grades every choice correctly", async (topic) => {
    const bank = (await topicImports[topic.slug as keyof typeof topicImports]()).default;
    const publicQuestions = await getPracticeQuestions(topic.slug, "a-level");
    expect(publicQuestions).toHaveLength(topic.count);
    const distribution = Object.fromEntries("ABCD".split("").map((label) => [
      label, bank.filter((question) => question.answer === label).length,
    ]));
    expect(distribution).toEqual({ A: 25, B: 25, C: 25, D: 25 });
    const guessingScores = [0, 0, 0, 0];
    let uniquelyLongest = 0;
    let uniquelyShortest = 0;
    for (const question of bank) {
      const lengths = question.options.map((option) => option.text.trim().split(/\s+/).length);
      [lengths, question.options.map(option => option.text.length)].forEach((sizes, metric) => {
        [Math.max(...sizes), Math.min(...sizes)].forEach((extreme, direction) => {
          if (sizes["ABCD".indexOf(question.answer)] === extreme)
            guessingScores[metric * 2 + direction] += 1 / sizes.filter(size => size === extreme).length;
        });
      });
      const correctLength = lengths["ABCD".indexOf(question.answer)];
      const otherLengths = lengths.filter((_, index) => index !== "ABCD".indexOf(question.answer));
      const sorted = [...otherLengths].sort((a, b) => a - b);
      const median = sorted[1];
      if (correctLength > Math.max(...otherLengths)) uniquelyLongest++;
      if (correctLength < Math.min(...otherLengths)) uniquelyShortest++;
      expect(Math.max(...lengths)).toBeLessThanOrEqual(40);
      expect(correctLength > 15 && correctLength >= 2 * Math.max(1, median)).toBe(false);
      expect(correctLength * 2 <= median && median > 10).toBe(false);
      expect(new Set(question.options.map((option) => option.text.toLowerCase().trim().replace(/\.$/, ""))).size).toBe(4);
      const publicQuestion = publicQuestions?.find((item) => item.id === question.id);
      expect(publicQuestion).not.toHaveProperty("answer");
      expect(publicQuestion).not.toHaveProperty("explanation");
      expect(publicQuestion?.options).toEqual(question.options);
      for (const option of question.options) {
        const result = await gradeAnswer(topic.slug, question.id, option.label, "a-level");
        expect(result?.correct).toBe(option.label === question.answer);
        expect(result?.answer).toBe(question.answer);
        expect(result?.explanation).toBe(question.explanation);
      }
    }
    // The requested longest-choice ceiling is 15%; keep the separate
    // shortest-choice gate to catch a reverse cue introduced by rewriting.
    guessingScores.forEach((score, index) =>
      expect(score).toBeLessThanOrEqual(topic.count * (index % 2 === 0 ? 0.15 : 0.35) + 1e-8));
    expect(uniquelyLongest).toBeLessThanOrEqual(15);
    expect(uniquelyShortest).toBeLessThanOrEqual(35);
  });

  it("keeps identical topic numbers in separate courses", async () => {
    const macro = await getPracticeQuestions("2-1", "ap-macro");
    const micro = await getPracticeQuestions("2-1", "a-level");
    expect(macro?.[0].prompt).not.toEqual(micro?.[0].prompt);
    expect(await getPracticeQuestions("2-1", "unknown")).toBeNull();
  });

  it("rejects nonexistent topics, IDs, and answer labels", async () => {
    expect(await getPracticeQuestions("unknown", "a-level")).toBeNull();
    expect(await gradeAnswer("unknown", 1, "A", "a-level")).toBeNull();
    expect(await gradeAnswer("6-5", 101, "A", "a-level")).toBeNull();
    expect(await gradeAnswer("6-5", 1, "F", "a-level")).toBeNull();
  });
});
