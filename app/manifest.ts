import type { MetadataRoute } from "next";
import { META_THEME_COLORS } from "@/hooks/use-meta-color";
import {
  APP_NAME,
  APP_SHORT_NAME,
  SITE_CATEGORY,
  SITE_DESCRIPTION,
  SITE_LOCALE,
} from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: SITE_DESCRIPTION,
    lang: SITE_LOCALE,
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: META_THEME_COLORS.dark,
    background_color: META_THEME_COLORS.dark,
    categories: [SITE_CATEGORY],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/open-economics-icon.png",
        sizes: "4096x4096",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
