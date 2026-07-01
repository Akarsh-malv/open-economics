import type { MetadataRoute } from "next";
import { clientEnv } from "@/env/client";
import { mockLessons } from "@/lib/data/mock-courses";

/**
 * sitemap covers landing page + free published lessons
 * for lessons:
 * - text: include attached images (if any)
 * - video: include full video metadata (thumbnail, duration, playback URL, stripped description etc.)
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = new URL(clientEnv.NEXT_PUBLIC_APP_URL);
  const origin = siteUrl.origin;

  const lessonEntries: MetadataRoute.Sitemap = [];

  for (const lesson of mockLessons) {
    const courseSlug =
      typeof lesson.course === "string" ? null : lesson.course?.slug;

    if (!courseSlug || !lesson.slug) {
      continue;
    }

    const url = `${origin}/course/${courseSlug}/${lesson.slug}`;

    lessonEntries.push({
      url,
      lastModified: lesson.updatedAt,
    });
  }

  return [
    {
      url: origin,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...lessonEntries.map((entry) => ({
      ...entry,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

export const dynamic = "force-static";

export const revalidate = 604800; // 1 week
