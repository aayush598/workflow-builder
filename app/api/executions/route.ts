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
