/**
 * Workflow history store.
 *
 * Responsibilities:
 * - Track workflow runs (full, partial, single)
 * - Store node-level execution results
 * - Provide immutable execution history
 *
 * IMPORTANT:
 * - No UI logic
 * - No React Flow types
 * - No execution orchestration
 */

import { create } from 'zustand';
import { nanoid } from 'nanoid';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type RunScope =
  | 'full'
  | 'partial'
  | 'single';

export type RunStatus =
  | 'running'
  | 'success'
  | 'failed';

export interface HistoryNodeResult {
  nodeId: string;
  nodeType: string;
  label?: string;
  status: RunStatus;
  durationMs?: number;
  inputs?: unknown;
  output?: unknown;
  error?: unknown;
}

export interface WorkflowRun {
  id: string;
  scope: RunScope;
  status: RunStatus;
  startedAt: number;
  finishedAt?: number;
  nodes: HistoryNodeResult[];
}

/* ------------------------------------------------------------------ */
/* Store Shape */
/* ------------------------------------------------------------------ */

export interface HistoryState {
  runs: WorkflowRun[];

  /* Lifecycle */
  startRun: (scope: RunScope) => string;
  finishRun: (runId: string, status: RunStatus) => void;

  /* Node-level updates */
  recordNode: (
    runId: string,
    result: HistoryNodeResult
  ) => void;

  /* Utilities */
  clear: () => void;
}

/* ------------------------------------------------------------------ */
/* Store */
 /* ------------------------------------------------------------------ */

const useHistoryStore = create<HistoryState>((set, get) => ({
  runs: [],

  /* -------------------------------------------------------------- */
  /* Run lifecycle */
  /* -------------------------------------------------------------- */

  startRun: (scope) => {
    const runId = nanoid();

    set((state) => ({
      runs: [
        {
          id: runId,
          scope,
          status: 'running',
          startedAt: Date.now(),
          nodes: [],
        },
        ...state.runs,
      ],
    }));

    return runId;
  },

  finishRun: (runId, status) =>
    set((state) => ({
      runs: state.runs.map((run) =>
        run.id === runId
          ? {
              ...run,
              status,
              finishedAt: Date.now(),
            }
          : run
      ),
    })),

  /* -------------------------------------------------------------- */
  /* Node-level results */
  /* -------------------------------------------------------------- */

  recordNode: (runId, result) =>
    set((state) => ({
      runs: state.runs.map((run) =>
        run.id === runId
          ? {
              ...run,
              nodes: [...run.nodes, result],
            }
          : run
      ),
    })),

  /* -------------------------------------------------------------- */
  /* Utilities */
  /* -------------------------------------------------------------- */

  clear: () => set({ runs: [] }),
}));

export default useHistoryStore;
