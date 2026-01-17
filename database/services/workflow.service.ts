import { prisma } from "@/lib/prisma";
import { withTransaction } from "@/lib/db";
import { workflowRepository } from "../repositories/workflow.repository";
import { workflowVersionRepository } from "../repositories/workflow-version.repository";
import { nodeSnapshotRepository } from "../repositories/node-snapshot.repository";
import { mapWorkflowToSnapshot, DomainWorkflowGraph } from "../mappers/workflow.mapper";
import { mapNodeToSnapshot } from "../mappers/node.mapper";
import { NodeType } from "@prisma/client";

interface CreateWorkflowInput {
    userId: string;
    name: string;
    description?: string;
    graph: DomainWorkflowGraph;
}

export class WorkflowService {
    async createWorkflow(input: CreateWorkflowInput) {
        return withTransaction(async (tx) => {
            const workflow = await workflowRepository.create(tx, {
                userId: input.userId,
                name: input.name,
                description: input.description,
            });

            const snapshot = mapWorkflowToSnapshot(input.graph);

            const version = await workflowVersionRepository.create(tx, {
                workflowId: workflow.id,
                version: 1,
                graph: snapshot.graph,
            });

            await nodeSnapshotRepository.createMany(
                tx,
                snapshot.graph.nodes.map((node) =>
                    mapNodeToSnapshot({
                        workflowVersionId: version.id,
                        nodeId: node.id,
                        type: node.type,
                        config: node.data,
                        position: node.position,
                    }),
                ),
            );

            return {
                workflow,
                version,
            };
        });
    }

    async saveNewVersion(
        workflowId: string,
        graph: CreateWorkflowInput["graph"],
    ) {
        return withTransaction(async (tx) => {
            const latest =
                await workflowVersionRepository.findLatestByWorkflowId(
                    tx,
                    workflowId,
                );

            const nextVersion = (latest?.version ?? 0) + 1;
            const snapshot = mapWorkflowToSnapshot(graph);

            const version = await workflowVersionRepository.create(tx, {
                workflowId,
                version: nextVersion,
                graph: snapshot.graph,
            });

            await nodeSnapshotRepository.createMany(
                tx,
                snapshot.graph.nodes.map((node) =>
                    mapNodeToSnapshot({
                        workflowVersionId: version.id,
                        nodeId: node.id,
                        type: node.type,
                        config: node.data,
                        position: node.position,
                    }),
                ),
            );

            return version;
        });
    }

    async loadWorkflow(workflowId: string) {
        const version =
            await workflowVersionRepository.findLatestByWorkflowId(
                prisma,
                workflowId,
            );

        if (!version) return null;

        return {
            workflowId,
            version,
            graph: version.graph,
        };
    }
}

export const workflowService = new WorkflowService();
