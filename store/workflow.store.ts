/**
 * Workflow store (graph state).
 *
 * Responsibilities:
 * - Own workflow nodes + edges (UI state)
 * - Bridge DomainNode <-> React Flow Node
 * - Enforce domain rules on mutations
 *
 * IMPORTANT:
 * - No execution logic
 * - No async side effects
 * - All validation delegated to domain/*
 */

import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';

import type { DomainNode } from '@/domain/nodes/node-factory';
import { createNode, duplicateNode } from '@/domain/nodes/node-factory';
import type { NodeTypeId } from '@/domain/nodes/node-types';
import {
  validateWorkflowGraph,
  type WorkflowEdge,
} from '@/domain/workflow/dag';
import {
  isCompatibleConnection,
  getNodePort,
  allowsMultipleConnections,
} from '@/domain/nodes/node-ports';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import {
  serializeWorkflow,
  deserializeWorkflow,
  type SerializedWorkflow,
} from '@/domain/workflow/serializer';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type EditorMode = 'select' | 'pan';

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];

  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;

  /* React Flow adapters */
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  /* Node actions */
  addNode: (type: NodeTypeId, position?: { x: number; y: number }) => void;
  duplicateNode: (nodeId: string) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;

  beforeGraphChange?: () => void;

  /* Graph actions */
  setGraph: (nodes: Node[], edges: Edge[]) => void;
  clear: () => void;

  /* Persistence */
  /* Persistence */
  saveWorkflow: (id: string) => Promise<void>;
  loadWorkflow: (id: string) => Promise<void>;

  /* State */
  isLoading: boolean;
  workflowName: string | null;
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

/**
 * Convert DomainNode → React Flow Node
 */
function toRFNode(node: DomainNode): Node {
  return {
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
  };
}

/**
 * Convert React Flow Node → DomainNode
 */
function toDomainNode(node: Node): DomainNode {
  return {
    id: node.id,
    type: node.type as NodeTypeId,
    position: node.position,
    data: node.data,
  };
}

