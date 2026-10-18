import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { gradeAnswer, getPracticeQuestions } from "./bank";
import { microPracticeTopics as practiceTopics } from "./topics";
import { microTopicImports as topicImports } from "./micro-topic-imports";

describe("audited Micro practice banks", () => {
  it("exposes the complete six units and 3,600 questions", () => {
    expect([...new Set(practiceTopics.map((topic) => topic.unit))]).toEqual([1, 2, 3, 4, 5, 6]);
    expect(practiceTopics.reduce((total, topic) => total + topic.count, 0)).toBe(3600);
  });

  it.each(practiceTopics)("$slug keeps answers private and grades every choice correctly", async (topic) => {
    const bank = (await topicImports[topic.slug as keyof typeof topicImports]()).default;
    const publicQuestions = await getPracticeQuestions(topic.slug, "ap-micro");
    expect(publicQuestions).toHaveLength(topic.count);
    const distribution = Object.fromEntries("ABCDE".split("").map((label) => [
      label, bank.filter((question) => question.answer === label).length,
    ]));
    expect(distribution).toEqual({ A: 20, B: 20, C: 20, D: 20, E: 20 });
    const guessingScores = [0, 0, 0, 0];
    let uniquelyLongest = 0;
    let uniquelyShortest = 0;
    for (const question of bank) {
      const lengths = question.options.map((option) => option.text.trim().split(/\s+/).length);
      [lengths, question.options.map(option => option.text.length)].forEach((sizes, metric) => {
        [Math.max(...sizes), Math.min(...sizes)].forEach((extreme, direction) => {
          if (sizes["ABCDE".indexOf(question.answer)] === extreme)
            guessingScores[metric * 2 + direction] += 1 / sizes.filter(size => size === extreme).length;
        });
      });
      const correctLength = lengths["ABCDE".indexOf(question.answer)];
      const otherLengths = lengths.filter((_, index) => index !== "ABCDE".indexOf(question.answer));
      const sorted = [...otherLengths].sort((a, b) => a - b);
      const median = (sorted[1] + sorted[2]) / 2;
      if (correctLength > Math.max(...otherLengths)) uniquelyLongest++;
      if (correctLength < Math.min(...otherLengths)) uniquelyShortest++;
      expect(Math.max(...lengths)).toBeLessThanOrEqual(40);
      expect(correctLength > 15 && correctLength >= 2 * Math.max(1, median)).toBe(false);
      expect(correctLength * 2 <= median && median > 10).toBe(false);
      expect(new Set(question.options.map((option) => option.text.toLowerCase().trim().replace(/\.$/, ""))).size).toBe(5);
      const publicQuestion = publicQuestions?.find((item) => item.id === question.id);
      expect(publicQuestion).not.toHaveProperty("answer");
      expect(publicQuestion).not.toHaveProperty("explanation");
      expect(publicQuestion?.options).toEqual(question.options);
      for (const option of question.options) {
        const result = await gradeAnswer(topic.slug, question.id, option.label, "ap-micro");
        expect(result?.correct).toBe(option.label === question.answer);
        expect(result?.answer).toBe(question.answer);
        expect(result?.explanation).toBe(question.explanation);
      }
    }
    guessingScores.forEach(score => expect(score).toBeLessThanOrEqual(topic.count * 0.35));
    expect(uniquelyLongest).toBeLessThanOrEqual(35);
    expect(uniquelyShortest).toBeLessThanOrEqual(35);
  });

  it("keeps identical topic numbers in separate courses", async () => {
    const macro = await getPracticeQuestions("2-1", "ap-macro");
    const micro = await getPracticeQuestions("2-1", "ap-micro");
    expect(macro?.[0].prompt).not.toEqual(micro?.[0].prompt);
    expect(await getPracticeQuestions("2-1", "unknown")).toBeNull();
  });

  it("rejects nonexistent topics, IDs, and answer labels", async () => {
    expect(await getPracticeQuestions("unknown", "ap-micro")).toBeNull();
    expect(await gradeAnswer("unknown", 1, "A", "ap-micro")).toBeNull();
    expect(await gradeAnswer("6-5", 101, "A", "ap-micro")).toBeNull();
    expect(await gradeAnswer("6-5", 1, "F", "ap-micro")).toBeNull();
  });
});
