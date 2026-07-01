import "server-only";

import { getMockCourse, getMockLesson } from "@/lib/data/mock-courses";
import type { Course, Poster } from "@/types/payload-types";

type CourseSeoData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  posterUrl: string | null;
  posterAlt: string | null;
  updatedAt: string;
};

function normalizeCourseSeoData(course: Course | null | undefined) {
  if (!course?.id || !course.slug || !course.title) return null;

  const poster =
    course.poster && typeof course.poster === "object"
      ? (course.poster as Poster)
      : null;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description ?? null,
    posterUrl: poster?.url ?? null,
    posterAlt: poster?.alt ?? course.title,
    updatedAt: course.updatedAt,
  } satisfies CourseSeoData;
}

export async function getCourseSeoData(courseSlug: string) {
  return normalizeCourseSeoData(getMockCourse(courseSlug));
}

export async function getLessonSeoData(courseSlug: string, lessonSlug: string) {
  const lesson = getMockLesson(courseSlug, lessonSlug);
  if (!lesson?.id || !lesson.slug || !lesson.title) return null;

  const course =
    typeof lesson.course === "string"
      ? normalizeCourseSeoData(getMockCourse(courseSlug))
      : normalizeCourseSeoData(lesson.course);

  if (!course) return null;

  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    free: Boolean(lesson.free),
    updatedAt: lesson.updatedAt,
    course,
  };
}
