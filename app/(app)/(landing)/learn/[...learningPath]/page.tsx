import { notFound, redirect } from "next/navigation";
import { getMockCourse, getMockCourseLessons } from "@/lib/data/mock-courses";
import { getCoursePracticeTopic } from "@/lib/practice/topics";
import { getGraphDefinition } from "@/lib/graphs";
const courses: Record<string, string> = { 'ap-micro': 'ap-microeconomics', 'ap-macro': 'ap-macroeconomics', 'ib-hl': 'hl-economics', 'ib-sl': 'sl-economics' };
export default async function LearningAlias({ params }: {
    params: Promise<{
        learningPath: string[];
    }>;
}) { const { learningPath: [section, id, slug] } = await params; if (section === 'practice' && id && slug && getCoursePracticeTopic(id, slug))
    redirect(`/practice/${id}/${slug}`); if (section === 'practice' && ['ap-micro', 'ap-macro', 'a-level', 'ib'].includes(id))
    redirect('/practice/' + id); if ((section === 'graph-lab' || section === 'graphs') && getGraphDefinition(id))
    redirect('/graphs/' + id); if (section === 'course' || section === 'lesson') {
    const name = courses[id] ?? id;
    if (getMockCourse(name)) {
        if (section === 'course')
            redirect('/course/' + name);
        if (slug && getMockCourseLessons(name).some(l => l.slug === slug))
            redirect(`/course/${name}/${slug}`);
    }
} notFound(); }
