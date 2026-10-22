import { globeCountries, globeConnections, projectGlobePoint } from "@/lib/redesign/globe-countries";
import styles from "./network-globe.module.css";

const anchors = new Set(["US", "GB", "IN"]);
const points = globeCountries.map(country => ({ ...country, ...projectGlobePoint(country.latitude, country.longitude) }));
const pointByCode = new Map(points.map(country => [country.code, country]));
const connections = globeConnections.map(([from, to]) => {
  const a = pointByCode.get(from)!, b = pointByCode.get(to)!;
  const distance = Math.hypot(b.x - a.x, b.y - a.y);
  const lift = Math.min(distance * .4, 58);
  return { key: `${from}-${to}`, d: `M${a.x} ${a.y}Q${(a.x+b.x)/2} ${(a.y+b.y)/2-lift} ${b.x} ${b.y}` };
});

export function NetworkGlobe() {
  return <div className={`world-art ${styles.art}`} data-network-globe>
    <svg viewBox="0 0 800 650" role="img" aria-labelledby="oep-network-title oep-network-description">
      <title id="oep-network-title">Open knowledge. Shared opportunity.</title>
      <desc id="oep-network-description">{`Country markers for ${globeCountries.map(country=>country.name).join(", ")}. An open economics learning network.`}</desc>
      <defs>
        <radialGradient id="oep-network-ocean"><stop stopColor="#23496f"/><stop offset="1" stopColor="#0b1f3a"/></radialGradient>
        <clipPath id="oep-network-sphere"><circle cx="415" cy="310" r="254"/></clipPath>
        <filter id="oep-network-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.4"/></filter>
        <filter id="oep-network-rim-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <circle cx="415" cy="310" r="288" fill="none" stroke="#b7d8e51a"/>
      <circle cx="415" cy="310" r="254" fill="none" stroke="#80cee4" strokeWidth="5" opacity=".13" filter="url(#oep-network-rim-glow)"/>
      <circle cx="415" cy="310" r="254" fill="url(#oep-network-ocean)" stroke="#b8d8e54d"/>
      <g clipPath="url(#oep-network-sphere)">
        <image href="/design-assets/world-map-globe.svg" x="115" y="110" width="620" height="400" opacity=".56"/>
        <g stroke="#e2f0ff20" fill="none" strokeWidth=".8">
          <ellipse cx="415" cy="310" rx="115" ry="254"/>
          <ellipse cx="415" cy="310" rx="208" ry="254"/>
          <ellipse cx="415" cy="310" rx="254" ry="90"/>
          <ellipse cx="415" cy="310" rx="254" ry="184"/>
          <path d="M160 310H670M415 56V564"/>
        </g>
        <g className={styles.connections} fill="none" stroke="#c3e9ee" strokeWidth=".7" strokeDasharray="1.7 3.2" strokeLinecap="round">
          {connections.map(connection=><path key={connection.key} d={connection.d}/>)}
        </g>
        <g filter="url(#oep-network-glow)" fill="#a9f0ed" opacity=".55" aria-hidden="true">
          {points.map(point=><circle key={point.code} cx={point.x} cy={point.y} r={anchors.has(point.code)?4:2.7}/>)}
        </g>
        <g className={styles.markers}>
          {points.map(point=><g key={point.code} className={styles.node} data-country={point.name}>
            <title>{point.name}</title>
            {anchors.has(point.code) && <><circle className={styles.halo} cx={point.x} cy={point.y} r="10" fill="none" stroke="#b8f1f0" strokeWidth=".7"/><circle cx={point.x} cy={point.y} r="5.5" fill="none" stroke="#d9f7f5" strokeWidth=".6" opacity=".45"/></>}
            <circle cx={point.x} cy={point.y} r={anchors.has(point.code)?2.6:1.65} fill="#e1fbf9" stroke="#9fe8e1" strokeWidth=".4"/>
          </g>)}
        </g>
      </g>
      <circle cx="415" cy="310" r="254" fill="none" stroke="#a9d8e8" strokeWidth=".8" opacity=".28"/>
    </svg>
    <span className="art-caption">OPEN KNOWLEDGE. SHARED OPPORTUNITY.<small>{globeCountries.length} countries connected</small></span>
  </div>;
}
