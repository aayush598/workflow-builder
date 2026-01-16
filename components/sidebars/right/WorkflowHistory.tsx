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

import useHistoryStore from '@/store/history.store';
import HistoryRunItem from './HistoryRunItem';

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function WorkflowHistory() {
  const { runs } = useHistoryStore();

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
