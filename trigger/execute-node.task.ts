import { task, logger } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/prisma";
import { NodeType, Prisma } from "@prisma/client";

/**
 * Phase 2: Real Text Node execution
 *
 * - Text nodes emit real text
 * - No mocks
 * - Output is persisted
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

        // 1. Load NodeRun with snapshot
        const nodeRun = await prisma.nodeRun.findFirst({
            where: { workflowRunId, nodeId },
            include: {
                nodeSnapshot: true,
            },
        });

        if (!nodeRun || !nodeRun.nodeSnapshot) {
            throw new Error("Node snapshot not found");
        }

        const { type, config } = nodeRun.nodeSnapshot;

        let output: unknown = null;

        // 2. TEXT NODE: emit real text
        // Prisma ENUM is uppercase
        if (type === NodeType.TEXT) {
            const textConfig = config as { text?: string } | null;
            output = textConfig?.text ?? "";
        }

        // (Other node types will be added in next phases)

        // 3. Persist output
        await prisma.nodeRun.update({
            where: { id: nodeRun.id },
            data: {
                status: "SUCCESS",
                finishedAt: new Date(),
                outputs: output as Prisma.InputJsonValue,
            },
        });

        // 4. Close workflow if last node
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

        logger.log("Node execution finished", {
            workflowRunId,
            nodeId,
            output,
        });

        return { status: "SUCCESS" };
    },
});
