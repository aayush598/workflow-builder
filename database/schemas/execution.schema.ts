import { z } from "zod";
import {
    WorkflowRunScope,
    WorkflowRunStatus,
    NodeRunStatus,
} from "@prisma/client";

/**
 * Start workflow execution
 */
export const startWorkflowExecutionSchema = z.object({
    workflowId: z.string().min(1),
    workflowVersionId: z.string().min(1),
    userId: z.string().min(1),
    scope: z.nativeEnum(WorkflowRunScope),
});

/**
 * Start node execution
 */
export const startNodeExecutionSchema = z.object({
    workflowRunId: z.string().min(1),
    nodeSnapshotId: z.string().min(1),
    nodeId: z.string().min(1),
    inputs: z.unknown().optional(),
});

/**
 * Complete node execution
 */
export const completeNodeExecutionSchema = z.object({
    nodeRunId: z.string().min(1),
    status: z.nativeEnum(NodeRunStatus),
    outputs: z.unknown().optional(),
    error: z.unknown().optional(),
    startedAt: z.coerce.date(),
    finishedAt: z.coerce.date(),
});

/**
 * Complete workflow execution
 */
export const completeWorkflowExecutionSchema = z.object({
    workflowRunId: z.string().min(1),
    status: z.nativeEnum(WorkflowRunStatus),
    error: z.unknown().optional(),
    startedAt: z.coerce.date(),
    finishedAt: z.coerce.date(),
});

export type StartWorkflowExecutionInput = z.infer<
    typeof startWorkflowExecutionSchema
>;
export type StartNodeExecutionInput = z.infer<
    typeof startNodeExecutionSchema
>;
export type CompleteNodeExecutionInput = z.infer<
    typeof completeNodeExecutionSchema
>;
export type CompleteWorkflowExecutionInput = z.infer<
    typeof completeWorkflowExecutionSchema
>;
