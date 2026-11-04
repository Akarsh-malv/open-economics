"use client";
import { type MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import founders from "@/lib/people/founders.json";
import roles from "@/lib/involved/roles.json";
import { impactFigures } from "@/lib/redesign/impact";
import { PeopleNetwork } from "./people-network";
import styles from "./people.module.css";
const founderImages = { arnav: "/people/arnav-maheshwari-cutout.png", akarsh: "/people/akarsh-malavalli-cutout.png" };
const founderRoles = { arnav: "Co-Founder + CBO", akarsh: "Co-Founder + CTO" };
export function PeoplePage() {
 function scrollToSection(event:MouseEvent<HTMLAnchorElement>){
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
  const target=document.getElementById(event.currentTarget.hash.slice(1));
  if(!target)return;
  event.preventDefault();
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  history.pushState(null,'',event.currentTarget.hash);
 }
 return <div className={styles.page}><div className={styles.content}>
  <section className={`${styles.hero} oe-page-hero`}><div><p className={styles.eyebrow}><Users size={17}/>Our people</p><h1>Global purpose.<br/>Local leadership.</h1><p className={styles.lead}>Ambassadors, educators and contributors turning shared ideas into local opportunities.</p><nav className={styles.jumps} aria-label="Explore our people"><a href="#leadership" onClick={scrollToSection}>Founders &amp; Leadership ↓</a><a href="#ambassadors" onClick={scrollToSection}>Ambassador program</a><a href="#global-network" onClick={scrollToSection}>Global Network</a></nav></div><dl className={styles.stats}>{[["Founders","2"],["Learners",new Intl.NumberFormat('en-US').format(impactFigures.learnersServed)]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
  <section id="leadership" className={styles.leadership} aria-label="Co-founders and leadership"><div className={styles.founderGrid}>{(Object.entries(founders) as [keyof typeof founders, typeof founders.arnav][]).map(([key,person])=><article className={styles.founderCard} key={key}><div className={styles.founderPhoto} data-founder={key}><img src={founderImages[key]} alt={person.name} width={1254} height={1254}/><span>Co-founder</span></div><div className={styles.founderCopy}><h2>{person.name}</h2><p>{founderRoles[key]}</p><blockquote className={styles.founderQuote}>{person.quote}</blockquote><Link href={`/people/${key==="arnav"?"arnav-maheshwari":"akarsh-malavalli"}`} className={styles.textButton}>Read profile <ArrowRight size={16}/></Link></div></article>)}</div>
   <div id="leadership-positions" className={styles.leadershipRoles}><header><div><p className={styles.eyebrow}>Executive &amp; Department Leadership</p><h2>Open Leadership Positions</h2></div><Link href="/involved#open-roles">View all openings →</Link></header><div>{roles.filter(role=>role.group!=="community").map(role=><Link href={`/involved/${role.id}`} className={styles.roleCard} key={role.id}><span>{role.group==="executive"?"Executive":"Department"}</span><h3>{role.title}</h3><p>{role.shortSummary}</p><small>Explore role <ArrowRight size={14}/></small></Link>)}</div></div>
  </section>
  <section id="ambassadors" className={styles.ambassadors}>
   <header className={styles.sectionHead}><div><p className={styles.eyebrow}>Ambassador program</p><h2>Ambassador applications opening for the next cohort.</h2></div></header>
   <p>Interested in bringing economics learning to your community? Explore the ambassador role and get in touch with our team.</p>
   <Link href="/involved/student-ambassador" className={styles.textButton}>Explore the ambassador role <ArrowRight size={16}/></Link>
  </section>
 </div><PeopleNetwork/><div className={styles.content}>   <section className={styles.join}><div><p className={styles.eyebrow}>Join our people</p><h2>Bring your perspective<br/>to your community.</h2></div><div className={styles.joinActions}><Link href="/involved/student-ambassador">Become an ambassador ↗</Link><Link href="/involved/workshop-facilitator">Facilitate a workshop ↗</Link></div></section></div>
</div>;
}
