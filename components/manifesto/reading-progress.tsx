"use client";

import { useEffect, useRef } from "react";
import styles from "./manifesto.module.css";

export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const page = document.getElementById("oep-manifesto");
      if (!page || !bar.current) return;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(Math.max(window.scrollY / distance, 0), 1) : 0;
      bar.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    const page = document.getElementById("oep-manifesto");
    if (page) observer.observe(page);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className={styles.progress} aria-hidden="true"><div ref={bar} data-manifesto-progress/></div>;
}
