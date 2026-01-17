/**
 * Undo / Redo hook for workflow state.
 *
 * Responsibilities:
 * - Track historical snapshots of workflow graph
 * - Provide undo / redo commands
 * - Remain UI-agnostic
 *
 * DESIGN:
 * - Snapshot-based (simple, reliable)
 * - Uses internal Zustand store for singleton history state
 *
 * IMPORTANT:
 * - No React Flow imports in API (handled internally)
 * - No DOM logic
 */

import { create } from 'zustand';
import useWorkflowStore from '@/store/workflow.store';
import type { Node as RFNode, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface WorkflowSnapshot {
  nodes: RFNode[];
  edges: Edge[];
}

interface HistoryState {
  undoStack: WorkflowSnapshot[];
  redoStack: WorkflowSnapshot[];
  isRestoring: boolean;

  /* Actions */
  pushSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
}

/* ------------------------------------------------------------------ */
/* Internal Store */
/* ------------------------------------------------------------------ */

const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  isRestoring: false,

  pushSnapshot: () => {
    const { isRestoring, undoStack } = get();
    // Don't save snapshot if we are currently undoing/redoing
    if (isRestoring) return;

    // Grab *current* state from the workflow store
    const { nodes, edges } = useWorkflowStore.getState();

    set({
      undoStack: [...undoStack, {
        nodes: structuredClone(nodes),
        edges: structuredClone(edges),
      }],
      redoStack: [], // New change clears redo stack
    });
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    const snapshot = undoStack[undoStack.length - 1];
    if (!snapshot) return;

    // Grab current state to move to redo stack
    const { nodes: currentNodes, edges: currentEdges, setGraph } = useWorkflowStore.getState();

    const newRedoSnapshot = {
      nodes: structuredClone(currentNodes),
      edges: structuredClone(currentEdges),
    };

    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, newRedoSnapshot],
      isRestoring: true,
    });

    // Apply the historic snapshot
    setGraph(snapshot.nodes, snapshot.edges);

    set({ isRestoring: false });
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    const snapshot = redoStack[redoStack.length - 1];
    if (!snapshot) return;

    // Grab current state to move to undo stack
    const { nodes: currentNodes, edges: currentEdges, setGraph } = useWorkflowStore.getState();

    const newUndoSnapshot = {
      nodes: structuredClone(currentNodes),
      edges: structuredClone(currentEdges),
    };

    set({
      undoStack: [...undoStack, newUndoSnapshot],
      redoStack: redoStack.slice(0, -1),
      isRestoring: true,
    });

    // Apply the next snapshot
    setGraph(snapshot.nodes, snapshot.edges);

    set({ isRestoring: false });
  },

  clear: () => {
    set({ undoStack: [], redoStack: [], isRestoring: false });
  },
}));

/* ------------------------------------------------------------------ */
/* Public Hook */
/* ------------------------------------------------------------------ */

export function useUndoRedo() {
  const undoStack = useHistoryStore((s) => s.undoStack);
  const redoStack = useHistoryStore((s) => s.redoStack);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const pushSnapshot = useHistoryStore((s) => s.pushSnapshot);

  return {
    undo,
    redo,
    pushSnapshot,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}

export default useUndoRedo;
