import { useCallback } from 'react';
import { useParams } from 'next/navigation';

import useExecutionStore from '@/store/execution.store';

export function useNodeExecution(nodeId: string) {
  const params = useParams();
  const workflowId = params?.workflowId as string | undefined;

  const {
    startWorkflowRun,
    startNode,
    succeedNode,
    failNode,
    finishWorkflowRun,
  } = useExecutionStore();

  return useCallback(async () => {
    if (!workflowId) return;

    // 1. Start workflow run (SINGLE)
    const res = await fetch(
      `/api/workflows/${workflowId}/runs`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    if (!res.ok) {
      throw new Error('Failed to start node run');
    }

    const json = await res.json();

    startWorkflowRun({
      runId: json.data.runId,
      workflowId,
      startedAt: json.data.startedAt,
      scope: 'single',
    });

    // 2. Mock node execution
    startNode(nodeId);

    await new Promise((r) => setTimeout(r, 800));

    const output = `Mock output for node ${nodeId}`;

    succeedNode(nodeId, output);
    finishWorkflowRun('success');

    return output;
  }, [
    nodeId,
    workflowId,
    startWorkflowRun,
    startNode,
    succeedNode,
    finishWorkflowRun,
    failNode,
  ]);
}
