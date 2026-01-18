import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */
export type BackendExecutionStatus =
  | 'RUNNING'
  | 'SUCCESS'
  | 'FAILED';

export interface BackendNodeRun {
  nodeId: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  error?: string | null;
  outputs?: unknown;
}

export interface BackendWorkflowRun {
  id: string;
  workflowId: string;
  status: BackendExecutionStatus;
  scope: 'FULL' | 'SINGLE' | 'PARTIAL';
  startedAt: string;
  finishedAt?: string | null;
  durationMs?: number | null;
  error?: string | null;
  nodeRuns?: BackendNodeRun[];
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
  getNodeStatus: (nodeId: string) => ExecutionStatus | undefined;
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

  getNodeStatus: (nodeId) =>
    get().nodeExecutions[nodeId]?.status,

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

      // Map backend node runs to frontend node executions
      let nodeExecutions = state.nodeExecutions;

      // If there is an active run with nodeRuns, update the store
      if (activeRun && activeRun.nodeRuns) {
        const newNodeExecutions: Record<string, NodeExecutionState> = {};

        activeRun.nodeRuns.forEach((nr) => {
          let status: ExecutionStatus = 'idle';
          if (nr.status === 'RUNNING') status = 'running';
          if (nr.status === 'SUCCESS') status = 'success';
          if (nr.status === 'FAILED') status = 'failed';

          newNodeExecutions[nr.nodeId] = {
            status,
            output: nr.outputs,
            error: nr.error,
          };
        });

        // Merge with existing logic? 
        // We probably want to overwrite fully if we trust the backend snapshot
        nodeExecutions = newNodeExecutions;
      }
      // If we recently finished (no active run), we might want to keep the last state 
      // OR look at the latest finished run? 
      // For now, let's prioritize the RUNNING one. 
      // If no running one, maybe we check the latest run if it matches our current view. 
      // But typically syncFromBackend is called during polling. 

      // If no active run but we have a workflowRun in state, check if it just finished
      if (!activeRun && state.workflowRun) {
        const finishedRun = runs.find(r => r.id === state.workflowRun?.runId);
        if (finishedRun && finishedRun.nodeRuns) {
          const finalNodeExecutions: Record<string, NodeExecutionState> = {};
          finishedRun.nodeRuns.forEach((nr) => {
            let status: ExecutionStatus = 'idle';
            if (nr.status === 'RUNNING') status = 'running';
            if (nr.status === 'SUCCESS') status = 'success';
            if (nr.status === 'FAILED') status = 'failed';
            finalNodeExecutions[nr.nodeId] = { status, output: nr.outputs, error: nr.error };
          });
          nodeExecutions = finalNodeExecutions;
        }
      }

      return {
        runs,
        nodeExecutions,
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
