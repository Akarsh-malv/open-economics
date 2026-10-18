import { notFound } from "next/navigation";
import { QuestionBank } from "@/components/practice/question-bank";
import { getPracticeQuestions } from "@/lib/practice/bank";
import { getCoursePracticeTopic, alevelPracticeTopics } from "@/lib/practice/topics";
import { buildPublicMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return alevelPracticeTopics.map(({ slug }) => ({ topic: slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { topic: slug } = await params;
  const topic = getCoursePracticeTopic("a-level", slug);
  if (!topic) return {};
  return buildPublicMetadata({
    title: `A-level ${topic.number} Practice`,
    description: `Practice ${topic.count} questions on ${topic.title}, with explanations after each answer.`,
    path: `/practice/a-level/${slug}`,
  });
}

export default async function TopicPracticePage({ params }: PageProps) {
  const { topic: slug } = await params;
  const topic = getCoursePracticeTopic("a-level", slug);
  if (!topic) notFound();
  const questions = await getPracticeQuestions(slug, "a-level");
  if (!questions) notFound();
  return <QuestionBank key={slug} topic={topic} questions={questions} course="a-level" />;
}
