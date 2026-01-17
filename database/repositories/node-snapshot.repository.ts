import { PrismaClient, Prisma, NodeType } from "@prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export class NodeSnapshotRepository {
    async createMany(
        db: DbClient,
        params: Array<{
            workflowVersionId: string;
            nodeId: string;
            type: NodeType;
            config: unknown;
            position: unknown;
        }>,
    ) {
        return db.nodeSnapshot.createMany({
            data: params.map((node) => ({
                workflowVersionId: node.workflowVersionId,
                nodeId: node.nodeId,
                type: node.type,
                config: node.config as Prisma.InputJsonValue,
                position: node.position as Prisma.InputJsonValue,
            })),
        });
    }

    async findByWorkflowVersionId(
        db: DbClient,
        workflowVersionId: string,
    ) {
        return db.nodeSnapshot.findMany({
            where: { workflowVersionId },
        });
    }

    async findByNodeId(
        db: DbClient,
        nodeId: string,
    ) {
        return db.nodeSnapshot.findMany({
            where: { nodeId },
        });
    }
}

export const nodeSnapshotRepository = new NodeSnapshotRepository();
