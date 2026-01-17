import {
    PrismaClient,
    Prisma,
    WorkflowRunStatus,
    WorkflowRunScope,
} from "@prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export class WorkflowRunRepository {
    async create(
        db: DbClient,
        params: {
            workflowId: string;
            workflowVersionId: string;
            userId: string;
            status: WorkflowRunStatus;
            scope: WorkflowRunScope;
        },
    ) {
        return db.workflowRun.create({
            data: {
                workflowId: params.workflowId,
                workflowVersionId: params.workflowVersionId,
                userId: params.userId,
                status: params.status,
                scope: params.scope,
            },
        });
    }

    async updateStatus(
        db: DbClient,
        params: {
            id: string;
            status: WorkflowRunStatus;
            error?: string;
            durationMs?: number;
            finishedAt?: Date;
        },
    ) {
        return db.workflowRun.update({
            where: { id: params.id },
            data: {
                status: params.status,
                error: params.error,
                durationMs: params.durationMs,
                finishedAt: params.finishedAt,
            },
        });
    }

    async findById(db: DbClient, id: string) {
        return db.workflowRun.findUnique({
            where: { id },
        });
    }
}

export const workflowRunRepository = new WorkflowRunRepository();
