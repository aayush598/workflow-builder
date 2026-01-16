'use client';

import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Crop, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useWorkflowStore from '@/lib/store';

type CropNodeData = {
  label?: string;
  xPercent?: number | string;
  yPercent?: number | string;
  widthPercent?: number | string;
  heightPercent?: number | string;
  [key: string]: unknown;
};

export default function CropImageNode({ id, data, selected }: NodeProps<Node<CropNodeData>>) {
  const { updateNode, runningNodes } = useWorkflowStore();
  const isRunning = runningNodes.has(id);

  return (
    <div className={`bg-[#1A1A1A] border border-white/10 rounded-xl p-4 min-w-[280px] ${selected ? 'ring-2 ring-[#3B82F6]' : ''
      } ${isRunning ? 'node-running' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="image_url"
        style={{ top: '20%' }}
        className="!w-3 !h-3 !bg-[#D946EF] !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="x_percent"
        style={{ top: '35%' }}
        className="!w-3 !h-3 !bg-[#3B82F6] !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="y_percent"
        style={{ top: '50%' }}
        className="!w-3 !h-3 !bg-[#3B82F6] !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="width_percent"
        style={{ top: '65%' }}
        className="!w-3 !h-3 !bg-[#3B82F6] !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="height_percent"
        style={{ top: '80%' }}
        className="!w-3 !h-3 !bg-[#3B82F6] !border-2 !border-white"
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-[#10B981]" />
          <span className="text-sm font-semibold text-white">{data.label || 'Crop Image'}</span>
        </div>
        <button className="text-white/50 hover:text-white transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs text-white/60">X (%)</label>
          <Input
            type="number"
            value={data.xPercent || 0}
            onChange={(e) => updateNode(id, { xPercent: e.target.value })}
            className="bg-[#0A0A0A] border-white/10 text-white text-xs h-8"
          />
        </div>
        <div>
          <label className="text-xs text-white/60">Y (%)</label>
          <Input
            type="number"
            value={data.yPercent || 0}
            onChange={(e) => updateNode(id, { yPercent: e.target.value })}
            className="bg-[#0A0A0A] border-white/10 text-white text-xs h-8"
          />
        </div>
        <div>
          <label className="text-xs text-white/60">Width (%)</label>
          <Input
            type="number"
            value={data.widthPercent || 100}
            onChange={(e) => updateNode(id, { widthPercent: e.target.value })}
            className="bg-[#0A0A0A] border-white/10 text-white text-xs h-8"
          />
        </div>
        <div>
          <label className="text-xs text-white/60">Height (%)</label>
          <Input
            type="number"
            value={data.heightPercent || 100}
            onChange={(e) => updateNode(id, { heightPercent: e.target.value })}
            className="bg-[#0A0A0A] border-white/10 text-white text-xs h-8"
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-[#10B981] !border-2 !border-white"
      />
    </div>
  );
}