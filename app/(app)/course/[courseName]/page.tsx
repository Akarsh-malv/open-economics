import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMockCourse,
  mockCourses,
} from "@/lib/data/mock-courses";
import { getCourseSeoData } from "@/lib/data/seo";
import {
  buildNoIndexMetadata,
  buildPublicMetadata,
  getCourseSocialImage,
} from "@/lib/seo";

export async function generateStaticParams() {
  return mockCourses.map((course) => ({ courseName: course.slug }));
}

type Args = {
  params: Promise<{ courseName: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseName: string }>;
}): Promise<Metadata> {
  const { courseName } = await params;
  const course = await getCourseSeoData(courseName);

  if (!course) {
    return buildNoIndexMetadata({
      title: "Course Not Found",
      description: "The course you are looking for does not exist.",
    });
  }

  return buildPublicMetadata({
    title: `${course.title} · Coming soon`,
    description: `${course.title} lessons are being prepared for launch.`,
    path: `/course/${courseName}`,
    images: [getCourseSocialImage(course.slug, course.posterAlt)],
  });
}

export default async function CoursePage({ params: paramsPromise }: Args) {
  const { courseName } = await paramsPromise;
  const course = getMockCourse(courseName);

  if (!course) notFound();

  return (
    <div className="academy-content">
      <div className="eyebrow">OEP LEARN · COURSE</div>
      <h1>{course.title}</h1>
      <div className="panel a-section">
        <h2>Coming soon</h2>
        <p>Lessons for this course are being prepared for launch.</p>
      </div>
    </div>
  );
}
