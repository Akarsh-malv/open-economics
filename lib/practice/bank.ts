import "server-only";
import { alevelTopicImports } from "./alevel-topic-imports";
import { microTopicImports } from "./micro-topic-imports";
import { topicImports } from "./topic-imports";
import type { PracticeQuestion } from "./types";

type BankQuestion = PracticeQuestion & {
  answer: string;
  explanation: string;
  reference: string;
};

// Published banks are immutable. Reuse the loaded bank across grading requests,
// with the course in the key so identical topic numbers never share answers.
const banks = new Map<string, Promise<BankQuestion[]>>();

async function getBank(slug: string, course = "ap-macro"): Promise<BankQuestion[] | null> {
  const imports = course === "ap-macro" ? topicImports : course === "ap-micro" ? microTopicImports : course === "a-level" ? alevelTopicImports : null;
  if (!imports) return null;
  const loader = imports[slug as keyof typeof imports];
  if (!loader) return null;
  const key = `${course}/${slug}`;
  let bank = banks.get(key);
  if (!bank) {
    bank = loader().then((module) => module.default as BankQuestion[]);
    banks.set(key, bank);
    bank.catch(() => banks.delete(key));
  }
  return bank;
}

export async function getPracticeQuestions(
  slug: string,
  course = "ap-macro",
): Promise<PracticeQuestion[] | null> {
  const bank = await getBank(slug, course);
  if (!bank) return null;
  return bank.map(
    ({ id, difficulty, prompt, options, graphDescription, graphRequired, graphScenes }) => ({
      id,
      difficulty,
      prompt,
      options,
      graphDescription,
      graphRequired,
      graphScenes,
    }),
  );
}

export async function gradeAnswer(slug: string, id: number, selected: string, course = "ap-macro") {
  const bank = await getBank(slug, course);
  const question = bank?.find((item) => item.id === id);
  if (
    !question ||
    !question.options.some((option) => option.label === selected)
  )
    return null;
  return {
    selected,
    correct: selected === question.answer,
    answer: question.answer,
    explanation: question.explanation,
    reference: question.reference,
  };
}
