"use client";
import { useId, useState } from "react";
import { globeCountries, globeConnections, projectGlobePoint } from "@/lib/redesign/globe-countries";
import countries from "@/lib/people/countries.json";
import styles from "./people.module.css";
const points=globeCountries.map(c=>({...c,...projectGlobePoint(c.latitude,c.longitude)}));
export function PeopleNetwork(){
 const uid=useId().replaceAll(':',''),[selected,setSelected]=useState(""),[hovered,setHovered]=useState("");
 const active=hovered||selected,point=points.find(p=>p.name===active),detail=countries.find(c=>c.name===selected);
 const gradient=`people-ocean-${uid}`,clip=`people-clip-${uid}`,glow=`people-glow-${uid}`;
 return <section id="global-network" className={styles.network} aria-labelledby="people-network-heading"><div className={styles.content}><header className={styles.networkHead}><div><p className={styles.eyebrow}>Global footprint</p><h2 id="people-network-heading">25 countries. One open ecosystem.</h2></div><label><span className={styles.srOnly}>Explore a country</span><select value={selected} onChange={e=>{setSelected(e.target.value);setHovered("");}}><option value="">Explore a country</option>{points.map(c=><option key={c.code}>{c.name}</option>)}</select></label></header><div className={styles.globeFrame}>
 <svg className={styles.globe} viewBox="110 15 610 590" role="group" aria-label="Interactive network globe"><defs><radialGradient id={gradient}><stop stopColor="#23496f"/><stop offset="1" stopColor="#0b1f3a"/></radialGradient><clipPath id={clip}><circle cx="415" cy="310" r="254"/></clipPath><filter id={glow} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>
 <circle cx="415" cy="310" r="284" fill="none" stroke="#b7d8e519"/><circle cx="415" cy="310" r="254" fill={`url(#${gradient})`} stroke="#8ac7d0" strokeWidth="1.4"/>
 <g clipPath={`url(#${clip})`}><image href="/design-assets/world-map-globe.svg" x="115" y="110" width="620" height="400" opacity=".6"/><g stroke="#c4e3ef28" fill="none" strokeWidth=".8"><ellipse cx="415" cy="310" rx="115" ry="254"/><ellipse cx="415" cy="310" rx="208" ry="254"/><ellipse cx="415" cy="310" rx="254" ry="90"/><ellipse cx="415" cy="310" rx="254" ry="184"/><path d="M160 310H670M415 56V564"/></g>
 <g fill="none" stroke="#bde7ed66" strokeWidth=".9" strokeDasharray="2 4">{globeConnections.map(([a,b])=>{const from=points.find(p=>p.code===a)!,to=points.find(p=>p.code===b)!;return <path key={`${a}-${b}`} d={`M${from.x} ${from.y}Q${(from.x+to.x)/2} ${(from.y+to.y)/2-45} ${to.x} ${to.y}`}/>;})}</g>
 <g fill="#b0efec" opacity=".65" filter={`url(#${glow})`} aria-hidden="true">{points.map(p=><circle key={p.code} cx={p.x} cy={p.y} r="5"/>)}</g>
 {points.map(p=><g key={p.code} className={styles.countryNode} role="button" tabIndex={0} aria-label={`Explore ${p.name}`} aria-pressed={selected===p.name} data-country={p.name} onMouseEnter={()=>setHovered(p.name)} onMouseLeave={()=>setHovered("")} onFocus={()=>setHovered(p.name)} onBlur={()=>setHovered("")} onClick={()=>setSelected(p.name)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(p.name);}if(e.key==='Escape'){setSelected("");setHovered("");}}}><circle cx={p.x} cy={p.y} r="8" fill="transparent"/><circle cx={p.x} cy={p.y} r={active===p.name?7:4.3} fill="none" stroke="#bcefed" opacity={active===p.name?1:.3}/><circle cx={p.x} cy={p.y} r={active===p.name?3.6:2.5} fill="#e9ffff"/></g>)}
 </g>
 {point&&<g className={styles.globeTooltip} aria-hidden="true" transform={`translate(${Math.max(225,Math.min(point.x,600))} ${point.y-25})`}><rect x="-85" y="-21" width="170" height="29" rx="7" fill="#061424" stroke="#87ccd0" strokeWidth=".7"/><text textAnchor="middle" y="-3" fill="white" fontSize="11" fontFamily="Manrope,sans-serif">{point.name}</text></g>}
 </svg>
 <div className={styles.countryDetail} aria-live="polite" aria-atomic="true">{detail?<><strong>{detail.name}</strong><span>{detail.region}</span><p>{detail.summary}</p></>:<p>Select a country to explore the network.</p>}</div>
 </div></div></section>;
}
