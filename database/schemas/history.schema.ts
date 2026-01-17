import { z } from "zod";
import { WorkflowRunStatus } from "@prisma/client";

/**
 * List workflow runs
 */
export const listWorkflowRunsSchema = z.object({
    workflowId: z.string().min(1),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    status: z.nativeEnum(WorkflowRunStatus).optional(),
});

/**
 * Get workflow run details
 */
export const getWorkflowRunDetailsSchema = z.object({
    workflowRunId: z.string().min(1),
});

export type ListWorkflowRunsInput = z.infer<
    typeof listWorkflowRunsSchema
>;
export type GetWorkflowRunDetailsInput = z.infer<
    typeof getWorkflowRunDetailsSchema
>;
