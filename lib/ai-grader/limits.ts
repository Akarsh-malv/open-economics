// Local prototype limits. Replace with shared storage and authenticated quotas on AWS.
const buckets = new Map<string, { count: number; reset: number }>();
let active = 0;
let daily = { count: 0, reset: 0 };
export function reserveGrade(identity: string, now = Date.now()): (() => void) | null {
  for (const [key, value] of buckets) if (value.reset <= now) buckets.delete(key);
  const bucket = buckets.get(identity) ?? { count: 0, reset: now + 3600000 };
  if (daily.reset <= now) daily = { count: 0, reset: now + 86400000 };
  if (bucket.count >= 20 || daily.count >= 200 || active >= 2 || buckets.size >= 5000 && !buckets.has(identity)) return null;
  bucket.count++; daily.count++; active++;
  buckets.set(identity, bucket);
  let released = false;
  return () => { if (!released) { active--; released = true; } };
}
