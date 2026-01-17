import { PrismaClient, Prisma } from "@prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export class WorkflowRepository {
    async create(
        db: DbClient,
        params: {
            userId: string;
            name: string;
            description?: string;
        },
    ) {
        return db.workflow.create({
            data: {
                userId: params.userId,
                name: params.name,
                description: params.description,
            },
        });
    }

    async findById(db: DbClient, id: string) {
        return db.workflow.findUnique({
            where: { id },
        });
    }

    async listByUser(db: DbClient, userId: string) {
        return db.workflow.findMany({
            where: {
                userId,
                isArchived: false,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }

    async archive(db: DbClient, id: string) {
        return db.workflow.update({
            where: { id },
            data: { isArchived: true },
        });
    }
}

export const workflowRepository = new WorkflowRepository();
