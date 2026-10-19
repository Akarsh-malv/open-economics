import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Discovery, LearningTools, PracticeHistory } from "@/components/redesign/academy";
import { getCourses } from "@/lib/data/courses";
import { getMockCourseLessons } from "@/lib/data/mock-courses";
import { buildPublicMetadata } from "@/lib/seo";
const titles: Record<string, string> = { saved: 'Saved questions & mistakes', analytics: 'Your practice history', lessons: 'Lessons', explore: 'Explore economics', olympiad: 'Olympiad Studio', flashcards: 'Flashcards', guides: 'Study guides', tests: 'Practice tests' };
export async function generateMetadata({ params }: {
    params: Promise<{
        section: string;
    }>;
}) { const { section } = await params; return buildPublicMetadata({ title: (titles[section] ?? 'Learning') + ' · OEP Learn', description: 'Explore economics with OEP Learn.', path: '/learn/' + section }); }
export default async function Page({ params }: {
    params: Promise<{
        section: string;
    }>;
}) {
    const { section } = await params;
    if (section === 'courses')
        redirect('/courses');
    if (section === 'question-bank' || section === 'practice')
        redirect('/practice');
    if (section === 'graph-lab' || section === 'graphs')
        redirect('/graphs');
    if (!titles[section])
        notFound();
    if (['saved', 'analytics'].includes(section))
        return <div className="academy-content"><div className="eyebrow">YOUR LEARNING, IN CONTEXT</div><h1>{titles[section]}</h1><p>Build understanding from the questions you actually practice.</p><section className="a-section"><PracticeHistory mode={section === 'saved' ? 'saved' : 'analytics'}/></section></div>;
    if (section === 'explore')
        return <div className="academy-content"><div className="eyebrow">ECONOMICS HAS MANY LENSES</div><h1>Follow your curiosity.</h1><p>Specialist course concepts, clearly distinguished from available foundation courses.</p><Discovery /></div>;
    if (section === 'lessons') {
        const courses = await getCourses();
        return <div className="academy-content"><div className="eyebrow">THE FOUNDATION FOR WHAT COMES NEXT</div><h1>One idea at a time.</h1><p>The full existing lesson catalog. Pick up a concept and follow it further.</p>{courses.map(c => <section key={c.id} className="panel a-section"><h2>{c.title}</h2>{getMockCourseLessons(c.slug ?? '').map(l => <Link className="lesson-row" href={`/course/${c.slug}/${l.slug}`} key={l.id}><span>{l.title}<small>{l.type} lesson</small></span><span>Explore →</span></Link>)}</section>)}</div>;
    }
    return <LearningTools section={section}/>;
}
