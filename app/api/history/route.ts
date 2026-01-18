import { withAuth } from '@/api/middlewares/with-auth';
import { withErrorHandler } from '@/api/middlewares/with-error-handler';
import { successResponse } from '@/api/responses/success.response';
import { requireAuth } from '@/auth/auth-guards';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/history
 * Global execution history for current user
 */
export const GET = withErrorHandler(
    withAuth(async () => {
        const { userId } = await requireAuth();

        const runs = await prisma.workflowRun.findMany({
            where: {
                userId,
            },
            orderBy: {
                startedAt: 'desc',
            },
            take: 50,
            include: {
                workflow: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return successResponse(
            runs.map((run) => ({
                id: run.id,
                workflowId: run.workflowId,
                workflowName: run.workflow.name,
                status: run.status,
                scope: run.scope,
                startedAt: run.startedAt,
                finishedAt: run.finishedAt,
                durationMs: run.durationMs,
                error: run.error,
            }))
        );
    })
);
