/**
 * Workflow serialization & deserialization.
 *
 * Responsibilities:
 * - Export workflows to a stable, versioned JSON format
 * - Import workflows safely with validation
 * - Rehydrate DomainNodes with parsed data
 *
 * IMPORTANT:
 * - No UI logic
 * - No Zustand
 * - No React Flow imports
 * - Never trust input JSON
 */

import type { DomainNode } from '../nodes/node-factory';
import type { NodeTypeId } from '../nodes/node-types';
import { isValidNodeType } from '../nodes/node-types';
import { parseNodeData } from '../nodes/node-schemas';
import type { WorkflowGraph, WorkflowEdge } from './dag';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface SerializedWorkflow {
  version: number;
  nodes: SerializedNode[];
  edges: SerializedEdge[];
}

export interface SerializedNode {
  id: string;
  type: NodeTypeId;
  position: {
    x: number;
    y: number;
  };
  data: unknown;
}

export interface SerializedEdge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */

const CURRENT_VERSION = 1;

/* ------------------------------------------------------------------ */
/* Public API */
/* ------------------------------------------------------------------ */

/**
 * Serialize a workflow graph to JSON string.
 */
export function serializeWorkflow(
  graph: WorkflowGraph
): string {
  const payload: SerializedWorkflow = {
    version: CURRENT_VERSION,
    nodes: graph.nodes.map(serializeNode),
    edges: graph.edges.map(serializeEdge),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Deserialize a workflow JSON string into a WorkflowGraph.
 *
 * Throws ONLY for irrecoverable format errors.
 */
export function deserializeWorkflow(
  json: string
): WorkflowGraph {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }

  if (!isSerializedWorkflow(parsed)) {
    throw new Error('Invalid workflow format');
  }

  if (parsed.version !== CURRENT_VERSION) {
    throw new Error(
      `Unsupported workflow version: ${parsed.version}`
    );
  }

  const nodes: DomainNode[] = parsed.nodes.map(
    deserializeNode
  );
  const edges: WorkflowEdge[] = parsed.edges.map(
    deserializeEdge
  );

  return { nodes, edges };
}

/* ------------------------------------------------------------------ */
/* Serialization Helpers */
/* ------------------------------------------------------------------ */

function serializeNode(node: DomainNode): SerializedNode {
  return {
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
  };
}

function serializeEdge(edge: WorkflowEdge): SerializedEdge {
  return {
    id: edge.id,
    source: edge.source,
    sourceHandle: edge.sourceHandle,
    target: edge.target,
    targetHandle: edge.targetHandle,
  };
}

/* ------------------------------------------------------------------ */
/* Deserialization Helpers */
/* ------------------------------------------------------------------ */

function deserializeNode(
  node: SerializedNode
): DomainNode {
  if (!isValidNodeType(node.type)) {
    throw new Error(`Unknown node type: ${node.type}`);
  }

  return {
    id: node.id,
    type: node.type,
    position: node.position,
    data: parseNodeData(node.type, node.data),
  };
}

function deserializeEdge(
  edge: SerializedEdge
): WorkflowEdge {
  return {
    id: edge.id,
    source: edge.source,
    sourceHandle: edge.sourceHandle,
    target: edge.target,
    targetHandle: edge.targetHandle,
  };
}

/* ------------------------------------------------------------------ */
/* Type Guards */
/* ------------------------------------------------------------------ */

function isSerializedWorkflow(
  value: unknown
): value is SerializedWorkflow {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false;
  }

  const v = value as Partial<SerializedWorkflow>;

  return (
    typeof v.version === 'number' &&
    Array.isArray(v.nodes) &&
    Array.isArray(v.edges)
  );
}
