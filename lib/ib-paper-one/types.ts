export type IbQuestion = {
  id: number;
  level: string;
  difficulty: string;
  a: { prompt: string; marks: number };
  b: { prompt: string; marks: number };
};
export type IbTopic = {
  number: string;
  title: string;
  count: number;
  questions: IbQuestion[];
};
