import "server-only";

import {
  getMockCourse,
  mockCourses,
} from "@/lib/data/mock-courses";

export async function getCourses() {
  return mockCourses;
}

export async function getCoursesByIds(ids: string[]) {
  const idSet = new Set(ids);
  return mockCourses.filter((course) => idSet.has(course.id));
}

export async function getOwnedCourseIds(_userId?: string) {
  return mockCourses.map((course) => course.id);
}

export async function getCourseBySlug(courseSlug: string) {
  return getMockCourse(courseSlug);
}
