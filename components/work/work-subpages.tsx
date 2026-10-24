import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import styles from "./work.module.css";

const placeholders = {
  film: { title: "Bringing OEP Film to life.", label: "OEP FILM", status: "Under development", lead: "We're preparing short films and video content that bring the ideas, people, and visual stories behind the Open Economics Project into view.", detail: "This space will make economic ideas easier to see, discuss, and share. We're developing the first stories now.", words: ["SEE.", "LEARN.", "DISCOVER."] },
  publications: { title: "Making economics readable everywhere.", label: "OEP PUBLICATIONS", status: "Under development", lead: "We're developing clear, accessible economics publications for students and educators, online and beyond the screen.", detail: "The collection will bring economic ideas into libraries, schools, and communities through resources designed to be read, shared, and used.", words: ["READ.", "THINK.", "SHARE."] },
  partnerships: { title: "Building access together.", label: "OEP PARTNERSHIPS", status: "Under development", lead: "We're shaping ways to work with educators, libraries, and local organizations to bring free economics education to more communities.", detail: "Our partnership space is taking shape. It will show how institutions can collaborate with OEP and help resources reach learners where they are.", words: ["CONNECT.", "BUILD.", "REACH."] },
  workshops: { title: "Bringing economics into the room.", label: "WORKSHOPS", status: "Under development", lead: "Guided workshops are being developed to help students explore economic ideas through examples, discussion, and problem solving.", detail: "We're designing sessions that make room for questions, different perspectives, and practical applications beyond the classroom.", words: ["ASK.", "DISCUSS.", "APPLY."] },
  competitions: { title: "Making room for strong arguments.", label: "ESSAY COMPETITIONS", status: "Under development", lead: "We're developing essay competitions that invite students to investigate economic questions and make evidence-based arguments.", detail: "This space will share opportunities to research, write, and challenge your thinking as the first competitions take shape.", words: ["QUESTION.", "RESEARCH.", "ARGUE."] },
  "case-studies": { title: "Real decisions. Economic thinking.", label: "ECONOMIC CASE STUDIES", status: "Coming soon", lead: "Applied case studies are coming soon to help students work through real economic decisions and competing perspectives.", detail: "Each study will invite learners to weigh evidence, identify trade-offs, and explain the reasoning behind a choice.", words: ["OBSERVE.", "WEIGH.", "DECIDE."] },
} as const;

export type PlaceholderSlug = keyof typeof placeholders;
export const placeholderSlugs = Object.keys(placeholders) as PlaceholderSlug[];

function ComingVisual({ slug, words }: { slug: PlaceholderSlug; words: readonly string[] }) {
  return <div className={`${styles.comingVisual} ${styles[`visual_${slug.replaceAll("-", "_")}`]}`} aria-hidden="true">
    <span className={styles.visualWordOne}>{words[0]}</span><span className={styles.visualWordTwo}>{words[1]}</span><span className={styles.visualWordThree}>{words[2]}</span>
    <svg className={styles.visualArt} viewBox="0 0 600 460" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="comingA" x1="58" y1="70" x2="528" y2="370" gradientUnits="userSpaceOnUse"><stop stopColor="#d9ab48"/><stop offset=".55" stopColor="#183b5b"/><stop offset="1" stopColor="#2795a2"/></linearGradient>
        <linearGradient id="comingB" x1="532" y1="55" x2="86" y2="410" gradientUnits="userSpaceOnUse"><stop stopColor="#1c8e9c"/><stop offset=".55" stopColor="#d8a63d"/><stop offset="1" stopColor="#173c5d"/></linearGradient>
        <linearGradient id="comingFill" x1="145" y1="140" x2="450" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#e4eff3"/><stop offset="1" stopColor="#f7f9fb"/></linearGradient>
      </defs>
      {slug === "film" && <>
        {Array.from({length:9},(_,i)=><path key={`a${i}`} d={`M36 ${235+i*7} C156 ${255+i*5}, 164 ${100+i*7}, 270 ${163+i*7} C359 ${215+i*6}, 367 ${351-i*5}, 566 ${238+i*5}`} stroke="url(#comingA)" strokeWidth={i===3?3:1.2} opacity={i===3?.95:.33}/>) }
        {Array.from({length:9},(_,i)=><path key={`b${i}`} d={`M38 ${283+i*4} C153 ${158+i*7}, 210 ${314+i*5}, 310 ${292-i*6} C420 ${261-i*5}, 464 ${119+i*5}, 570 ${222+i*4}`} stroke="url(#comingB)" strokeWidth={i===4?3:1.2} opacity={i===4?.95:.32}/>) }
        <circle cx="302" cy="229" r="56" fill="white" fillOpacity=".72" stroke="#dce8ef"/><path d="m288 201 40 28-40 28v-56Z" fill="#d8a742"/>
      </>}
      {slug === "publications" && <>
        <path d="M82 128c73-31 144-27 216 13v226c-69-39-143-43-216-12V128Z" fill="url(#comingFill)" stroke="#224d69" strokeWidth="4"/>
        <path d="M518 128c-73-31-144-27-216 13v226c69-39 143-43 216-12V128Z" fill="url(#comingFill)" stroke="#224d69" strokeWidth="4"/>
        <path d="M302 141v226M109 167c58-14 113-9 165 16M109 206c58-14 113-9 165 16M109 245c58-14 113-9 165 16M490 167c-58-14-113-9-165 16M490 206c-58-14-113-9-165 16M490 245c-58-14-113-9-165 16" stroke="#8baabc" strokeWidth="3" strokeLinecap="round"/>
        <path d="M148 330c53-3 100 7 154 37 54-30 101-40 154-37" stroke="#d8a742" strokeWidth="10" strokeLinecap="round"/>
      </>}
      {slug === "partnerships" && <>
        <circle cx="245" cy="228" r="124" stroke="#d7a641" strokeWidth="29"/><circle cx="359" cy="228" r="124" stroke="#2893a1" strokeWidth="29" opacity=".91"/>
        <circle cx="302" cy="228" r="26" fill="#123451"/><circle cx="245" cy="104" r="8" fill="#123451"/><circle cx="359" cy="352" r="8" fill="#123451"/>
      </>}
      {slug === "workshops" && <>
        <circle cx="300" cy="225" r="112" stroke="#d5e2e9" strokeWidth="2" strokeDasharray="5 9"/><circle cx="300" cy="225" r="62" fill="#e9f2f4" stroke="#2a8d9a" strokeWidth="6"/>
        <path d="M300 163V78M354 257l95 63M245 259l-100 65" stroke="#8eacbc" strokeWidth="3"/>
        <circle cx="300" cy="75" r="33" fill="#d8a641"/><circle cx="457" cy="326" r="33" fill="#1e4967"/><circle cx="136" cy="328" r="33" fill="#2b93a1"/><circle cx="300" cy="225" r="19" fill="#1e4967"/>
      </>}
      {slug === "competitions" && <>
        <path d="M167 100h219l54 55v227H167V100Z" fill="url(#comingFill)" stroke="#234c68" strokeWidth="4"/><path d="M386 101v55h54" stroke="#234c68" strokeWidth="4"/><path d="M206 196h187M206 229h187M206 262h127" stroke="#9eb5c3" strokeWidth="7" strokeLinecap="round"/>
        <path d="m349 337 99-99 28 28-99 99-41 15 13-43Z" fill="#d8a641" stroke="#224b69" strokeWidth="3"/><path d="m449 239 27 27" stroke="#224b69" strokeWidth="3"/>
      </>}
      {slug === "case-studies" && <>
        <rect x="91" y="89" width="418" height="280" rx="12" fill="url(#comingFill)" stroke="#d2e0e8" strokeWidth="3"/>
        <path d="M137 318h331M137 318V143" stroke="#51758d" strokeWidth="3"/>
        <path d="M138 298c66-6 87-124 152-119 54 4 65 101 116 59 23-19 42-38 61-88" stroke="#2994a1" strokeWidth="10" strokeLinecap="round"/>
        <path d="M138 244c57-3 86 56 146 43 63-13 90-91 183-95" stroke="#d8a641" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="290" cy="179" r="11" fill="#123c59"/><circle cx="406" cy="238" r="11" fill="#123c59"/>
      </>}
    </svg>
  </div>;
}

