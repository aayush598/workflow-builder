'use client';

/**
 * WorkflowHistory
 *
 * Responsibilities:
 * - Read workflow run history from store
 * - Render list of workflow runs
 * - Handle empty / loading states
 *
 * IMPORTANT:
 * - No layout positioning (handled by RightSidebar)
 * - No node-level rendering (delegated)
 */

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useHistoryStore from '@/store/history.store';
import HistoryRunItem from './HistoryRunItem';

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function WorkflowHistory() {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const { runs, isLoading, error, fetchHistory } = useHistoryStore();

  useEffect(() => {
    if (workflowId) {
      fetchHistory(workflowId);
    }
  }, [workflowId, fetchHistory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-white/40">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-xs text-red-400">
        Failed to load history: {error}
      </div>
    );
  }

  if (!runs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="text-sm text-white/60">
          No workflow runs yet
        </div>
        <div className="mt-1 text-xs text-white/40">
          Execute a node or workflow to see history
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-white/5">
      {runs.map((run) => (
        <HistoryRunItem key={run.id} run={run} />
      ))}
    </div>
  );
}
