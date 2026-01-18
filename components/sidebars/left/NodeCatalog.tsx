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

import { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import {
  NODE_TYPES_BY_CATEGORY,
  type NodeCategory,
  type NodeTypeDefinition
} from '@/domain/nodes/node-types';

import NodeCatalogSection from './NodeCatalogSection';
import DraggableNodeItem from './DraggableNodeItem';

import useWorkflowStore from '@/store/workflow.store';

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

/**
 * Human-readable labels for categories.
 */
const CATEGORY_LABELS: Record<NodeCategory, string> = {
  text: 'Text',
  input: 'Input',
  image: 'Image',
  video: 'Video',
  llm: 'LLM',
  utility: 'Utility',
};

/**
 * Maps sidebar mode to corresponding node category for auto-scroll.
 * If multiple categories map, it scrolls to the first one found.
 */
const SIDEBAR_MODE_TO_CATEGORY: Record<string, NodeCategory | undefined> = {
  'quick': undefined,
  'toolbox': 'utility', // or 'text'/'input'? let's pick utility first or rely on standard order
  'image': 'image',
  'video': 'video',
  'models': 'llm',
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
  activeMode: SidebarMode | null;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function NodeCatalog({ activeMode }: NodeCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { workflowName } = useWorkflowStore();

  /* ------------------------------------------------------------------ */
  /* Scroll handler */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!activeMode) return;

    if (activeMode === 'search') {
      // Focus search input? (Optional, requires ref to input)
      return;
    }

    const targetCategory = SIDEBAR_MODE_TO_CATEGORY[activeMode];
    if (targetCategory && sectionRefs.current[targetCategory]) {
      sectionRefs.current[targetCategory]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeMode]);

  /* ------------------------------------------------------------------ */
  /* Filter Logic */
  /* ------------------------------------------------------------------ */
  const filteredCategories = Object.entries(NODE_TYPES_BY_CATEGORY).reduce(
    (acc, [category, nodes]) => {
      const filteredNodes = nodes.filter((node) =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredNodes.length > 0) {
        acc[category as NodeCategory] = filteredNodes;
      }
      return acc;
    },
    {} as Record<NodeCategory, NodeTypeDefinition[]>
  );

  return (
    <div className="flex h-full flex-col bg-[#1A1A1A]">
      {/* Workflow Name Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-white truncate" title={workflowName ?? 'Untitled Workflow'}>
          {workflowName || 'Untitled Workflow'}
        </h2>
      </div>

      {/* Search Header */}
      <div className="border-b border-white/10 p-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-[#0A0A0A] py-2 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-4">
        {Object.entries(filteredCategories).map(
          ([category, nodes]) => (
            <div
              key={category}
              ref={(el) => { sectionRefs.current[category] = el; }}
            >
              <NodeCatalogSection
                title={CATEGORY_LABELS[category as NodeCategory]}
              >
                {nodes.map((node) => (
                  <DraggableNodeItem key={node.type} node={node} />
                ))}
              </NodeCatalogSection>
            </div>
          )
        )}

        {Object.keys(filteredCategories).length === 0 && (
          <div className="px-4 text-center text-sm text-white/40">
            No nodes found
          </div>
        )}
      </div>
    </div>
  );
}
