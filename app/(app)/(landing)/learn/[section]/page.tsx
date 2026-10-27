import { notFound, redirect } from "next/navigation";
import { LearningTools, PracticeHistory } from "@/components/redesign/academy";
import { SpecialismsPage } from "@/components/redesign/academy-reference";
import { buildPublicMetadata } from "@/lib/seo";
const titles: Record<string, string> = { saved: 'Saved questions & mistakes', analytics: 'Your practice history', lessons: 'Lessons', explore: 'Explore economics', olympiad: 'Olympiad Studio', 'olympiad-case': 'Case analysis', flashcards: 'Flashcards', guides: 'Study guides', tests: 'Practice tests' };
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
    if (section === 'saved') return <div className="academy-content oe-reference-page oe-saved-page"><header className="oe-page-heading"><h1>A place to come back to.</h1><p>Questions you save and mistakes from your practice on this device.</p></header><PracticeHistory mode="saved"/></div>;
    if (section === 'analytics')
        return <div className="academy-content"><div className="eyebrow">YOUR LEARNING, IN CONTEXT</div><h1>{titles[section]}</h1><p>Build understanding from the questions you actually practice.</p><section className="a-section"><PracticeHistory mode="analytics"/></section></div>;
    if (section === 'explore') return <SpecialismsPage/>;
    if (section === 'lessons')
        return <div className="academy-content"><div className="eyebrow">OEP LEARN</div><h1>Lessons</h1><div className="panel a-section"><h2>Under maintenance</h2><p>Our lessons are being prepared for launch.</p></div></div>;
    return <LearningTools section={section}/>;
}
