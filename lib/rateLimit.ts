/**
 * Simple in-memory rate limiter for the /api/chat route.
 *
 * Limits each IP to MAX_REQUESTS requests per WINDOW_MS milliseconds.
 * Uses a sliding window approach — old entries are cleaned up automatically.
 *
 * Note: This is an in-memory store, so it resets on server restart and does
 * not work across multiple server instances. For production with multiple
 * instances, use Redis-backed rate limiting (e.g., @upstash/ratelimit).
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;  // max requests per IP per window

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory store: IP address → rate limit entry
const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now - entry.windowStart > WINDOW_MS) {
      store.delete(ip);
    }
  }
}, 5 * 60_000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;  // requests remaining in current window
  resetAt: number;    // timestamp (ms) when the window resets
}

/**
 * Check whether the given IP is within the rate limit.
 * Increments the counter if allowed.
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  // No entry yet, or window has expired — start a fresh window
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(ip, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: now + WINDOW_MS,
    };
  }

  // Within the current window
  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.windowStart + WINDOW_MS,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.windowStart + WINDOW_MS,
  };
}
