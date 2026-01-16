'use client';

/**
 * CanvasMiniMap
 *
 * Responsibilities:
 * - Provide spatial overview of workflow
 * - Color nodes by node type accent
 *
 * IMPORTANT:
 * - No store access
 * - No execution logic
 */

import { MiniMap, type Node } from '@xyflow/react';
import { NODE_TYPES } from '@/domain/nodes/node-types';

export default function CanvasMiniMap() {
  return (
    <MiniMap
      position="bottom-right"
      pannable
      zoomable
      className="!bg-[#1A1A1A] !border !border-white/10 rounded-lg"
      maskColor="rgba(10, 10, 10, 0.75)"
      nodeColor={(node: Node) => {
        const definition = NODE_TYPES[node.type as keyof typeof NODE_TYPES];
        return definition?.color ?? '#6B7280';
      }}
    />
  );
}
