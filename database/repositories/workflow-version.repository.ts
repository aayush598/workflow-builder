import { PrismaClient, Prisma } from "@prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export class WorkflowVersionRepository {
    async create(
        db: DbClient,
        params: {
            workflowId: string;
            version: number;
            graph: unknown;
        },
    ) {
        return db.workflowVersion.create({
            data: {
                workflowId: params.workflowId,
                version: params.version,
                graph: params.graph as Prisma.InputJsonValue,
            },
        });
    }

    async findLatestByWorkflowId(db: DbClient, workflowId: string) {
        return db.workflowVersion.findFirst({
            where: { workflowId },
            orderBy: { version: "desc" },
        });
    }

    async findById(db: DbClient, id: string) {
        return db.workflowVersion.findUnique({
            where: { id },
        });
    }
}

export const workflowVersionRepository = new WorkflowVersionRepository();
