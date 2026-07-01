import Link from "next/link";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui";
import type { Course } from "@/types/payload-types";

interface CourseCardProps extends React.ComponentProps<"article"> {
  course: Course;
  owned: boolean;
  customContent?: React.ReactNode;
}

export function CourseCard({
  course,
  owned: _owned,
  customContent,
  className,
  ...props
}: CourseCardProps) {
  const defaultCourseHref = course.slug ? `/course/${course.slug}` : "#";

  return (
    <article
      className={cn(
        "group flex min-h-[260px] flex-col rounded-[1.4rem] border border-oe-border bg-oe-surface p-6 text-oe-text shadow-sm shadow-black/5 transition-all duration-200",
        "hover:-translate-y-1 hover:border-oe-accent/45 hover:bg-oe-surface-elevated/75 hover:shadow-xl hover:shadow-black/10",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap gap-2">
        <Badge>Open Economics</Badge>
        <Badge>{course.lessonCount ?? 0} lessons</Badge>
      </div>

      <h2 className="mt-6 text-2xl font-semibold tracking-tight">
        {course.title}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-7 text-oe-text-muted">
        {course.description}
      </p>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs font-medium text-oe-text-muted">
          <span>{getUnitsLabel(course.lessonCount ?? 0)}</span>
          <span>Course pathway</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08] ring-1 ring-oe-border">
          <div className="h-full w-1/4 rounded-full bg-oe-accent" />
        </div>
      </div>

      <div className="mt-6">
        {customContent ?? (
          <Button asChild size="lg" className="w-full rounded-full">
            <Link prefetch href={defaultCourseHref}>
              Open course
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-oe-border bg-oe-surface-elevated/75 px-3 py-1 text-xs font-medium text-oe-text-muted">
      {children}
    </span>
  );
}

function getUnitsLabel(lessonCount: number) {
  if (lessonCount >= 12) return "6 units";
  if (lessonCount > 0) return `${lessonCount} lessons`;
  return "Course path";
}
