"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { IbTopic } from "@/lib/ib-paper-one/types";
import styles from "./bank.module.css";
import { AiFeedback } from "./ai-feedback";

type Draft = { a: string; b: string };
type Drafts = Record<number, Draft>;

export function IbPaperOneBank({ topic, slug }: { topic: IbTopic; slug: string }) {
  const [level, setLevel] = useState<"All" | "SL/HL" | "HL">("All");
  const [number, setNumber] = useState(1);
  const [drafts, setDrafts] = useState<Drafts>({});
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [savedAt, setSavedAt] = useState("");
  const storageKey = `oe-ib-paper-one-${slug}-v1`;
  const visible = useMemo(() => topic.questions.filter(question => level === "All" || question.level === level), [topic.questions, level]);
  const current = topic.questions.find(question => question.id === number) ?? topic.questions[0];
  const currentDraft = drafts[current.id] ?? { a: "", b: "" };
  const position = visible.findIndex(question => question.id === current.id);
  const previous = visible[position - 1];
  const next = visible[position + 1];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (saved?.version === 1 && saved.drafts && typeof saved.drafts === "object") {
        const valid: Drafts = {};
        for (const question of topic.questions) {
          const draft = saved.drafts[question.id];
          if (draft && typeof draft.a === "string" && typeof draft.b === "string") {
            valid[question.id] = { a: draft.a, b: draft.b };
          }
        }
        setDrafts(valid);
        if (topic.questions.some(question => question.id === saved.currentId)) setNumber(saved.currentId);
      }
    } catch {
      setStorageAvailable(false);
    }
    const requested = Number(new URLSearchParams(window.location.search).get("q"));
    if (topic.questions.some(question => question.id === requested)) setNumber(requested);
    setLoaded(true);
  }, [storageKey, topic.questions]);

  useEffect(() => {
    if (!loaded || !storageAvailable) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ version: 1, currentId: number, drafts }));
        setSavedAt("Saved on this device");
      } catch {
        setStorageAvailable(false);
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [drafts, loaded, number, storageAvailable, storageKey]);

  function selectQuestion(id: number) {
    setNumber(id);
    window.history.replaceState(null, "", `/practice/ib/${slug}?q=${id}`);
  }
  function changeLevel(value: "All" | "SL/HL" | "HL") {
    setLevel(value);
    if (value !== "All" && current.level !== value) {
      const first = topic.questions.find(question => question.level === value);
      if (first) selectQuestion(first.id);
    }
  }
  function updateDraft(part: "a" | "b", text: string) {
    setSavedAt("Saving…");
    setDrafts(existing => ({ ...existing, [current.id]: { a: existing[current.id]?.a ?? "", b: existing[current.id]?.b ?? "", [part]: text } }));
  }
  const draftCount = topic.questions.filter(question => (drafts[question.id]?.a ?? "").trim() || (drafts[question.id]?.b ?? "").trim()).length;
  return <div className={styles.container}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/practice">Practice</Link><span>/</span><Link href="/practice/ib">IB Economics</Link><span>/</span><span>Topic {topic.number}</span></nav>
    <header className={styles.header}>
      <span className={styles.eyebrow}>IB ECONOMICS · PAPER 1 STYLE · TOPIC {topic.number}</span>
      <h1>{topic.title}</h1>
      <p>{topic.count} complete question pairs. Each has part (a), worth 10 marks, and part (b), worth 15 marks.</p>
      <div className={styles.summary}><span>{draftCount} with drafts</span><span>1 hour 15 minutes suggested per pair</span><span>Original practice material · Not an official IB examination</span></div>
    </header>
    <div className={styles.layout}>
      <aside className={styles.library} aria-label="Questions in this topic">
        <div className={styles.libraryHead}><h2>Questions</h2><span>{visible.length} shown</span></div>
        <div className={styles.filters} aria-label="Syllabus level">
          {(["All", "SL/HL", "HL"] as const).map(value => <button type="button" key={value} aria-pressed={level === value} onClick={() => changeLevel(value)} disabled={value === "HL" && !topic.questions.some(q => q.level === "HL")}>{value}</button>)}
        </div>
        <label className={styles.picker}>Jump to question<select aria-label="Jump to question" value={number} onChange={event => selectQuestion(Number(event.target.value))}>{visible.map(question => <option value={question.id} key={question.id}>Question {question.id} · {question.level}</option>)}</select></label>
        <div className={styles.numberList}>{visible.map(question => <button type="button" key={question.id} onClick={() => selectQuestion(question.id)} aria-current={question.id === current.id ? "true" : undefined} aria-label={`Question ${question.id}${drafts[question.id]?.a || drafts[question.id]?.b ? ", draft saved" : ""}`}><span>{question.id}</span>{(drafts[question.id]?.a || drafts[question.id]?.b) && <span className={styles.draftDot} aria-hidden="true"/>}</button>)}</div>
        <p className={styles.storageNote}>{storageAvailable ? "Drafts are saved only in this browser." : "Browser storage is unavailable. Copy your response before leaving."}</p>
      </aside>
      <article className={styles.question}>
        <div className={styles.questionTop}><div><span className={styles.eyebrow}>QUESTION {current.id} OF {topic.count}</span><h2>Answer both parts</h2></div><div className={styles.badges}><span>{current.level}</span><span>{current.difficulty}</span><strong>25 marks</strong></div></div>
        <section className={styles.part}><div className={styles.partHead}><h3>Part (a)</h3><span>10 marks</span></div><p>{current.a.prompt}</p><label htmlFor="ib-answer-a">Your response</label><textarea id="ib-answer-a" value={currentDraft.a} onChange={event => updateDraft("a", event.target.value)} placeholder="Write your explanation here…" rows={9}/></section>
        <section className={styles.part}><div className={styles.partHead}><h3>Part (b)</h3><span>15 marks</span></div><p>{current.b.prompt}</p><label htmlFor="ib-answer-b">Your response</label><textarea id="ib-answer-b" value={currentDraft.b} onChange={event => updateDraft("b", event.target.value)} placeholder="Use real-world examples and develop your evaluation…" rows={12}/></section>
        <div className={styles.status} role="status">{storageAvailable ? (loaded ? savedAt || "Drafts save automatically on this device." : "Loading your drafts…") : "Your draft cannot be saved on this device."}</div>
        {process.env.NODE_ENV !== "production" && <AiFeedback key={`${slug}-${current.id}`} topic={slug} questionId={current.id} a={currentDraft.a} b={currentDraft.b}/>}
        <div className={styles.navigation}><button type="button" onClick={() => previous && selectQuestion(previous.id)} disabled={!previous}>← Previous question</button><span>{position + 1} / {visible.length}</span><button type="button" onClick={() => next && selectQuestion(next.id)} disabled={!next}>Next question →</button></div>
      </article>
    </div>
  </div>;
}
