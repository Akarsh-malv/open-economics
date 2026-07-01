import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState, EmptyStateCenterWrapper } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  getMockCourse,
  getMockCourseChapters,
  getMockCourseLessons,
  mockCourses,
} from "@/lib/data/mock-courses";
import { getCourseSeoData } from "@/lib/data/seo";
import {
  buildNoIndexMetadata,
  buildPublicMetadata,
  getCourseDescription,
  getCourseSocialImage,
} from "@/lib/seo";
import { CoursePathway } from "./_components/course-pathway";

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
    title: `${course.title} Pathway`,
    description: getCourseDescription(course.description, course.title),
    path: `/course/${courseName}`,
    images: [getCourseSocialImage(course.slug, course.posterAlt)],
  });
}

export default async function CoursePage({ params: paramsPromise }: Args) {
  const { courseName } = await paramsPromise;
  const course = getMockCourse(courseName);

  if (!course) notFound();

  const lessons = getMockCourseLessons(courseName);
  const chapters = getMockCourseChapters(courseName);

  if (lessons.length === 0) {
    return (
      <EmptyStateCenterWrapper>
        <EmptyState
          icon={BookOpen}
          title="No lessons available"
          description="This course does not have lessons yet."
          action={
            <Button asChild size="lg">
              <Link href="/">Go home</Link>
            </Button>
          }
        />
      </EmptyStateCenterWrapper>
    );
  }

  const units = chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    modules: lessons
      .filter(
        (lesson) =>
          typeof lesson.chapter !== "string" &&
          lesson.chapter?.id === chapter.id,
      )
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug ?? "",
        href: `/course/${courseName}/${lesson.slug}`,
        description: getLessonPreview(lesson.slug ?? ""),
      })),
  }));

  return (
    <CoursePathway
      course={{
        title: course.title,
        slug: course.slug ?? courseName,
        level: course.title.includes("IB") ? "IB" : "AP",
        description: getShortDescription(course.slug ?? ""),
      }}
      unitCount={chapters.length}
      moduleCount={lessons.length}
      units={units}
    />
  );
}

function getShortDescription(courseSlug: string) {
  if (courseSlug === "ap-microeconomics") {
    return "Examine markets, individual choices, firm behavior, and the role of scarcity.";
  }

  if (courseSlug === "ap-macroeconomics") {
    return "Examine the economy as a whole and the forces that shape it.";
  }

  if (courseSlug === "sl-economics") {
    return "Build core economics understanding through clear concepts and diagrams.";
  }

  return "Explore advanced economics analysis, diagrams, and policy applications.";
}

function getLessonPreview(slug: string) {
  if (slug === "production-possibilities-frontier") {
    return "Explore scarcity, tradeoffs, efficiency, and opportunity cost through a visual model.";
  }

  if (slug.includes("inflation")) {
    return "Explore how economists measure price changes and cost of living.";
  }

  if (slug.includes("demand") || slug.includes("supply")) {
    return "Practice reading market behavior through curves, shifts, and equilibrium.";
  }

  if (slug.includes("policy")) {
    return "Connect policy tools to incentives, outcomes, and economic tradeoffs.";
  }

  return "Start this topic with a focused explanation and guided economics practice.";
}
