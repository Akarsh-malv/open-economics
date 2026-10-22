"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SiteShell } from "@/components/redesign/site-shell";
import { useCourseStore } from "@/stores/course-store";
import type { Course, Lesson } from "@/types/payload-types";

export function CourseLayoutWrapper({
  course,
  lessons,
  children,
}: {
  course: Course;
  lessons: Lesson[];
  children: React.ReactNode;
}) {
  const initialize = useCourseStore((state) => state.initialize);
  const pathname = usePathname();
  const coursePath = `/course/${course.slug}`;
  const isLessonRoute = pathname.startsWith(`${coursePath}/`);

  useEffect(() => {
    initialize(course, lessons);
  }, [initialize, course, lessons]);

  return (
    <div className="oe-course-view flex min-h-screen flex-col overflow-x-hidden bg-oe-background text-oe-text">
      {isLessonRoute ? <main className="flex-1 w-full min-w-0">{children}</main> : <SiteShell>{children}</SiteShell>}
    </div>
  );
}
