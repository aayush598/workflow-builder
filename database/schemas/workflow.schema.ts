import { z } from "zod";
import { NodeType } from "@prisma/client";

/**
 * Node schema (React Flow compatible)
 */
export const workflowNodeSchema = z.object({
    id: z.string().min(1),
    type: z.nativeEnum(NodeType),
    data: z.record(z.string(), z.unknown()),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
});

/**
 * Edge schema (React Flow compatible)
 */
export const workflowEdgeSchema = z.object({
    id: z.string().min(1),
    source: z.string().min(1),
    target: z.string().min(1),
    sourceHandle: z.string().optional(),
    targetHandle: z.string().optional(),
});

/**
 * Full workflow graph schema
 */
export const workflowGraphSchema = z.object({
    nodes: z.array(workflowNodeSchema).min(1),
    edges: z.array(workflowEdgeSchema),
});

/**
 * Create workflow payload
 */
export const createWorkflowSchema = z.object({
    userId: z.string().min(1),
    name: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
    graph: workflowGraphSchema,
});

/**
 * Save new workflow version payload
 */
export const saveWorkflowVersionSchema = z.object({
    workflowId: z.string().min(1),
    graph: workflowGraphSchema,
});

export type CreateWorkflowInput = z.infer<
    typeof createWorkflowSchema
>;
export type SaveWorkflowVersionInput = z.infer<
    typeof saveWorkflowVersionSchema
>;
export type WorkflowGraph = z.infer<typeof workflowGraphSchema>;
