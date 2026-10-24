"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clapperboard, GraduationCap, Handshake } from "lucide-react";
import styles from "./work.module.css";

const initiatives = [
  { title: "OEP Film", description: "Stories and ideas that make economics education easier to see, discuss, and share.", href: "/work/film", Icon: Clapperboard, tone: "film" },
  { title: "OEP Learn", description: "Free lessons, practice, and tools for students learning economics online.", href: "/work/learn", Icon: GraduationCap, tone: "learn" },
  { title: "OEP Publications", description: "Educational publications designed to travel beyond the screen.", href: "/work/publications", Icon: BookOpen, tone: "publications" },
  { title: "OEP Partnerships", description: "Work with educators, libraries, and local organizations to widen access.", href: "/work/partnerships", Icon: Handshake, tone: "partnerships" },
] as const;

const programs = {
  student: [
    { kind: "WORKSHOPS", art: "workshop", title: "Explore economics together.", description: "Take part in guided sessions that use real-world examples, discussions, and problem-solving activities to explore economic concepts beyond the classroom.", detail: "Guided workshops and discussions", cta: "Explore Workshops", href: "/work/workshops" },
    { kind: "ESSAY COMPETITIONS", art: "essay", title: "Make your case.", description: "Examine important economic questions, develop evidence-based arguments, and challenge your understanding through structured economic writing.", detail: "Research, analysis, and argumentation", cta: "Explore Competitions", href: "/work/competitions" },
    { kind: "ECONOMIC CASE STUDIES", art: "case", title: "Think like an economist.", description: "Work through real economic decisions, examine competing perspectives, and evaluate the trade-offs faced by businesses, governments, and individuals.", detail: "Applied case studies and guided exercises", cta: "Explore Case Studies", href: "/work/case-studies" },
  ],
  teacher: [
    { kind: "CLASSROOM RESOURCES", art: "resources", title: "Resources for the classroom.", description: "Access topic-specific worksheets, graphing exercises, and discussion activities designed to complement existing economics curricula.", detail: "Worksheets and classroom activities", cta: "Browse Resources", href: "/work/resources" },
    { kind: "ASSESSMENTS & PRACTICE", art: "assessment", title: "Go beyond memorization.", description: "Use practice questions, structured-response exercises, and worked explanations to assess conceptual understanding and economic reasoning.", detail: "Practice questions and assessments", cta: "Explore Assessments", href: "/practice" },
    { kind: "EDUCATIONAL WORKSHOPS", art: "collaboration", title: "Bring economics to life.", description: "Work with OEP to explore interactive workshops that connect economic theory with real-world issues and classroom learning.", detail: "Workshops and educational collaboration", cta: "Discuss a Workshop", href: "/contact?type=Workshop" },
  ],
} as const;

function ResourceSketch({ kind }: { kind: "student" | "teacher" }) {
  if (kind === "student") return <svg viewBox="0 0 128 100" fill="none" aria-hidden="true"><rect x="18" y="22" width="86" height="58" rx="4" stroke="currentColor"/><path d="M10 84h102M27 70V33h68v37H27Z" stroke="currentColor"/><path d="m36 62 15-17 13 10 19-20" stroke="currentColor"/><circle cx="94" cy="12" r="3" stroke="currentColor"/><path d="M112 24h8M9 31H2M11 13l-4-5" stroke="currentColor"/></svg>;
  if (kind === "teacher") return <svg viewBox="0 0 128 100" fill="none" aria-hidden="true"><rect x="13" y="20" width="78" height="59" rx="3" stroke="currentColor"/><path d="M6 84h93M26 67V52h10v15M43 67V39h10v28M60 67V46h10v21M23 34h49" stroke="currentColor"/><path d="M81 10h36v25H96l-10 8v-8h-5V10ZM89 18h20M89 24h16" stroke="currentColor"/><path d="m91 65 23 23 6-6-23-23M95 69l-5-11 11 5" stroke="currentColor"/></svg>;
  return null;
}

