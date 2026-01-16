'use client';

import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Image, MoreVertical, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useWorkflowStore from '@/lib/store';

type UploadImageNodeData = {
  label?: string;
  imageUrl?: string;
  fileName?: string;
  [key: string]: unknown;
};

export default function UploadImageNode({ id, data, selected }: NodeProps<Node<UploadImageNodeData>>) {
  const { updateNode, runningNodes } = useWorkflowStore();
  const isRunning = runningNodes.has(id);

  const handleFileUpload = () => {
    // Mock file upload
    setTimeout(() => {
      updateNode(id, {
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600',
        fileName: 'product-image.jpg'
      });
    }, 1000);
  };

  return (
    <div className={`bg-[#1A1A1A] border border-white/10 rounded-xl p-4 min-w-[280px] ${selected ? 'ring-2 ring-[#3B82F6]' : ''
      } ${isRunning ? 'node-running' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-[#D946EF]" />
          <span className="text-sm font-semibold text-white">{data.label || 'Upload Image'}</span>
        </div>
        <button className="text-white/50 hover:text-white transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {!data.imageUrl ? (
        <Button
          onClick={handleFileUpload}
          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      ) : (
        <div className="relative">
          <img
            src={data.imageUrl}
            alt="Uploaded"
            className="w-full h-32 object-cover rounded-lg"
          />
          <div className="mt-2 text-xs text-white/60">{data.fileName}</div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-[#D946EF] !border-2 !border-white"
      />
    </div>
  );
}