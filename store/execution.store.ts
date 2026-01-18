import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */
export type BackendExecutionStatus =
  | 'RUNNING'
  | 'SUCCESS'
  | 'FAILED';

export interface BackendWorkflowRun {
  id: string;
  workflowId: string;
  status: BackendExecutionStatus;
  scope: 'FULL' | 'SINGLE' | 'PARTIAL';
  startedAt: string;
  finishedAt?: string | null;
  durationMs?: number | null;
  error?: string | null;
}

export type ExecutionStatus =
  | 'idle'
  | 'running'
  | 'success'
  | 'failed';

export interface NodeExecutionState {
  status: ExecutionStatus;
  output?: unknown;
  error?: unknown;
}

export interface ExecutionState {
  /* Workflow run */
  workflowRun?: {
    runId: string;
    workflowId: string;
    status: ExecutionStatus;
    startedAt: string;
    scope: 'full' | 'single' | 'partial';
  };

  /* Node runs */
  nodeExecutions: Record<string, NodeExecutionState>;

  /* Queries */
  isNodeRunning: (nodeId: string) => boolean;
  isWorkflowRunning: () => boolean;

  /* Workflow lifecycle */
  startWorkflowRun: (payload: {
    runId: string;
    workflowId: string;
    startedAt: string;
    scope: 'full' | 'single' | 'partial';
  }) => void;

  finishWorkflowRun: (status: ExecutionStatus) => void;

  /* Node lifecycle */
  startNode: (nodeId: string) => void;
  succeedNode: (nodeId: string, output?: unknown) => void;
  failNode: (nodeId: string, error: unknown) => void;

  /* Backend-synced runs */
  runs: BackendWorkflowRun[];

  /* Sync */
  syncFromBackend: (runs: BackendWorkflowRun[]) => void;


  reset: () => void;
}

/* ------------------------------------------------------------------ */
/* Store */
/* ------------------------------------------------------------------ */

const useExecutionStore = create<ExecutionState>((set, get) => ({
  nodeExecutions: {},

  /* Queries */
  isNodeRunning: (nodeId) =>
    get().nodeExecutions[nodeId]?.status === 'running',

  isWorkflowRunning: () =>
    get().workflowRun?.status === 'running',

  /* Workflow lifecycle */
  startWorkflowRun: ({ runId, workflowId, startedAt, scope }) =>
    set({
      workflowRun: {
        runId,
        workflowId,
        startedAt,
        status: 'running',
        scope,
      },
    }),

  finishWorkflowRun: (status) =>
    set((state) => ({
      workflowRun: state.workflowRun
        ? { ...state.workflowRun, status }
        : undefined,
    })),

  /* Node lifecycle */
  startNode: (nodeId) =>
    set((state) => ({
      nodeExecutions: {
        ...state.nodeExecutions,
        [nodeId]: { status: 'running' },
      },
    })),

  succeedNode: (nodeId, output) =>
    set((state) => ({
      nodeExecutions: {
        ...state.nodeExecutions,
        [nodeId]: {
          status: 'success',
          output,
        },
      },
    })),

  failNode: (nodeId, error) =>
    set((state) => ({
      nodeExecutions: {
        ...state.nodeExecutions,
        [nodeId]: {
          status: 'failed',
          error,
        },
      },
    })),

  reset: () =>
    set({
      workflowRun: undefined,
      nodeExecutions: {},
    }),

  runs: [],

  syncFromBackend: (runs) =>
    set((state) => {
      const activeRun = runs.find((r) => r.status === 'RUNNING');

      return {
        runs,
        workflowRun: activeRun
          ? {
            runId: activeRun.id,
            workflowId: activeRun.workflowId,
            status: 'running',
            startedAt: activeRun.startedAt,
            scope:
              activeRun.scope === 'FULL'
                ? 'full'
                : activeRun.scope === 'SINGLE'
                  ? 'single'
                  : 'partial',
          }
          : state.workflowRun
            ? {
              ...state.workflowRun,
              status:
                runs.find((r) => r.id === state.workflowRun?.runId)
                  ?.status === 'SUCCESS'
                  ? 'success'
                  : 'failed',
            }
            : undefined,
      };
    }),

}));

export default useExecutionStore;
