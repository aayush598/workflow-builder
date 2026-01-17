import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

/**
 * Prisma Client Singleton
 *
 * - Prevents exhausting connections in dev (Next.js hot reload)
 * - Creates a fresh client in prod (serverless-safe)
 */
export const prisma: PrismaClient =
    global.__prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "warn", "error"]
                : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    global.__prisma = prisma;
}
