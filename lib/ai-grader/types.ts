import { z } from "zod";

export const submissionSchema = z.object({
  questionId: z.number().int().positive(),
  a: z.string().trim().min(1, "Write a response for part (a).").max(20000),
  b: z.string().trim().min(1, "Write a response for part (b).").max(20000),
}).strict();
const feedbackPart = (maximum: number) => z.object({
  marks: z.number().int().min(0).max(maximum),
  rationale: z.string().min(1).max(3000),
  evidence: z.array(z.string().min(1).max(500)).max(3),
  referenceAlignment: z.string().min(1).max(1500),
  strengths: z.array(z.string().min(1).max(1000)).max(5),
  improvements: z.array(z.string().min(1).max(1000)).min(1).max(5),
});
export const feedbackSchema = z.object({
  a: feedbackPart(10),
  b: feedbackPart(15),
  reviewNotes: z.array(z.string().min(1).max(1000)).max(5),
});
export type GradingFeedback = z.infer<typeof feedbackSchema>;
export type GradeResult = GradingFeedback & { total: number; maximum: 25; assessedAt: string; rubric: {
  version: string; topic: string; questionId: number; teacherSource: string; teacherSha256: string;
  bands: Record<"a" | "b", { range: string; description: string }>;
} };
export type GradingInput = { question: { a: string; b: string; level?: string; topic?: string }; guidance: string; answerReferences?: { a: string; b: string }; answers: { a: string; b: string } };
export interface GradingProvider { grade(input: GradingInput): Promise<GradingFeedback> }
