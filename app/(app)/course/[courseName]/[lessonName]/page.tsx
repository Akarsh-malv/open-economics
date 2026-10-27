import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/redesign/site-shell";
import { getMockLesson, mockLessons } from "@/lib/data/mock-courses";
import { buildNoIndexMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return mockLessons.map((lesson) => ({
    courseName:
      typeof lesson.course === "string" ? "" : lesson.course?.slug || "",
    lessonName: lesson.slug,
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  return buildNoIndexMetadata({
    title: "Lessons under maintenance · OEP Learn",
    description: "OEP Learn lessons are being prepared for launch.",
  });
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseName: string; lessonName: string }>;
}) {
  const { courseName, lessonName } = await params;
  const lesson = getMockLesson(courseName, lessonName);

  if (!lesson) notFound();

  return (
    <SiteShell>
      <div className="academy-content">
        <div className="eyebrow">OEP LEARN · LESSON</div>
        <h1>{lesson.title}</h1>
        <div className="panel a-section">
          <h2>Under maintenance</h2>
          <p>This lesson is being prepared for launch.</p>
        </div>
      </div>
    </SiteShell>
  );
}
