import { withSafeTransaction } from "@/lib/db";
import {
    WorkflowRunStatus,
    WorkflowRunScope,
    NodeRunStatus,
} from "@prisma/client";
import { workflowRunRepository } from "../repositories/workflow-run.repository";
import { nodeRunRepository } from "../repositories/node-run.repository";
import {
    mapNodeExecutionResult,
    mapWorkflowExecutionResult,
} from "../mappers/execution.mapper";

interface StartExecutionInput {
    workflowId: string;
    workflowVersionId: string;
    userId: string;
    scope: WorkflowRunScope;
}

export class ExecutionService {
    async startWorkflowRun(input: StartExecutionInput) {
        return withSafeTransaction(async (tx) => {
            return workflowRunRepository.create(tx, {
                workflowId: input.workflowId,
                workflowVersionId: input.workflowVersionId,
                userId: input.userId,
                status: WorkflowRunStatus.RUNNING,
                scope: input.scope,
            });
        });
    }

    async startNodeRun(params: {
        workflowRunId: string;
        nodeSnapshotId: string;
        nodeId: string;
        inputs?: unknown;
    }) {
        return withSafeTransaction(async (tx) => {
            return nodeRunRepository.create(tx, {
                workflowRunId: params.workflowRunId,
                nodeSnapshotId: params.nodeSnapshotId,
                nodeId: params.nodeId,
                status: NodeRunStatus.RUNNING,
                inputs: params.inputs,
            });
        });
    }

    async completeNodeRun(params: {
        nodeRunId: string;
        result: Parameters<typeof mapNodeExecutionResult>[0];
    }) {
        return withSafeTransaction(async (tx) => {
            return nodeRunRepository.updateStatus(tx, {
                id: params.nodeRunId,
                ...mapNodeExecutionResult(params.result),
            });
        });
    }

    async completeWorkflowRun(params: {
        workflowRunId: string;
        result: Parameters<typeof mapWorkflowExecutionResult>[0];
    }) {
        return withSafeTransaction(async (tx) => {
            return workflowRunRepository.updateStatus(tx, {
                id: params.workflowRunId,
                ...mapWorkflowExecutionResult(params.result),
            });
        });
    }
}

export const executionService = new ExecutionService();