/* ------------------------------------------------------------------ */
/* Store */
/* ------------------------------------------------------------------ */

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],

  editorMode: 'select',
  setEditorMode: (mode) => set({ editorMode: mode }),

  /* State */
  isLoading: false,
  workflowName: null,

  /* -------------------------------------------------------------- */
  /* React Flow adapters */
  /* -------------------------------------------------------------- */

  onNodesChange: (changes) =>
    set((state) => {
      state.beforeGraphChange?.();
      return {
        nodes: applyNodeChanges(changes, state.nodes),
      };
    }),


  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) => {
    const { nodes, edges } = get();

    console.log('🔗 onConnect triggered:', connection);

    if (
      !connection.source ||
      !connection.target ||
      !connection.sourceHandle ||
      !connection.targetHandle
    ) {
      console.warn('❌ Missing connection handles/ids');
      return;
    }

    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) {
      console.warn('❌ Source or Target node not found', { sourceNode, targetNode });
      return;
    }

    const sourcePort = getNodePort(
      sourceNode.type as NodeTypeId,
      connection.sourceHandle,
      'output'
    );

    const targetPort = getNodePort(
      targetNode.type as NodeTypeId,
      connection.targetHandle,
      'input'
    );

    if (!sourcePort || !targetPort) {
      console.warn('❌ Source or Target port definition not found', { sourcePort, targetPort });
      return;
    }

    console.log('✅ Ports found:', { source: sourcePort, target: targetPort });

    if (
      !isCompatibleConnection(
        sourcePort.dataType,
        targetPort.dataType
      )
    ) {
      console.warn('❌ Incompatible types:', { from: sourcePort.dataType, to: targetPort.dataType });
      return;
    }

    if (
      !allowsMultipleConnections(
        targetNode.type as NodeTypeId,
        targetPort.id
      )
    ) {
      const alreadyConnected = edges.some(
        (e) =>
          e.target === connection.target &&
          e.targetHandle === connection.targetHandle
      );

      if (alreadyConnected) {
        console.warn('❌ Port already connected (single connection allowed)');
        return;
      }
    }

    const newEdge: Edge = {
      id: `${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
      source: connection.source,
      sourceHandle: connection.sourceHandle ?? undefined,
      target: connection.target,
      targetHandle: connection.targetHandle ?? undefined,
    };

    console.log('✨ Creating edge:', newEdge);

    const domainNodes = nodes.map(toDomainNode);
    const domainEdges: WorkflowEdge[] = [
      ...edges.map((e) => ({
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle ?? null,
        target: e.target,
        targetHandle: e.targetHandle ?? null,
      })),
      {
        id: newEdge.id,
        source: newEdge.source,
        sourceHandle: newEdge.sourceHandle ?? null,
        target: newEdge.target,
        targetHandle: newEdge.targetHandle ?? null,
      },
    ];

    if (!validateWorkflowGraph(domainNodes, domainEdges, { checkRequired: false }).valid) {
      console.warn('❌ Cycle detected or graph invalid');
      return;
    }

    set({ edges: [...edges, newEdge] });
  },

  /* -------------------------------------------------------------- */
  /* Node actions */
  /* -------------------------------------------------------------- */

  addNode: (type, position) => {
    const domainNode = createNode(type, { position });
    set((state) => ({
      nodes: [...state.nodes, toRFNode(domainNode)],
    }));
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const duplicated = duplicateNode(toDomainNode(node));
    set((state) => ({
      nodes: [...state.nodes, toRFNode(duplicated)],
    }));
  },

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    })),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...data } }
          : n
      ),
    })),

  /* -------------------------------------------------------------- */
  /* Graph actions */
  /* -------------------------------------------------------------- */

  setGraph: (nodes: Node[], edges: Edge[]) => set({ nodes, edges }),

  clear: () => set({ nodes: [], edges: [] }),

  /* -------------------------------------------------------------- */
  /* Persistence */
  /* -------------------------------------------------------------- */

  saveWorkflow: async (id) => {
    console.log(`💾 Saving workflow ${id}...`);
    const { nodes, edges } = get();

    // 1. Convert to domain objects
    const domainNodes = nodes.map(toDomainNode);
    const domainEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      sourceHandle: e.sourceHandle ?? null,
      target: e.target,
      targetHandle: e.targetHandle ?? null,
    }));

    console.log(`📦 Payload: ${domainNodes.length} nodes, ${domainEdges.length} edges`);

    // 2. Serialize (reuse domain logic)
    // We use the serializer to ensure consistent structure, then parse back
    // because our API expects an object, not a string.
    const json = serializeWorkflow({ nodes: domainNodes, edges: domainEdges });
    const payload = JSON.parse(json) as SerializedWorkflow;

    // 3. Send to API
    try {
      const res = await fetch(`/api/workflows/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          graph: {
            nodes: payload.nodes,
            edges: payload.edges,
          }
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save workflow: ${res.status} ${errorText}`);
      }

      console.log('✅ Workflow saved successfully');
    } catch (error) {
      console.error('❌ Save failed:', error);
    }
  },

  loadWorkflow: async (id) => {
    console.log(`📥 Loading workflow ${id}...`);
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/workflows/${id}`);
      if (!res.ok) throw new Error(`Failed to load workflow: ${res.status}`);

      const json = await res.json();
      console.log('📦 API Response:', json);

      const workflowData = json.data;

      if (!workflowData?.graph) {
        console.warn('⚠️ No graph data found in workflow response');
        return;
      }

      // 1. Reconstruct serialized format
      // We assume version 1 for now as we don't store it on the workflow root
      // In a real app, `data.version` might come from the API
      const serialized: SerializedWorkflow = {
        version: 1,
        nodes: workflowData.graph.nodes ?? [], // Default to empty if missing
        edges: workflowData.graph.edges ?? [],
      };

      // 2. Deserialize (validates & rehydrates types)
      const graph = deserializeWorkflow(JSON.stringify(serialized));

      // 3. Update store
      set({
        workflowName: workflowData.name ?? 'Untitled Workflow',
        nodes: graph.nodes.map(toRFNode),
        edges: graph.edges.map((e) => ({
          id: e.id,
          source: e.source,
          sourceHandle: e.sourceHandle ?? undefined,
          target: e.target,
          targetHandle: e.targetHandle ?? undefined,
          animated: true, // Restore default UI props
        })),
        // Reset history on load?
        // Maybe not necessary if undo/redo handles it naturally or if we want to clear it.
      });

      console.log('✅ Workflow loaded');
    } catch (error) {
      console.error('❌ Load failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useWorkflowStore;
