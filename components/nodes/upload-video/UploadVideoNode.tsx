'use client';

/**
 * UploadVideoNode
 *
 * Responsibilities:
 * - Allow user to upload a video (mock for now)
 * - Display video preview + filename
 * - Expose video output port
 *
 * Execution:
 * - Non-executable (data source node)
 */

import type { NodeProps } from '@xyflow/react';
import { Video as VideoIcon, Upload } from 'lucide-react';

import BaseNode from '@/components/nodes/base/BaseNode';
import NodeHeader from '@/components/nodes/base/NodeHeader';
import NodeHandles from '@/components/nodes/base/NodeHandles';

import { Button } from '@/components/ui/button';
import useWorkflowStore from '@/store/workflow.store';

import { NODE_TYPES } from '@/domain/nodes/node-types';
import type { NodeTypeId } from '@/domain/nodes/node-types';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type UploadVideoNodeData = {
  label?: string;
  videoUrl?: string;
  fileName?: string;
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function UploadVideoNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = data as UploadVideoNodeData;

  const updateNodeData = useWorkflowStore(
    (s) => s.updateNodeData
  );

  const definition = NODE_TYPES['upload-video'];

  /* ------------------------------------------------------------------ */
  /* Mock upload (replace with Transloadit later) */
  /* ------------------------------------------------------------------ */

  const handleUpload = () => {
    // Mock async upload
    setTimeout(() => {
      updateNodeData(id, {
        videoUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        fileName: 'demo-video.mp4',
      });
    }, 1000);
  };

  return (
    <>
      <NodeHandles
        nodeType={'upload-video' satisfies NodeTypeId}
        accentColor={definition.color}
      />

      <BaseNode
        title={nodeData.label ?? definition.label}
        accentColor={definition.color}
        selected={selected}
        isRunning={false}
        header={
          <NodeHeader
            icon={<VideoIcon className="h-4 w-4" />}
            title={nodeData.label ?? definition.label}
            accentColor={definition.color}
          />
        }
      >
        {!nodeData.videoUrl ? (
          <Button
            type="button"
            onClick={handleUpload}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
        ) : (
          <div className="space-y-2">
            <video
              src={nodeData.videoUrl}
              controls
              className="w-full h-32 rounded-lg bg-black border border-white/10"
            />

            <div className="text-[11px] text-white/60 truncate">
              {nodeData.fileName}
            </div>
          </div>
        )}
      </BaseNode>
    </>
  );
}
