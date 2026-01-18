import { withAuth } from '@/api/middlewares/with-auth';
import { withErrorHandler } from '@/api/middlewares/with-error-handler';
import { successResponse } from '@/api/responses/success.response';
import { requireAuth } from '@/auth/auth-guards';
import { workflowService } from '@/database/services/workflow.service';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: Promise<{
        workflowId: string;
    }>;
};

/**
 * GET /api/workflows/:workflowId/history
 * Execution history for a single workflow
 */
export const GET = withErrorHandler(
    withAuth(async (_req, context) => {
        const { params } = context as RouteContext;
        const { workflowId } = await params;

        const { userId } = await requireAuth();

        // 🔐 Ownership validation
        await workflowService.getByIdForUser(workflowId, userId);

        const runs = await prisma.workflowRun.findMany({
            where: {
                workflowId,
                userId,
            },
            orderBy: {
                startedAt: 'desc',
            },
            include: {
                nodeRuns: {
                    select: {
                        id: true,
                        nodeId: true,
                        status: true,
                        startedAt: true,
                        finishedAt: true,
                        durationMs: true,
                        error: true,
                    },
                },
            },
        });

        return successResponse(
            runs.map((run) => ({
                id: run.id,
                status: run.status,
                scope: run.scope,
                startedAt: run.startedAt,
                finishedAt: run.finishedAt,
                durationMs: run.durationMs,
                error: run.error,
                nodes: run.nodeRuns,
            }))
        );
    })
);
