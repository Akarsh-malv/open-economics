import Link from "next/link";
import { notFound } from "next/navigation";
import blueprint from "@/lib/redesign/blueprint.json";
export async function generateMetadata({ params }: {
    params: Promise<{
        id: string;
    }>;
}) { const { id } = await params; return { title: (blueprint.specialisms.find(c => c.id === id)?.name ?? 'Specialism') + ' · OEP Learn' }; }
export default async function Page({ params }: {
    params: Promise<{
        id: string;
    }>;
}) { const { id } = await params; const c = blueprint.specialisms.find(c => c.id === id); if (!c)
    notFound(); return <div className="academy-content"><div className="specialism-heading"><div className={'subject-art ' + c.art} aria-hidden="true"><span /><span /><span /><span /><span /></div><div><div className="eyebrow">SPECIALISM</div><h1>{c.name}</h1><p>{c.desc}</p><span className="pill">Specialist economics</span></div></div><div className="grid two a-section"><section className="panel"><h2>Where this could take you.</h2>{c.topics.map((t, i) => <div className="lesson-row" key={t}><span>0{i + 1} {t}<small>Module</small></span></div>)}</section><section className="panel curiosity-question"><div className="eyebrow">A QUESTION TO START WITH</div><h2>{c.question}</h2><details><summary>Explore an explanation</summary><p>{c.answer}</p></details></section></div><div className="panel a-section"><div className="eyebrow">VIDEO</div><h2>Inside {c.name.toLowerCase()}</h2><p>No approved recording is available yet.</p></div><div className="actions a-section"><Link className="btn" href="/learn/lessons">Explore the foundations →</Link><Link className="text-link" href="/learn/explore">Back to specialisms</Link></div></div>; }
