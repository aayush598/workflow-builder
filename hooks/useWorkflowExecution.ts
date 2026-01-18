import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import useExecutionStore from '@/store/execution.store';

export function useWorkflowExecution() {
    const params = useParams();
    const workflowId = params?.workflowId as string | undefined;

    const startWorkflowRun = useExecutionStore(
        (s) => s.startWorkflowRun
    );

    return useCallback(async () => {
        if (!workflowId) {
            throw new Error('Missing workflowId');
        }

        const res = await fetch(
            `/api/workflows/${workflowId}/runs`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        if (!res.ok) {
            throw new Error('Failed to start workflow run');
        }

        const json = await res.json();

        startWorkflowRun({
            runId: json.data.runId,
            workflowId: json.data.workflowId,
            startedAt: json.data.startedAt,
            scope: 'full',
        });
    }, [workflowId, startWorkflowRun]);
}
