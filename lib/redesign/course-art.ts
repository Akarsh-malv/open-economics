export type CourseArtworkId = "macro" | "micro" | "ib" | "alevel" | "foundations" | "olympiad";

export const courseArtwork = (id: CourseArtworkId) => ({
  icon: `/learn-art/${id}-icon.webp`,
  wallpaper: `/learn-art/${id}-wallpaper.webp`,
});

export function artworkForSlug(slug: string): CourseArtworkId {
  if (slug.includes("macro")) return "macro";
  if (slug.includes("micro")) return "micro";
  if (slug.includes("cambridge") || slug.includes("a-level")) return "alevel";
  if (slug.includes("ib") || slug.includes("hl-economics") || slug.includes("sl-economics")) return "ib";
  if (slug.includes("olympiad")) return "olympiad";
  return "foundations";
}
