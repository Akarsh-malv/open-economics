"use client";

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/ui";
import {
  AnswerChoice,
  FeedbackCard,
  GuidedLessonShell,
  LearningCard,
  LessonActionBar,
  LessonProgressHeader,
  PrimaryLessonAction,
  StepIntro,
  StepMotion,
} from "./guided-lesson-ui";

type LessonStep = {
  title: string;
  type: "content" | "multiple-choice" | "calculation" | "complete";
  content: string[];
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
};

const lessonSteps: LessonStep[] = [
  {
    title: "Why scarcity matters",
    type: "content",
    content: [
      "Imagine you have one free hour before tomorrow's AP Micro quiz. You could study, work a shift, sleep, or catch up with a friend.",
      "The point is not that one choice is always best. The point is that choosing one means giving up the next-best option.",
    ],
  },
  {
    title: "Scarcity",
    type: "content",
    content: [
      "Scarcity means people have unlimited wants, but limited resources.",
      "Time, money, labor, land, and capital are all limited. Economics studies how people make choices under those limits.",
    ],
  },
  {
    title: "Opportunity cost",
    type: "content",
    content: [
      "Opportunity cost is the value of the next-best alternative you give up.",
      "It is not every possible alternative. It is the best option you did not choose.",
    ],
  },
  {
    title: "Check your intuition",
    type: "multiple-choice",
    content: [
      "You spend one hour studying instead of working a job that pays $16/hour. What is one part of your opportunity cost?",
    ],
    options: [
      "The $16 in wages you gave up",
      "Every activity you could have done that hour",
      "The cost of your AP Micro textbook",
    ],
    correctAnswer: 0,
    explanation:
      "The $16 wage is part of the next-best alternative you gave up by studying instead of working.",
  },
  {
    title: "Marginal analysis",
    type: "content",
    content: [
      "Marginal analysis compares the benefit and cost of one more action.",
      "If one more hour of studying raises your expected quiz score enough to be worth the lost time, the marginal benefit is greater than the marginal cost.",
    ],
  },
  {
    title: "Quick calculation",
    type: "calculation",
    content: [
      "If marginal benefit is $9 and marginal cost is $7, what is the net benefit?",
    ],
    options: ["$2", "$7", "$16"],
    correctAnswer: "$2",
    explanation:
      "Net benefit equals marginal benefit minus marginal cost: $9 - $7 = $2.",
  },
  {
    title: "Lesson complete",
    type: "complete",
    content: [
      "You learned how scarcity creates tradeoffs, why opportunity cost focuses on the next-best alternative, and how marginal analysis supports better decisions.",
    ],
  },
];

export function GuidedScarcityLesson() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(
    null,
  );
  const [typedAnswer, setTypedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const step = lessonSteps[stepIndex];
  const isLastStep = stepIndex === lessonSteps.length - 1;

  const isCorrect = useMemo(() => {
    if (!submitted) return false;

    if (step.type === "multiple-choice") {
      return selectedAnswer === step.correctAnswer;
    }

    if (step.type === "calculation") {
      const normalized = typedAnswer.trim().replace(/\s/g, "").toLowerCase();
      return (
        selectedAnswer === step.correctAnswer ||
        normalized === "2" ||
        normalized === "$2" ||
        normalized === "2.00" ||
        normalized === "$2.00"
      );
    }

    return false;
  }, [selectedAnswer, step.correctAnswer, step.type, submitted, typedAnswer]);

  const resetStepState = () => {
    setSelectedAnswer(null);
    setTypedAnswer("");
    setSubmitted(false);
  };

  const goNext = () => {
    if (isLastStep) return;
    setStepIndex((current) => current + 1);
    resetStepState();
  };

  const submitAnswer = () => {
    if (step.type === "calculation" && !selectedAnswer && !typedAnswer.trim()) {
      return;
    }
    if (step.type === "multiple-choice" && selectedAnswer === null) return;
    setSubmitted(true);
  };

  return (
    <GuidedLessonShell>
      <LessonProgressHeader
        current={stepIndex + 1}
        total={lessonSteps.length}
        label="Scarcity and Economic Thinking"
      />

      <LearningCard>
        <AnimatePresence mode="wait" initial={false}>
          <StepMotion stepKey={stepIndex}>
            <StepIntro
              eyebrow="Scarcity and Economic Thinking"
              title={step.title}
            >
              {step.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </StepIntro>

            {step.type === "multiple-choice" && (
              <AnswerOptions
                options={step.options ?? []}
                selectedAnswer={selectedAnswer}
                submitted={submitted}
                correctAnswer={step.correctAnswer}
                onSelect={setSelectedAnswer}
              />
            )}

            {step.type === "calculation" && (
              <CalculationAnswer
                options={step.options ?? []}
                selectedAnswer={selectedAnswer}
                typedAnswer={typedAnswer}
                submitted={submitted}
                correctAnswer={step.correctAnswer}
                onSelect={setSelectedAnswer}
                onType={(value) => {
                  setTypedAnswer(value);
                  setSelectedAnswer(null);
                }}
              />
            )}

            {submitted && step.explanation && (
              <FeedbackCard isCorrect={isCorrect}>
                <p>{step.explanation}</p>
              </FeedbackCard>
            )}

            {step.type === "complete" && (
              <CompletionSummary courseSlug="ap-microeconomics" />
            )}
          </StepMotion>
        </AnimatePresence>

        <LessonActionBar
          canGoBack={stepIndex > 0}
          onBack={() => {
            setStepIndex((current) => Math.max(0, current - 1));
            resetStepState();
          }}
        >
          {step.type === "content" ? (
            <PrimaryLessonAction onClick={goNext}>Continue</PrimaryLessonAction>
          ) : step.type === "complete" ? (
            <PrimaryLessonAction href="/course/ap-microeconomics/production-possibilities-frontier">
              Next lesson
            </PrimaryLessonAction>
          ) : submitted ? (
            <PrimaryLessonAction onClick={goNext}>Continue</PrimaryLessonAction>
          ) : (
            <PrimaryLessonAction
              onClick={submitAnswer}
              disabled={
                step.type === "multiple-choice"
                  ? selectedAnswer === null
                  : !selectedAnswer && !typedAnswer.trim()
              }
            >
              Check answer
            </PrimaryLessonAction>
          )}
        </LessonActionBar>
      </LearningCard>
    </GuidedLessonShell>
  );
}

function AnswerOptions({
  options,
  selectedAnswer,
  submitted,
  correctAnswer,
  onSelect,
}: {
  options: string[];
  selectedAnswer: string | number | null;
  submitted: boolean;
  correctAnswer?: string | number;
  onSelect: (answer: number) => void;
}) {
  return (
    <div className="mt-8 space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = submitted && correctAnswer === index;
        const isWrong = submitted && isSelected && !isCorrect;

        return (
          <AnswerChoice
            key={option}
            selected={isSelected}
            submitted={submitted}
            correct={isCorrect}
            incorrect={isWrong}
            onClick={() => onSelect(index)}
          >
            {option}
          </AnswerChoice>
        );
      })}
    </div>
  );
}

