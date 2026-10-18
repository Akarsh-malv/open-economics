import manifest from "./topics/manifest.json";
import alevelManifest from "./alevel-topics/manifest.json";
import microManifest from "./micro-topics/manifest.json";

export type PracticeTopic = (typeof manifest)[number] & { revision?: number };
export const practiceTopics: PracticeTopic[] = manifest;

export function getPracticeTopic(slug: string): PracticeTopic | undefined {
  return practiceTopics.find((topic) => topic.slug === slug);
}

export const microPracticeTopics: PracticeTopic[] = microManifest;
export const alevelPracticeTopics: PracticeTopic[] = alevelManifest;
export function getCoursePracticeTopics(course: string): PracticeTopic[] {
  return course === "ap-macro" ? practiceTopics : course === "ap-micro" ? microPracticeTopics : course === "a-level" ? alevelPracticeTopics : [];
}
export function getCoursePracticeTopic(course: string, slug: string): PracticeTopic | undefined {
  return getCoursePracticeTopics(course).find(topic => topic.slug === slug);
}
