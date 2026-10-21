import { impactMetrics } from "@/lib/redesign/impact";

export function ImpactStats() {
  return <div className="stats-grid">{impactMetrics.map(metric => <div className="stat" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><p>{metric.description}</p></div>)}</div>;
}
