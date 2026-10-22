import "server-only";
import { z } from "zod";
import config from "./ib-paper-one.config.json";
const band = z.object({ minimum: z.number().int().nonnegative(), maximum: z.number().int().nonnegative(), description: z.string().min(1) });
const part = z.object({ maximum: z.number().int().positive(), focus: z.array(z.string()).min(1), bands: z.array(band).min(1) });
export const ibGradingProfile = z.object({
  version: z.string().min(1), label: z.string().min(1), descriptorStatus: z.string().min(1),
  reasoningEffort: z.enum(["none", "low", "medium", "high"]),
  parts: z.object({ a: part, b: part }), rules: z.array(z.string()).min(1),
}).parse(config);
export function markBand(part: "a" | "b", marks: number) {
  const range = ibGradingProfile.parts[part].bands.find(b => marks >= b.minimum && marks <= b.maximum);
  if (!range) throw new Error("Mark has no configured band");
  return { range: range.minimum === range.maximum ? String(range.minimum) : `${range.minimum}–${range.maximum}`, description: range.description };
}
