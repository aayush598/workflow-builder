import {
    WorkflowRunStatus,
    WorkflowRunScope,
    NodeRunStatus,
    NodeType,
} from "@prisma/client";

/**
 * Re-export Prisma enums as DB-level enums.
 * This avoids leaking Prisma deep into the app.
 */

export type DbWorkflowRunStatus = WorkflowRunStatus;
export type DbWorkflowRunScope = WorkflowRunScope;
export type DbNodeRunStatus = NodeRunStatus;
export type DbNodeType = NodeType;

/**
 * Common DB identifiers
 */
export type DbId = string;

/**
 * JSON payload stored in DB (JSONB)
 */
export type DbJson =
    | string
    | number
    | boolean
    | null
    | DbJson[]
    | { [key: string]: DbJson };
