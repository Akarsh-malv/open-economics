export type Difficulty = "Easy" | "Medium" | "Hard";
export type PracticeQuestion = {
  id: number;
  difficulty: Difficulty;
  prompt: string;
  options: { label: string; text: string }[];
  graphDescription: string;
  graphRequired: boolean;
};
export type AnswerResult = {
  selected: string;
  correct: boolean;
  answer: string;
  explanation: string;
  reference: string;
};
