"use client";

import { useCallback, useEffect, useState } from "react";

export const courseFamilies = ["All", "AP", "IB", "A-level"] as const;
export type CourseFamily = typeof courseFamilies[number];
const storageKey = "oe-course-family";
const eventName = "oe-course-family";
const validFamily = (value: unknown): value is CourseFamily => courseFamilies.includes(value as CourseFamily);

export function useCourseFamily() {
  const [family, setFamily] = useState<CourseFamily>("All");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (validFamily(saved)) setFamily(saved);
    } catch { /* Course browsing also works without browser storage. */ }
    const update = (event: Event) => {
      const value = (event as CustomEvent<unknown>).detail;
      if (validFamily(value)) setFamily(value);
    };
    window.addEventListener(eventName, update);
    return () => window.removeEventListener(eventName, update);
  }, []);
  const selectFamily = useCallback((value: CourseFamily) => {
    setFamily(value);
    try { localStorage.setItem(storageKey, value); } catch {}
    window.dispatchEvent(new CustomEvent(eventName, { detail: value }));
  }, []);
  return [family, selectFamily] as const;
}