export function WorkPlaceholder({ slug }: { slug: PlaceholderSlug }) {
  const item = placeholders[slug];
  return <main className={styles.comingPage}><div className={styles.comingInner}>
    <div className={styles.comingTop}><Link href="/work">← Our Work</Link><span>{item.status}</span></div>
    <div className={styles.comingGrid}><div className={styles.comingCopy}><p className={styles.comingEyebrow}>THE OPEN ECONOMICS PROJECT / {item.label}</p><h1>{item.title}</h1><p className={styles.comingLead}>{item.lead}</p><p className={styles.comingDetail}>{item.detail}</p><div className={styles.comingActions}><Link href="/contact">Contact the team <ArrowRight size={18}/></Link><Link href="/work">Explore our work <ArrowRight size={18}/></Link></div></div><ComingVisual slug={slug} words={item.words}/></div>
  </div></main>;
}

export function WorkLearn() {
  return <main className={styles.subpage}><div className={styles.subpageInner}><Link className={styles.backLink} href="/work">← Our Work</Link><p className={styles.eyebrow}>DIGITAL LEARNING</p><h1>OEP Learn</h1><p className={styles.subpageLead}>Learn economics at your own pace with free lessons, original practice questions, and tools that help you apply what you know.</p><div className={styles.bridgeGrid}><article><GraduationCap size={28}/><h2>Explore the academy</h2><p>Find courses and learning paths built around clear explanations and active practice.</p><Link href="/learn">Open OEP Learn <ArrowRight size={16}/></Link></article><article><BookOpen size={28}/><h2>Try the question bank</h2><p>Choose a course or topic and test your reasoning with practice questions.</p><Link href="/practice">Browse questions <ArrowRight size={16}/></Link></article></div></div></main>;
}

export function WorkResources() {
  return <main className={styles.comingPage}><div className={styles.comingInner}>
    <div className={styles.comingTop}><Link href="/work#work-resources">← Our Work</Link><span>Under development</span></div>
    <div className={styles.comingGrid}><div className={styles.comingCopy}><p className={styles.comingEyebrow}>STUDENT AND EDUCATOR RESOURCES</p><h1>Classroom resources are coming.</h1><p className={styles.comingLead}>We're preparing topic-specific worksheets, graphing exercises, and discussion activities for economics classrooms.</p><p className={styles.comingDetail}>In the meantime, explore free lessons and practice questions in OEP Learn.</p><div className={styles.comingActions}><Link href="/learn">Explore OEP Learn <ArrowRight size={18}/></Link><Link href="/practice">Browse questions <ArrowRight size={18}/></Link></div></div><ComingVisual slug="publications" words={["LEARN.", "PRACTICE.", "TEACH."]}/></div>
  </div></main>;
}
