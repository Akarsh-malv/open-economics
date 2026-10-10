import manifest from "./topics/manifest.json";

export type PracticeTopic = (typeof manifest)[number];
export const practiceTopics: PracticeTopic[] = manifest;

export function getPracticeTopic(slug: string): PracticeTopic | undefined {
  return practiceTopics.find((topic) => topic.slug === slug);
}
