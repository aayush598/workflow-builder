import { DbId, DbJson, DbNodeType } from "./db.types";

/**
 * Persisted workflow metadata
 */
export interface DbWorkflow {
    id: DbId;
    userId: DbId;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Immutable workflow version
 */
export interface DbWorkflowVersion {
    id: DbId;
    workflowId: DbId;
    version: number;
    graph: DbWorkflowGraph;
    createdAt: Date;
}

/**
 * Workflow DAG snapshot
 */
export interface DbWorkflowGraph {
    nodes: DbWorkflowNode[];
    edges: DbWorkflowEdge[];
}

/**
 * Persisted node snapshot
 */
export interface DbWorkflowNode {
    id: DbId;
    nodeId: string;
    type: DbNodeType;
    config: DbJson;
    position: {
        x: number;
        y: number;
    };
}

/**
 * Persisted edge snapshot
 */
export interface DbWorkflowEdge {
    id: DbId;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}
