import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/footer";
import { getLessonSeoData } from "@/lib/data/seo";
import { getMockLesson, mockLessons } from "@/lib/data/mock-courses";
import {
  APP_NAME,
  buildNoIndexMetadata,
  buildPublicMetadata,
  getCourseDescription,
  getCourseSocialImage,
  NO_INDEX_ROBOTS,
} from "@/lib/seo";
import { LessonLayout } from "./_components/lesson-layout";
import { LessonNavigation } from "./_components/lesson-navigation";

export const revalidate = 3600;

function getLesson({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug: string;
}) {
  return getMockLesson(courseSlug, lessonSlug);
}

export async function generateStaticParams() {
  return mockLessons
    .map((lesson) => ({
      courseName:
        typeof lesson.course === "string" ? "" : lesson.course?.slug || "",
      lessonName: lesson.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseName: string; lessonName: string }>;
}): Promise<Metadata> {
  const { courseName, lessonName } = await params;
  const lesson = await getLessonSeoData(courseName, lessonName);

  if (!lesson) {
    return buildNoIndexMetadata({
      title: "Lesson Not Found",
      description: "The lesson you are looking for does not exist.",
    });
  }

  return buildPublicMetadata({
    absoluteTitle: `${lesson.title} | ${lesson.course.title} | ${APP_NAME}`,
    description: getCourseDescription(
      lesson.course.description,
      lesson.course.title,
    ),
    path: `/course/${courseName}/${lessonName}`,
    images: [getCourseSocialImage(lesson.course.slug, lesson.course.posterAlt)],
    type: "article",
    robots: lesson.free ? undefined : NO_INDEX_ROBOTS,
  });
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseName: string; lessonName: string }>;
}) {
  const { courseName, lessonName } = await params;

  const lesson = await getLesson({
    courseSlug: courseName,
    lessonSlug: lessonName,
  });

  if (!lesson) notFound();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Link
        href={`/course/${courseName}`}
        className="fixed left-4 top-4 z-50 inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/85 px-3 text-sm font-semibold text-neutral-200 shadow-[0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors hover:border-white/18 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oe-accent/70 sm:px-4"
        aria-label="Return to course progress"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Progress</span>
      </Link>
      <div className="grow">
        <LessonLayout lesson={lesson}>
          {lesson.slug !== "scarcity-and-economic-thinking" &&
            lesson.slug !== "production-possibilities-frontier" && (
            <LessonNavigation currentSlug={lesson.slug} />
          )}
        </LessonLayout>
      </div>
      <Footer />
    </div>
  );
}
