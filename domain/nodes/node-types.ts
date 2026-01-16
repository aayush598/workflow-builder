/**
 * Canonical node type registry.
 *
 * This file is the single source of truth for:
 * - What node types exist
 * - How they are labeled
 * - How they are categorized
 * - How they are visually identified (icon + color)
 *
 * IMPORTANT:
 * - No React imports
 * - No UI logic
 * - No execution logic
 *
 * UI layers must CONSUME this file, never extend it.
 */

/* ------------------------------------------------------------------ */
/* Node Categories */
/* ------------------------------------------------------------------ */

export type NodeCategory =
  | 'text'
  | 'input'
  | 'image'
  | 'video'
  | 'llm'
  | 'utility';

/* ------------------------------------------------------------------ */
/* Node Type IDs */
/* ------------------------------------------------------------------ */

export type NodeTypeId =
  | 'text'
  | 'upload-image'
  | 'upload-video'
  | 'crop-image'
  | 'extract-frame'
  | 'llm';

/* ------------------------------------------------------------------ */
/* Node Definition */
/* ------------------------------------------------------------------ */

export interface NodeTypeDefinition {
  /** Unique, stable identifier */
  type: NodeTypeId;

  /** Human-readable label */
  label: string;

  /** High-level grouping for sidebar & search */
  category: NodeCategory;

  /**
   * Icon identifier (string only).
   * UI layer maps this to lucide / svg / custom icons.
   */
  icon: string;

  /**
   * Accent color used consistently across:
   * - node border
   * - handles
   * - minimap
   */
  color: string;

  /**
   * Short description (used in tooltips, search, onboarding)
   */
  description: string;
}

/* ------------------------------------------------------------------ */
/* Node Registry */
/* ------------------------------------------------------------------ */

export const NODE_TYPES: Record<NodeTypeId, NodeTypeDefinition> = {
  text: {
    type: 'text',
    label: 'Text',
    category: 'text',
    icon: 'Type',
    color: '#3B82F6',
    description: 'Provide static or dynamic text input',
  },

  'upload-image': {
    type: 'upload-image',
    label: 'Upload Image',
    category: 'image',
    icon: 'Image',
    color: '#D946EF',
    description: 'Upload an image file for processing',
  },

  'upload-video': {
    type: 'upload-video',
    label: 'Upload Video',
    category: 'video',
    icon: 'Video',
    color: '#2DD4BF',
    description: 'Upload a video file for processing',
  },

  'crop-image': {
    type: 'crop-image',
    label: 'Crop Image',
    category: 'image',
    icon: 'Crop',
    color: '#10B981',
    description: 'Crop an image using percentage-based coordinates',
  },

  'extract-frame': {
    type: 'extract-frame',
    label: 'Extract Frame',
    category: 'video',
    icon: 'Film',
    color: '#F59E0B',
    description: 'Extract a single frame from a video',
  },

  llm: {
    type: 'llm',
    label: 'Run Any LLM',
    category: 'llm',
    icon: 'Sparkles',
    color: '#FFD700',
    description: 'Execute a large language model with text and images',
  },
};

/* ------------------------------------------------------------------ */
/* Derived Helpers */
/* ------------------------------------------------------------------ */

/**
 * Ordered list of node definitions.
 * Useful for sidebar rendering and search.
 */
export const NODE_TYPE_LIST: NodeTypeDefinition[] =
  Object.values(NODE_TYPES);

/**
 * Group nodes by category.
 * Used for catalog sections.
 */
export const NODE_TYPES_BY_CATEGORY: Record<NodeCategory, NodeTypeDefinition[]> =
  NODE_TYPE_LIST.reduce((acc, node) => {
    acc[node.category] ??= [];
    acc[node.category].push(node);
    return acc;
  }, {} as Record<NodeCategory, NodeTypeDefinition[]>);

/**
 * Runtime guard for unknown node types.
 */
export function isValidNodeType(type: string): type is NodeTypeId {
  return type in NODE_TYPES;
}
