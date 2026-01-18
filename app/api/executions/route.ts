import { withAuth } from '@/api/middlewares/with-auth';
import { withErrorHandler } from '@/api/middlewares/with-error-handler';
import { successResponse } from '@/api/responses/success.response';
import { requireAuth } from '@/auth/auth-guards';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/executions
 * List workflow executions for current user (polling endpoint)
 */
export const GET = withErrorHandler(
    withAuth(async () => {
        const { userId } = await requireAuth();

        // ------------------------------------------------------------------
        // MOCK BEHAVIOR:
        // Automatically transition "RUNNING" -> "SUCCESS" after 3 seconds
        // ------------------------------------------------------------------
        const stuckExecutions = await prisma.workflowRun.findMany({
            where: {
                userId,
                status: 'RUNNING',
                startedAt: {
                    // Check if started > 3s ago
                    lt: new Date(Date.now() - 3000),
                },
            },
            select: { id: true },
        });

        if (stuckExecutions.length > 0) {
            await prisma.workflowRun.updateMany({
                where: {
                    id: { in: stuckExecutions.map((e) => e.id) },
                },
                data: {
                    status: 'SUCCESS',
                    finishedAt: new Date(),
                    durationMs: 3000,
                },
            });
        }
        // ------------------------------------------------------------------

        const executions = await prisma.workflowRun.findMany({
            where: {
                userId,
            },
            orderBy: {
                startedAt: 'desc',
            },
            take: 20, // safe default for polling
            select: {
                id: true,
                workflowId: true,
                status: true,
                scope: true,
                startedAt: true,
                finishedAt: true,
                durationMs: true,
                error: true,
            },
        });

        return successResponse(executions);
    })
);
