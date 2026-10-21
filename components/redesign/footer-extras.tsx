import { ArrowUpRight } from "lucide-react";

function Laurel() {
  return <svg viewBox="0 0 30 80" aria-hidden="true"><path d="M25 75Q2 42 21 5" fill="none" stroke="currentColor"/><g fill="currentColor">{Array.from({ length: 6 }, (_, index) => <g key={index}><ellipse cx={12 - index * .4} cy={15 + index * 9} rx="3" ry="6" transform={`rotate(-35 ${12 - index * .4} ${15 + index * 9})`}/><ellipse cx={23 - index * .8} cy={19 + index * 8} rx="3" ry="6" transform={`rotate(35 ${23 - index * .8} ${19 + index * 8})`}/></g>)}</g></svg>;
}

export function FooterExtras() {
  return <div className="oe-footer-extras"><div className="learner-trust" aria-label="Trusted by 8.3K learners"><Laurel/><div><small>Trusted by</small><strong>8.3K</strong><span>learners</span></div><Laurel/></div><a className="oe-footer-follow" href="https://www.instagram.com/open_economics/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Follow OEP on Instagram (opens in a new tab)"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none"/></svg><span>Follow OEP</span><ArrowUpRight size={15} aria-hidden="true"/></a></div>;
}
