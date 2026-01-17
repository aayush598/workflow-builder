import {
    DbId,
    DbJson,
    DbWorkflowRunStatus,
    DbWorkflowRunScope,
    DbNodeRunStatus,
} from "./db.types";

/**
 * Workflow execution (run)
 */
export interface DbWorkflowRun {
    id: DbId;
    workflowId: DbId;
    workflowVersionId: DbId;
    userId: DbId;
    status: DbWorkflowRunStatus;
    scope: DbWorkflowRunScope;
    startedAt: Date;
    finishedAt?: Date;
    durationMs?: number;
    error?: string;
}

/**
 * Node-level execution
 */
export interface DbNodeRun {
    id: DbId;
    workflowRunId: DbId;
    nodeSnapshotId: DbId;
    nodeId: string;
    status: DbNodeRunStatus;
    inputs?: DbJson;
    outputs?: DbJson;
    error?: string;
    startedAt: Date;
    finishedAt?: Date;
    durationMs?: number;
}
