'use client';

import {
  Hand,
  MousePointer,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import useWorkflowStore from '@/store/workflow.store';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useState } from 'react';

import { Play } from 'lucide-react';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import useExecutionStore from '@/store/execution.store';

export default function BottomToolbar() {
  const { zoomIn, zoomOut, fitView, getZoom, getViewport, setViewport } = useReactFlow();
  const { editorMode, setEditorMode } = useWorkflowStore();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const [open, setOpen] = useState(false);
  const zoom = Math.round(getZoom() * 100);

  const runWorkflow = useWorkflowExecution();
  const executionStatus = useExecutionStore((s) => s.status);


  return (
    <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-2 shadow-2xl">
      {/* Select / Pan */}
      <ToolbarButton
        icon={MousePointer}
        active={editorMode === 'select'}
        onClick={() => setEditorMode('select')}
      />
      <ToolbarButton
        icon={Hand}
        active={editorMode === 'pan'}
        onClick={() => setEditorMode('pan')}
      />

      <Divider />

      {/* Undo / Redo */}
      <ToolbarButton icon={Undo2} disabled={!canUndo} onClick={undo} />
      <ToolbarButton icon={Redo2} disabled={!canRedo} onClick={redo} />

      <Divider />

      <ToolbarButton
        icon={Play}
        onClick={runWorkflow}
        disabled={executionStatus === 'running'}
      />

      <Divider />

      {/* Zoom */}
      <ToolbarButton icon={ZoomOut} onClick={zoomOut} />

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-white/70 hover:bg-white/10"
      >
        {zoom}% <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-md border border-white/10 bg-[#1A1A1A] shadow-xl">
          <MenuItem
            onClick={() => {
              const { x, y } = getViewport();
              setViewport({ x, y, zoom: 1 });
            }}
          >
            100%
          </MenuItem>

          <MenuItem onClick={() => fitView()}>Fit</MenuItem>
          <MenuItem onClick={zoomIn}>Zoom In</MenuItem>
          <MenuItem onClick={zoomOut}>Zoom Out</MenuItem>
        </div>
      )}

      <ToolbarButton icon={ZoomIn} onClick={zoomIn} />
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  onClick,
  active,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition
        ${active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10'}
        ${disabled ? 'opacity-40 pointer-events-none' : ''}
      `}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return <div className="mx-2 h-6 w-px bg-white/10" />;
}

function MenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-left text-xs text-white/70 hover:bg-white/10"
    >
      {children}
    </button>
  );
}
