import path from "node:path";
import { ImageResponse } from "next/og";
import {
  APP_NAME,
  fileToDataUrl,
  SEO_IMAGE_HEIGHT,
  SEO_IMAGE_WIDTH,
} from "@/lib/seo";

export const runtime = "nodejs";

export const revalidate = 2592000; // 30 days

export async function GET() {
  const logoDataUrl = await fileToDataUrl(
    path.join(process.cwd(), "public", "brand-wordmark.png"),
    "image/png",
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse requires plain img elements. */}
      <img
        alt={`${APP_NAME} logo`}
        src={logoDataUrl}
        width={1050}
        height={226}
        style={{
          objectFit: "contain",
        }}
      />
    </div>,
    {
      width: SEO_IMAGE_WIDTH,
      height: SEO_IMAGE_HEIGHT,
    },
  );
}
