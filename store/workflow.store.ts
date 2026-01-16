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

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];

  /* React Flow adapters */
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  /* Node actions */
  addNode: (type: NodeTypeId, position?: { x: number; y: number }) => void;
  duplicateNode: (nodeId: string) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;

  /* Graph actions */
  setGraph: (nodes: Node[], edges: Edge[]) => void;
  clear: () => void;
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

  /* -------------------------------------------------------------- */
  /* React Flow adapters */
  /* -------------------------------------------------------------- */

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

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
      sourceHandle: connection.sourceHandle,
      target: connection.target,
      targetHandle: connection.targetHandle,
    };

    console.log('✨ Creating edge:', newEdge);

    const domainNodes = nodes.map(toDomainNode);
    const domainEdges: WorkflowEdge[] = [
      ...edges.map((e) => ({
        id: e.id,
        source: e.source,
        sourceHandle: e.sourceHandle!,
        target: e.target,
        targetHandle: e.targetHandle!,
      })),
      {
        id: newEdge.id,
        source: newEdge.source,
        sourceHandle: newEdge.sourceHandle!,
        target: newEdge.target,
        targetHandle: newEdge.targetHandle!,
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

  setGraph: (nodes, edges) => set({ nodes, edges }),

  clear: () => set({ nodes: [], edges: [] }),
}));

export default useWorkflowStore;
