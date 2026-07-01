"use client";

import { BookOpenText, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/ui";
import type { Lesson } from "@/types/payload-types";

interface LessonItemProps {
  lesson: Lesson;
  courseSlug: string;
  isActive: boolean;
  owned?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, lessonPath: string) => void;
  registerRef?: (lessonPath: string, node: HTMLAnchorElement | null) => void;
}

export const LessonItem = memo(
  ({
    lesson,
    courseSlug,
    isActive,
    owned,
    onClick,
    registerRef,
  }: LessonItemProps) => {
    const lessonPath = `/course/${courseSlug}/${lesson.slug}`;

    const durationSeconds =
      lesson.videoDurationSeconds ?? lesson.readingTimeSeconds ?? 0;
    const durationLabel =
      durationSeconds > 0
        ? formatDuration(durationSeconds)
        : lesson.type === "quiz" && lesson.quiz?.length
          ? `${lesson.quiz.length} task${lesson.quiz.length > 1 ? "s" : ""}`
          : "";

    return (
      <Link
        key={lesson.id}
        href={lessonPath}
        title={lesson.title}
        ref={(node) => registerRef?.(lessonPath, node)}
        // intentionally enabling prefetch here because lesson items inside a collapsed accordion
        // are not mounted in the DOM until the chapter is expanded
        prefetch
        onClick={(e) => onClick(e, lessonPath)}
        data-lesson-path={lessonPath}
        data-active={isActive}
        className="block min-w-0"
      >
        <div
          className={cn(
            "group relative grid min-h-[78px] min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden rounded-xl border p-4 transition-all",
            isActive
              ? "border-white bg-white text-neutral-950"
              : "border-transparent text-neutral-100 hover:border-white/5 hover:bg-neutral-900",
          )}
        >
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              isActive
                ? "bg-neutral-950 text-white"
                : "border border-white/5 bg-neutral-900 text-neutral-400",
            )}
          >
            <BookOpenText className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "max-w-full overflow-hidden text-ellipsis text-pretty text-base font-medium leading-6 tracking-[-0.01em]",
                isActive ? "text-neutral-950" : "text-neutral-100",
              )}
            >
              {lesson.title}
            </p>
            {durationLabel && (
              <p
                className={cn(
                  "mt-1 text-sm",
                  isActive ? "text-neutral-600" : "text-neutral-400",
                )}
              >
                Est. {durationLabel}
              </p>
            )}
          </div>
          {!lesson.free && !owned && (
            <Lock
              size={20}
              className={cn(
                "shrink-0 text-neutral-500",
                isActive && "text-neutral-950",
              )}
            />
          )}
          {(lesson.free || owned) && isActive && (
            <ChevronRight className="size-5 shrink-0 text-neutral-950" />
          )}
        </div>
      </Link>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.lesson.id === nextProps.lesson.id &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.owned === nextProps.owned &&
      prevProps.courseSlug === nextProps.courseSlug
    );
  },
);
