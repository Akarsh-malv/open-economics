import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth/get-session";
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

  const [data, session] = await Promise.all([
    getCourseWithLessons(courseName),
    getServerSession(),
  ]);

  if (!data) notFound();

  return (
    <CourseLayoutWrapper
      course={data.course}
      lessons={data.lessons}
      user={session?.user || null}
    >
      {children}
    </CourseLayoutWrapper>
  );
}
