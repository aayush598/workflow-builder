import { useCallback } from 'react';
import { useParams } from 'next/navigation';

import useExecutionStore from '@/store/execution.store';

export function useNodeExecution(nodeId: string) {
  const params = useParams();
  const workflowId = params?.workflowId as string | undefined;

  const {
    startWorkflowRun,
    startNode,
  } = useExecutionStore();

  return useCallback(async () => {
    if (!workflowId) return;

    // Call backend execution API
    const res = await fetch(
      `/api/workflows/${workflowId}/nodes/${nodeId}/execute`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    if (!res.ok) {
      throw new Error('Failed to execute node');
    }

    const json = await res.json();

    // Start workflow run in UI
    startWorkflowRun({
      runId: json.data.runId,
      workflowId,
      startedAt: json.data.startedAt,
      scope: 'single',
    });

    // Start node in UI
    startNode(nodeId);

    // Output will arrive via polling → syncFromBackend
    return null;
  }, [
    nodeId,
    workflowId,
    startWorkflowRun,
    startNode,
  ]);
}
