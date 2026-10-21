"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { ArrowRight, Bookmark, ChartLine, Globe, Info, Landmark, LayoutGrid, Lightbulb, Play, Scale, Target } from "lucide-react";
import { useCourseFamily } from "@/lib/redesign/course-family";
import type { HistoryRow } from "@/lib/redesign/history";
import blueprint from "@/lib/redesign/academy-content.json";

const pathways = [
  { id: "macro", title: "AP Macroeconomics", tag: "AP", family: "AP", icon: ChartLine, learn: "/course/ap-macroeconomics", practice: "/practice/ap-macro" },
  { id: "micro", title: "AP Microeconomics", tag: "AP", family: "AP", icon: Scale, learn: "/course/ap-microeconomics", practice: "/practice/ap-micro" },
  { id: "ib", title: "IB Economics", tag: "IB · SL & HL", family: "IB", icon: Globe, learn: "/courses?family=IB", practice: "/practice/ib" },
  { id: "alevel", title: "Cambridge Economics", tag: "AS & A LEVEL", family: "A-level", icon: Landmark, learn: "/practice/a-level", practice: "/practice/a-level" },
  { id: "foundations", title: "Economics Foundations", tag: "OPEN LEARNING", family: "All", icon: Lightbulb, learn: "/learn/lessons", practice: "/practice/ap-micro" },
  { id: "olympiad", title: "Olympiad Preparation", tag: "COMPETITION", family: "All", icon: Target, learn: "/learn/olympiad", practice: "/learn/olympiad" },
] as const;

export function PathwayCards({ mode = "learn", heading = false }: { mode?: "learn" | "practice"; heading?: boolean }) {
  const [family] = useCourseFamily();
  const visible = pathways.filter(course => family === "All" || course.family === family);
  return <section className="oe-pathways" aria-label={mode === "learn" ? "Your courses" : "Practice courses"}>
    {heading && <div className="section-head"><h2><LayoutGrid size={21}/>Your courses</h2><span className="pill">{visible.length} pathways</span></div>}
    <div className="oe-pathway-grid">{visible.map(({ id, title, tag, icon: Icon, ...course }) => <Link className={`oe-pathway-card tone-${id}`} key={id} href={course[mode]}>
      <small>{tag}</small><h3>{title}</h3><span className="oe-pathway-open">{id === "olympiad" ? "Explore" : "Open"}<ArrowRight size={13}/></span>
      <span className="oe-pathway-art" aria-hidden="true"><Icon size={68} strokeWidth={1.25}/></span>
    </Link>)}</div>
  </section>;
}

export function AcademyNotice({ children }: { children: ReactNode }) {
  return <div className="oe-academy-notice"><Info size={18}/><p>{children}</p></div>;
}

export function SavedHistoryPanels({ rows }: { rows: HistoryRow[] }) {
  const saved = rows.flatMap(row => row.bookmarks.map(id => ({ row, id })));
  const mistakes = rows.flatMap(row => Object.entries(row.attempts).filter(([, answer]) => !answer.correct).map(([id]) => ({ row, id: Number(id) })));
  return <><div className="oe-saved-columns">{[
    { id: "saved", title: "Saved questions", count: `${saved.length} saved`, items: saved, empty: "Nothing saved yet.", description: "Save a question in the practice bank to come back to it here." },
    { id: "mistakes", title: "Review mistakes", count: `${mistakes.length} to revisit`, items: mistakes, empty: "A fresh start.", description: "Questions you get wrong will appear here so you can try them again." },
  ].map(group => <section className="oe-review-panel" key={group.id} aria-label={group.title}>
    <div className="section-head"><h2>{group.title}</h2><span className="pill">{group.count}</span></div>
    {group.items.length ? <div className="oe-review-entries">{group.items.map(({ row, id }) => <Link className="lesson-row" key={`${row.course}-${row.topic}-${id}`} href={`/practice/${row.course}/${row.topic}?q=${id}`}><span><strong>{row.title}</strong><small>{row.courseName} · Question {id}</small></span><ArrowRight size={18}/></Link>)}</div> : <div className="oe-review-empty"><Bookmark size={31} strokeWidth={1.6}/><h3>{group.empty}</h3><p>{group.description}</p><Link className="btn" href="/practice">Open practice<ArrowRight size={22}/></Link></div>}
  </section>)}</div><AcademyNotice>Saved questions and mistakes reflect your actual practice history on this device. Clearing browser data removes these records.</AcademyNotice></>;
}

export function SpecialismCards({ full = false }: { full?: boolean }) {
  return <div className={'specialism-grid oe-specialism-cards' + (full ? ' full' : '')}>{blueprint.specialisms.map(course => <Link className="specialism-card" href={'/learn/specialism/' + course.id} key={course.id}>
    <div className={'subject-art ' + course.art} aria-hidden="true"><span/><span/><span/><span/><span/></div>
    <div><small>{full ? course.tag.toUpperCase() : 'COURSE CONCEPT'}</small><h3>{course.name}</h3><p>{course.desc}</p>{full && <span className="text-link">Explore the concept<ArrowRight size={16}/></span>}</div>
  </Link>)}</div>;
}

export function SpecialismsPage() {
  return <div className="academy-content oe-reference-page oe-specialisms-page"><header className="oe-page-heading"><div className="eyebrow">ECONOMICS HAS MANY LENSES</div><h1>Follow your curiosity.</h1><p>Four specialist course concepts, each beginning with a question about the world.</p></header><SpecialismCards full/><AcademyNotice>These are curriculum concepts with one original introductory question each. Full specialist courses are in development.</AcademyNotice></div>;
}

