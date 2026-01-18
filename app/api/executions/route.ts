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
            include: {
                nodeRuns: true,
                workflowVersion: {
                    include: {
                        nodes: true,
                    },
                },
            },
        });

        const responseData = executions.map((execution) => {
            let nodeRuns = execution.nodeRuns.map(nr => ({
                nodeId: nr.nodeId,
                status: nr.status,
                error: nr.error,
                outputs: nr.outputs
            }));

            // Mock generation if empty and we have nodes definition
            if (nodeRuns.length === 0 && execution.workflowVersion?.nodes) {
                const nodes = execution.workflowVersion.nodes;
                const totalDuration = 3000;
                const now = Date.now();
                const start = execution.startedAt.getTime();
                const elapsed = now - start;

                nodeRuns = nodes.map((node, index) => {
                    // Simple linear progress execution for mock logic
                    // We can randomize order or just use index. 
                    // To look better, let's just use index sequence.
                    const timePerNode = totalDuration / nodes.length;
                    const nodeStartTime = index * timePerNode;
                    const nodeEndTime = (index + 1) * timePerNode;

                    let status = 'PENDING';

                    if (execution.status === 'SUCCESS') {
                        status = 'SUCCESS';
                    } else if (execution.status === 'FAILED') {
                        // Mocking a failure: Let's say the last node failed if workflow failed
                        if (index === nodes.length - 1) status = 'FAILED';
                        else status = 'SUCCESS';
                    } else if (execution.status === 'RUNNING') {
                        if (elapsed >= nodeEndTime) {
                            status = 'SUCCESS';
                        } else if (elapsed >= nodeStartTime) {
                            status = 'RUNNING';
                        } else {
                            status = 'PENDING';
                        }
                    }

                    return {
                        nodeId: node.nodeId,
                        status: status as 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED',
                        error: null,
                        outputs: null,
                    };
                });
            }

            return {
                id: execution.id,
                workflowId: execution.workflowId,
                status: execution.status,
                scope: execution.scope,
                startedAt: execution.startedAt,
                finishedAt: execution.finishedAt,
                durationMs: execution.durationMs,
                error: execution.error,
                nodeRuns,
            };
        });

        return successResponse(responseData);
    })
);
