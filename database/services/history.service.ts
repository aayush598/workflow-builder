import { prisma } from "@/lib/prisma";

export class HistoryService {
    async listWorkflowRuns(workflowId: string) {
        return prisma.workflowRun.findMany({
            where: { workflowId },
            orderBy: { startedAt: "desc" },
            include: {
                nodeRuns: true,
            },
        });
    }

    async getWorkflowRunDetails(workflowRunId: string) {
        return prisma.workflowRun.findUnique({
            where: { id: workflowRunId },
            include: {
                nodeRuns: {
                    orderBy: { startedAt: "asc" },
                },
            },
        });
    }
}

export const historyService = new HistoryService();
