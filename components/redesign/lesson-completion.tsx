"use client";
import { useEffect, useState } from "react";
export function LessonCompletion({ course, lesson }: {
    course: string;
    lesson: string;
}) { const key = `oe-lesson-complete-${course}-${lesson}`; const [done, setDone] = useState(false); const [ready, setReady] = useState(false); const [error, setError] = useState(false); useEffect(() => { try {
    setDone(localStorage.getItem(key) === 'true');
}
catch {
    setError(true);
} setReady(true); }, [key]); return <section className="oe-lesson-completion" aria-label="Lesson completion"><button disabled={!ready || error} aria-pressed={done} onClick={() => { try {
    localStorage.setItem(key, String(!done));
    setDone(!done);
}
catch {
    setError(true);
} }}>{done ? '✓ Lesson marked complete' : 'Mark lesson complete'}</button><p role="status">{error ? 'Browser storage is unavailable. Completion cannot be saved.' : 'Completion is saved in this browser only; it is not synced to your account.'}</p></section>; }
