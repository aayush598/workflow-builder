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
 * - No command pattern yet (can be added later)
 *
 * IMPORTANT:
 * - No React Flow imports
 * - No DOM logic
 */

import { useCallback, useEffect, useRef } from 'react';

import useWorkflowStore from '@/store/workflow.store';
import type { DomainNode } from '@/domain/nodes/node-factory';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface WorkflowSnapshot {
  nodes: DomainNode[];
  edges: any[];
}

/* ------------------------------------------------------------------ */
/* Hook */
 /* ------------------------------------------------------------------ */

export function useUndoRedo() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
  } = useWorkflowStore();

  const undoStack = useRef<WorkflowSnapshot[]>([]);
  const redoStack = useRef<WorkflowSnapshot[]>([]);
  const isRestoring = useRef(false);

  /* ------------------------------------------------------------------ */
  /* Snapshot */
  /* ------------------------------------------------------------------ */

  const snapshot = useCallback(() => {
    if (isRestoring.current) return;

    undoStack.current.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    });

    // Once a new action happens, redo history is invalid
    redoStack.current = [];
  }, [nodes, edges]);

  /* ------------------------------------------------------------------ */
  /* Undo */
  /* ------------------------------------------------------------------ */

  const undo = useCallback(() => {
    const last = undoStack.current.pop();
    if (!last) return;

    redoStack.current.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    });

    isRestoring.current = true;
    setNodes(last.nodes);
    setEdges(last.edges);
    isRestoring.current = false;
  }, [nodes, edges, setNodes, setEdges]);

  /* ------------------------------------------------------------------ */
  /* Redo */
  /* ------------------------------------------------------------------ */

  const redo = useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) return;

    undoStack.current.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    });

    isRestoring.current = true;
    setNodes(next.nodes);
    setEdges(next.edges);
    isRestoring.current = false;
  }, [nodes, edges, setNodes, setEdges]);

  /* ------------------------------------------------------------------ */
  /* Auto snapshot on graph mutation */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    snapshot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  /* ------------------------------------------------------------------ */
  /* Public API */
  /* ------------------------------------------------------------------ */

  return {
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
  };
}

export default useUndoRedo;
