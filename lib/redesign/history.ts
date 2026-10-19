import { getCoursePracticeTopics } from "@/lib/practice/topics";
import { practiceCourses } from "@/lib/practice/courses";
import type { AnswerResult } from "@/lib/practice/types";
export type HistoryRow = {
    course: string;
    courseName: string;
    topic: string;
    title: string;
    bookmarks: number[];
    attempts: Record<string, AnswerResult>;
    currentId: number;
};
export function readPracticeHistory(storage: Pick<Storage, 'getItem'>): HistoryRow[] { const rows: HistoryRow[] = []; for (const c of practiceCourses) {
    for (const t of getCoursePracticeTopics(c.slug)) {
        try {
            const value = JSON.parse(storage.getItem(`oe-practice-${c.slug}-${t.slug}-v${t.revision ?? 4}`) ?? 'null');
            if (value?.version !== 1)
                continue;
            const attempts: Record<string, AnswerResult> = {};
            for (const [id, v] of Object.entries(value.attempts ?? {})) {
                const a = v as Partial<AnswerResult>;
                if (Number(id) > 0 && Number(id) <= t.count && typeof a.correct === 'boolean' && typeof a.selected === 'string' && typeof a.answer === 'string' && typeof a.explanation === 'string' && typeof a.reference === 'string')
                    attempts[id] = a as AnswerResult;
            }
            rows.push({ course: c.slug, courseName: c.name, topic: t.slug, title: t.title, attempts, bookmarks: Array.isArray(value.bookmarks) ? value.bookmarks.filter((id: unknown) => Number.isInteger(id) && Number(id) > 0 && Number(id) <= t.count) : [], currentId: Number.isInteger(value.currentId) ? value.currentId : 1 });
        }
        catch { /* Ignore malformed browser records; do not discard valid topics. */ }
    }
} return rows; }
