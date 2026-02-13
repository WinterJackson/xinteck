import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_GA_ID: z.string().optional(),
    JWT_SECRET: z.string().min(32),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
});

export function validateEnv() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error(
            "❌ Invalid environment variables:",
            parsed.error.flatten().fieldErrors
        );

        // In CI/Build environments (like Vercel), we might want to proceed 
        // even if secrets are missing, to allow the build to finish.
        if (process.env.CI || process.env.VERCEL || process.env.NEXT_PHASE === 'phase-production-build') {
            console.warn("⚠️  Running in CI/Build mode. Proceeding despite validation failure.");
            return process.env as any;
        }

        throw new Error("Invalid environment variables");
    }

    return parsed.data;
}
