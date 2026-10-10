import "server-only";
import { topicImports } from "./topic-imports";
import type { PracticeQuestion } from "./types";

type BankQuestion = PracticeQuestion & {
  answer: string;
  explanation: string;
  reference: string;
};

async function getBank(slug: string): Promise<BankQuestion[] | null> {
  const loader = topicImports[slug as keyof typeof topicImports];
  if (!loader) return null;
  const module = await loader();
  return module.default as BankQuestion[];
}

export async function getPracticeQuestions(
  slug: string,
): Promise<PracticeQuestion[] | null> {
  const bank = await getBank(slug);
  if (!bank) return null;
  return bank.map(
    ({ id, difficulty, prompt, options, graphDescription, graphRequired }) => ({
      id,
      difficulty,
      prompt,
      options,
      graphDescription,
      graphRequired,
    }),
  );
}

export async function gradeAnswer(slug: string, id: number, selected: string) {
  const bank = await getBank(slug);
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
