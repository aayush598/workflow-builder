'use client';

/**
 * NodeCatalog
 *
 * Responsibilities:
 * - Read canonical node definitions from domain layer
 * - Group nodes by category
 * - Render sections + draggable items
 *
 * IMPORTANT:
 * - No store access
 * - No canvas logic
 * - No drag/drop mechanics
 */

import {
  NODE_TYPES_BY_CATEGORY,
  type NodeCategory,
} from '@/domain/nodes/node-types';

import NodeCatalogSection from './NodeCatalogSection';
import DraggableNodeItem from './DraggableNodeItem';

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

/**
 * Human-readable labels for categories.
 * UI-only concern (not stored in domain).
 */
const CATEGORY_LABELS: Record<NodeCategory, string> = {
  text: 'Text',
  input: 'Input',
  image: 'Image',
  video: 'Video',
  llm: 'LLM',
  utility: 'Utility',
};

export type SidebarMode =
  | 'search'
  | 'quick'
  | 'toolbox'
  | 'image'
  | 'video'
  | 'models'
  | 'three';

interface NodeCatalogProps {
  activeMode: SidebarMode;
}
/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function NodeCatalog({ activeMode }: NodeCatalogProps) {
  // later you’ll switch rendering based on activeMode
  return (
    <div className="flex-1 overflow-y-auto pb-6">
      {Object.entries(NODE_TYPES_BY_CATEGORY).map(
        ([category, nodes]) => {
          if (!nodes.length) return null;

          return (
            <NodeCatalogSection
              key={category}
              title={CATEGORY_LABELS[category as NodeCategory]}
            >
              {nodes.map((node) => (
                <DraggableNodeItem key={node.type} node={node} />
              ))}
            </NodeCatalogSection>
          );
        }
      )}
    </div>
  );
}
