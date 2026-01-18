'use client';

/**
 * DraggableNodeItem
 *
 * Responsibilities:
 * - Render a single node entry in the catalog
 * - Attach drag metadata (node type)
 * - Delegate drag behavior to hook
 *
 * IMPORTANT:
 * - No store access
 * - No React Flow imports
 * - No node creation logic
 */

import type { NodeTypeDefinition } from '@/domain/nodes/node-types';
import { useDragNode } from '@/hooks/useDragNode';
import { cn } from '@/lib/utils';
import {
  Type,
  Image,
  Video,
  Crop,
  Film,
  Sparkles,
  Box,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface DraggableNodeItemProps {
  node: NodeTypeDefinition;
}

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Type,
  Image,
  Video,
  Crop,
  Film,
  Sparkles,
  Box,
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function DraggableNodeItem({
  node,
}: DraggableNodeItemProps) {
  const { onDragStart } = useDragNode();

  const Icon: LucideIcon =
    ICON_REGISTRY[node.icon] ?? ICON_REGISTRY.Box;


  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, node.type)}
      className={cn(
        'group flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center transition',
        'border-white/10 bg-[#0A0A0A] hover:border-white/30 hover:bg-white/5',
        'active:cursor-grabbing'
      )}
    >
      {/* Icon */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-md transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${node.color}20` }}
      >
        <Icon
          className="h-5 w-5"
          style={{ color: node.color }}
        />
      </div>

      {/* Label */}
      <span className="text-xs font-medium text-white line-clamp-2">
        {node.label}
      </span>
    </div>
  );
}
