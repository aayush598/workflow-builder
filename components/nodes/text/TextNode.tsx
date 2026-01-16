'use client';

/**
 * TextNode
 *
 * Responsibilities:
 * - Render text input
 * - Expose text output port
 *
 * Execution:
 * - Non-executable (pure data node)
 */

import type { NodeProps } from '@xyflow/react';
import { Type } from 'lucide-react';

import BaseNode from '@/components/nodes/base/BaseNode';
import NodeHeader from '@/components/nodes/base/NodeHeader';
import NodeHandles from '@/components/nodes/base/NodeHandles';

import { Textarea } from '@/components/ui/textarea';
import useWorkflowStore from '@/store/workflow.store';

import { NODE_TYPES } from '@/domain/nodes/node-types';
import type { NodeTypeId } from '@/domain/nodes/node-types';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type TextNodeData = {
  label?: string;
  text?: string;
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function TextNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = data as TextNodeData;

  const updateNodeData = useWorkflowStore(
    (s) => s.updateNodeData
  );

  const definition = NODE_TYPES['text'];

  return (
    <>
      <BaseNode
        title={nodeData.label ?? definition.label}
        accentColor={definition.color}
        selected={selected}
        isRunning={false}
        header={
          <NodeHeader
            icon={<Type className="h-4 w-4" />}
            title={nodeData.label ?? definition.label}
            accentColor={definition.color}
          />
        }
      >
        <Textarea
          value={nodeData.text ?? ''}
          onChange={(e) =>
            updateNodeData(id, { text: e.target.value })
          }
          placeholder="Enter text…"
          className="min-h-[100px] resize-none bg-[#0A0A0A] text-xs text-white border-white/10 focus:border-[#3B82F6]"
        />
      </BaseNode>

      <NodeHandles
        nodeType={'text' satisfies NodeTypeId}
        accentColor={definition.color}
      />
    </>
  );
}
