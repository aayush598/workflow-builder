import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Generic transaction helper.
 * Ensures all DB writes are executed atomically.
 */
export async function withTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
    return prisma.$transaction(async (tx) => {
        return fn(tx);
    });
}

/**
 * Serializable transaction for critical paths.
 * Use this for:
 * - Workflow execution creation
 * - Node run creation
 * - Trigger.dev callbacks
 */
export async function withSerializableTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
    return prisma.$transaction(
        async (tx) => {
            return fn(tx);
        },
        {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
    );
}

/**
 * Retry wrapper for transient DB failures.
 * Designed for Trigger.dev retries & network blips.
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    options?: {
        retries?: number;
        delayMs?: number;
    },
): Promise<T> {
    const retries = options?.retries ?? 3;
    const delayMs = options?.delayMs ?? 200;

    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            if (attempt === retries) {
                break;
            }

            await sleep(delayMs * attempt);
        }
    }

    throw lastError;
}

/**
 * Transaction + retry combo.
 * This is what you will use most often in execution services.
 */
export async function withSafeTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
    return withRetry(() =>
        withSerializableTransaction(async (tx) => fn(tx)),
    );
}

/**
 * Utility: sleep helper
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
