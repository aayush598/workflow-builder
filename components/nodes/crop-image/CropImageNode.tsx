'use client';

/**
 * CropImageNode
 *
 * Responsibilities:
 * - Configure image crop parameters
 * - Accept image + numeric inputs via ports
 * - Output cropped image URL
 *
 * Execution:
 * - Non-executable (configuration node)
 */

import type { NodeProps } from '@xyflow/react';
import { Crop } from 'lucide-react';

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

type CropImageNodeData = {
  label?: string;
  xPercent?: number | string;
  yPercent?: number | string;
  widthPercent?: number | string;
  heightPercent?: number | string;
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function CropImageNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = data as CropImageNodeData;

  const updateNodeData = useWorkflowStore(
    (s) => s.updateNodeData
  );

  const definition = NODE_TYPES['crop-image'];

  return (
    <>
      <NodeHandles
        nodeType={'crop-image' satisfies NodeTypeId}
        accentColor={definition.color}
      />

      <BaseNode
        title={nodeData.label ?? definition.label}
        accentColor={definition.color}
        selected={selected}
        isRunning={false}
        header={
          <NodeHeader
            icon={<Crop className="h-4 w-4" />}
            title={nodeData.label ?? definition.label}
            accentColor={definition.color}
          />
        }
      >
        <div className="space-y-3">
          <Field
            label="X (%)"
            value={nodeData.xPercent ?? 0}
            onChange={(v) => updateNodeData(id, { xPercent: v })}
          />

          <Field
            label="Y (%)"
            value={nodeData.yPercent ?? 0}
            onChange={(v) => updateNodeData(id, { yPercent: v })}
          />

          <Field
            label="Width (%)"
            value={nodeData.widthPercent ?? 100}
            onChange={(v) => updateNodeData(id, { widthPercent: v })}
          />

          <Field
            label="Height (%)"
            value={nodeData.heightPercent ?? 100}
            onChange={(v) => updateNodeData(id, { heightPercent: v })}
          />
        </div>
      </BaseNode>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Small helper component */
/* ------------------------------------------------------------------ */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-white/60">{label}</label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 bg-[#0A0A0A] border-white/10 text-xs text-white"
      />
    </div>
  );
}
