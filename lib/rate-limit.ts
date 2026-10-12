import { createHash } from 'node:crypto';
// Bounded, transient hashes only. No contact values or IP addresses are stored.
// Each process enforces this limit; use a shared limiter when scaling across servers.
export function createRateLimiter(now = () => Date.now()) {
  const buckets = new Map<string,{ count: number; expires: number }>();
  let globalCount = 0, globalExpires = 0;
  return (contact: string) => {
    const time = now();
    if (time >= globalExpires) { globalCount = 0; globalExpires = time + 60_000; }
    if (++globalCount > 100) return false;
    for (const [key, bucket] of buckets) if (time >= bucket.expires) buckets.delete(key);
    const key = createHash('sha256').update(contact.toLowerCase().replace(/\s/g,'')).digest('hex');
    const bucket = buckets.get(key) || {count: 0, expires: time + 600_000};
    if (buckets.size >= 1000 && !buckets.has(key)) return false;
    bucket.count++; buckets.set(key, bucket);
    return bucket.count <= 5;
  };
}
