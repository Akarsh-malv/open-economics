"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

import blueprint from "@/lib/redesign/blueprint.json";
import styles from "./terms.module.css";

export type PolicyParagraph = { style: string; bullet: boolean; runs: { text: string; bold: boolean; italic: boolean; href: string | null }[] };
type Paragraph = PolicyParagraph;
function RichText({ paragraph }: { paragraph: Paragraph }) {
    return <>{paragraph.runs.map((run, index) => {
        let content: ReactNode = run.text;
        if (run.italic) content = <em>{content}</em>;
        if (run.bold) content = <strong>{content}</strong>;
        if (run.href) {
            const url = new URL(run.href, "https://openecon.org");
            const localPolicy = ["/terms", "/privacy", "/licensing", "/accessibility", "/methodology"].includes(url.pathname) && url.hostname === "openecon.org";
            if (!(url.hostname === "openecon.org" && url.pathname.replace(/\/$/, "") === "/safeguarding")) {
                content = localPolicy ? <Link href={url.pathname}>{content}</Link> : <a href={run.href}>{content}</a>;
            }
        }
        return <Fragment key={index}>{content}</Fragment>;
    })}</>;
}
const text = (p: Paragraph) => p.runs.map(run => run.text).join("");
function Body({ items }: { items: Paragraph[] }) {
    const result: ReactNode[] = [];
    for (let i = 0; i < items.length; i++) {
        const paragraph = items[i];
        if (paragraph.bullet) {
            const bullets = [paragraph];
            while (items[i + 1]?.bullet) bullets.push(items[++i]);
            result.push(<ul key={i}>{bullets.map((item, j) => <li key={j} data-policy-paragraph data-terms-paragraph><RichText paragraph={item}/></li>)}</ul>);
        } else if (paragraph.style === "Heading3") {
            result.push(<h3 key={i} data-policy-paragraph data-terms-paragraph><RichText paragraph={paragraph}/></h3>);
        } else {
            result.push(<p key={i} data-policy-paragraph data-terms-paragraph><RichText paragraph={paragraph}/></p>);
        }
    }
    return <>{result}</>;
}
export function PolicyDocument({ paragraphs, policyKey }: { paragraphs: Paragraph[]; policyKey: "terms" | "privacy" | "licensing" | "accessibility" | "methodology" }) {
    const firstSection = paragraphs.findIndex(p => p.style === "Heading2");
    const descriptions = {
        terms: "The terms that apply to OEP’s website, learning resources and programs.",
        privacy: "How we collect, use and protect your information.",
        accessibility: "Our commitment to making economic learning accessible.",
        licensing: "How OEP’s educational materials may be used and shared.",
        methodology: "How we measure and report our impact.",
    };
    const dates = text(paragraphs[2]).split(/\r?\n/).flatMap(line => {
        const match = line.trim().match(/^(Effective Date|Last Updated):\s*(.+)$/i);
        return match ? [{ label: match[1].toLowerCase() === "effective date" ? "Effective date" : "Last updated", value: match[2] }] : [];
    });
    const introduction = paragraphs.slice(3, firstSection).filter(paragraph => text(paragraph).trim() !== "The Open Economics Project");
    const sections: { heading: Paragraph; body: Paragraph[] }[] = [];
    for (const paragraph of paragraphs.slice(firstSection)) {
        if (paragraph.style === "Heading2") sections.push({ heading: paragraph, body: [] });
        else sections.at(-1)?.body.push(paragraph);
    }
    const [active, setActive] = useState(`${policyKey}-section-1`);
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const first = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top)[0];
            if (first) setActive(first.target.id);
        }, { rootMargin: "-110px 0px -55% 0px" });
        document.querySelectorAll("[data-terms-section]").forEach(section => observer.observe(section));
        return () => observer.disconnect();
    }, [policyKey]);
    return <div className={`wrap policy-page ${styles.terms}`}>
        <header className="policy-heading">
            <div className="eyebrow">{policyKey === "methodology" ? "ACCOUNTABILITY" : "POLICIES & ACCESS"}</div>
            <h1 data-policy-paragraph data-terms-paragraph><RichText paragraph={paragraphs[0]}/></h1>
            <p className={styles.description}>{descriptions[policyKey]}</p>
        </header>
        <nav className="policy-switcher" aria-label="Policies and resources">
            {Object.entries(blueprint.policies).map(([key, policy]) => <Link key={key} href={`/${key}`} className={key === policyKey ? "active" : ""} aria-current={key === policyKey ? "page" : undefined}>{policy.title}</Link>)}
        </nav>
        <div className="policy-layout">
            <article className={`policy-reading ${styles.reading}`} aria-label={text(paragraphs[0])}>
            <dl className={styles.metadata} aria-label="Policy dates">{dates.map(date => <div key={date.label}><dt>{date.label}</dt><dd>{date.value}</dd></div>)}</dl>
                {introduction.length > 0 && <div className={styles.intro}><Body items={introduction}/></div>}
                {sections.map((section, index) => <section key={index} className="policy-section" id={`${policyKey}-section-${index+1}`} data-terms-section tabIndex={-1}>
                    <h2 data-policy-paragraph data-terms-paragraph><RichText paragraph={section.heading}/></h2>
                    <Body items={section.body}/>
                </section>)}
            </article>
            <aside className="policy-contents"><nav aria-label="On this page">
                <span className="policy-contents-label">ON THIS PAGE</span>
                <div className={`policy-toc-track ${styles.contents}`}>{sections.map((section, index) => {
                    const id = `${policyKey}-section-${index+1}`;
                    return <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => {setActive(id); document.getElementById(id)?.focus({preventScroll:true});}}>{text(section.heading)}</a>;
                })}</div>
            </nav></aside>
        </div>
    </div>;
}
