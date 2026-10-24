"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, type ReactNode, type ComponentType } from "react";
import { Home, ChartNoAxesColumn, ChartLine, Bookmark, LayoutGrid, Target, Clock3, Globe, BookOpen, FileText, Layers3, Search, ChevronRight, Menu, MessageCircle, ArrowUpRight } from "lucide-react";
import { courseFamilies, useCourseFamily } from "@/lib/redesign/course-family";
import { PublicFooter } from "./public-page";

function activePath(path: string, href: string) { return path === href || (!['/', '/learn'].includes(href) && path.startsWith(href + '/')); }
const publicLinks = [['Home', '/'], ['Our work', '/work'], ['Our people', '/people'], ['Impact', '/impact'], ['Get involved', '/involved'], ['Stories', '/stories']];
type SideLink = readonly [ComponentType<{size?: number; strokeWidth?: number}>, string, string];
const sideGroups: ReadonlyArray<{ title: string; links: ReadonlyArray<SideLink> }> = [
  { title: '', links: [[Home, 'Home', '/learn'], [ChartNoAxesColumn, 'Analytics', '/learn/analytics'], [Bookmark, 'Saved & mistakes', '/learn/saved']] },
  { title: 'MY LEARNING', links: [[LayoutGrid, 'Browse courses', '/courses']] },
  { title: 'PRACTICE', links: [[Target, 'Question bank', '/practice'], [Clock3, 'Practice tests', '/learn/tests']] },
  { title: 'DISCOVER', links: [[Target, 'Olympiad studio', '/learn/olympiad'], [Globe, 'Specialisms', '/learn/explore'], [ChartLine, 'Graph lab', '/graphs']] },
  { title: 'LEARN', links: [[BookOpen, 'Lessons', '/learn/lessons'], [FileText, 'Study guides', '/learn/guides'], [Layers3, 'Flashcards', '/learn/flashcards']] },
];
const crumbName = (path: string) => sideGroups.flatMap(g => g.links).find(([, , href]) => activePath(path, href))?.[1] ?? 'Learning workspace';
type RecentCourse = { title: string; href: string };
const courseNames: Record<string, string> = {
  'ap-microeconomics': 'AP Microeconomics',
  'ap-macroeconomics': 'AP Macroeconomics',
  'hl-economics': 'HL Economics',
  'sl-economics': 'SL Economics',
  'ib-economics': 'IB Economics · SL & HL',
  'a-level-economics': 'A-Level Economics',
};
const practiceCourseNames: Record<string, string> = {
  'ap-micro': 'AP Microeconomics',
  'ap-macro': 'AP Macroeconomics',
  'a-level': 'A-Level Economics',
  ib: 'IB Economics',
};
function viewedCourse(path: string): RecentCourse | null {
  const match = /^\/(course|practice)\/([^/]+)/.exec(path);
  if (!match) return null;
  const [, section, slug] = match;
  const title = section === 'course' ? courseNames[slug] : practiceCourseNames[slug];
  return title ? { title, href: `/${section}/${slug}` } : null;
}
export function DesignBrand({ learn = false }: { learn?: boolean }) { return <Link className={'brand ' + (learn ? 'learn-brand' : '')} href={learn ? '/learn' : '/'} aria-label={learn ? 'OEP Learn home' : 'OpenEconomics home'}><img className="brand-logo" src={learn ? "/brand/stacked-white.svg" : "/brand/lockup-white.svg"} width={learn ? 643 : 910} height={learn ? 183 : 118} alt="The Open Economics Project"/>{learn && <span className="learn-word">LEARN</span>}</Link>; }
export function SiteShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [recentCourse, setRecentCourse] = useState<RecentCourse | null>(null);
  useEffect(() => setHydrated(true), []);
  const [mobile, setMobile] = useState(false);
  const [family, setFamily] = useCourseFamily();
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { const mq = matchMedia('(max-width:960px)'); const update = () => setMobile(mq.matches); update(); mq.addEventListener('change', update); return () => mq.removeEventListener('change', update); }, []);
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); menuRef.current?.focus(); } }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const current = viewedCourse(path);
    if (current) {
      setRecentCourse(current);
      try { localStorage.setItem('oe-last-viewed-course', JSON.stringify(current)); } catch {}
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem('oe-last-viewed-course') ?? 'null') as RecentCourse | null;
      setRecentCourse(saved && viewedCourse(saved.href)?.title === saved.title ? saved : null);
    } catch { setRecentCourse(null); }
  }, [path]);
  const learn = /^\/(learn|course|courses|practice|graphs)(\/|$)/.test(path);
  return <div data-ready={hydrated} className={'oe-design ' + (learn ? 'oe-academy' : 'oe-public')}><a className="skip" href="#main">Skip to content</a>{learn ? <div className="oe-academy-layout"><aside id="learning-nav" inert={mobile && !open} className={'sidebar ' + (open ? 'open' : '')} aria-label="Academy navigation"><DesignBrand learn/><div className="oe-family-switch" role="group" aria-label="Course family">{courseFamilies.map(value => <button key={value} type="button" aria-pressed={family === value} className={family === value ? 'active' : ''} onClick={() => setFamily(value)}>{value === "A-level" ? "A-Level" : value}</button>)}</div><nav aria-label="Learning navigation">{sideGroups.map(group => <section className="oe-side-group" key={group.title || 'main'} aria-label={group.title || "Overview"}>{group.title && <h2 className="oe-side-heading">{group.title}</h2>}{(group.title === "MY LEARNING" && recentCourse ? [[ChartLine, recentCourse.title, recentCourse.href] as SideLink, ...group.links] : group.links).map(([Icon, label, href]) => <Link key={href} href={href} className={activePath(path, href) ? 'active' : ''} aria-current={activePath(path, href) ? 'page' : undefined}><Icon size={19} strokeWidth={1.7}/>{label}</Link>)}</section>)}</nav><div className="oe-sidebar-bottom"><Link href="/contact"><MessageCircle size={17}/>Give feedback</Link><Link href="/"><ArrowUpRight size={17}/>Back to OpenEconomics</Link></div></aside>{mobile && open && <button className="oe-nav-backdrop" aria-label="Close learning navigation" onClick={() => { setOpen(false); menuRef.current?.focus(); }}/>}<div className="oe-academy-main"><header className="oe-academy-topbar"><div className="oe-topbar-crumb"><button ref={menuRef} className="menu-toggle" aria-label="Toggle learning navigation" aria-controls="learning-nav" aria-expanded={open} onClick={() => setOpen(!open)}><Menu size={20}/></button><Link href="/learn">OEP Learn</Link><ChevronRight size={17}/><span>{crumbName(path)}</span></div><div className="oe-topbar-actions"><Link className="oe-icon-button" href="/courses" aria-label="Search courses"><Search size={20}/></Link></div></header><main inert={mobile && open} id="main" className="oe-learning-content">{children}</main><div inert={mobile && open} className="oe-learning-footer">Open knowledge. Your next possibility. <Link href="/accessibility">Accessibility</Link></div></div></div> : <><div className="nav-wrap"><header className="topnav wrap"><DesignBrand /><button ref={menuRef} className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>☰</button><nav className={'navlinks ' + (open ? 'open' : '')} id="main-nav" aria-label="Main navigation">{publicLinks.map(([label, href]) => <Link key={href} href={href} className={activePath(path, href) ? 'active' : ''} aria-current={activePath(path, href) ? 'page' : undefined}>{label}</Link>)}<Link className="btn" href="/learn">Learn ↗</Link></nav></header></div><main id="main">{children}</main><PublicFooter /></>}</div>;
}
