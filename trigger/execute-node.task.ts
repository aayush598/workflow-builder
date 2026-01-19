import { task, logger, wait } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/prisma";

/**
 * Core node execution task
 *
 * Phase 1:
 * - No real node logic yet
 * - Just lifecycle + DB updates
 */
export const executeNodeTask = task({
    id: "execute-node",
    maxDuration: 300,
    run: async (
        payload: {
            workflowRunId: string;
            nodeId: string;
        }
    ) => {
        const { workflowRunId, nodeId } = payload;

        logger.log("Executing node", { workflowRunId, nodeId });

        // Simulate execution delay (Phase 1 only)
        await wait.for({ seconds: 0.8 });

        // Mark node as SUCCESS
        await prisma.nodeRun.updateMany({
            where: {
                workflowRunId,
                nodeId,
            },
            data: {
                status: "SUCCESS",
                finishedAt: new Date(),
                outputs: {
                    result: `Mock execution result for node ${nodeId}`,
                },
            },
        });

        // Check if this is the last running node
        const remaining = await prisma.nodeRun.count({
            where: {
                workflowRunId,
                status: "RUNNING",
            },
        });

        if (remaining === 0) {
            await prisma.workflowRun.update({
                where: { id: workflowRunId },
                data: {
                    status: "SUCCESS",
                    finishedAt: new Date(),
                },
            });
        }

        logger.log("Node execution finished", { workflowRunId, nodeId });

        return {
            status: "SUCCESS",
        };
    },
});
