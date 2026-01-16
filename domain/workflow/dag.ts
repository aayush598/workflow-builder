/**
 * DAG validation and graph utilities.
 *
 * Responsibilities:
 * - Validate workflow graphs (acyclic, well-typed, executable)
 * - Enforce required inputs and port compatibility
 * - Provide deterministic execution ordering (topological sort)
 *
 * IMPORTANT:
 * - No React / React Flow imports
 * - No Zustand
 * - No execution logic
 * - No side effects
 */

import type { DomainNode } from '../nodes/node-factory';
import {
  getNodePort,
  isCompatibleConnection,
  allowsMultipleConnections,
  getRequiredInputPorts,
} from '../nodes/node-ports';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface WorkflowEdge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

export interface WorkflowGraph {
  nodes: DomainNode[];
  edges: WorkflowEdge[];
}

export interface DagValidationError {
  nodeId?: string;
  edgeId?: string;
  message: string;
}

export interface DagValidationResult {
  valid: boolean;
  errors: DagValidationError[];
}

/* ------------------------------------------------------------------ */
/* Store-facing API */
/* ------------------------------------------------------------------ */

/**
 * Store-friendly validation helper.
 *
 * This keeps stores simple while allowing the domain
 * to evolve independently.
 */
export function validateWorkflowGraph(
  nodes: DomainNode[],
  edges: WorkflowEdge[]
): DagValidationResult {
  return validateDag({ nodes, edges });
}


/* ------------------------------------------------------------------ */
/* Public API */
/* ------------------------------------------------------------------ */

/**
 * Validate a workflow graph.
 * This function NEVER throws.
 */
export function validateDag(graph: WorkflowGraph): DagValidationResult {
  const errors: DagValidationError[] = [];

  const nodeMap = buildNodeMap(graph.nodes);

  /* ---------------- Cycle Detection ---------------- */

  const cycle = detectCycle(graph);
  if (cycle) {
    errors.push({
      message: `Cycle detected in workflow (node: ${cycle})`,
    });
  }

  /* ---------------- Edge Validation ---------------- */

  for (const edge of graph.edges) {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode || !targetNode) {
      errors.push({
        edgeId: edge.id,
        message: 'Edge references non-existent node',
      });
      continue;
    }

    const sourcePort = getNodePort(
      sourceNode.type,
      edge.sourceHandle,
      'output'
    );
    const targetPort = getNodePort(
      targetNode.type,
      edge.targetHandle,
      'input'
    );

    if (!sourcePort || !targetPort) {
      errors.push({
        edgeId: edge.id,
        message: 'Edge references invalid port',
      });
      continue;
    }

    if (
      !isCompatibleConnection(
        sourcePort.dataType,
        targetPort.dataType
      )
    ) {
      errors.push({
        edgeId: edge.id,
        message: `Incompatible connection: ${sourcePort.dataType} → ${targetPort.dataType}`,
      });
    }

    if (
      !allowsMultipleConnections(targetNode.type, targetPort.id)
    ) {
      const incoming = getIncomingEdges(
        targetNode.id,
        graph.edges
      ).filter((e) => e.targetHandle === targetPort.id);

      if (incoming.length > 1) {
        errors.push({
          nodeId: targetNode.id,
          message: `Input "${targetPort.label}" does not allow multiple connections`,
        });
      }
    }
  }

  /* ---------------- Required Inputs ---------------- */

  for (const node of graph.nodes) {
    const requiredPorts = getRequiredInputPorts(node.type);
    const incoming = getIncomingEdges(node.id, graph.edges);

    for (const port of requiredPorts) {
      const connected = incoming.some(
        (e) => e.targetHandle === port.id
      );

      if (!connected) {
        errors.push({
          nodeId: node.id,
          message: `Required input "${port.label}" is not connected`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Deterministic topological sort.
 * Returns an ordered list of node ids.
 *
 * Throws ONLY if a cycle exists.
 */
export function topologicalSort(
  graph: WorkflowGraph
): string[] {
  const nodeIds = graph.nodes.map((n) => n.id);
  const inDegree = new Map<string, number>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
  }

  for (const edge of graph.edges) {
    inDegree.set(
      edge.target,
      (inDegree.get(edge.target) ?? 0) + 1
    );
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(id);
  }

  const sorted: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const edge of getOutgoingEdges(current, graph.edges)) {
      const next = edge.target;
      inDegree.set(next, (inDegree.get(next) ?? 1) - 1);

      if (inDegree.get(next) === 0) {
        queue.push(next);
      }
    }
  }

  if (sorted.length !== nodeIds.length) {
    throw new Error('Cycle detected during topological sort');
  }

  return sorted;
}

/* ------------------------------------------------------------------ */
/* Graph Utilities */
/* ------------------------------------------------------------------ */

export function getIncomingEdges(
  nodeId: string,
  edges: WorkflowEdge[]
): WorkflowEdge[] {
  return edges.filter((e) => e.target === nodeId);
}

export function getOutgoingEdges(
  nodeId: string,
  edges: WorkflowEdge[]
): WorkflowEdge[] {
  return edges.filter((e) => e.source === nodeId);
}

/* ------------------------------------------------------------------ */
/* Internal Helpers */
/* ------------------------------------------------------------------ */

function buildNodeMap(
  nodes: DomainNode[]
): Map<string, DomainNode> {
  return new Map(nodes.map((n) => [n.id, n]));
}

/**
 * Detect cycles using DFS.
 * Returns the node id where a cycle is detected, or null.
 */
function detectCycle(
  graph: WorkflowGraph
): string | null {
  const visited = new Set<string>();
  const stack = new Set<string>();

  const adjacency = new Map<string, string[]>();
  for (const node of graph.nodes) {
    adjacency.set(node.id, []);
  }

  for (const edge of graph.edges) {
    adjacency.get(edge.source)?.push(edge.target);
  }

  function dfs(nodeId: string): string | null {
    if (stack.has(nodeId)) return nodeId;
    if (visited.has(nodeId)) return null;

    visited.add(nodeId);
    stack.add(nodeId);

    for (const next of adjacency.get(nodeId) ?? []) {
      const cycle = dfs(next);
      if (cycle) return cycle;
    }

    stack.delete(nodeId);
    return null;
  }

  for (const node of graph.nodes) {
    const cycle = dfs(node.id);
    if (cycle) return cycle;
  }

  return null;
}
