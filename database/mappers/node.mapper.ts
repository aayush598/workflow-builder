import { NodeType } from "@prisma/client";

export interface NodeSnapshotInput {
    workflowVersionId: string;
    nodeId: string;
    type: NodeType;
    config: Record<string, unknown>;
    position: { x: number; y: number };
}

export interface NodeIOSnapshot {
    inputs?: Record<string, unknown>;
    outputs?: Record<string, unknown>;
}

/**
 * Maps a domain node into a DB node snapshot.
 */
export function mapNodeToSnapshot(
    node: NodeSnapshotInput,
) {
    return {
        workflowVersionId: node.workflowVersionId,
        nodeId: node.nodeId,
        type: node.type,
        config: structuredClone(node.config),
        position: structuredClone(node.position),
    };
}

/**
 * Normalizes node inputs for persistence.
 */
export function mapNodeInputs(
    inputs: unknown,
): Record<string, unknown> | undefined {
    if (inputs == null) return undefined;
    return structuredClone(inputs as Record<string, unknown>);
}

/**
 * Normalizes node outputs for persistence.
 */
export function mapNodeOutputs(
    outputs: unknown,
): Record<string, unknown> | undefined {
    if (outputs == null) return undefined;
    return structuredClone(outputs as Record<string, unknown>);
}
