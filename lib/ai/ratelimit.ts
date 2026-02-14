"use server";

// Simple in-memory rate limiter for the "Free Tier" architecture.
// In a scalable serverless setup, this would use Redis (e.g. Upstash).
// For a single-instance/dev setup or meaningful persistence during runtime, a global Map works.

const TRACKER = new Map<string, number[]>();

const WINDOW_SIZE = 60 * 1000; // 1 Minute
const MAX_REQUESTS = 10; // 10 requests per minute per user (Gemini Free is ~15 RPM)

export async function checkRateLimit(userId: string) {
    const now = Date.now();
    const timestamps = TRACKER.get(userId) || [];

    // Filter out old timestamps
    const validTimestamps = timestamps.filter(t => now - t < WINDOW_SIZE);

    if (validTimestamps.length >= MAX_REQUESTS) {
        throw new Error("Rate limit exceeded. Please wait a moment before requesting more AI generations.");
    }

    validTimestamps.push(now);
    TRACKER.set(userId, validTimestamps);

    // Cleanup old keys occasionally
    if (TRACKER.size > 1000) {
        for (const [key, times] of TRACKER.entries()) {
            if (times.every(t => now - t > WINDOW_SIZE)) {
                TRACKER.delete(key);
            }
        }
    }
}
