"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import paragraphs from "@/lib/policies/terms.json";
import blueprint from "@/lib/redesign/blueprint.json";
import styles from "./terms.module.css";

type Paragraph = (typeof paragraphs)[number];
function RichText({ paragraph }: { paragraph: Paragraph }) {
    return <>{paragraph.runs.map((run, index) => {
        let content: ReactNode = run.text;
        if (run.italic) content = <em>{content}</em>;
        if (run.bold) content = <strong>{content}</strong>;
        if (run.href) content = <a href={run.href}>{content}</a>;
        return <Fragment key={index}>{content}</Fragment>;
    })}</>;
}
const text = (p: Paragraph) => p.runs.map(run => run.text).join("");
const sections: { heading: Paragraph; body: Paragraph[] }[] = [];
for (const paragraph of paragraphs.slice(7)) {
    if (paragraph.style === "Heading2") sections.push({ heading: paragraph, body: [] });
    else sections.at(-1)?.body.push(paragraph);
}
function Body({ items }: { items: Paragraph[] }) {
    const result: ReactNode[] = [];
    for (let i = 0; i < items.length; i++) {
        const paragraph = items[i];
        if (paragraph.bullet) {
            const bullets = [paragraph];
            while (items[i + 1]?.bullet) bullets.push(items[++i]);
            result.push(<ul key={i}>{bullets.map((item, j) => <li key={j} data-terms-paragraph><RichText paragraph={item}/></li>)}</ul>);
        } else if (paragraph.style === "Heading3") {
            result.push(<h3 key={i} data-terms-paragraph><RichText paragraph={paragraph}/></h3>);
        } else {
            result.push(<p key={i} data-terms-paragraph><RichText paragraph={paragraph}/></p>);
        }
    }
    return <>{result}</>;
}
export function TermsOfUse() {
    const [active, setActive] = useState("terms-section-1");
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const first = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top)[0];
            if (first) setActive(first.target.id);
        }, { rootMargin: "-110px 0px -55% 0px" });
        document.querySelectorAll("[data-terms-section]").forEach(section => observer.observe(section));
        return () => observer.disconnect();
    }, []);
    return <div className={`wrap policy-page ${styles.terms}`}>
        <header className="policy-heading">
            <div className="eyebrow">POLICIES &amp; ACCESS</div>
            <h1 data-terms-paragraph><RichText paragraph={paragraphs[0]}/></h1>
            <p data-terms-paragraph><RichText paragraph={paragraphs[1]}/></p>
            <p className={styles.dates} data-terms-paragraph><RichText paragraph={paragraphs[2]}/></p>
        </header>
        <nav className="policy-switcher" aria-label="Policies and resources">
            {Object.entries(blueprint.policies).map(([key, policy]) => <Link key={key} href={`/${key}`} className={key === "terms" ? "active" : ""} aria-current={key === "terms" ? "page" : undefined}>{policy.title}</Link>)}
        </nav>
        <div className="policy-layout">
            <article className={`policy-reading ${styles.reading}`} aria-label="Terms of Use">
                <div className={styles.intro}><Body items={paragraphs.slice(3,7)}/></div>
                {sections.map((section, index) => <section key={index} className="policy-section" id={`terms-section-${index+1}`} data-terms-section tabIndex={-1}>
                    <h2 data-terms-paragraph><RichText paragraph={section.heading}/></h2>
                    <Body items={section.body}/>
                </section>)}
            </article>
            <aside className="policy-contents"><nav aria-label="On this page">
                <span className="policy-contents-label">ON THIS PAGE</span>
                <div className={`policy-toc-track ${styles.contents}`}>{sections.map((section, index) => {
                    const id = `terms-section-${index+1}`;
                    return <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => {setActive(id); document.getElementById(id)?.focus({preventScroll:true});}}>{text(section.heading)}</a>;
                })}</div>
            </nav></aside>
        </div>
    </div>;
}
