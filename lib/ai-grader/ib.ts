import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ibGradingProfile, markBand } from "./ib-profile";
import { ibTopicData } from "@/lib/ib-paper-one/topic-data";
import type { GradingProvider, GradeResult } from "./types";
import { submissionSchema, feedbackSchema } from "./types";

export async function gradeIbSubmission(topic: string, raw: unknown, provider: GradingProvider): Promise<GradeResult> {
  const submission = submissionSchema.parse(raw);
  // Resolve only known topic identifiers, never a client-controlled file path or rubric.
  if (!Object.hasOwn(ibTopicData, topic)) throw new Error("Question not found");
  const question = ibTopicData[topic].questions.find(q => q.id === submission.questionId);
  if (!question) throw new Error("Question not found");
  const guide = JSON.parse(await readFile(path.join(process.cwd(), "lib/ib-paper-one/grading-guides", `${topic}.json`), "utf8"));
  const specific = guide.questions.find((q: { id: number }) => q.id === question.id);
  if (!specific?.answerReferences?.a || !specific?.answerReferences?.b || !guide.generalGuidance || !guide.source?.teacherSha256) throw new Error("Marking guide unavailable");
  const feedback = feedbackSchema.parse(await provider.grade({
    question: { a: question.a.prompt, b: question.b.prompt, level: question.level, topic: ibTopicData[topic].number },
    guidance: guide.generalGuidance,
    answerReferences: specific.answerReferences,
    answers: { a: submission.a, b: submission.b },
  }));
  for (const part of ["a", "b"] as const) {
    // Prevent fabricated quotations from being presented as student evidence.
    if (feedback[part].evidence.some(quote => !submission[part].includes(quote))) throw new Error("Feedback contains unsupported student evidence");
  }
  return { ...feedback, total: feedback.a.marks + feedback.b.marks, maximum: 25, assessedAt: new Date().toISOString(), rubric: {
    version: ibGradingProfile.version, topic, questionId: question.id,
    teacherSource: guide.source.teacherFile, teacherSha256: guide.source.teacherSha256,
    bands: { a: markBand("a", feedback.a.marks), b: markBand("b", feedback.b.marks) },
  } };
}
