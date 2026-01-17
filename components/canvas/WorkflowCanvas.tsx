'use client';

/**
 * WorkflowCanvas
 *
 * Responsibilities:
 * - Own full editor layout
 * - Compose chrome (header, sidebars, toolbar)
 * - Host React Flow canvas only
 *
 * IMPORTANT:
 * - No business logic
 * - No execution logic
 */

import { useCallback } from 'react';
import {
  ReactFlow,
  type Connection,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Header from '@/components/header/Header';
import LeftSidebar from '@/components/sidebars/left/LeftSidebar';
import RightSidebar from '@/components/sidebars/right/RightSidebar';
import BottomToolbar from '@/components/toolbar/BottomToolbar';

import TextNode from '@/components/nodes/text/TextNode';
import UploadImageNode from '@/components/nodes/upload-image/UploadImageNode';
import UploadVideoNode from '@/components/nodes/upload-video/UploadVideoNode';
import CropImageNode from '@/components/nodes/crop-image/CropImageNode';
import ExtractFrameNode from '@/components/nodes/extract-frame/ExtractFrameNode';
import LLMNode from '@/components/nodes/llm/LLMNode';

import CanvasBackground from './CanvasBackground';
import CanvasMiniMap from './CanvasMiniMap';
import CanvasControls from './CanvasControls';

import useWorkflowStore from '@/store/workflow.store';
import { useDragNode } from '@/hooks/useDragNode';

import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useEffect } from 'react';

/* ------------------------------------------------------------------ */
/* Edge defaults */
/* ------------------------------------------------------------------ */

const defaultEdgeOptions = {
  animated: true,
  style: { strokeWidth: 2, stroke: '#fff' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
};

/* ------------------------------------------------------------------ */
/* Node Types */
/* ------------------------------------------------------------------ */

const nodeTypes = {
  text: TextNode,
  'upload-image': UploadImageNode,
  'upload-video': UploadVideoNode,
  'crop-image': CropImageNode,
  'extract-frame': ExtractFrameNode,
  llm: LLMNode,
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    editorMode,
  } = useWorkflowStore();

  const { onDrop, onDragOver } = useDragNode();
  const { pushSnapshot } = useUndoRedo();

  /**
   * Connection validation wrapper
   * (data-type validation already handled in store/domain)
   */
  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection);
    },
    [onConnect]
  );

  useEffect(() => {
    useWorkflowStore.setState({
      beforeGraphChange: pushSnapshot,
    });
  }, [pushSnapshot]);

  return (
    <div className="h-screen w-screen bg-[#0A0A0A] overflow-hidden">
      {/* Chrome */}
      <LeftSidebar />
      <RightSidebar />
      <Header />

      <div
        className="absolute left-16 right-[300px] top-16 bottom-0"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          panOnDrag={editorMode === 'pan'}
          selectionOnDrag={editorMode === 'select'}
          nodesDraggable={editorMode === 'select'}
          nodesConnectable={editorMode === 'select'}
          fitView
          className="bg-[#0A0A0A]"
          proOptions={{ hideAttribution: true }}
        >
          <CanvasBackground />
          <CanvasMiniMap />
          <CanvasControls />
        </ReactFlow>

        <BottomToolbar />
      </div>

    </div>
  );
}
