import { ArrowLeft, ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseArt } from "@/components/practice/course-art";
import { practiceCourses } from "@/lib/practice/courses";
import { getCoursePracticeTopics } from "@/lib/practice/topics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  return {
    title: `${practiceCourses.find((c) => c.slug === course)?.name ?? "Course"} Practice`,
  };
}

export default async function CoursePracticePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: slug } = await params;
  const course = practiceCourses.find((c) => c.slug === slug);
  if (!course) notFound();
  const practiceTopics = getCoursePracticeTopics(slug);
  return (
    <div className="practice-container">
      <nav className="practice-breadcrumb" aria-label="Breadcrumb">
        <Link href="/practice">Practice</Link>
        <ChevronRight size={14} />
        <span>{course.name}</span>
      </nav>
      <section className="practice-course-heading">
        <div>
          <div className="practice-eyebrow">QUESTION BANK</div>
          <h1>{course.fullName}</h1>
          <p>{course.description} Choose a topic to get started.</p>
        </div>
        <div className={`practice-heading-art art-${course.icon}`}>
          <CourseArt type={course.icon} />
        </div>
      </section>
      <nav className="practice-course-tabs" aria-label="Practice courses">
        {practiceCourses.map((c) => (
          <Link
            key={c.slug}
            href={`/practice/${c.slug}`}
            aria-current={c.slug === slug ? "page" : undefined}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      {course.available ? (
        <div className="practice-topic-section">
          <p className="practice-catalog-summary">
            {practiceTopics.length} topics ·{" "}
            {practiceTopics
              .reduce((sum, topic) => sum + topic.count, 0)
              .toLocaleString()}{" "}
            {slug === "ib" ? "Paper 1 question pairs" : "questions"} · Organized by unit
          </p>
          {Array.from(new Set(practiceTopics.map((topic) => topic.unit))).map((unit) => {
            const topics = practiceTopics.filter(
              (topic) => topic.unit === unit,
            );
            return (
              <section key={unit} className="practice-unit-section">
                <div className="practice-section-heading">
                  <h2>
                    <span className="practice-unit">
                      {String(unit).padStart(2, "0")}
                    </span>{" "}
                    {topics[0].unitName}
                  </h2>
                  <span>{topics.length} topics</span>
                </div>
                <div className="practice-topic-list">
                  {topics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/practice/${slug}/${topic.slug}`}
                      className="practice-topic-row"
                    >
                      <span className="practice-topic-number">
                        {topic.number}
                      </span>
                      <div>
                        <div className="practice-topic-kicker">
                          TOPIC {topic.number} <span>{topic.count} QUESTIONS</span>
                        </div>
                        <h3>{topic.title}</h3>
                        <p>
                          {slug === "ib" ? "Paper 1 parts (a) and (b)" : "Practice questions"} <span>·</span> {slug === "ib" ? "Draft your response" : "Answer explanations"}
                          {topic.graphs > 0 && (
                            <>
                              {" "}
                              <span>·</span> Diagrams
                            </>
                          )}
                        </p>
                      </div>
                      <span className="practice-topic-action">
                        Start practice <ArrowRight size={19} />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <section className="practice-empty">
          <BookOpen size={32} />
          <h2>A new place to practice.</h2>
          <p>
            The {course.name} question bank is being prepared. In the meantime,
            explore our AP Macro question bank.
          </p>
          <Link className="practice-primary" href="/practice/ap-macro">
            Explore AP Macro <ArrowRight size={17} />
          </Link>
        </section>
      )}
      <Link href="/practice" className="practice-back">
        <ArrowLeft size={16} /> All practice courses
      </Link>
    </div>
  );
}
