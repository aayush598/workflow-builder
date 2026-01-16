/**
 * Execution store.
 *
 * Responsibilities:
 * - Track running / completed node executions
 * - Track node-level status & results
 * - Coordinate execution lifecycle
 *
 * IMPORTANT:
 * - No UI components
 * - No React Flow types
 * - No domain DAG logic
 */

import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type ExecutionStatus =
  | 'idle'
  | 'running'
  | 'success'
  | 'error';

export interface NodeExecutionState {
  status: ExecutionStatus;
  startedAt?: number;
  finishedAt?: number;
  output?: unknown;
  error?: unknown;
}

export interface ExecutionState {
  /** Node id → execution state */
  executions: Record<string, NodeExecutionState>;

  /* Queries */
  isNodeRunning: (nodeId: string) => boolean;

  /* Lifecycle */
  startNode: (nodeId: string) => void;
  succeedNode: (nodeId: string, output?: unknown) => void;
  failNode: (nodeId: string, error: unknown) => void;
  resetAll: () => void;
}

/* ------------------------------------------------------------------ */
/* Store */
/* ------------------------------------------------------------------ */

const useExecutionStore = create<ExecutionState>((set, get) => ({
  executions: {},

  isNodeRunning: (nodeId) =>
    get().executions[nodeId]?.status === 'running',

  /* -------------------------------------------------------------- */
  /* Lifecycle */
  /* -------------------------------------------------------------- */

  startNode: (nodeId) =>
    set((state) => ({
      executions: {
        ...state.executions,
        [nodeId]: {
          status: 'running',
          startedAt: Date.now(),
        },
      },
    })),

  succeedNode: (nodeId, output) =>
    set((state) => ({
      executions: {
        ...state.executions,
        [nodeId]: {
          status: 'success',
          startedAt: state.executions[nodeId]?.startedAt,
          finishedAt: Date.now(),
          output,
        },
      },
    })),

  failNode: (nodeId, error) =>
    set((state) => ({
      executions: {
        ...state.executions,
        [nodeId]: {
          status: 'error',
          startedAt: state.executions[nodeId]?.startedAt,
          finishedAt: Date.now(),
          error,
        },
      },
    })),

  resetAll: () => set({ executions: {} }),
}));

export default useExecutionStore;
