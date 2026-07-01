"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type React from "react";
import { cn } from "@/lib/ui";

export function GuidedLessonShell({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative isolate flex min-h-[calc(100dvh-7rem)] w-full items-center justify-center overflow-visible px-4 py-8 text-neutral-100 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-18rem] inset-y-[-7rem] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.48)_44%,rgba(10,10,10,0.18)_64%,rgba(10,10,10,0)_82%)]"
      />
      <div className={cn("mx-auto w-full", wide ? "max-w-6xl" : "max-w-3xl")}>
        {children}
      </div>
    </div>
  );
}

export function LessonProgressHeader({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const progress = (current / total) * 100;

  return (
    <header className="mb-6">
      <div className="mb-3 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-neutral-100">
          Step {current} of {total}
        </span>
        <span className="min-w-0 truncate text-neutral-500">{label}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-slate-300 transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}

export function LearningCard({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/70 shadow-2xl shadow-neutral-950/30",
        "px-6 py-7 sm:px-10 sm:py-10",
        wide && "lg:px-10 lg:py-10",
      )}
    >
      {children}
    </section>
  );
}

export function StepMotion({
  stepKey,
  children,
  className,
}: {
  stepKey: React.Key;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StepIntro({
  eyebrow = "Open Economics",
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        {eyebrow}
      </p>
      <h1 className="text-balance break-words text-3xl font-extrabold tracking-tight text-neutral-50 sm:text-4xl sm:leading-[1.08]">
        {title}
      </h1>
      <div className="mt-7 space-y-5 text-[1.05rem] leading-8 text-neutral-200 sm:text-xl">
        {children}
      </div>
    </div>
  );
}

export function AnswerChoice({
  children,
  selected,
  submitted,
  correct,
  incorrect,
  disabled,
  onClick,
  align = "left",
}: {
  children: React.ReactNode;
  selected?: boolean;
  submitted?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  align?: "left" | "center";
}) {
  return (
    <button
      type="button"
      disabled={disabled || submitted}
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-2xl border px-5 py-4 text-base leading-7 text-neutral-100 transition-all duration-150",
        "border-white/5 bg-neutral-900 shadow-sm shadow-black/5",
        "hover:-translate-y-0.5 hover:border-white/10 hover:bg-neutral-800/70",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/35",
        "disabled:cursor-default disabled:hover:translate-y-0",
        align === "center" ? "text-center font-semibold" : "text-left",
        selected && "border-slate-300/70 bg-slate-300/10",
        correct && "border-slate-200/70 bg-white/10",
        incorrect && "border-slate-500/60 bg-slate-500/10",
      )}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="min-w-0">{children}</span>
        {correct && (
          <span className="shrink-0 text-sm font-medium text-slate-100">
            Correct
          </span>
        )}
        {incorrect && (
          <span className="shrink-0 text-sm font-medium text-slate-400">
            Incorrect
          </span>
        )}
      </span>
    </button>
  );
}

export function FeedbackCard({
  isCorrect,
  children,
}: {
  isCorrect: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-7 rounded-2xl border px-5 py-4",
        isCorrect
          ? "border-slate-200/45 bg-white/10"
          : "border-slate-500/45 bg-slate-500/10",
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold",
          isCorrect ? "text-slate-100" : "text-slate-400",
        )}
      >
        {isCorrect ? "Correct" : "Not quite"}
      </p>
      <div className="mt-2 text-base leading-7 text-neutral-300">
        {children}
      </div>
    </div>
  );
}

export function LessonActionBar({
  canGoBack,
  onBack,
  children,
}: {
  canGoBack: boolean;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-12 flex flex-col-reverse gap-3 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        className="h-11 rounded-xl border border-white/10 bg-neutral-900 px-5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800/70 hover:text-neutral-100 disabled:pointer-events-none disabled:opacity-40"
        disabled={!canGoBack}
        onClick={onBack}
      >
        Back
      </button>
      {children}
    </div>
  );
}

export function PrimaryLessonAction({
  children,
  disabled,
  onClick,
  href,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const className = cn(
    "inline-flex h-12 items-center justify-center rounded-xl border px-8 text-base font-semibold transition-all duration-150",
    "border-slate-200/40 bg-white text-[#0b1f3a] shadow-lg shadow-black/10",
    "hover:-translate-y-0.5 hover:bg-slate-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/35",
    "disabled:pointer-events-none disabled:opacity-40",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
