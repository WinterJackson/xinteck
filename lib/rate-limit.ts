
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that'll be used to limit requests.
// We use a sliding window of 10 requests per 10 seconds by default.
// The user can pass in their own window and limit.
export function createRateLimiter(
    requests: number = 10,
    windowDuration: `${number} s` | `${number} m` | `${number} h` | `${number} d` = "10 s"
) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.warn("Upstash Redis credentials not found. Rate limiting disabled.");
        return {
            limit: async () => ({ success: true, limit: 100, remaining: 99, reset: 0 }),
        };
    }

    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    return new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(requests, windowDuration),
        analytics: true,
        prefix: "@upstash/ratelimit",
    });
}

// Pre-configured limiters for specific routes
export const authLimiter = createRateLimiter(5, "1 m"); // 5 requests per minute
export const contactLimiter = createRateLimiter(10, "5 m"); // 10 requests per 5 minutes
export const newsletterLimiter = createRateLimiter(5, "10 m"); // 5 requests per 10 minutes
