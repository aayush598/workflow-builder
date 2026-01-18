import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

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
}));

export default useExecutionStore;
