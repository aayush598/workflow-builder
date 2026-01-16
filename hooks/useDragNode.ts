/**
 * Drag & drop node creation hook.
 *
 * Responsibilities:
 * - Bridge sidebar drag → canvas drop
 * - Translate screen coords → canvas coords
 * - Create nodes via domain factory (ONLY)
 *
 * IMPORTANT:
 * - No UI rendering
 * - No Zustand create logic
 * - No domain mutations outside the factory
 */

import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { NodeTypeId } from '@/domain/nodes/node-types';
import useWorkflowStore from '@/store/workflow.store';

/* ------------------------------------------------------------------ */
/* Hook */
/* ------------------------------------------------------------------ */

export function useDragNode() {
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useWorkflowStore((s) => s.addNode);

  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: NodeTypeId) => {
      event.dataTransfer.setData('application/node-type', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        'application/node-type'
      ) as NodeTypeId;

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // ✅ store creates the node
      addNode(type, position);
    },
    [addNode, screenToFlowPosition]
  );

  return { onDragStart, onDragOver, onDrop };
}


export default useDragNode;
