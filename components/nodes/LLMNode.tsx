'use client';

import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Sparkles, MoreVertical, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useWorkflowStore from '@/lib/store';

type LLMNodeData = Node<{ label: string; model: string; result?: string; }, 'llm'>['data'];

export default function LLMNode({ id, data, selected }: NodeProps<Node<LLMNodeData, "llm">>) {
  const { updateNode, runningNodes, addRunningNode, removeRunningNode, addToHistory } = useWorkflowStore();
  const isRunning = runningNodes.has(id);

  const handleRun = async () => {
    addRunningNode(id);

    // Mock LLM execution
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockResult = `✨ Generated Response

Introducing our premium Wireless Bluetooth Headphones - where cutting-edge technology meets uncompromising comfort. Featuring advanced noise cancellation technology, these headphones deliver an immersive audio experience that blocks out the world around you. With an impressive 30-hour battery life, you can enjoy uninterrupted music, podcasts, or calls throughout your day. The foldable design makes them perfect for travel, easily fitting into your bag without sacrificing durability. Whether you're commuting, working, or relaxing, these headphones provide studio-quality sound in a sleek, portable package.`;

    updateNode(id, { result: mockResult });
    removeRunningNode(id);

    // Add to history
    addToHistory({
      type: 'single',
      status: 'success',
      duration: '3.2s',
      nodes: [{ id, name: data.label, status: 'success', output: mockResult }]
    });
  };

  return (
    <div className={`bg-[#1A1A1A] border border-white/10 rounded-xl p-4 min-w-[320px] max-w-[400px] ${selected ? 'ring-2 ring-[#3B82F6]' : ''
      } ${isRunning ? 'node-running' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="system_prompt"
        style={{ top: '30%' }}
        className="!w-3 !h-3 !bg-[#3B82F6] !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="user_message"
        style={{ top: '50%' }}
        className="!w-3 !h-3 !bg-[#D946EF] !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="images"
        style={{ top: '70%' }}
        className="!w-3 !h-3 !bg-[#2DD4BF] !border-2 !border-white"
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFD700]" />
          <span className="text-sm font-semibold text-white">{data.label || 'Run Any LLM'}</span>
        </div>
        <button className="text-white/50 hover:text-white transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-white/60 mb-1 block">MODEL</label>
          <Select
            value={data.model || 'gemini-2.0-flash'}
            onValueChange={(value) => updateNode(id, { model: value })}
          >
            <SelectTrigger className="bg-[#0A0A0A] border-white/10 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="gemini-2.0-flash" className="text-white">Gemini 2.0 Flash</SelectItem>
              <SelectItem value="gemini-1.5-pro" className="text-white">Gemini 1.5 Pro</SelectItem>
              <SelectItem value="gemini-1.5-flash" className="text-white">Gemini 1.5 Flash</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.result && (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
            <div className="text-xs text-white/60 mb-2">OUTPUT</div>
            <div className="text-xs text-white whitespace-pre-wrap max-h-[200px] overflow-y-auto">
              {data.result}
            </div>
          </div>
        )}

        <Button
          onClick={handleRun}
          disabled={isRunning}
          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Run Model
            </span>
          )}
        </Button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-[#FFD700] !border-2 !border-white"
      />
    </div>
  );
}