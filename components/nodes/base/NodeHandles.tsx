'use client';

/**
 * NodeHandles
 *
 * Responsibilities:
 * - Render input/output handles based on domain port definitions
 * - Enforce consistent positioning & styling
 * - Stay node-type agnostic
 *
 * IMPORTANT:
 * - Reads from domain/nodes/node-ports
 * - Minimal React Flow surface
 */

import { Handle, Position } from '@xyflow/react';

import type { NodeTypeId } from '@/domain/nodes/node-types';
import {
  NODE_PORTS,
  type NodePort,
} from '@/domain/nodes/node-ports';

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

export interface NodeHandlesProps {
  nodeType: NodeTypeId;
  accentColor: string;
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

function renderHandles(
  ports: NodePort[],
  position: Position,
  accentColor: string
) {
  if (!ports.length) return null;

  const step = 100 / (ports.length + 1);

  return ports.map((port, index) => {
    const top = `${step * (index + 1)}%`;

    return (
      <Handle
        key={port.id}
        id={port.id}
        type={position === Position.Left ? 'target' : 'source'}
        position={position}
        style={{
          top,
          backgroundColor: accentColor,
          border: '2px solid white',
          width: 12,
          height: 12,
          zIndex: 50,
        }}
        className="!rounded-full"
      />
    );
  });
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function NodeHandles({
  nodeType,
  accentColor,
}: NodeHandlesProps) {
  const ports = NODE_PORTS[nodeType];

  return (
    <>
      {/* Input handles */}
      {renderHandles(ports.inputs, Position.Left, accentColor)}

      {/* Output handles */}
      {renderHandles(ports.outputs, Position.Right, accentColor)}
    </>
  );
}
