import { PrismaClient } from '@prisma/client';

// Purpose: Prevent multiple Prisma Client instances in development (hot-reload issue).
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/*
Purpose: Singleton instance of Prisma Client to manage database connections.
Decision: Reusing the connection pool is critical for serverless/Next.js performance.
*/
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
        datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
