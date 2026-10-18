import { ArrowRight, CheckCircle2, Layers3, Sparkles } from "lucide-react";
import Link from "next/link";
import { CourseArt } from "@/components/practice/course-art";
import { practiceCourses } from "@/lib/practice/courses";
import { practiceTopics } from "@/lib/practice/topics";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata = buildPublicMetadata({
  title: "Practice",
  description:
    "Build confidence with topic-based economics practice and explained answers.",
  path: "/practice",
});

export default function PracticePage() {
  return (
    <div className="practice-container">
      <div className="practice-eyebrow">
        <span className="practice-dot" /> THE PRACTICE ROOM
      </div>
      <section className="practice-intro">
        <div>
          <h1>
            A little practice.
            <br />
            <span>A deeper understanding.</span>
          </h1>
          <p>
            Put your knowledge to work. Choose your course, find a topic,
            <br className="practice-desktop-break" /> and learn something from
            every answer.
          </p>
        </div>
        <div className="practice-intro-note">
          <Layers3 size={22} />
          <div>
            <strong>One question at a time.</strong>
            <span>Your pace. Room to get it wrong.</span>
          </div>
        </div>
      </section>
      <div className="practice-section-heading">
        <h2>Choose your course</h2>
        <span>04 pathways</span>
      </div>
      <div className="practice-course-grid">
        {practiceCourses.map((course) => (
          <Link
            href={`/practice/${course.slug}`}
            key={course.slug}
            className={`practice-course-card art-${course.icon}`}
          >
            <div className="practice-card-top">
              <span>{course.tag}</span>
              <ArrowRight size={20} />
            </div>
            <CourseArt type={course.icon} />
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <div className="practice-card-bottom">
              {course.available ? (
                <>
                  <span className="practice-live-dot" /> {practiceTopics.length}{" "}
                  topics ·{" "}
                  {practiceTopics
                    .reduce((sum, topic) => sum + topic.count, 0)
                    .toLocaleString()}{" "}
                  questions
                </>
              ) : (
                <span>Topics coming soon</span>
              )}
              <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </div>
      <section className="practice-featured">
        <div className="practice-featured-icon">01</div>
        <div>
          <div className="practice-eyebrow">
            <Sparkles size={14} /> AP MACRO QUESTION BANK
          </div>
          <h2>Start with scarcity. Keep building from there.</h2>
          <p>
            All {practiceTopics.length} topics are ready, from basic concepts through
            international trade and finance.
          </p>
        </div>
        <Link href="/practice/ap-macro" className="practice-primary">
          Browse all topics <ArrowRight size={17} />
        </Link>
      </section>
      <div className="practice-benefits">
        <span>
          <CheckCircle2 /> Explanations after every answer
        </span>
        <span>
          <CheckCircle2 /> Progress saved on this device
        </span>
        <span>
          <CheckCircle2 /> Always free to practice
        </span>
      </div>
    </div>
  );
}
