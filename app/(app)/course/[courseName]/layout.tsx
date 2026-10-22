import { notFound } from "next/navigation";
import { getMockCourse, getMockCourseLessons } from "@/lib/data/mock-courses";
import { CourseLayoutWrapper } from "./_components/course-layout-wrapper";

const getCourseWithLessons = (courseSlug: string) => {
  const course = getMockCourse(courseSlug);
  if (!course) return null;
  return {
    course,
    lessons: getMockCourseLessons(courseSlug),
  };
};

type Args = {
  params: Promise<{ courseName: string }>;
  children: React.ReactNode;
};

export default async function CourseLayout({
  params: paramsPromise,
  children,
}: Args) {
  const { courseName } = await paramsPromise;

  const data = getCourseWithLessons(courseName);

  if (!data) notFound();

  return (
    <CourseLayoutWrapper
      course={data.course}
      lessons={data.lessons}
    >
      {children}
    </CourseLayoutWrapper>
  );
}
