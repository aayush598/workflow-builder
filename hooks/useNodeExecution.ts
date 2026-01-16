import { useCallback } from 'react';

import { executeWorkflow } from '@/domain/workflow/executor';
import type { DomainNode } from '@/domain/nodes/node-factory';

import useWorkflowStore from '@/store/workflow.store';
import useExecutionStore from '@/store/execution.store';
import useHistoryStore from '@/store/history.store';

export function useNodeExecution(nodeId: string) {
  const { nodes, edges } = useWorkflowStore();
  const {
    startNode,
    succeedNode,
    failNode,
    resetAll,
  } = useExecutionStore();
  const { startRun, recordNode, finishRun } = useHistoryStore();

  return useCallback(async () => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    resetAll();
    startNode(nodeId);

    const runId = startRun('single');
    const startedAt = Date.now();

    try {
      const result = await executeWorkflow({
        nodes: [node as DomainNode],
        edges: [],
      });

      const nodeResult = result.find(r => r.nodeId === nodeId);
      const output = nodeResult?.output;

      succeedNode(nodeId, output);

      recordNode(runId, {
        nodeId,
        nodeType: node.type,
        status: 'success',
        durationMs: Date.now() - startedAt,
        output,
      });

      finishRun(runId, 'success');
      return output;
    } catch (err) {
      failNode(nodeId, err);

      recordNode(runId, {
        nodeId,
        nodeType: node.type,
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      });

      finishRun(runId, 'failed');
      throw err;
    }
  }, [
  nodeId,
  nodes,
  edges,
  resetAll,
  startNode,
  succeedNode,
  failNode,
  startRun,
  recordNode,
  finishRun,
]);
}