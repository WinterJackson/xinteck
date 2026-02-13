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
        throw new Error("Invalid environment variables");
    }

    return parsed.data;
}
