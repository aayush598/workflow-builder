/**
 * Node factory.
 *
 * Responsibilities:
 * - Create new workflow nodes from a node type
 * - Apply default data using schemas
 * - Attach canonical metadata from node-types
 *
 * This file ensures:
 * - UI never manually constructs nodes
 * - Drag & drop stays trivial
 * - Execution always receives valid nodes
 *
 * IMPORTANT:
 * - No React imports
 * - No Zustand imports
 * - No React Flow imports
 */

import { nanoid } from 'nanoid';
import type { NodeTypeId } from './node-types';
import { NODE_TYPES } from './node-types';
import { getDefaultNodeData } from './node-schemas';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

/**
 * Minimal node shape expected by the rest of the system.
 * React Flow will ADAPT to this later.
 */
export interface DomainNode {
  id: string;
  type: NodeTypeId;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/* Factory Options */
/* ------------------------------------------------------------------ */

export interface CreateNodeOptions {
  /**
   * Optional initial position.
   * If omitted, a sane default is used.
   */
  position?: {
    x: number;
    y: number;
  };

  /**
   * Optional data overrides.
   * Useful for import / duplication.
   */
  data?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/* Factory */
/* ------------------------------------------------------------------ */

/**
 * Create a new node instance from a node type.
 *
 * This is the ONLY correct way to create nodes.
 */
export function createNode(
  type: NodeTypeId,
  options: CreateNodeOptions = {}
): DomainNode {
  const definition = NODE_TYPES[type];

  if (!definition) {
    throw new Error(`Unknown node type: ${type}`);
  }

  return {
    id: nanoid(),
    type,
    position: options.position ?? {
      x: 200,
      y: 200,
    },
    data: {
      ...getDefaultNodeData(type),
      label: definition.label,
      ...options.data,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Utilities */
/* ------------------------------------------------------------------ */

/**
 * Duplicate an existing node.
 * Generates a new id and offsets position slightly.
 */
export function duplicateNode(node: DomainNode): DomainNode {
  return createNode(node.type, {
    position: {
      x: node.position.x + 40,
      y: node.position.y + 40,
    },
    data: {
      ...node.data,
    },
  });
}
