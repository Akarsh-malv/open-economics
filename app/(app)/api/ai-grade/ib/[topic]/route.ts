import { ibTopicData } from "@/lib/ib-paper-one/topic-data";
import { submissionSchema } from "@/lib/ai-grader/types";
import { gradeIbSubmission } from "@/lib/ai-grader/ib";
import { OpenAIGradingProvider, GradingUnavailableError } from "@/lib/ai-grader/openai";
import { reserveGrade } from "@/lib/ai-grader/limits";
export const runtime = "nodejs";
export const maxDuration = 60;
const headers = { "Cache-Control": "no-store" };
const error = (message: string, status: number) => Response.json({ error: message }, { status, headers });
export async function POST(request: Request, { params }: { params: Promise<{ topic: string }> }) {
  // Intentionally local/development only until shared authentication and quotas are deployed.
  if (process.env.NODE_ENV === "production") return error("The AI grader is not enabled on this deployment.", 503);
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return error("Submit your response from the website.", 403);
  if (!process.env.OPENAI_API_KEY) return error("The AI grader is not configured yet. Your draft is saved on this device.", 503);
  if (!request.headers.get("content-type")?.includes("application/json")) return error("Send a valid response.", 415);
  const { topic } = await params;
  if (!Object.hasOwn(ibTopicData, topic)) return error("Topic not found.", 404);
  let raw: unknown;
  try {
    // Enforce the byte limit while reading, even without a Content-Length header.
    const reader = request.body?.getReader();
    if (!reader) return error("Write your response before submitting.", 400);
    let size = 0; const chunks: Uint8Array[] = [];
    while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.byteLength; if (size > 180000) { await reader.cancel(); return error("Your response is too long.", 413); } chunks.push(chunk.value); }
    raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return error("Send a valid response.", 400); }
  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) return error("Complete both parts, with no more than 20,000 characters per part.", 400);
  if (!ibTopicData[topic].questions.some(q => q.id === parsed.data.questionId)) return error("Question not found.", 404);
  // Local browser prototype: use one shared bucket; do not trust spoofable forwarding headers.
  const release = reserveGrade("local-prototype");
  if (!release) return error("The grader is busy or the hourly limit has been reached. Please try again later.", 429);
  try { return Response.json(await gradeIbSubmission(topic, parsed.data, new OpenAIGradingProvider()), { headers }); }
  catch (cause) { return error(cause instanceof GradingUnavailableError ? cause.message : "Grading is temporarily unavailable. Your draft is safe; please try again.", 503); }
  finally { release(); }
}
