import { join } from "node:path";
import sharp from "sharp";

const publicDir = join(import.meta.dirname, "..", "public");

async function prepare(sourceName, outputName, width, square = false) {
  const source = join(publicDir, sourceName);
  const { data, info } = await sharp(source)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const offset = (y * info.width + x) * info.channels;
      if (Math.min(data[offset], data[offset + 1], data[offset + 2]) < 220) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (minX > maxX) throw new Error(`No logo pixels found in ${sourceName}`);

  const markWidth = maxX - minX + 1;
  const markHeight = maxY - minY + 1;
  const pad = Math.round(
    Math.max(markWidth, markHeight) * (square ? 0.055 : 0.035),
  );
  const targetWidth = square
    ? Math.max(markWidth, markHeight) + pad * 2
    : markWidth + pad * 2;
  const targetHeight = square ? targetWidth : markHeight + pad * 2;
  const left = Math.round(minX - (targetWidth - markWidth) / 2);
  const top = Math.round(minY - (targetHeight - markHeight) / 2);

  const rgba = Buffer.alloc(targetWidth * targetHeight * 4);
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const sourceX = x + left;
      const sourceY = y + top;
      if (
        sourceX < 0 ||
        sourceY < 0 ||
        sourceX >= info.width ||
        sourceY >= info.height
      )
        continue;
      const from = (sourceY * info.width + sourceX) * info.channels;
      const to = (y * targetWidth + x) * 4;
      const r = data[from];
      const g = data[from + 1];
      const b = data[from + 2];
      const darkness = 255 - Math.min(r, g, b);
      const alpha = Math.round(
        Math.max(0, Math.min(1, (darkness - 6) / 190)) * 255,
      );
      rgba[to] = alpha < 255 ? 31 : r;
      rgba[to + 1] = alpha < 255 ? 42 : g;
      rgba[to + 2] = alpha < 255 ? 58 : b;
      rgba[to + 3] = alpha;
    }
  }

  const output = join(publicDir, outputName);
  await sharp(rgba, {
    raw: { width: targetWidth, height: targetHeight, channels: 4 },
  })
    .resize({ width })
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(
    `${outputName}: ${targetWidth}x${targetHeight} source crop, ${width}px output`,
  );
}

await prepare("open-economics-icon.png", "brand-icon.png", 512, true);
await prepare("open-economics-wordmark.png", "brand-wordmark.png", 1600);
