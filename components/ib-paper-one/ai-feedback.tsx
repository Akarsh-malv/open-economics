"use client";
import { useEffect, useRef, useState } from "react";
import type { GradeResult } from "@/lib/ai-grader/types";
import styles from "./bank.module.css";

export function AiFeedback({ topic, questionId, a, b }: { topic: string; questionId: number; a: string; b: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [assessment, setAssessment] = useState<{ result: GradeResult; a: string; b: string } | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const edited = assessment && (assessment.a !== a || assessment.b !== b);
  async function grade() {
    if (busy) return;
    controller.current = new AbortController();
    setBusy(true); setError("");
    const submitted = { a, b };
    try {
      const response = await fetch(`/api/ai-grade/ib/${topic}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, ...submitted }), signal: controller.current.signal,
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to grade your response. Please try again.");
      setAssessment({ result: body, ...submitted });
    } catch (cause) {
      if (!(cause instanceof Error && cause.name === "AbortError")) setError(cause instanceof Error ? cause.message : "Unable to reach the grader. Please try again.");
    } finally { setBusy(false); }
  }
  return <section className={styles.aiFeedback} aria-labelledby="ai-feedback-title" aria-busy={busy}>
    <div className={styles.partHead}><h3 id="ai-feedback-title">AI feedback</h3><span>Parts (a) + (b) · 25 marks</span></div>
    <p>Get feedback on your explanation, analysis and evaluation. Submitting sends both written responses to OpenAI for assessment. Include any diagram explanation in your text; image uploads are not supported yet.</p>
    <button className={styles.gradeButton} type="button" onClick={grade} disabled={busy || !a.trim() || !b.trim() || a.length > 20000 || b.length > 20000}>{busy ? "Assessing your response…" : assessment ? "Submit again for grading" : "Submit for grading"}</button>
    {(!a.trim() || !b.trim()) && <p className={styles.storageNote}>Complete both parts to submit for grading.</p>}
    <p className={styles.storageNote}>AI feedback supports your learning and may make mistakes. It is not an official IB grade.</p>
    {error && <p role="alert" className={styles.gradeError}>{error}</p>}
    {edited && <p role="status">You’ve edited your response. Grade again to get feedback on the latest version.</p>}
    {assessment && !edited && <div className={styles.gradeResults} aria-live="polite">
      <h4>Total: {assessment.result.total} / 25</h4>{assessment.result.rubric && <p className={styles.storageNote}>Assessed against the Topic {assessment.result.rubric.topic.replace("-", ".")} teacher guide · Question {assessment.result.rubric.questionId}</p>}
      {(["a", "b"] as const).map(part => <section key={part}><h4>Part ({part}): {assessment.result[part].marks} / {part === "a" ? 10 : 15}</h4>{assessment.result.rubric && <p className={styles.storageNote}>Band {assessment.result.rubric.bands[part].range} · {assessment.result.rubric.bands[part].description}</p>}<p>{assessment.result[part].rationale}</p>
        {!!assessment.result[part].evidence?.length && <><h5>Evidence from your response</h5>{assessment.result[part].evidence.map((quote, i) => <blockquote key={i}>{quote}</blockquote>)}</>}
        <h5>Against the answer guidance</h5><p>{assessment.result[part].referenceAlignment}</p>
        {!!assessment.result[part].strengths.length && <><h5>What worked</h5><ul>{assessment.result[part].strengths.map((item, i) => <li key={i}>{item}</li>)}</ul></>}
        <h5>How to improve</h5><ul>{assessment.result[part].improvements.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </section>)}
      {!!assessment.result.reviewNotes.length && <section><h4>Points to review</h4><ul>{assessment.result.reviewNotes.map((item, i) => <li key={i}>{item}</li>)}</ul></section>}
    </div>}
  </section>;
}
