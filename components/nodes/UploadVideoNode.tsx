'use client';

import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Video, MoreVertical, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useWorkflowStore from '@/lib/store';

type UploadVideoNodeData = {
  label?: string;
  videoUrl?: string;
  fileName?: string;
  [key: string]: unknown;
};

export default function UploadVideoNode({ id, data, selected }: NodeProps<Node<UploadVideoNodeData>>) {
  const { updateNode, runningNodes } = useWorkflowStore();
  const isRunning = runningNodes.has(id);

  const handleFileUpload = () => {
    // Mock file upload
    setTimeout(() => {
      updateNode(id, {
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        fileName: 'demo-video.mp4'
      });
    }, 1500);
  };

  return (
    <div className={`bg-[#1A1A1A] border border-white/10 rounded-xl p-4 min-w-[280px] ${selected ? 'ring-2 ring-[#3B82F6]' : ''
      } ${isRunning ? 'node-running' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-[#2DD4BF]" />
          <span className="text-sm font-semibold text-white">{data.label || 'Upload Video'}</span>
        </div>
        <button className="text-white/50 hover:text-white transition">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {!data.videoUrl ? (
        <Button
          onClick={handleFileUpload}
          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      ) : (
        <div className="relative">
          <video
            src={data.videoUrl}
            controls
            className="w-full h-32 rounded-lg bg-black"
          />
          <div className="mt-2 text-xs text-white/60">{data.fileName}</div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-[#2DD4BF] !border-2 !border-white"
      />
    </div>
  );
}