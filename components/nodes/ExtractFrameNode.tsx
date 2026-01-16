'use client';

import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Film, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useWorkflowStore from '@/lib/store';

type ExtractFrameNodeData = {
  label?: string;
  timestamp?: string | number;
  [key: string]: unknown;
};

export default function ExtractFrameNode({ id, data, selected }: NodeProps<Node<ExtractFrameNodeData>>) {
  const { updateNode, runningNodes } = useWorkflowStore();
  const isRunning = runningNodes.has(id);

  return (
    <div className={`bg-[#1A1A1A] border border-white/10 rounded-xl p-4 min-w-[280px] ${selected ? 'ring-2 ring-[#3B82F6]' : ''
      } ${isRunning ? 'node-running' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="video_url"
        style={{ top: '35%' }}
        className="!w-3 !h-3 !bg-[#2DD4BF] !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="timestamp"
        style={{ top: '65%' }}
        className="!w-3 !h-3 !bg-[#3B82F6] !border-2 !border-white"
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-sm font-semibold text-white">{data.label || 'Extract Frame'}</span>
        </div>
        <button className="text-white/50 hover:text-white transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-xs text-white/60">Timestamp (seconds or %)</label>
          <Input
            type="text"
            value={data.timestamp || '0'}
            onChange={(e) => updateNode(id, { timestamp: e.target.value })}
            placeholder="e.g., 5 or 50%"
            className="bg-[#0A0A0A] border-white/10 text-white text-xs h-8"
          />
        </div>
        <div className="text-xs text-white/40 mt-2">
          Use seconds (e.g., 5) or percentage (e.g., 50%)
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-[#F59E0B] !border-2 !border-white"
      />
    </div>
  );
}