function CalculationAnswer({
  options,
  selectedAnswer,
  typedAnswer,
  submitted,
  correctAnswer,
  onSelect,
  onType,
}: {
  options: string[];
  selectedAnswer: string | number | null;
  typedAnswer: string;
  submitted: boolean;
  correctAnswer?: string | number;
  onSelect: (answer: string) => void;
  onType: (answer: string) => void;
}) {
  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = submitted && correctAnswer === option;
          const isWrong = submitted && isSelected && !isCorrect;

          return (
            <AnswerChoice
              key={option}
              align="center"
              selected={isSelected}
              submitted={submitted}
              correct={isCorrect}
              incorrect={isWrong}
              onClick={() => onSelect(option)}
            >
              {option}
            </AnswerChoice>
          );
        })}
      </div>

      <div className="rounded-2xl border border-oe-border bg-oe-surface-elevated/70 p-4">
        <label
          htmlFor="net-benefit"
          className="mb-2 block text-sm font-medium text-oe-text-muted"
        >
          Or type the net benefit
        </label>
        <input
          id="net-benefit"
          value={typedAnswer}
          disabled={submitted}
          onChange={(event) => onType(event.target.value)}
          placeholder="$2"
          className="h-12 w-full rounded-xl border border-oe-border bg-black/20 px-4 text-lg text-oe-text outline-none transition-colors placeholder:text-oe-text-muted/60 focus:border-oe-accent/55"
        />
      </div>
    </div>
  );
}

function CompletionSummary({ courseSlug }: { courseSlug: string }) {
  return (
    <div className="mt-9 border-t border-oe-border pt-7">
      <h2 className="text-base font-semibold text-oe-text">
        What you learned
      </h2>
      <ul className="mt-4 space-y-2.5 text-base leading-7 text-oe-text-muted">
        <li>Scarcity forces people to make choices.</li>
        <li>Opportunity cost is the next-best alternative.</li>
        <li>Marginal decisions compare extra benefit and extra cost.</li>
      </ul>

      <h2 className="mt-7 text-base font-semibold text-oe-text">Key terms</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Scarcity", "Tradeoff", "Opportunity cost", "Marginal analysis"].map(
          (term) => (
            <span
              key={term}
              className="rounded-full border border-oe-border bg-oe-surface-elevated px-3 py-1 text-sm text-oe-text-muted"
            >
              {term}
            </span>
          ),
        )}
      </div>

      <Link
        href={`/course/${courseSlug}`}
        className={cn(
          "mt-6 inline-flex text-sm font-medium",
          "text-oe-accent transition-colors hover:text-[#ddb96d]",
        )}
      >
        View all lessons
      </Link>
    </div>
  );
}
