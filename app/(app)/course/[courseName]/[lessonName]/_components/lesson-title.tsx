"use client";

import { Calendar, CheckCircle, Clock, Film, Gem, List } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDuration, formatReadingTime } from "@/lib/format";
import { cn } from "@/lib/ui";
import type { Lesson } from "@/types/payload-types";

interface LessonTitleProps {
  lesson: Lesson | null;
}

export function LessonTitle({ lesson }: LessonTitleProps) {
  if (!lesson) return null;

  const metadata = getLessonMetadata(lesson);
  const createdAt = new Date(lesson.createdAt);
  const updatedAt = new Date(lesson.updatedAt);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(createdAt);

  const fullCreatedAt = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(createdAt);

  const fullUpdatedAt = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(updatedAt);

  return (
    <header className="mb-8 font-inter">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 text-foreground/95 tracking-tight leading-[1.05] text-balance">
        {lesson.title}
      </h1>

      <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
        {metadata && (
          <MetaBadge>
            <metadata.icon size={16} />
            <span>{metadata.text}</span>
          </MetaBadge>
        )}

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <MetaBadge>
                <Calendar size={16} />
                <span suppressHydrationWarning>{formattedDate}</span>
              </MetaBadge>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <div>
                <span className="font-medium">Created:</span>{" "}
                <span suppressHydrationWarning>{fullCreatedAt}</span>
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                <span suppressHydrationWarning>{fullUpdatedAt}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <MetaBadge
          className={cn(
            lesson.free
              ? "border-blue-400/25 bg-blue-500/10 text-blue-200"
              : "border-slate-300/25 bg-slate-300/10 text-slate-200",
          )}
        >
          {lesson.free ? <CheckCircle size={16} /> : <Gem size={16} />}
          <span>{lesson.free ? "Open lesson" : "Premium"}</span>
        </MetaBadge>
      </div>

      <div className="mt-7 rounded-2xl border border-blue-400/15 bg-blue-500/[0.07] px-5 py-4 sm:px-6 sm:py-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300/85">
          Lesson overview
        </p>
        <p className="mt-2 max-w-3xl text-base sm:text-lg leading-8 text-slate-200/85">
          {getLessonIntro(lesson)}
        </p>
      </div>
    </header>
  );
}

function MetaBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-sm font-medium text-slate-300 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

function getLessonIntro(lesson: Lesson) {
  if (lesson.slug === "scarcity-and-economic-thinking") {
    return "Build the foundation for AP Microeconomics by connecting scarcity, tradeoffs, opportunity cost, and marginal decision-making.";
  }

  if (lesson.type === "quiz") {
    return "Check your understanding with focused AP-style practice and immediate explanations.";
  }

  return "Work through the core model, vocabulary, and exam moves for this Open Economics lesson.";
}

function getLessonMetadata(lesson: Lesson) {
  switch (lesson.type) {
    case "text": {
      const readingTime = formatReadingTime(lesson.readingTimeSeconds || 0);
      return readingTime ? { icon: Clock, text: readingTime } : null;
    }
    case "video": {
      const duration = lesson.videoDurationSeconds;
      return duration ? { icon: Film, text: formatDuration(duration) } : null;
    }
    case "quiz": {
      const count = lesson.quiz?.length ?? 0;
      return count > 0
        ? {
            icon: List,
            text: `${count} ${count === 1 ? "question" : "questions"}`,
          }
        : null;
    }
    default:
      return null;
  }
}
