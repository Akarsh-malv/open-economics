"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  type EconomicsGraphPoint,
  InteractiveEconomicsGraph,
} from "@/components/interactive-economics-graph";
import { ppcGraphConfig, ppcLessonSteps } from "@/lib/data/economics-graphs";
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

export function GuidedPpcLesson() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<EconomicsGraphPoint | null>(
    null,
  );
  const [selectedClassification, setSelectedClassification] = useState<
    "efficient" | "inefficient" | "unattainable" | null
  >(null);
  const [submitted, setSubmitted] = useState(false);

  const step = ppcLessonSteps[stepIndex];
  const isClassifyStep = step.type === "classify";
  const isCorrect = selectedClassification === "inefficient";

  const reset = () => {
    setSelectedPoint(null);
    setSelectedClassification(null);
    setSubmitted(false);
  };

  const next = () => {
    setStepIndex((current) => Math.min(ppcLessonSteps.length - 1, current + 1));
    reset();
  };

  return (
    <GuidedLessonShell wide={step.showGraph}>
      <LessonProgressHeader
        current={stepIndex + 1}
        total={ppcLessonSteps.length}
        label="Production Possibilities Frontier"
      />

      <LearningCard wide={step.showGraph}>
        <AnimatePresence mode="wait" initial={false}>
          <StepMotion
            stepKey={stepIndex}
            className={cn(
              "min-w-0",
              step.showGraph &&
                "grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1fr)] lg:items-start",
            )}
          >
            <div className="min-w-0">
              <StepIntro
                eyebrow="Production Possibilities Frontier"
                title={step.title}
              >
                {step.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </StepIntro>

              {isClassifyStep && (
                <div className="mt-8 space-y-3">
                  <p className="text-sm font-medium text-oe-text-muted">
                    Choose a classification for point B.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {(["efficient", "inefficient", "unattainable"] as const).map(
                      (option) => {
                        const isSelected = selectedClassification === option;
                        const correct = submitted && option === "inefficient";
                        const incorrect =
                          submitted && isSelected && option !== "inefficient";

                        return (
                          <AnswerChoice
                            key={option}
                            selected={isSelected}
                            submitted={submitted}
                            correct={correct}
                            incorrect={incorrect}
                            onClick={() => setSelectedClassification(option)}
                          >
                            <span className="capitalize">{option}</span>
                          </AnswerChoice>
                        );
                      },
                    )}
                  </div>

                  {submitted && (
                    <FeedbackCard isCorrect={isCorrect}>
                      <p>
                        {isCorrect
                          ? "Point B is inside the PPC, so the economy has unused or misallocated resources."
                          : "Point B is inside the PPC. Points inside the frontier are inefficient, not efficient or unattainable."}
                      </p>
                    </FeedbackCard>
                  )}
                </div>
              )}

              {step.type === "complete" && (
                <div className="mt-8 border-t border-oe-border pt-6">
                  <h2 className="font-semibold text-oe-text">Key takeaways</h2>
                  <ul className="mt-3 space-y-2 text-oe-text-muted">
                    <li>On the curve: efficient production.</li>
                    <li>Inside the curve: inefficient production.</li>
                    <li>Outside the curve: unattainable with current resources.</li>
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["PPC", "Efficiency", "Opportunity cost", "Growth"].map(
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
                </div>
              )}
            </div>

            {step.showGraph && (
              <div className="min-w-0 lg:sticky lg:top-8">
                <InteractiveEconomicsGraph
                  config={step.graphConfig ?? ppcGraphConfig}
                  activePointId={selectedPoint?.id ?? step.activePointId ?? null}
                  onPointSelect={
                    isClassifyStep ? (point) => setSelectedPoint(point) : undefined
                  }
                />
              </div>
            )}
          </StepMotion>
        </AnimatePresence>

        <LessonActionBar
          canGoBack={stepIndex > 0}
          onBack={() => {
            setStepIndex((current) => Math.max(0, current - 1));
            reset();
          }}
        >
          {step.type === "complete" ? (
            <PrimaryLessonAction href="/course/ap-microeconomics/demand-supply-and-equilibrium">
              Next lesson
            </PrimaryLessonAction>
          ) : isClassifyStep && !submitted ? (
            <PrimaryLessonAction
              disabled={!selectedClassification}
              onClick={() => setSubmitted(true)}
            >
              Check answer
            </PrimaryLessonAction>
          ) : (
            <PrimaryLessonAction onClick={next}>Continue</PrimaryLessonAction>
          )}
        </LessonActionBar>
      </LearningCard>
    </GuidedLessonShell>
  );
}
