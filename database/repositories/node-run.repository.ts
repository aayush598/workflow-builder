import {
    PrismaClient,
    Prisma,
    NodeRunStatus,
} from "@prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export class NodeRunRepository {
    async create(
        db: DbClient,
        params: {
            workflowRunId: string;
            nodeSnapshotId: string;
            nodeId: string;
            status: NodeRunStatus;
            inputs?: unknown;
        },
    ) {
        return db.nodeRun.create({
            data: {
                workflowRunId: params.workflowRunId,
                nodeSnapshotId: params.nodeSnapshotId,
                nodeId: params.nodeId,
                status: params.status,
                inputs: params.inputs as Prisma.InputJsonValue | undefined,
            },
        });
    }

    async updateStatus(
        db: DbClient,
        params: {
            id: string;
            status: NodeRunStatus;
            outputs?: unknown;
            error?: string;
            durationMs?: number;
            finishedAt?: Date;
        },
    ) {
        return db.nodeRun.update({
            where: { id: params.id },
            data: {
                status: params.status,
                outputs: params.outputs as Prisma.InputJsonValue | undefined,
                error: params.error,
                durationMs: params.durationMs,
                finishedAt: params.finishedAt,
            },
        });
    }

    async findByWorkflowRunId(
        db: DbClient,
        workflowRunId: string,
    ) {
        return db.nodeRun.findMany({
            where: { workflowRunId },
            orderBy: { startedAt: "asc" },
        });
    }
}

export const nodeRunRepository = new NodeRunRepository();