function ProgramArt({ kind, number, label }: { kind: string; number: number; label: string }) {
  return <div className={`${styles.programArt} ${styles[`art_${kind}`]}`} aria-hidden="true"><span className={styles.artLabel}>0{number} / {label}</span>
    {kind === "workshop" || kind === "collaboration" ? <><div className={styles.discussionBubble}>{kind === "workshop" ? "Why?" : "How?"}</div><div className={`${styles.discussionBubble} ${styles.secondBubble}`}>{kind === "workshop" ? "What if?" : "Together."}</div></> : null}
    {kind === "essay" || kind === "resources" || kind === "assessment" ? <div className={styles.artSheet}><strong>{kind === "essay" ? <>AN IDEA WORTH<br/>EXPLORING.</> : kind === "resources" ? <>TEACH.<br/>DISCUSS.</> : <>THINK.<br/>EXPLAIN.</>}</strong><i/><i/><i/></div> : null}
    {kind === "case" ? <div className={styles.caseArt}><span/><span/><span/><i/></div> : null}
  </div>;
}

export function WorkPage() {
  const [audience, setAudience] = useState<"student" | "teacher">("student");
  return <div className={styles.page}>
    <header className={`${styles.hero} oe-page-hero`}><div className={styles.wrap}><p className={styles.eyebrow}>OUR WORK</p><h1>One mission.<br/>More ways to make it happen.</h1><p className={styles.lead}>We connect free economics learning with the people, publications, and partnerships that help it reach further.</p></div></header>

    <section className={`${styles.wrap} ${styles.initiatives}`} aria-labelledby="work-initiatives"><div className={styles.sectionHead}><div><p className={styles.eyebrow}>THE INITIATIVES</p><h2 id="work-initiatives">Four ways to open access.</h2></div><p>Explore the work behind the Open Economics Project.</p></div><div className={styles.initiativeGrid}>{initiatives.map(({title,description,href,Icon,tone},index)=><Link className={`${styles.initiativeCard} ${styles[tone]}`} href={href} key={title}><div className={styles.initiativeTop}><span>0{index+1} / 04</span><ArrowRight size={20}/></div><Icon className={styles.initiativeIcon} size={44} strokeWidth={1.3}/><div><h3>{title}</h3><p>{description}</p></div></Link>)}</div></section>

    <section className={styles.resources} aria-labelledby="work-resources"><div className={styles.wrap}><div className={styles.sectionHead}><div><p className={styles.eyebrow}>STUDENT AND EDUCATOR RESOURCES</p><h2 id="work-resources">A place to start, for every classroom.</h2></div><p>Course-aligned learning for students, with practical ways for teachers to bring it into class.</p></div><div className={styles.resourceOfferings}><article><div><span className={styles.resourceTag}>FOR STUDENTS</span><h3>Learn the idea. Try the problem.</h3><p>Start with a clear explanation, practice an economic decision, and check your reasoning against a worked answer.</p></div><ResourceSketch kind="student"/></article><article><div><span className={styles.resourceTag}>FOR EDUCATORS</span><h3>Teach it your way.</h3><p>Use short prompts, graphing tasks, and discussion questions as a starting point for your own lessons and assessments.</p></div><ResourceSketch kind="teacher"/></article></div></div></section>

    <section className={`${styles.wrap} ${styles.engage}`} aria-labelledby="work-engage"><div className={styles.sectionHead}><div><p className={styles.eyebrow}>MORE WAYS TO ENGAGE</p><h2 id="work-engage">Put economics into practice.</h2></div><div className={styles.audienceTabs} role="tablist" aria-label="Choose an audience"><button type="button" role="tab" aria-selected={audience==="student"} onClick={()=>setAudience("student")}>For students</button><button type="button" role="tab" aria-selected={audience==="teacher"} onClick={()=>setAudience("teacher")}>For teachers</button></div></div><p className={styles.programIntro}>Explore opportunities and resources that help students apply economic concepts and educators bring them into the classroom.</p><div className={styles.programGrid} role="tabpanel" aria-label={audience==="student"?"For students":"For teachers"}>{programs[audience].map((program,index)=><article className={styles.programCard} key={program.kind}><ProgramArt kind={program.art} number={index+1} label={program.kind}/><div className={styles.programCopy}><h3>{program.title}</h3><p>{program.description}</p><div className={styles.programBottom}><span>{program.detail}</span><Link href={program.href}>{program.cta} <ArrowRight size={15}/></Link></div></div></article>)}</div></section>

    <section className={`${styles.wrap} ${styles.closing} oe-geometric-cta`}><div><p className={styles.eyebrow}>BUILD WITH US</p><h2>Bring economics learning to your community.</h2><p>Tell us what your students, educators, or local institution need.</p></div><Link href="/contact?type=Educational%20partnership">Discuss a partnership <ArrowRight size={17}/></Link></section>
  </div>;
}
