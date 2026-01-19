/**
 * Workflow execution orchestrator (mock).
 *
 * Responsibilities:
 * - Determine execution order using DAG utilities
 * - Aggregate inputs for each node from upstream outputs
 * - Execute nodes deterministically (mocked)
 * - Support partial execution
 * - Track execution timing and status
 *
 * IMPORTANT:
 * - No UI logic
 * - No React / Zustand
 * - No real API calls
 * - Execution is mocked and deterministic
 */

import type { DomainNode } from '../nodes/node-factory';
import type { NodeTypeId } from '../nodes/node-types';
import {
  NODE_PORTS,
  getNodePort,
} from '../nodes/node-ports';
import {
  topologicalSort,
  getIncomingEdges,
  type WorkflowGraph,
  type WorkflowEdge,
} from './dag';
import { parseNodeData } from '../nodes/node-schemas';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface ExecutionContext {
  nodeId: string;
  inputs: Record<string, unknown>;
}

export interface ExecutionResult {
  nodeId: string;
  status: 'success' | 'failed';
  output?: unknown;
  error?: string;
  durationMs: number;
}

export interface ExecuteWorkflowOptions {
  /**
   * Optional subset of node ids to execute.
   * If omitted, executes the full workflow.
   */
  nodes?: string[];
}

/* ------------------------------------------------------------------ */
/* Public API */
/* ------------------------------------------------------------------ */

/**
 * Execute a workflow graph.
 *
 * Execution is:
 * - Topologically ordered
 * - Deterministic
 * - Side-effect free (mocked)
 *
 * Independent branches execute in parallel.
 */
export async function executeWorkflow(
  graph: WorkflowGraph,
  options: ExecuteWorkflowOptions = {}
): Promise<ExecutionResult[]> {
  const executionOrder = topologicalSort(graph);
  const nodeMap = new Map<string, DomainNode>(
    graph.nodes.map((n) => [n.id, n])
  );

  const allowedNodes = options.nodes
    ? new Set(options.nodes)
    : null;

  const results: ExecutionResult[] = [];

  for (const nodeId of executionOrder) {
    if (allowedNodes && !allowedNodes.has(nodeId)) continue;

    const node = nodeMap.get(nodeId);
    if (!node) continue;

    // ❗ Phase 2: executor NO LONGER runs logic
    // Execution is handled by Trigger.dev only
    results.push({
      nodeId,
      status: "success",
      durationMs: 0,
    });
  }

  return results;
}


/* ------------------------------------------------------------------ */
/* Input Aggregation */
/* ------------------------------------------------------------------ */

function buildExecutionContext(
  node: DomainNode,
  edges: WorkflowEdge[],
  outputStore: Map<string, unknown>,
  nodeMap: Map<string, DomainNode>
): ExecutionContext {
  const inputs: Record<string, unknown> = {};

  const incoming = getIncomingEdges(node.id, edges);
  const portDefinitions = NODE_PORTS[node.type].inputs;

  for (const port of portDefinitions) {
    const connectedEdges = incoming.filter(
      (e) => e.targetHandle === port.id
    );

    if (connectedEdges.length === 0) continue;

    if (port.multiple) {
      inputs[port.id] = connectedEdges
        .map((edge) => outputStore.get(edge.source))
        .filter(Boolean);
    } else {
      inputs[port.id] = outputStore.get(
        connectedEdges[0].source
      );
    }
  }

  return {
    nodeId: node.id,
    inputs,
  };
}


/* ------------------------------------------------------------------ */
/* Utilities */
/* ------------------------------------------------------------------ */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
