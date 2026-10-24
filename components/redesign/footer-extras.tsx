import { InstagramMark, LinkedInMark, XMark, YouTubeMark } from "./social-marks";

function Laurel() {
  return <svg viewBox="0 0 30 80" aria-hidden="true"><path d="M25 75Q2 42 21 5" fill="none" stroke="currentColor"/><g fill="currentColor">{Array.from({ length: 6 }, (_, index) => <g key={index}><ellipse cx={12 - index * .4} cy={15 + index * 9} rx="3" ry="6" transform={`rotate(-35 ${12 - index * .4} ${15 + index * 9})`}/><ellipse cx={23 - index * .8} cy={19 + index * 8} rx="3" ry="6" transform={`rotate(35 ${23 - index * .8} ${19 + index * 8})`}/></g>)}</g></svg>;
}

export function FooterExtras() {
  return <div className="oe-footer-extras"><div className="learner-trust" aria-label="Trusted by 8.3K learners"><Laurel/><div><small>Trusted by</small><strong>8.3K</strong><span>learners</span></div><Laurel/></div></div>;
}

export function FooterSocials() {
  return <div className="oe-footer-socials" aria-label="Social media"><a href="https://www.instagram.com/open_economics/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)"><InstagramMark/></a><span role="img" aria-label="X profile link coming soon" title="X profile link coming soon"><XMark/></span><span role="img" aria-label="LinkedIn profile link coming soon" title="LinkedIn profile link coming soon"><LinkedInMark/></span><span role="img" aria-label="YouTube profile link coming soon" title="YouTube profile link coming soon"><YouTubeMark/></span></div>;
}
