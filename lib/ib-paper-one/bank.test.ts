import { describe, expect, it } from 'vitest';
import manifest from './manifest.json';
import { ibTopicData } from './topic-data';

describe('IB Paper 1 import', () => {
  it('has every supplied topic and its numbered 10+15 mark pairs', () => {
    expect(manifest).toHaveLength(30);
    expect(manifest.reduce((total, topic) => total + topic.count, 0)).toBe(1290);
    for (const topic of manifest) {
      const questions = ibTopicData[topic.slug]?.questions;
      expect(questions, topic.number).toHaveLength(topic.count);
      expect(questions?.map(q => q.id), topic.number).toEqual(Array.from({ length: topic.count }, (_, index) => index + 1));
      for (const question of questions ?? []) {
        expect(question.a.marks).toBe(10);
        expect(question.b.marks).toBe(15);
        expect(question.a.prompt.length).toBeGreaterThan(20);
        expect(question.b.prompt.length).toBeGreaterThan(20);
      }
    }
  });
});
