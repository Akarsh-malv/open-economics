"use client";
import { createElement, useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Link from "next/link";
import { ImpactStats } from "./impact-stats";
import { HeroViews } from "./hero-views";
import { NetworkGlobe } from "./network-globe";
import { FooterExtras } from "./footer-extras";
import blueprint from "@/lib/redesign/blueprint.json";
type Node = string | {
    tag: string;
    attrs: Record<string, string>;
    children: Node[];
};
export type PublicPageKey = keyof typeof blueprint.pages | keyof typeof blueprint.policies;
const titleOf = (key: string) => blueprint.policies[key as keyof typeof blueprint.policies]?.title;
const attrNames: Record<string, string> = { class: "className", tabindex: "tabIndex", for: "htmlFor", viewbox: "viewBox", preserveaspectratio: "preserveAspectRatio", strokewidth: "strokeWidth", 'stroke-width': "strokeWidth", 'stroke-linecap': "strokeLinecap", 'stroke-linejoin': "strokeLinejoin", 'fill-rule': "fillRule", 'clip-rule': "clipRule", 'clip-path': "clipPath", 'stop-color': "stopColor", 'stop-opacity': "stopOpacity", 'stroke-dasharray': "strokeDasharray", 'font-size': "fontSize", 'stroke-dashoffset': "strokeDashoffset", 'text-anchor': "textAnchor", 'font-weight': "fontWeight", 'dominant-baseline': "dominantBaseline", 'color-interpolation-filters': "colorInterpolationFilters", colspan: "colSpan", rowspan: "rowSpan", autocomplete: "autoComplete", readonly: "readOnly" };
function style(value: string): CSSProperties { return Object.fromEntries(value.split(';').filter(Boolean).map(rule => { const i = rule.indexOf(':'); const key = rule.slice(0, i).trim(); return [key.startsWith('--') ? key : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), rule.slice(i + 1).trim()]; })); }
export function DesignContent({ nodes, footer = false }: {
    nodes: unknown;
    footer?: boolean;
}) {
    const [message, setMessage] = useState<string | null>(null);
    const [country, setCountry] = useState('');
    function render(n: Node, index: number): ReactNode {
        if (typeof n === 'string')
            return n;
        const a = n.attrs, cls = a.class ?? '';
        if (cls === 'world-art') return <NetworkGlobe key={index}/>;
        if (cls === 'mission-card') return <HeroViews key={index}/>;
        if (cls === 'stats-grid') return <ImpactStats key={index}/>;
        if (cls === 'ambassador-section') return <Ambassadors key={index}/>;
        if (cls.includes('program-section'))
            return <Programs key={index}/>;
        if (cls === 'team-testimonials') return <Testimonials key={index}/>;
        if (n.tag === 'form')
            return <EnquiryForm key={index}/>;
        if (cls === 'learner-trust') return footer ? <FooterExtras key={index}/> : null;
        if (cls.includes('trust-laurel') || cls === 'trust-band') return null;
        const props: Record<string, unknown> = { key: index };
        for (const [key, value] of Object.entries(a)) {
            if (key.startsWith('on'))
                continue;
            if (key === 'style') {
                props.style = style(value);
                continue;
            }
            if (['selected', 'checked'].includes(key))
                continue;
            props[attrNames[key] ?? (key.includes("-") && !key.startsWith("data-") && !key.startsWith("aria-") ? key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : key)] = value;
        }
        if (n.tag === 'button')
            props.type = 'button';
        if (a['data-video'])
            props.onClick = () => setMessage(a['data-video'] + '. The recording is coming soon. Captions and a transcript will accompany it.');
        if (a['data-action'])
            props.onClick = () => setMessage(a['data-action'] === 'press-brief' ? 'Organization brief: OpenEconomics connects open education, local leadership and institutional access. Contact our team for organizational information.' : 'Contact the team to learn more.');
        if (a['data-country']) {
            props.onClick = () => setCountry(a['data-country']);
            props['aria-pressed'] = country === a['data-country'];
            props.className = country === a['data-country'] ? 'active' : '';
        }
        if (cls === 'map-detail' && country)
            return <p key={index} className={cls}>{country} · Our community</p>;
        if (a['data-jump']) {
            props.href = '#' + a['data-jump'];
        }
        if (n.tag === 'a' && typeof props.href === 'string') {
            let href = props.href as string;
            if (href.startsWith('/learn/graph'))
                href = '/graphs';
            if (href.startsWith('/curriculum/'))
                href = '/courses';
            props.href = href;
            if (footer && href === '/manifesto') return <div className="oe-footer-story-links" key={index}><Link href="/#about">Our Story</Link><Link href="/stories">Stories &amp; Insights</Link><Link href="/manifesto">Our manifesto</Link></div>;
            if (href.startsWith('/'))
                return createElement(Link, props as {
                    href: string;
                }, ...n.children.map(render));
        }
        return createElement(n.tag, props, ...n.children.map(render));
    }
    return <>{(nodes as Node[]).map(render)}<MessageDialog message={message} close={() => setMessage(null)}/></>;
}
export function MessageDialog({ message, close }: {
    message: string | null;
    close: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => { if (message)
        ref.current?.showModal();
    else
        ref.current?.close(); }, [message]);
    return <dialog ref={ref} className="oe-dialog" onCancel={close} onClick={e => { if (e.target === e.currentTarget)
        close(); }} aria-labelledby="oe-dialog-title"><h2 id="oe-dialog-title">A note about this placement</h2><p>{message}</p><button className="btn" onClick={close}>Close</button></dialog>;
}
export function PublicPage({ page }: {
    page: PublicPageKey;
}) {
    if (titleOf(page))
        return <PolicyPage page={page as keyof typeof blueprint.policies}/>;
    return <div className="oe-reference"><DesignContent nodes={blueprint.pages[page as keyof typeof blueprint.pages]}/></div>;
}
export function PublicFooter() { return <DesignContent nodes={blueprint.footer} footer/>; }
function Ambassadors() {
    const [country, setCountry] = useState('All countries');
    const [selected, setSelected] = useState<(typeof blueprint.people)[number] | null>(null);
    const [video, setVideo] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const people = blueprint.people.filter(p => country === 'All countries' || p.country === country);
    return <section className="ambassador-section"><div className="section-head"><div><div className="eyebrow">MEET THE AMBASSADORS</div><h2>15 perspectives. A shared purpose.</h2></div><p>Meet the people bringing economics education into their communities.</p></div><div className="carousel-toolbar"><label className="country-select">Explore by country<select value={country} onChange={e => setCountry(e.target.value)}>{['All countries', ...new Set(blueprint.people.map(p => p.country))].map(c => <option key={c}>{c}</option>)}</select></label><div className="carousel-controls"><span>{people.length} profiles</span><button className="icon-btn" aria-label="Previous ambassador profiles" onClick={() => ref.current?.scrollBy({ left: -320, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>←</button><button className="icon-btn" aria-label="Next ambassador profiles" onClick={() => ref.current?.scrollBy({ left: 320, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>→</button></div></div><div ref={ref} className="ambassador-carousel" tabIndex={0} aria-label="Ambassador profiles; scroll or use arrows">{people.map(p => <article className="ambassador-card" key={p.id}><button className={'portrait-art ' + p.tone} onClick={() => setSelected(p)} aria-label={'Meet ' + p.name + ', profile'}><span className="portrait-grid"/><span className="portrait-initials">{p.initials}</span><span className="portrait-ring"/><span className="profile-video-label">▷ INTRODUCTION</span></button><div className="ambassador-copy"><h3>{p.name}</h3><p className="ambassador-location">{p.city}, {p.country}</p><p>{p.school && <>{p.school}<br /></>}{p.qualifications[0]}</p><button className="text-link" onClick={() => setSelected(p)}>Meet {p.name.split(' ')[0]} ↗</button></div></article>)}</div><div className="carousel-hint">Scroll to meet the network <span>← →</span></div><Profile person={selected} close={() => setSelected(null)} video={() => setVideo('The introduction video is being prepared.')}/><MessageDialog message={video} close={() => setVideo(null)}/></section>;
}
function Profile({ person, close, video }: {
    person: (typeof blueprint.people)[number] | null;
    close: () => void;
    video: () => void;
}) { const ref = useRef<HTMLDialogElement>(null); useEffect(() => { if (person)
    ref.current?.showModal();
else
    ref.current?.close(); }, [person]); return <dialog ref={ref} className="oe-dialog" onCancel={close} aria-label="Ambassador profile">{person && <><h2>{person.name}</h2><p>{person.city}, {person.country}<br />{person.school}</p><p>{person.qualifications.join(' · ')}</p><button className="btn light" onClick={video}>▷ Introduction video</button> <button className="btn" onClick={close}>Close profile</button></>}</dialog>; }
function Programs() { const [audience, setAudience] = useState<'student' | 'teacher'>('student'); return <section className="section section-rule program-section"><div className="section-head"><div><div className="eyebrow">MORE WAYS TO TAKE PART</div><h2>Economics beyond the textbook.</h2></div><div className="audience-toggle" role="group" aria-label="Program audience">{(['student', 'teacher'] as const).map(a => <button key={a} className={audience === a ? 'active' : ''} aria-pressed={audience === a} onClick={() => setAudience(a)}>For {a}s</button>)}</div></div><p className="program-intro">Explore more ways to learn, contribute and take part in OpenEconomics.</p><div className="program-grid">{blueprint.programs[audience].map(([kind, title, head, desc, detail, type], i) => <article className="program-feature" key={kind}><div className={'program-art art-' + kind} aria-hidden="true"><span className="art-label">0{i + 1} / {title.toUpperCase()}</span>{kind === 'workshop' ? <><div className="discussion-bubble">Why?</div><div className="discussion-bubble second">What if?</div></> : kind === 'essay' ? <div className="essay-sheet"><span>AN IDEA WORTH<br />EXPLORING.</span><i /><i /><i /></div> : <><div className="circle-person one"/><div className="circle-person two"/><div className="circle-person three"/><div className="connection-line"/></>}</div><div className="program-copy"><span className="pill">Program</span><h3>{head}</h3><p>{desc}</p><div className="program-detail">✓ {detail}</div><Link className="text-link" href={'/contact?type=' + encodeURIComponent(type)}>Explore this format →</Link></div></article>)}</div></section>; }
function Testimonials() { const [slide, setSlide] = useState(0); const t = blueprint.testimonials[slide]; return <section className="team-testimonials" aria-label="Team testimonials"><div className="testimonial-controls"><div className="eyebrow">PEOPLE MAKE<br />THE DIFFERENCE</div><div><button className="icon-btn" aria-label="Previous testimonial" onClick={() => setSlide((slide + 2) % 3)}>←</button><button className="icon-btn" aria-label="Next testimonial" onClick={() => setSlide((slide + 1) % 3)}>→</button></div><span>0{slide + 1} / 03</span></div><div className="testimonial-copy" aria-live="polite"><blockquote>{t.quote}</blockquote><p>Team member <span>· {t.role}</span></p><div className="testimonial-dots">{blueprint.testimonials.map((_, i) => <button key={i} aria-label={'Show testimonial ' + (i + 1)} aria-pressed={slide === i} className={slide === i ? 'active' : ''} onClick={() => setSlide(i)}/>)}</div></div><div className="testimonial-portrait" aria-label="Team portrait"><span></span></div></section>; }
function EnquiryForm() { const [error, setError] = useState(''); const [interest, setInterest] = useState('General enquiry'); useEffect(() => { const type = new URLSearchParams(window.location.search).get('type'); if (type)
    setInterest(type); }, []); return <form className="panel enquiry-form" onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); const body = ['Name: ' + data.get('name'), 'Email: ' + data.get('email'), 'Organization: ' + data.get('organization'), 'Country / region: ' + data.get('country'), '', '' + data.get('message')].join('\n'); if (body.length > 7000) {
    setError('Please shorten your message to open an email draft.');
    return;
} window.location.href = 'mailto:contact@openeconomics.org?subject=' + encodeURIComponent('OpenEconomics: ' + data.get('type')) + '&body=' + encodeURIComponent(body); setError('Email draft requested. Review and send it in your email app; nothing has been submitted through this website.'); }}>{[['Name', 'name', 'text', true], ['Email', 'email', 'email', true], ['Organization', 'organization', 'text', false], ['Country / region', 'country', 'text', false]].map(([label, name, type, required]) => <label className="field" key={String(name)}>{label}<input name={String(name)} type={String(type)} required={Boolean(required)} autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : undefined}/></label>)}<label className="field full">I’m interested in<select name="type" value={interest} onChange={e => setInterest(e.target.value)}>{['General enquiry', 'Library pilot', 'Educational partnership', 'Ambassador', 'Volunteering', 'Funding', 'Media', 'Workshop', 'Essay competition', 'Learning circle', 'Educator exchange', 'Curriculum contributor', 'Workshop facilitator', 'Design and engineering', 'Translation'].map(t => <option key={t}>{t}</option>)}</select></label><label className="field full">Your message<textarea name="message" required maxLength={6000}/></label><p className="form-note">This opens a draft in your email app. It does not submit or store a website application. <Link href="/privacy">Privacy policy</Link></p><button className="btn" type="submit">Create email enquiry ↗</button><p role="status" className="field full">{error}</p></form>; }
function PolicyPage({ page }: {
    page: keyof typeof blueprint.policies;
}) { const policy = blueprint.policies[page]; const [active, setActive] = useState('policy-section-0'); const sections = [...policy.sections, ['Contact us', 'Questions about this policy can be directed to the OpenEconomics team.']]; useEffect(() => { const observer = new IntersectionObserver(entries => { const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); if (visible[0])
    setActive(visible[0].target.id); }, { rootMargin: '-110px 0px -55% 0px' }); document.querySelectorAll('.policy-section').forEach(el => observer.observe(el)); return () => observer.disconnect(); }, [page]); return <div className="wrap policy-page"><header className="policy-heading"><div className="eyebrow">{page === 'methodology' ? 'ACCOUNTABILITY' : 'POLICIES & ACCESS'}</div><h1>{policy.title}</h1><p>{policy.intro}</p><div className="policy-status"><span>OEP policy</span></div></header><nav className="policy-switcher" aria-label="Policies and resources">{Object.entries(blueprint.policies).map(([key, p]) => <Link key={key} className={page === key ? 'active' : ''} aria-current={page === key ? 'page' : undefined} href={'/' + key}>{p.title}</Link>)}</nav><div className="policy-layout"><article className="policy-reading"><div className="policy-draft-note">{page === 'methodology' ? 'Participation, funding and estimated savings are reported separately. Estimates depend on the methods and assumptions described below.' : 'Read the policy and contact our team with any questions.'}</div>{sections.map(([title, body], i) => <section key={title} className="policy-section" id={'policy-section-' + i} tabIndex={-1}><h2>{title}</h2><p>{body}</p>{i === sections.length - 1 && <Link className="text-link" href="/contact">Contact the team →</Link>}</section>)}</article><aside className="policy-contents"><nav aria-label="On this page"><span className="policy-contents-label">ON THIS PAGE</span><div className="policy-toc-track">{sections.map(([title], i) => <a key={title} href={'#policy-section-' + i} aria-current={active === 'policy-section-' + i ? 'location' : undefined} className={active === 'policy-section-' + i ? 'active' : ''} onClick={() => setActive('policy-section-' + i)}>{title}</a>)}</div></nav></aside></div></div>; }
