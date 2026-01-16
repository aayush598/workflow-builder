'use client';

/**
 * ExtractFrameNode
 *
 * Responsibilities:
 * - Configure frame extraction timestamp
 * - Accept video input via port
 * - Output extracted image
 *
 * Execution:
 * - Non-executable (configuration node)
 */

import type { NodeProps } from '@xyflow/react';
import { Film } from 'lucide-react';

import BaseNode from '@/components/nodes/base/BaseNode';
import NodeHeader from '@/components/nodes/base/NodeHeader';
import NodeHandles from '@/components/nodes/base/NodeHandles';

import { Input } from '@/components/ui/input';
import useWorkflowStore from '@/store/workflow.store';

import { NODE_TYPES } from '@/domain/nodes/node-types';
import type { NodeTypeId } from '@/domain/nodes/node-types';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type ExtractFrameNodeData = {
  label?: string;
  timestamp?: number | string;
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function ExtractFrameNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = data as ExtractFrameNodeData;

  const updateNodeData = useWorkflowStore(
    (s) => s.updateNodeData
  );

  const definition = NODE_TYPES['extract-frame'];

  return (
    <>
      <NodeHandles
        nodeType={'extract-frame' satisfies NodeTypeId}
        accentColor={definition.color}
      />

      <BaseNode
        title={nodeData.label ?? definition.label}
        accentColor={definition.color}
        selected={selected}
        isRunning={false}
        header={
          <NodeHeader
            icon={<Film className="h-4 w-4" />}
            title={nodeData.label ?? definition.label}
            accentColor={definition.color}
          />
        }
      >
        <div className="space-y-2">
          <label className="text-[11px] text-white/60">
            Timestamp (seconds or %)
          </label>

          <Input
            type="text"
            value={nodeData.timestamp ?? 0}
            onChange={(e) =>
              updateNodeData(id, { timestamp: e.target.value })
            }
            placeholder="e.g. 5 or 50%"
            className="h-8 bg-[#0A0A0A] border-white/10 text-xs text-white"
          />

          <p className="text-[10px] text-white/40">
            Use seconds (<code>5</code>) or percentage (<code>50%</code>)
          </p>
        </div>
      </BaseNode>
    </>
  );
}
