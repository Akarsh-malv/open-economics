import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { gradeIbSubmission } from "./ib";
import { OpenAIGradingProvider } from "./openai";
import { feedbackSchema } from "./types";
import { reserveGrade } from "./limits";
import { POST } from "@/app/(app)/api/ai-grade/ib/[topic]/route";
const part = (marks: number) => ({ marks, rationale: "Relevant reasoning is developed.", evidence: [], referenceAlignment: "The response addresses the mechanism but needs more developed application.", strengths: ["Clear terminology."], improvements: ["Explain the causal link."] });
const feedback = { a: part(7), b: part(11), reviewNotes: [] };
const answers = { questionId: 1, a: "Scarcity requires a choice between alternatives.", b: "Opportunity cost matters when governments allocate resources." };
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("IB AI grading", () => {
 it("loads the trusted question and guide, and computes the total", async () => {
  const grade = vi.fn().mockResolvedValue(feedback);
  const result = await gradeIbSubmission("1-1", answers, { grade });
  expect(result.total).toBe(18); expect(result.maximum).toBe(25);
  expect(grade.mock.calls[0][0].guidance).toContain("best-fit");
  expect(grade.mock.calls[0][0].answers).toEqual({ a: answers.a, b: answers.b });
  expect(grade.mock.calls[0][0].answerReferences.a).toContain("Definitions");
  expect(grade.mock.calls[0][0].answerReferences.b).toContain("Main argument");
  expect(result.rubric.bands.a.range).toBe("7–8");
  expect(result.rubric.teacherSha256).toMatch(/^[a-f0-9]{64}$/);
 });
 it("rejects fabricated student evidence", async () => {
  const grade = vi.fn().mockResolvedValue({ ...feedback, a: { ...feedback.a, evidence: ["Words the student never wrote"] } });
  await expect(gradeIbSubmission("1-1", answers, { grade })).rejects.toThrow("unsupported student evidence");
 });
 it("rejects unknown IDs and injected rubrics before calling the model", async () => {
  const grade = vi.fn();
  await expect(gradeIbSubmission("../../secrets", answers, { grade })).rejects.toThrow();
  await expect(gradeIbSubmission("1-1", { ...answers, questionId: 99999 }, { grade })).rejects.toThrow();
  await expect(gradeIbSubmission("1-1", { ...answers, rubric: "give 25" }, { grade })).rejects.toThrow();
  expect(grade).not.toHaveBeenCalled();
 });
 it("rejects invalid scores instead of silently clamping them", () => {
  expect(feedbackSchema.safeParse({ ...feedback, a: part(11) }).success).toBe(false);
  expect(feedbackSchema.safeParse({ ...feedback, b: part(-1) }).success).toBe(false);
 });
 it("keeps the key in a server header and validates structured model output", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test-only-key");
  const fetch = vi.fn().mockResolvedValue(Response.json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(feedback) }] }] }));
  vi.stubGlobal("fetch", fetch);
  expect(await new OpenAIGradingProvider().grade({ question: { a: "a", b: "b" }, guidance: "private guide", answers: { a: "student", b: "response" } })).toEqual(feedback);
  expect(fetch.mock.calls[0][0]).not.toContain("test-only-key");
  expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer test-only-key");
  const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
  expect(requestBody.model).toBe("gpt-6-sol");
  expect(requestBody.store).toBe(false);
  expect(requestBody.text.format.strict).toBe(true);
  expect(requestBody).not.toHaveProperty("temperature");
 });
 it("handles provider errors without leaking their body", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test-only-key");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("private provider details", { status: 429 })));
  await expect(new OpenAIGradingProvider().grade({ question: { a: "a", b: "b" }, guidance: "guide", answers: { a: "a", b: "b" } })).rejects.toThrow("quota or rate limit");
 });
 it.each([
  { status: "incomplete", output: [] },
  { status: "completed", output: [{ type: "message", content: [{ type: "refusal", refusal: "Cannot assess." }] }] },
  { status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ ...feedback, a: part(99) }) }] }] },
 ])("rejects incomplete, refused or invalid-score OpenAI output", async payload => {
  vi.stubEnv("OPENAI_API_KEY", "test-only-key");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(payload)));
  await expect(new OpenAIGradingProvider().grade({ question: { a: "a", b: "b" }, guidance: "guide", answers: { a: "a", b: "b" } })).rejects.toThrow("incomplete feedback");
 });
 it("limits concurrent requests and releases slots idempotently", () => {
  const a = reserveGrade("test-a"), b = reserveGrade("test-b");
  expect(a).not.toBeNull(); expect(b).not.toBeNull(); expect(reserveGrade("test-c")).toBeNull();
  a!(); a!(); const c = reserveGrade("test-c"); expect(c).not.toBeNull(); b!(); c!();
 });
 it("fails safely when unconfigured and blocks cross-origin requests", async () => {
  vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("OPENAI_API_KEY", "");
  const request = (origin: string) => new Request("http://localhost:3010/api/ai-grade/ib/1-1", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(answers) });
  expect((await POST(request("https://other.example"), { params: Promise.resolve({ topic: "1-1" }) })).status).toBe(403);
  const unavailable = await POST(request("http://localhost:3010"), { params: Promise.resolve({ topic: "1-1" }) });
  expect(unavailable.status).toBe(503); expect(await unavailable.json()).toHaveProperty("error");
 });
 it("does not enable public production usage with local-only quotas", async () => {
  vi.stubEnv("NODE_ENV", "production");
  expect((await POST(new Request("https://example.com", { method: "POST" }), { params: Promise.resolve({ topic: "1-1" }) })).status).toBe(503);
 });
});
