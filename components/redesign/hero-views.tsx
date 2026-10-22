"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./hero-views.module.css";

const INITIAL_VIEWS = 2_543_271; // Owner-selected display baseline; increases locally on the schedule below.
const UPDATE_MS = 6_000;
const STORAGE_KEY = "oep.websiteViews.v2";
const initialPoints = [4, 5, 9, 7, 6, 10, 9, 16, 13, 17, 16, 23];
type Counter = { value: number; previous: number; revision: number; increment: number; points: number[] };
const initial: Counter = { value: INITIAL_VIEWS, previous: INITIAL_VIEWS, revision: 0, increment: 0, points: initialPoints };

function RollingNumber({ counter }: { counter: Counter }) {
  const current = counter.value.toLocaleString("en-US");
  const previous = counter.previous.toLocaleString("en-US").padStart(current.length, " ");
  return <output className={styles.total} aria-label="Total website views" aria-live="off" data-view-count={counter.value}>
    <span className={styles.srOnly}>{current}</span>
    <span className={styles.digits} aria-hidden="true">{[...current].map((digit, index) => {
      if (digit === ",") return <span key={`comma-${current.length - index}`} className={styles.comma}>,</span>;
      const before = previous[index] ?? " ";
      const changed = counter.revision > 0;
      return <span key={`place-${current.length - index}`} className={styles.digitWindow}>
        <span key={changed ? `${counter.revision}-${digit}` : digit} className={`${styles.digitTrack} ${changed ? styles.rolling : ""}`} style={{ "--digit-delay": `${Math.min(current.length - index - 1, 4) * 55}ms` } as CSSProperties}>
          {changed && <span>{before}</span>}<span>{digit}</span>
        </span>
      </span>;
    })}</span>
  </output>;
}

function Sparkline({ points, revision }: { points: number[]; revision: number }) {
  const min = Math.min(...points) - 2, max = Math.max(...points) + 3;
  const positions = points.map((point, index) => [index / (points.length - 1) * 184 + 3, 48 - (point - min) / (max - min) * 42]);
  const path = positions.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const [x, y] = positions[positions.length - 1];
  return <svg className={styles.sparkline} viewBox="0 0 190 58" fill="none" aria-hidden="true">
    <defs><linearGradient id="oep-website-views-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8ee6dc" stopOpacity=".16"/><stop offset="100%" stopColor="#8ee6dc" stopOpacity="0"/></linearGradient></defs>
    <path d={`${path} L187,58 L3,58 Z`} fill="url(#oep-website-views-fill)"/>
    <path className={styles.gridLine} d="M3 54H187"/>
    <path className={styles.lineGlow} d={path}/>
    <path key={revision} className={styles.trendLine} pathLength="1" d={path}/>
    <circle className={styles.endpointHalo} cx={x} cy={y} r="5"/>
    <circle cx={x} cy={y} r="2" fill="#a6f3e8"/>
  </svg>;
}

export function HeroViews() {
  const [counter, setCounter] = useState<Counter>(initial);
  useEffect(() => {
    let current = initial;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && Number.isSafeInteger(saved.value) && saved.value >= INITIAL_VIEWS && saved.value < Number.MAX_SAFE_INTEGER - 10 && Array.isArray(saved.points) && saved.points.length === 12 && saved.points.every((point: unknown) => typeof point === "number" && Number.isFinite(point))) {
        current = { ...initial, value: saved.value, previous: saved.value, points: saved.points };
        setCounter(current);
      }
    } catch { /* Browser storage is optional. */ }
    const interval = setInterval(() => {
      if (document.visibilityState === "hidden") return;
      const previous = current;
      const increment = 1;
        const next = {
          value: previous.value + increment,
          previous: previous.value,
          increment,
          revision: previous.revision + 1,
          points: [...previous.points.slice(1), previous.points[previous.points.length - 1] + increment],
        };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: next.value, points: next.points })); } catch { /* Keep updating when storage is unavailable. */ }
        current = next;
        setCounter(next);
    }, UPDATE_MS);
    return () => clearInterval(interval);
  }, []);

  return <section className={`mission-card ${styles.card}`} data-view-counter aria-label="Website views counter">
    {counter.revision > 0 && <span key={counter.revision} className={styles.updateFlash} aria-hidden="true"/>}
    <div className={styles.heading}><span>GLOBAL ENGAGEMENT</span><span className={styles.badge}><i aria-hidden="true"/>ACTIVE</span></div>
    <RollingNumber counter={counter}/>
    <span className={styles.label}>TOTAL WEBSITE VIEWS</span>
    <span className={styles.disclosure}>Views across the platform</span>
    <div className={styles.footer}>
      <Sparkline points={counter.points} revision={counter.revision}/>
      <div className={styles.updateInfo}><span>Website activity</span></div>
    </div>
  </section>;
}
