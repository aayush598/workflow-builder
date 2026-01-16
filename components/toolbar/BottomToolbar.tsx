'use client';

/**
 * BottomToolbar
 *
 * Responsibilities:
 * - Canvas navigation controls
 * - Zoom + fit view
 *
 * IMPORTANT:
 * - No workflow logic
 * - No history logic
 */

import {
  Hand,
  MousePointer,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function BottomToolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-2 shadow-2xl">
      <ToolbarButton icon={Hand} />
      <ToolbarButton icon={MousePointer} />

      <Divider />

      <ToolbarButton icon={Undo2} />
      <ToolbarButton icon={Redo2} />

      <Divider />

      <ToolbarButton icon={ZoomOut} onClick={zoomOut} />
      <button
        onClick={() => fitView()}
        className="h-8 rounded-lg px-3 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        Fit
      </button>
      <ToolbarButton icon={ZoomIn} onClick={zoomIn} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

function ToolbarButton({
  icon: Icon,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return <div className="mx-2 h-6 w-px bg-white/10" />;
}
