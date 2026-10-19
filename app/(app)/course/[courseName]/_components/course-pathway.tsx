"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCoursePracticeTopics } from "@/lib/practice/topics";
type Module = {
    id: string;
    title: string;
    slug: string;
    href: string;
    description: string;
};
export function CoursePathway({ course, unitCount, moduleCount, units }: {
    course: {
        title: string;
        slug: string;
        level: string;
        description: string;
    };
    unitCount: number;
    moduleCount: number;
    units: {
        id: string;
        title: string;
        modules: Module[];
    }[];
}) { const [tab, setTab] = useState('Lessons'); const [query, setQuery] = useState(''); const [complete, setComplete] = useState<string[]>([]); const [error, setError] = useState(false); const modules = units.flatMap(u => u.modules); useEffect(() => { try {
    setComplete(modules.filter(m => localStorage.getItem(`oe-lesson-complete-${course.slug}-${m.slug}`) === 'true').map(m => m.id));
}
catch {
    setError(true);
} }, [course.slug, units]); const practice = course.slug === 'ap-microeconomics' ? 'ap-micro' : course.slug === 'ap-macroeconomics' ? 'ap-macro' : ['hl-economics', 'sl-economics'].includes(course.slug) ? 'ib' : null; const topics = practice ? getCoursePracticeTopics(practice) : []; return <div className="academy-content"><Link className="text-link" href="/courses">← All courses</Link><header className="oe-course-header"><div className="eyebrow">OEP LEARN / {course.title.toUpperCase()}</div><h1>{course.title}</h1><p>{course.description}</p><div className="oe-course-meta"><span>{unitCount} units</span><span>{moduleCount} available lessons</span><span>{complete.length} marked complete in this browser</span></div>{modules[0] && <Link className="btn" href={(modules.find(m => !complete.includes(m.id)) ?? modules[0]).href}>Continue learning →</Link>}</header><div className="tabs oe-resource-tabs" aria-label="Course resources">{['Lessons', 'Question Bank', 'Graphs', 'Study resources'].map(t => <button key={t} className={t === tab ? 'active' : ''} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</div>{error && <p role="status">Browser completion storage is unavailable.</p>}{(tab === 'Lessons' || tab === 'Question Bank') && <label className="oe-search oe-course-search"><span className="sr-only">Search {tab.toLowerCase()}</span><input placeholder={'Search ' + tab.toLowerCase()} value={query} onChange={e => setQuery(e.target.value)}/></label>}{tab === 'Lessons' ? <div className="oe-course-units">{units.map((u, i) => { const list = u.modules.filter(m => (m.title + ' ' + u.title).toLowerCase().includes(query.toLowerCase())); if (!list.length)
    return null; return <section className="panel" key={u.id}><div className="eyebrow">UNIT {String(i + 1).padStart(2, '0')}</div><h2>{u.title}</h2>{list.map(m => <Link key={m.id} className="lesson-row" href={m.href}><span><strong>{m.title}</strong><small>{m.description || 'Explore this concept'}</small></span><span>{complete.includes(m.id) ? '✓ Complete' : 'Explore →'}</span></Link>)}</section>; })}{!modules.some(m => m.title.toLowerCase().includes(query.toLowerCase())) && query && <p>No lessons match this search.</p>}</div> : tab === 'Question Bank' ? <section className="panel a-section"><h2>{practice === 'ib' ? 'Practice Paper 1 responses.' : 'Practice with explanations.'}</h2>{topics.length ? topics.filter(t => t.title.toLowerCase().includes(query.toLowerCase())).map(t => <Link key={t.slug} className="lesson-row" href={`/practice/${practice}/${t.slug}`}><span>{t.number} · {t.title}<small>{t.count} {practice === 'ib' ? 'original question pairs' : 'original questions'}</small></span><span>Practice →</span></Link>) : <><p>Explore the available topic-based question banks.</p><Link className="btn small" href="/practice">Explore all question banks</Link></>}</section> : tab === 'Graphs' ? <section className="panel a-section"><h2>Make the model move.</h2><p>The full AP Micro and Macro graph library, with the existing controls, calculations, and reset behavior.</p><div className="actions"><Link className="btn" href="/graphs">Open interactive graph lab →</Link></div></section> : <section className="panel a-section"><h2>Review, connect, remember.</h2><p>Use the existing lessons alongside introductory flashcards and practice explanations.</p><div className="actions"><Link className="btn" href="/learn/flashcards">Flashcards</Link><Link className="btn light" href="/learn/guides">Study guides</Link><Link className="text-link" href="/learn/tests">Practice formats →</Link></div></section>}</div>; }
