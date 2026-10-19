import { describe, it, expect } from 'vitest';
import { readPracticeHistory } from './history';
import { getCoursePracticeTopics } from '@/lib/practice/topics';
const topic = getCoursePracticeTopics('ap-micro')[0];
const key = `oe-practice-ap-micro-${topic.slug}-v${topic.revision ?? 4}`;
const result = { correct: false, selected: 'A', answer: 'B', explanation: 'Existing explanation', reference: 'Existing reference' };
describe('academy history integration', () => {
    it('uses the existing versioned keys and separates actual attempts from bookmarks', () => { const getItem = (k: string) => k === key ? JSON.stringify({ version: 1, currentId: 3, attempts: { 1: result }, bookmarks: [1, 3] }) : null; const rows = readPracticeHistory({ getItem }); expect(rows).toHaveLength(1); expect(rows[0].attempts['1']).toEqual(result); expect(rows[0].bookmarks).toEqual([1, 3]); expect(rows[0].course).toBe('ap-micro'); });
    it('ignores corrupt or obsolete records without inventing results', () => { expect(readPracticeHistory({ getItem: k => k === key ? 'broken json' : null })).toEqual([]); expect(readPracticeHistory({ getItem: k => k === key ? JSON.stringify({ version: 2, attempts: { 1: result } }) : null })).toEqual([]); });
    it('rejects invalid answer and bookmark records', () => { const rows = readPracticeHistory({ getItem: k => k === key ? JSON.stringify({ version: 1, attempts: { 1: { correct: 'yes' }, 99999: result }, bookmarks: [-1, '1', null, 99999, 1] }) : null }); expect(rows[0].attempts).toEqual({}); expect(rows[0].bookmarks).toEqual([1]); });
});
