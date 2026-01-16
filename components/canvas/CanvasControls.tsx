'use client';

/**
 * CanvasControls
 *
 * Responsibilities:
 * - Zoom / fit / reset controls
 * - Provide ergonomic canvas navigation
 *
 * IMPORTANT:
 * - No workflow logic
 * - Pure React Flow controls
 */

import { Controls } from '@xyflow/react';

export default function CanvasControls() {
  return (
    <Controls
      position="bottom-left"
      className="!bg-[#1A1A1A] !border !border-white/10 rounded-lg"
      showInteractive={false}
    />
  );
}
