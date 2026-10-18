"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Flag,
  RotateCcw,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PracticeTopic } from "@/lib/practice/topics";
import type {
  AnswerResult,
  Difficulty,
  PracticeQuestion,
} from "@/lib/practice/types";
import { QuestionGraph } from "./question-graph";
import { QuestionText } from "./question-text";

type Attempts = Record<number, AnswerResult>;

export function QuestionBank({
  topic,
  questions,
  course = "ap-macro",
}: {
  course?: "ap-macro" | "ap-micro" | "a-level";
  topic: PracticeTopic;
  questions: PracticeQuestion[];
}) {
  const storageKey = `oe-practice-${course}-${topic.slug}-v${topic.revision ?? 4}`;
  const [currentId, setCurrentId] = useState(1);
  const [difficulty, setDifficulty] = useState<"All" | Difficulty>("All");
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [attempts, setAttempts] = useState<Attempts>({});
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const questionHeading = useRef<HTMLDivElement>(null);
  const feedback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (saved && saved.version === 1) {
        const valid: Attempts = {};
        for (const q of questions) {
          const item = saved.attempts?.[q.id];
          if (
            item &&
            ["A", "B", "C", "D", "E"].includes(item.selected) &&
            ["A", "B", "C", "D", "E"].includes(item.answer) &&
            typeof item.correct === "boolean" &&
            typeof item.explanation === "string" &&
            typeof item.reference === "string"
          )
            valid[q.id] = item;
        }
        setAttempts(valid);
        if (Array.isArray(saved.bookmarks))
          setBookmarks(
            saved.bookmarks.filter((id: unknown) =>
              questions.some((q) => q.id === id),
            ),
          );
        if (questions.some((q) => q.id === saved.currentId))
          setCurrentId(saved.currentId);
      }
    } catch {
      setStorageAvailable(false);
    }
    setReady(true);
  }, [questions, storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ version: 1, currentId, attempts, bookmarks }),
      );
    } catch {
      setStorageAvailable(false);
    }
  }, [ready, attempts, bookmarks, currentId, storageKey]);

  const visible = questions.filter(
    (q) => difficulty === "All" || q.difficulty === difficulty,
  );
  const question = questions.find((q) => q.id === currentId) ?? questions[0];
  const result = attempts[question.id];
  const selected = result?.selected ?? drafts[question.id];
  const currentIndex = visible.findIndex((q) => q.id === currentId);
  const answered = Object.keys(attempts).length;
  const correct = Object.values(attempts).filter((a) => a.correct).length;
  const incorrect = answered - correct;
  const progress = Math.round((answered / questions.length) * 100);
  const isBookmarked = bookmarks.includes(question.id);

  function goTo(id: number) {
    if (busy) return;
    setCurrentId(id);
    setError("");
    setShowSummary(false);
    requestAnimationFrame(() => {
      questionHeading.current?.focus({ preventScroll: true });
      questionHeading.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    });
  }

  function filterQuestions(value: "All" | Difficulty) {
    setDifficulty(value);
    const first = questions.find(
      (q) => value === "All" || q.difficulty === value,
    );
    if (first && value !== "All" && question.difficulty !== value)
      goTo(first.id);
  }

  async function submitAnswer() {
    if (!selected || busy || result) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/practice/${course}/${topic.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: question.id, selected }),
      });
      if (!response.ok)
        throw new Error("Unable to check your answer. Please try again.");
      const answer: AnswerResult = await response.json();
      setAttempts((previous) => ({ ...previous, [question.id]: answer }));
      requestAnimationFrame(() => feedback.current?.focus());
    } catch {
      setError(
        "Your answer wasn’t submitted. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function restart() {
    setAttempts({});
    setDrafts({});
    setBookmarks([]);
    setCurrentId(1);
    setDifficulty("All");
    setShowSummary(false);
    setConfirmReset(false);
    setError("");
  }

  function reviewFirst(kind: "incorrect" | "unanswered" | "saved") {
    const target = questions.find((q) =>
      kind === "incorrect"
        ? attempts[q.id] && !attempts[q.id].correct
        : kind === "saved"
          ? bookmarks.includes(q.id)
          : !attempts[q.id],
    );
    if (target) {
      setDifficulty("All");
      goTo(target.id);
    }
  }

  return (
    <div className="practice-container practice-bank-container">
      <nav className="practice-breadcrumb" aria-label="Breadcrumb">
        <Link href="/practice">Practice</Link>
        <ChevronRight size={14} />
        <Link href={`/practice/${course}`}>{course === "a-level" ? "A-level" : course === "ap-micro" ? "AP Micro" : "AP Macro"}</Link>
        <ChevronRight size={14} />
        <span>Topic {topic.number}</span>
      </nav>
      <header className="practice-bank-heading">
        <div>
          <div className="practice-eyebrow">
            UNIT {String(topic.unit).padStart(2, "0")} <span>/</span>{" "}
            {topic.unitName.toUpperCase()}
          </div>
          <h1>
            {topic.title}
            <span className="practice-test-label">{topic.number} test</span>
          </h1>
          <p>{topic.count} questions with explanations after each answer.</p>
        </div>
        <span className="practice-mode">
          <span className="practice-live-dot" /> Practice mode
        </span>
      </header>
      <div className="practice-toolbar">
        <fieldset className="practice-filters">
          <legend className="sr-only">Filter questions by difficulty</legend>
          {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
            <button
              key={d}
              type="button"
              disabled={busy || !ready}
              aria-pressed={difficulty === d}
              onClick={() => filterQuestions(d)}
            >
              {d === "All" ? "All questions" : d}
              <span>
                {
                  questions.filter((q) => d === "All" || q.difficulty === d)
                    .length
                }
              </span>
            </button>
          ))}
        </fieldset>
        <span className="practice-save-status">
          {!ready ? (
            "Loading progress…"
          ) : storageAvailable ? (
            <>
              <Check size={14} /> Saved on this device
            </>
          ) : (
            "Progress available for this visit"
          )}
        </span>
      </div>
      <div className="practice-workspace">
        <aside
          className={`practice-navigator ${navigatorOpen ? "is-open" : ""}`}
        >
          <div className="practice-progress-heading">
            <h2>Your progress</h2>
            <span>{progress}%</span>
          </div>
          <div
            className="practice-progress-track"
            role="progressbar"
            aria-label="Questions completed"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={answered}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="practice-progress-caption">
            {answered} of {questions.length} questions answered
          </p>
          <div className="practice-score">
            <div>
              <span className="practice-correct-dot" /> Correct
              <strong>{correct}</strong>
            </div>
            <div>
              <span className="practice-review-dot" /> To review
              <strong>{incorrect}</strong>
            </div>
          </div>
          <button
            className="practice-map-toggle"
            type="button"
            aria-expanded={navigatorOpen}
            aria-controls="practice-question-map"
            onClick={() => setNavigatorOpen((v) => !v)}
          >
            Question navigator <ChevronDown size={16} />
          </button>
          <div className="practice-map" id="practice-question-map">
            <div className="practice-map-heading">
              <span>QUESTIONS</span>
              <span>
                {difficulty === "All" ? `01–${questions.length}` : difficulty}
              </span>
            </div>
            <div className="practice-number-grid">
              {visible.map((q) => (
                <button
                  type="button"
                  key={q.id}
                  disabled={busy || !ready}
                  aria-current={question.id === q.id ? "step" : undefined}
                  aria-label={`Question ${q.id}${attempts[q.id] ? (attempts[q.id].correct ? ", correct" : ", incorrect") : ", unanswered"}${bookmarks.includes(q.id) ? ", saved" : ""}`}
                  className={`${attempts[q.id] ? (attempts[q.id].correct ? "is-correct" : "is-incorrect") : ""} ${question.id === q.id ? "is-current" : ""}`}
                  onClick={() => goTo(q.id)}
                >
                  {q.id}
                  {bookmarks.includes(q.id) && (
                    <span className="practice-bookmark-mark" />
                  )}
                </button>
              ))}
            </div>
            <div className="practice-map-legend">
              <span>
                <i /> Unanswered
              </span>
              <span>
                <i className="legend-saved" /> Saved
              </span>
            </div>
          </div>
          <button
            type="button"
            className="practice-secondary practice-summary-button"
            disabled={busy || !ready}
            onClick={() => setShowSummary((v) => !v)}
          >
            {showSummary ? "Back to question" : "View progress"}
            <ArrowRight size={15} />
          </button>
          <p className="practice-sidebar-note">
            <CircleHelp size={16} /> Your first submitted answer counts toward
            your score. Take your time.
          </p>
        </aside>
        <div className="practice-main-column">
          {showSummary ? (
            <section className="practice-question-card practice-results">
              <div className="practice-eyebrow">
                {answered === questions.length
                  ? "PRACTICE COMPLETE"
                  : "YOUR PRACTICE SO FAR"}
              </div>
              <h2>
                {answered === questions.length
                  ? "Every answer is a step forward."
                  : "Look how far you’ve come."}
              </h2>
              <p>
                Review what needs another look, or pick up where you left off.
              </p>
              <div className="practice-result-stats">
                <div>
                  <strong>{answered}</strong>
                  <span>Answered</span>
                </div>
                <div>
                  <strong>{correct}</strong>
                  <span>Correct</span>
                </div>
                <div>
                  <strong>
                    {answered
                      ? `${Math.round((correct / answered) * 100)}%`
                      : "—"}
                  </strong>
                  <span>Accuracy</span>
                </div>
              </div>
              <div className="practice-result-actions">
                <button
                  type="button"
                  className="practice-primary"
                  disabled={answered === questions.length}
                  onClick={() => reviewFirst("unanswered")}
                >
                  Continue practice <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className="practice-secondary"
                  disabled={!incorrect}
                  onClick={() => reviewFirst("incorrect")}
                >
                  Review incorrect ({incorrect})
                </button>
                <button
                  type="button"
                  className="practice-secondary"
                  disabled={!bookmarks.length}
                  onClick={() => reviewFirst("saved")}
                >
                  Saved questions ({bookmarks.length})
                </button>
              </div>
              <div className="practice-review-list">
                {questions
                  .filter((q) => attempts[q.id] && !attempts[q.id].correct)
                  .map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setDifficulty("All");
                        goTo(q.id);
                      }}
                    >
                      <span>Q{q.id}</span>
                      <span>{q.prompt}</span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
              </div>
              {confirmReset ? (
                <div className="practice-reset-confirm">
                  <p>
                    Clear your answers, score, and saved questions for this
                    topic?
                  </p>
                  <button
                    type="button"
                    className="practice-secondary"
                    onClick={() => setConfirmReset(false)}
                  >
                    Keep progress
                  </button>
                  <button
                    type="button"
                    className="practice-primary"
                    onClick={restart}
                  >
                    Clear and start again
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="practice-text-button"
                  onClick={() => setConfirmReset(true)}
                >
                  <RotateCcw size={15} /> Start over
                </button>
              )}
            </section>
          ) : (
            <>
              <section
                className="practice-question-card"
                aria-labelledby="practice-question-title"
              >
                <div className="practice-question-meta">
                  <div>
                    <span className="practice-question-counter">
                      QUESTION {String(question.id).padStart(2, "0")}{" "}
                      <span>/ {questions.length}</span>
                    </span>
                    <span
                      className={`practice-difficulty difficulty-${question.difficulty.toLowerCase()}`}
                    >
                      <span />
                      {question.difficulty}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`practice-bookmark ${isBookmarked ? "is-saved" : ""}`}
                    disabled={!ready}
                    aria-pressed={isBookmarked}
                    onClick={() =>
                      setBookmarks((previous) =>
                        previous.includes(question.id)
                          ? previous.filter((id) => id !== question.id)
                          : [...previous, question.id],
                      )
                    }
                  >
                    <Bookmark
                      size={17}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                    {isBookmarked ? "Saved" : "Save"}
                  </button>
                </div>
                <h2 id="practice-question-title" className="sr-only">Question {question.id}</h2>
                {course === "ap-macro" && topic.slug === "4-3" && (
                  <p className="practice-measure-convention">
                    For these historical-model questions, M1 includes currency and checkable deposits;
                    savings deposits enter M2. Modern U.S. M1 also includes savings deposits.
                  </p>
                )}
                <div
                  id="practice-question-heading"
                  tabIndex={-1}
                  ref={questionHeading}
                  className="practice-question-prompt"
                >
                  <QuestionText text={question.prompt} />
                </div>
                <QuestionGraph
                  topic={topic.slug}
                  id={question.id}
                  description={question.graphDescription}
                  required={question.graphRequired}
                  scenes={question.graphScenes}
                  revealed={!!result}
                />
                <fieldset
                  className="practice-answer-options"
                  disabled={!!result || busy || !ready}
                >
                  <legend>Select one answer</legend>
                  {question.options.map((option) => {
                    const optionCorrect =
                      !!result && option.label === result.answer;
                    const optionWrong =
                      !!result &&
                      option.label === result.selected &&
                      !result.correct;
                    return (
                      <label
                        key={`${question.id}-${option.label}`}
                        className={`practice-answer ${selected === option.label ? "is-selected" : ""} ${optionCorrect ? "answer-correct" : ""} ${optionWrong ? "answer-incorrect" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.label}
                          checked={selected === option.label}
                          onChange={() =>
                            setDrafts((previous) => ({
                              ...previous,
                              [question.id]: option.label,
                            }))
                          }
                        />
                        <span className="practice-answer-letter">
                          {optionCorrect ? (
                            <Check size={17} />
                          ) : optionWrong ? (
                            <X size={17} />
                          ) : (
                            option.label
                          )}
                        </span>
                        <span className="practice-answer-text">
                          {option.text}
                          {optionCorrect && (
                            <span className="practice-answer-state">
                              Correct answer · {option.label}
                            </span>
                          )}
                          {optionWrong && (
                            <span className="practice-answer-state">
                              Your answer · {option.label}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </fieldset>
                {result && (
                  <div
                    ref={feedback}
                    tabIndex={-1}
                    className={`practice-feedback ${result.correct ? "feedback-correct" : "feedback-review"}`}
                    role="status"
                  >
                    <div className="practice-feedback-heading">
                      {result.correct ? (
                        <CheckCircle2 size={22} />
                      ) : (
                        <CircleHelp size={22} />
                      )}
                      <div>
                        <h3>
                          {result.correct
                            ? "That’s right. Nicely reasoned."
                            : "Not quite. Let’s work through it."}
                        </h3>
                        <span>Correct answer: {result.answer}</span>
                      </div>
                    </div>
                    <p>{result.explanation}</p>
                    <div className="practice-reference">
                      {course === "a-level" ? "Syllabus reference" : "CED reference"} · {result.reference.replace(/\s*\|\s*AO\d.*$/, "")}
                    </div>
                  </div>
                )}
                {error && (
                  <p className="practice-submit-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="practice-question-bottom">
                  <span>
                    {result
                      ? "Answer checked. Keep building your understanding."
                      : "Submit your answer to see the explanation."}
                  </span>
                  {!result ? (
                    <button
                      type="button"
                      className="practice-primary"
                      onClick={submitAnswer}
                      disabled={!selected || busy || !ready}
                    >
                      {busy ? "Checking…" : "Check answer"}
                      {!busy && <ArrowRight size={17} />}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="practice-primary"
                      onClick={() =>
                        currentIndex < visible.length - 1
                          ? goTo(visible[currentIndex + 1].id)
                          : setShowSummary(true)
                      }
                    >
                      {currentIndex < visible.length - 1
                        ? "Next question"
                        : "View results"}
                      <ArrowRight size={17} />
                    </button>
                  )}
                </div>
              </section>
              <div className="practice-pagination">
                <button
                  type="button"
                  disabled={currentIndex <= 0 || busy || !ready}
                  onClick={() => goTo(visible[currentIndex - 1].id)}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <span>
                  {currentIndex + 1} of {visible.length}
                  {difficulty !== "All" ? ` · ${difficulty}` : ""}
                </span>
                <button
                  type="button"
                  disabled={busy || !ready}
                  onClick={() =>
                    currentIndex < visible.length - 1
                      ? goTo(visible[currentIndex + 1].id)
                      : setShowSummary(true)
                  }
                >
                  {currentIndex < visible.length - 1
                    ? result
                      ? "Next"
                      : "Skip for now"
                    : "View results"}
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="practice-learning-note">
                <Flag size={16} />
                <span>
                  A wrong answer is a useful starting point. Read the
                  explanation, then keep going.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
