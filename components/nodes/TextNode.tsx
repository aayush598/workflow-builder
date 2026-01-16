'use client';

import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Type, MoreVertical } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import useWorkflowStore from '@/lib/store';

type TextNodeData = {
  label?: string;
  text?: string;
  [key: string]: unknown;
};

export default function TextNode({ id, data, selected }: NodeProps<Node<TextNodeData>>) {
  const { updateNode, runningNodes } = useWorkflowStore();
  const isRunning = runningNodes.has(id);

  return (
    <div className={`bg-[#1A1A1A] border border-white/10 rounded-xl p-4 min-w-[280px] ${selected ? 'ring-2 ring-[#3B82F6]' : ''
      } ${isRunning ? 'node-running' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-sm font-semibold text-white">{data.label || 'Text Node'}</span>
        </div>
        <button className="text-white/50 hover:text-white transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <Textarea
        value={data.text || ''}
        onChange={(e) => updateNode(id, { text: e.target.value })}
        placeholder="Enter text..."
        className="bg-[#0A0A0A] border-white/10 text-white text-xs min-h-[100px] resize-none focus:ring-[#3B82F6] focus:border-[#3B82F6]"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-[#3B82F6] !border-2 !border-white"
      />
    </div>
  );
}