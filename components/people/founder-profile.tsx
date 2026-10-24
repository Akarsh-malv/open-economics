import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { founderProfiles, type FounderSlug } from "@/lib/people/founder-profiles";
import styles from "./founder-profile.module.css";

export function FounderProfile({ slug }: { slug: FounderSlug }) {
  const person = founderProfiles[slug];
  return <main className={styles.page} id="main">
    <div className={styles.inner}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/people"><ArrowLeft size={15} /> Our people</Link><span> / </span><span>{person.name}</span></nav>
      <header className={styles.introduction}>
        <div className={styles.introCopy}>
          <p className={styles.eyebrow}>The Open Economics Project / Leadership</p>
          <h1>{person.name}</h1>
          <p className={styles.role}>{person.role}</p>
          {person.region && <p className={styles.region}>{person.region}</p>}
          <p className={styles.statement}>{person.introduction}</p>
        </div>
        <div className={styles.portrait}>{person.portrait
          ? <img src={person.portrait} alt={`Portrait of ${person.name}`} width={800} height={800}/>
          : <div className={styles.portraitPlaceholder}>Portrait in development</div>}</div>
      </header>
      <section className={styles.editorialSection} aria-labelledby="biography-heading">
        <p className={styles.sectionIndex}>01 / Profile</p>
        <div className={styles.sectionBody}><h2 id="biography-heading">Biography</h2><div className={styles.prose}>{person.biography.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{person.motivation && <p>{person.motivation}</p>}</div></div>
      </section>
      {person.work.length > 0 && <section className={styles.editorialSection} aria-labelledby="work-heading">
        <p className={styles.sectionIndex}>02 / Contributions</p>
        <div className={styles.sectionBody}><h2 id="work-heading">Work at OEP</h2><div className={styles.workList}>{person.work.slice(0,3).map(item=><article key={item.heading}>
          <h3>{item.heading}</h3><div><p>{item.description}</p>{"href" in item && item.href && <Link href={item.href}>{item.linkLabel}<ArrowUpRight size={15}/></Link>}</div>
        </article>)}</div></div>
      </section>}
      {person.professionalLinks?.length ? <nav className={styles.professionalLinks} aria-label={`${person.name}'s professional links`}><span>Professional links</span><div>{person.professionalLinks.filter(link=>/^https:\/\//.test(link.href)).map(link=><a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={15}/></a>)}</div></nav> : null}
      <Link className={styles.backLink} href="/people"><ArrowLeft size={16}/> Back to our people</Link>
    </div>
  </main>;
}