export function OlympiadArtwork({ studio = false }: { studio?: boolean }) {
  return <div className="olympiad-art" aria-hidden="true"><span className="medal-ring"/><span className="medal-ring second"/><span>{studio ? <>REASON.<br/>APPLY.<br/>DEFEND.</> : <>THINK.<br/>CONNECT.<br/>EXPLAIN.</>}</span></div>;
}

export function FilmTile({ title, subtitle, kind = "concept" }: { title: string; subtitle: string; kind?: "concept" | "workshop" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <><button type="button" className={'film-tile ' + kind} onClick={() => dialog.current?.showModal()} aria-label={`View video: ${title}`}><span className="film-shade"/><span className="play-disc"><Play size={21}/></span><span className="film-meta"><small>{kind === 'workshop' ? 'AI ILLUSTRATION · VIDEO PLACEHOLDER' : 'VIDEO PLACEHOLDER'}</small><strong>{title}</strong><span>{subtitle}</span></span></button><dialog ref={dialog} className="oe-dialog" aria-label={title}><h2>{title}</h2><p>The recording is being prepared. Captions and a transcript will accompany the video.</p><button type="button" className="btn small" onClick={() => dialog.current?.close()}>Close</button></dialog></>;
}

const tracks = {
  Reasoning: { title: "Think through the unfamiliar.", description: "Connect concepts, read evidence and explain the mechanism behind a result.", skills: ["Economic mechanisms", "Graph interpretation", "Quantitative reasoning"], label: "Try original practice questions", href: "/practice" },
  "Financial literacy": { title: "Make choices across time and risk.", description: "Reason about interest, inflation, diversification and the trade-offs behind financial decisions.", skills: ["Interest and compounding", "Real versus nominal values", "Risk and diversification"], label: "Explore financial economics", href: "/learn/specialism/financial" },
  "Case analysis": { title: "Build a recommendation that holds up.", description: "Define the problem, use relevant evidence, compare options and acknowledge uncertainty.", skills: ["Problem framing", "Evidence and assumptions", "Trade-offs and communication"], label: "Explore a sample case", href: "/learn/olympiad-case" },
};

export function OlympiadStudio() {
  const [track, setTrack] = useState<keyof typeof tracks>("Reasoning");
  const selected = tracks[track];
  return <div className="academy-content oe-reference-page oe-olympiad-page"><section className="olympiad-banner studio-hero"><div><div className="eyebrow">OEP LEARN / OLYMPIAD STUDIO</div><h1>For the challenge<br/>of thinking further.</h1><p>A proposed preparation hub for ambitious economics learners.</p><span className="pill">Independent preparation</span></div><OlympiadArtwork studio/></section>
    <div className="studio-tabs" role="group" aria-label="Olympiad preparation track">{(Object.keys(tracks) as Array<keyof typeof tracks>).map(name => <button type="button" key={name} className={track === name ? 'active' : ''} aria-pressed={track === name} onClick={() => setTrack(name)}>{name}</button>)}</div>
    <div className="oe-studio-columns"><section className="panel oe-selected-track" aria-live="polite"><div className="eyebrow">YOUR SELECTED TRACK</div><h2>{selected.title}</h2><p>{selected.description}</p><div className="skill-pills">{selected.skills.map(skill => <span className="pill" key={skill}>{skill}</span>)}</div><Link className="btn small" href={selected.href}>{selected.label}<ArrowRight size={17}/></Link>{track === 'Reasoning' && <Link className="text-link oe-track-lab" href="/graphs">Open graph lab<ArrowRight size={16}/></Link>}</section>
      <section className="panel oe-study-plan"><div className="eyebrow">A PROPOSED PRACTICE LOOP</div>{[['01', 'Understand', 'Review a concept and its assumptions.'], ['02', 'Apply', 'Work through a new problem or case.'], ['03', 'Explain', 'Defend the reasoning and review the gaps.']].map(([number, title, copy]) => <div className="oe-study-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</section></div>
    <section className="a-section oe-studio-film"><FilmTile title="How an economist approaches a new problem." subtitle="Coach walkthrough · Video placeholder"/></section>
    <AcademyNotice>Designed as a foundation for future outreach to the International Economics Olympiad, World Economics Cup and national programs. No affiliation, endorsement, official syllabus alignment or score prediction is claimed.</AcademyNotice>
  </div>;
}

export function OlympiadCase() {
  return <div className="academy-content oe-reference-page"><header className="oe-page-heading"><div className="eyebrow">ORIGINAL SAMPLE / CASE ANALYSIS</div><h1>A library. A budget. A choice.</h1><p>A community library has a hypothetical $1,200 learning budget. It can run six $200 workshops for 15 students each, or provide 40 individual $30 learning packs. Workshop attendance may overlap.</p></header><div className="oe-studio-columns"><section className="panel"><h2>Make a recommendation.</h2><ol className="case-prompts"><li>What outcome should the library prioritize?</li><li>Which costs and benefits are missing?</li><li>Can 90 workshop places be treated as 90 unique learners?</li><li>What evidence would change your decision?</li></ol></section><section className="panel"><div className="eyebrow">THINK BEFORE REVEALING</div><details><summary>Compare the costs</summary><p>Workshops cost $1,200 / 90 = $13.33 per attendance place. Learning packs cost $30 each. Attendance places may repeat, while packs do not guarantee use or learning.</p></details><details><summary>What makes a strong recommendation?</summary><p>Define the intended outcome, consider accessibility and repeat attendance, state uncertainty, and propose a small pilot with evidence collection. A lower cost per place alone does not establish greater impact.</p></details></section></div><Link className="text-link a-section" href="/learn/olympiad">Back to the studio<ArrowRight size={16}/></Link></div>;
}
