import { NodeRunStatus, WorkflowRunStatus } from "@prisma/client";

export interface ExecutionTiming {
    startedAt: Date;
    finishedAt: Date;
}

export interface NodeExecutionResult {
    status: NodeRunStatus;
    inputs?: unknown;
    outputs?: unknown;
    error?: unknown;
    timing: ExecutionTiming;
}

export interface WorkflowExecutionResult {
    status: WorkflowRunStatus;
    error?: unknown;
    timing: ExecutionTiming;
}

/**
 * Maps node execution result to DB-ready fields.
 */
export function mapNodeExecutionResult(
    result: NodeExecutionResult,
) {
    return {
        status: result.status,
        inputs: result.inputs
            ? structuredClone(result.inputs)
            : undefined,
        outputs: result.outputs
            ? structuredClone(result.outputs)
            : undefined,
        error: normalizeError(result.error),
        durationMs: calculateDurationMs(result.timing),
        finishedAt: result.timing.finishedAt,
    };
}

/**
 * Maps workflow execution result to DB-ready fields.
 */
export function mapWorkflowExecutionResult(
    result: WorkflowExecutionResult,
) {
    return {
        status: result.status,
        error: normalizeError(result.error),
        durationMs: calculateDurationMs(result.timing),
        finishedAt: result.timing.finishedAt,
    };
}

/**
 * Converts unknown error shapes into safe string.
 */
function normalizeError(error: unknown): string | undefined {
    if (!error) return undefined;

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return "Unknown execution error";
    }
}

/**
 * Computes execution duration in milliseconds.
 */
function calculateDurationMs(timing: ExecutionTiming): number {
    return timing.finishedAt.getTime() - timing.startedAt.getTime();
}
