import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/functions";

type LimitResult =
  | { allowed: true }
  | { allowed: false; status: 403 | 429 | 503; retryAfter?: number };

export function hasSharedGraderLimits() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return Boolean(url?.startsWith("https://") && token && token !== "mock");
}

let limits: {
  perVisitor: Ratelimit;
  burst: Ratelimit;
  daily: Ratelimit;
} | null = null;

function getLimits() {
  if (limits) return limits;
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  limits = {
    perVisitor: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "oep:ai-grade:visitor",
    }),
    burst: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "oep:ai-grade:burst",
    }),
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(50, "1 d"),
      prefix: "oep:ai-grade:daily",
    }),
  };
  return limits;
}

export async function allowPublicGrade(request: Request): Promise<LimitResult> {
  if (!hasSharedGraderLimits()) return { allowed: false, status: 503 };
  // Vercel overwrites the forwarding header; never accept a client-supplied identity.
  const ip = ipAddress(request);
  if (!ip || !isIP(ip)) return { allowed: false, status: 403 };
  const visitor = createHash("sha256").update(ip).digest("hex");
  const { perVisitor, burst, daily } = getLimits();
  try {
    for (const [limit, key] of [
      [perVisitor, visitor],
      [burst, "site"],
      [daily, "site"],
    ] as const) {
      const result = await limit.limit(key);
      if (!result.success)
        return {
          allowed: false,
          status: 429,
          retryAfter: Math.max(
            1,
            Math.ceil((result.reset - Date.now()) / 1000),
          ),
        };
    }
    return { allowed: true };
  } catch {
    // A quota outage must never turn into unrestricted paid model calls.
    return { allowed: false, status: 503 };
  }
}
