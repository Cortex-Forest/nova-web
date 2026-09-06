/**
 * 尽力而为的内存限流（单实例滑动窗口）。
 * Vercel serverless 多实例下非全局限流——与既有 Early Access 相同口径；
 * 本阶段不引入 Redis/Upstash（Owner 纪律）。
 */
export interface RateLimiter {
  /** 若该 key 超限返回 true（本次应拒绝），否则记录并返回 false */
  hit(key: string): boolean;
  size(): number;
}

export function createRateLimiter(
  max: number,
  windowMs: number,
): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key: string): boolean {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter(
        (t) => now - t < windowMs,
      );
      if (recent.length >= max) {
        hits.set(key, recent);
        return true;
      }
      recent.push(now);
      hits.set(key, recent);
      // 防 Map 无限增长
      if (hits.size > 10_000) {
        for (const [k, arr] of hits) {
          if (arr.length === 0 || now - arr[arr.length - 1] > windowMs) {
            hits.delete(k);
          }
        }
      }
      return false;
    },
    size(): number {
      return hits.size;
    },
  };
}
