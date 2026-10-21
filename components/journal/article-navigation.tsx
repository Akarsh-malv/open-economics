"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function ArticleNavigation({ sections, status }: { sections: Array<{ id: string; title: string }>; status: string }) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const [fallback, setFallback] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-120px 0px -45% 0px' });
    for (const section of sections) { const element = document.getElementById(section.id); if (element) observer.observe(element); }
    return () => observer.disconnect();
  }, [sections]);
  function jump(id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    setActive(id);
    element.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    element.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, '', `#${id}`);
  }
  async function copyLink() {
    const url = window.location.origin + window.location.pathname;
    try { await navigator.clipboard.writeText(url); setMessage('Article link copied.'); setFallback(''); }
    catch { setFallback(url); setMessage('Copy the article link below.'); }
  }
  return <aside className="article-sidebar"><span className="eyebrow">IN THIS ARTICLE</span><nav aria-label="Article sections">{sections.map(section => <button type="button" key={section.id} onClick={() => jump(section.id)} aria-current={active === section.id ? 'location' : undefined}>{section.title}</button>)}</nav><button type="button" className="text-link" onClick={copyLink}>Copy article link<ArrowUpRight className="icon" aria-hidden="true"/></button><p role="status" aria-live="polite" className="article-copy-status">{message}</p>{fallback && <label className="article-copy-fallback">Article link<input readOnly value={fallback} onFocus={event => event.currentTarget.select()}/></label>}<span className="tiny">{status}</span></aside>;
}
