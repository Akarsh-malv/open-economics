"use client";

import type { User } from "better-auth";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useCourseStore } from "@/stores/course-store";
import type { Course, Lesson } from "@/types/payload-types";

export function CourseLayoutWrapper({
  course,
  lessons,
  user,
  children,
}: {
  course: Course;
  lessons: Lesson[];
  user: User | null;
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-oe-background text-oe-text">
      {!isLessonRoute && <Navbar user={user} />}
      <main className="flex-1 w-full min-w-0">{children}</main>
    </div>
  );
}
