/**
 * Workflow history store.
 *
 * Responsibilities:
 * - Fetch and store workflow runs from backend
 * - Manage loading and error states
 * - Provide execution history to UI
 */

import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type RunScope =
  | 'FULL'
  | 'PARTIAL'
  | 'SINGLE_NODE';

export type RunStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'SUCCESS'
  | 'FAILED';

export interface HistoryNodeResult {
  id: string; // valid database id
  nodeId: string;
  nodeType: string;
  label?: string;
  status: RunStatus;
  startedAt: string; // ISO string
  finishedAt?: string; // ISO string
  durationMs?: number;
  inputs?: unknown;
  output?: unknown;
  error?: unknown;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  scope: RunScope;
  status: RunStatus;
  startedAt: string; // ISO string
  finishedAt?: string; // ISO string
  durationMs?: number;
  error?: string | null;
  nodes: HistoryNodeResult[];
}

/* ------------------------------------------------------------------ */
/* Store Shape */
/* ------------------------------------------------------------------ */

export interface HistoryState {
  runs: WorkflowRun[];
  isLoading: boolean;
  error: string | null;

  /* Actions */
  fetchHistory: (workflowId: string) => Promise<void>;
  clear: () => void;
}

/* ------------------------------------------------------------------ */
/* Store */
/* ------------------------------------------------------------------ */

const useHistoryStore = create<HistoryState>((set) => ({
  runs: [],
  isLoading: false,
  error: null,

  /* -------------------------------------------------------------- */
  /* Actions */
  /* -------------------------------------------------------------- */

  fetchHistory: async (workflowId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/workflows/${workflowId}/history`);
      if (!res.ok) throw new Error('Failed to fetch history');

      const { data } = await res.json();
      set({ runs: data });
    } catch (err) {
      console.error(err);
      set({ error: (err as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  clear: () => set({ runs: [], error: null }),
}));

export default useHistoryStore;
