import { NodeType } from "@prisma/client";

export interface DomainNode {
    id: string;
    type: NodeType;
    data: Record<string, unknown>;
    position: { x: number; y: number };
}

export interface DomainEdge {
    id: string;
    source: string;
    sourceHandle?: string;
    target: string;
    targetHandle?: string;
}

export interface DomainWorkflowGraph {
    nodes: DomainNode[];
    edges: DomainEdge[];
}

export interface WorkflowVersionSnapshot {
    graph: DomainWorkflowGraph;
}

/**
 * Maps a domain workflow graph to a DB-safe snapshot.
 * This snapshot must remain immutable forever.
 */
export function mapWorkflowToSnapshot(
    graph: DomainWorkflowGraph,
): WorkflowVersionSnapshot {
    return {
        graph: {
            nodes: graph.nodes.map((node) => ({
                id: node.id,
                type: node.type,
                data: structuredClone(node.data),
                position: structuredClone(node.position),
            })),
            edges: graph.edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                sourceHandle: edge.sourceHandle,
                target: edge.target,
                targetHandle: edge.targetHandle,
            })),
        },
    };
}

/**
 * Restores a domain workflow graph from a DB snapshot.
 */
export function mapSnapshotToWorkflow(
    snapshot: WorkflowVersionSnapshot,
): DomainWorkflowGraph {
    return {
        nodes: snapshot.graph.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            data: structuredClone(node.data),
            position: structuredClone(node.position),
        })),
        edges: snapshot.graph.edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            sourceHandle: edge.sourceHandle,
            target: edge.target,
            targetHandle: edge.targetHandle,
        })),
    };
}
