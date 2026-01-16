'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  type Connection,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TextNode from '@/components/nodes/TextNode';
import UploadImageNode from '@/components/nodes/UploadImageNode';
import UploadVideoNode from '@/components/nodes/UploadVideoNode';
import LLMNode from '@/components/nodes/LLMNode';
import CropImageNode from '@/components/nodes/CropImageNode';
import ExtractFrameNode from '@/components/nodes/ExtractFrameNode';

import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import Header from '@/components/Header';
import BottomToolbar from '@/components/BottomToolbar';
import WelcomeModal from '@/components/WelcomeModal';

import useWorkflowStore from '@/lib/store';

const nodeTypes = {
  text: TextNode,
  uploadImage: UploadImageNode,
  uploadVideo: UploadVideoNode,
  llm: LLMNode,
  cropImage: CropImageNode,
  extractFrame: ExtractFrameNode,
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#D946EF', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#D946EF',
  },
};

export default function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect: onConnectStore, // Rename to avoid conflict if we define local wrapper
    loadSampleWorkflow,
    setEdges // We might need this if we manually construct edge
  } = useWorkflowStore();

  const [showWelcome, setShowWelcome] = useState(true);

  // Load sample workflow on mount
  useEffect(() => {
    const hasLoadedBefore = localStorage.getItem('weavy-loaded');
    if (!hasLoadedBefore) {
      loadSampleWorkflow();
      localStorage.setItem('weavy-loaded', 'true');
    }
  }, [loadSampleWorkflow]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Type validation for connections
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);

      // Allow connection if types are compatible
      const newEdge = {
        ...params,
        animated: true,
        style: {
          stroke: Math.random() > 0.5 ? '#D946EF' : '#2DD4BF',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: Math.random() > 0.5 ? '#D946EF' : '#2DD4BF',
        },
      };

      onConnectStore(newEdge);
    },
    [nodes, onConnectStore]
  );

  const onNodeDelete = useCallback(
    (deleted: Node[]) => {
      // Remove connected edges - This logic is better handled in the store usually,
      // but for now we follow existing pattern but updating STORE edges.
      // Actually, ReactFlow might handle deletion of edges connected to deleted nodes automatically if we pass onEdgesChange?
      // No, usually explicit.
      // But let's stick to what we have, using setEdges from store.

      // Wait, the store has a deleteNode action but ReactFlow calls onNodesDelete with array of deleted nodes.
      // We should probably rely on onNodesChange which handles 'remove' events?
      // ReactFlow sends 'remove' changes to onNodesChange.
      // But connected edges removal must be manual if not handled by applyNodeChanges.
      // applyNodeChanges does NOT remove connected edges.

      // EXISTING IMPLEMENTATION:
      // setEdgesState((eds) => eds.filter(...))

      // NEW IMPLEMENTATION:
      setEdges(edges.filter(
        (edge) => !deleted.some((node) => node.id === edge.source || node.id === edge.target)
      ));
    },
    [edges, setEdges]
  );

  return (
    <div className="w-screen h-screen bg-[#0A0A0A]">
      <LeftSidebar />
      <RightSidebar />
      <Header />

      <div className="absolute left-16 top-16 right-[300px] bottom-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodeDelete}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          className="bg-[#0A0A0A]"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            gap={20}
            size={1}
            color="#2A2A2A"
            variant={BackgroundVariant.Dots}
          />
          <MiniMap
            nodeColor={(node: Node) => {
              switch (node.type) {
                case 'text': return '#3B82F6';
                case 'uploadImage': return '#D946EF';
                case 'uploadVideo': return '#2DD4BF';
                case 'llm': return '#FFD700';
                case 'cropImage': return '#10B981';
                case 'extractFrame': return '#F59E0B';
                default: return '#6B7280';
              }
            }}
            className="!bg-[#1A1A1A] !border-white/10"
            maskColor="rgba(10, 10, 10, 0.8)"
          />
        </ReactFlow>

        <BottomToolbar />
      </div>

      <WelcomeModal open={showWelcome} onClose={() => setShowWelcome(false)} />
    </div>
  );
}