/**
 * Canonical port and data-flow definitions for workflow nodes.
 *
 * This file defines:
 * - What data types exist in the system
 * - Which inputs/outputs each node exposes
 * - What connections are valid
 *
 * IMPORTANT:
 * - No React Flow imports
 * - No UI logic
 * - No execution logic
 *
 * This file enables:
 * - Type-safe connections
 * - DAG validation
 * - Future static analysis
 */

import type { NodeTypeId } from './node-types';

/* ------------------------------------------------------------------ */
/* Data Types */
/* ------------------------------------------------------------------ */

/**
 * Atomic data types that can flow between nodes.
 * These are semantic types, not JS primitives.
 */
export type PortDataType =
  | 'text'
  | 'image'
  | 'video'
  | 'number';

/* ------------------------------------------------------------------ */
/* Port Definitions */
/* ------------------------------------------------------------------ */

export interface NodePort {
  /** Stable identifier (used as handle id) */
  id: string;

  /** Human-readable label */
  label: string;

  /** Data type flowing through this port */
  dataType: PortDataType;

  /** Whether this input is required for execution */
  required?: boolean;

  /** Whether multiple connections are allowed */
  multiple?: boolean;
}

export interface NodePorts {
  inputs: NodePort[];
  outputs: NodePort[];
}

/* ------------------------------------------------------------------ */
/* Node → Ports Registry */
/* ------------------------------------------------------------------ */

export const NODE_PORTS: Record<NodeTypeId, NodePorts> = {
  text: {
    inputs: [],
    outputs: [
      {
        id: 'output',
        label: 'Text',
        dataType: 'text',
      },
    ],
  },

  'upload-image': {
    inputs: [],
    outputs: [
      {
        id: 'output',
        label: 'Image URL',
        dataType: 'image',
      },
    ],
  },

  'upload-video': {
    inputs: [],
    outputs: [
      {
        id: 'output',
        label: 'Video URL',
        dataType: 'video',
      },
    ],
  },

  'crop-image': {
    inputs: [
      {
        id: 'image_url',
        label: 'Image',
        dataType: 'image',
        required: true,
      },
      {
        id: 'x_percent',
        label: 'X (%)',
        dataType: 'number',
      },
      {
        id: 'y_percent',
        label: 'Y (%)',
        dataType: 'number',
      },
      {
        id: 'width_percent',
        label: 'Width (%)',
        dataType: 'number',
      },
      {
        id: 'height_percent',
        label: 'Height (%)',
        dataType: 'number',
      },
    ],
    outputs: [
      {
        id: 'output',
        label: 'Cropped Image',
        dataType: 'image',
      },
    ],
  },

  'extract-frame': {
    inputs: [
      {
        id: 'video_url',
        label: 'Video',
        dataType: 'video',
        required: true,
      },
      {
        id: 'timestamp',
        label: 'Timestamp',
        dataType: 'number',
      },
    ],
    outputs: [
      {
        id: 'output',
        label: 'Frame Image',
        dataType: 'image',
      },
    ],
  },

  llm: {
    inputs: [
      {
        id: 'system_prompt',
        label: 'System Prompt',
        dataType: 'text',
      },
      {
        id: 'user_message',
        label: 'User Message',
        dataType: 'text',
        required: true,
      },
      {
        id: 'images',
        label: 'Images',
        dataType: 'image',
        multiple: true,
      },
    ],
    outputs: [
      {
        id: 'output',
        label: 'Text Output',
        dataType: 'text',
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Connection Validation */
/* ------------------------------------------------------------------ */

/**
 * Determines whether a connection between two ports is valid.
 */
export function isCompatibleConnection(
  sourceType: PortDataType,
  targetType: PortDataType
): boolean {
  // Strict match
  if (sourceType === targetType) return true;

  // Allow Text -> Image/Video (assuming URL)
  if (sourceType === 'text' && (targetType === 'image' || targetType === 'video')) {
    return true;
  }

  return false;
}

/**
 * Get port definition by node + port id.
 */
export function getNodePort(
  nodeType: NodeTypeId,
  portId: string | null,
  direction: 'input' | 'output'
): NodePort | undefined {
  if (!portId) return undefined;
  const ports = NODE_PORTS[nodeType];
  const list = direction === 'input' ? ports.inputs : ports.outputs;
  return list.find((p) => p.id === portId);
}

/**
 * Check whether a given input port allows multiple connections.
 */
export function allowsMultipleConnections(
  nodeType: NodeTypeId,
  portId: string | null
): boolean {
  if (!portId) return false;
  const port = getNodePort(nodeType, portId, 'input');
  return Boolean(port?.multiple);
}

/**
 * Get required input ports for a node.
 */
export function getRequiredInputPorts(
  nodeType: NodeTypeId
): NodePort[] {
  return NODE_PORTS[nodeType].inputs.filter((p) => p.required);
}
