import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { PathwayCards } from "@/components/redesign/academy-reference";
import { practiceCourses } from "@/lib/practice/courses";
import { getCoursePracticeTopics, practiceTopics } from "@/lib/practice/topics";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata = buildPublicMetadata({
  title: "Practice",
  description: "Build confidence with topic-based economics practice and explained answers.",
  path: "/practice",
});

export default function PracticePage() {
  const total = practiceCourses.reduce((sum, course) => sum + getCoursePracticeTopics(course.slug).reduce((n, topic) => n + topic.count, 0), 0);
  const firstTopic = practiceTopics[0];
  return <div className="academy-content oe-reference-page oe-question-bank-page">
    <header className="oe-page-heading"><h1>Your practice starts here.</h1><div className="oe-heading-row"><p>Choose a course, then narrow down to a unit or concept.</p><span className="pill">Original practice questions</span></div></header>
    <PathwayCards mode="practice"/>
    <section className="panel oe-practice-start"><h2>Put an idea into practice.</h2><p>Explore {total.toLocaleString()} original questions and question pairs across AP, A-level and IB Economics. Save questions and revisit mistakes as you go.</p><div className="actions"><Link className="btn oe-practice-blue" href={`/practice/ap-macro/${firstTopic.slug}`}>Start practice<Play size={16}/></Link><Link className="btn light" href="/practice/ap-macro">Browse AP Macro<ArrowRight size={17}/></Link></div></section>
  </div>;
}
