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
import useExecutionStore from '@/store/execution.store'; // Added import

import { NODE_TYPES } from '@/domain/nodes/node-types';
import type { NodeTypeId } from '@/domain/nodes/node-types';
import { uploadWithTransloadit } from "@/services/media.service";

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

  const executionStatus = useExecutionStore(
    (s) => s.getNodeStatus(id)
  );

  const definition = NODE_TYPES['upload-video'];

  /* ------------------------------------------------------------------ */
  /* Mock upload (replace with Transloadit later) */
  /* ------------------------------------------------------------------ */

  const handleUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm,video/mov,video/m4v";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const result = await uploadWithTransloadit(
          file,
          process.env.NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_VIDEO
        );

        updateNodeData(id, {
          videoUrl: result.url,
          fileName: result.fileName,
        });
      } catch (err) {
        console.error("Video upload failed", err);
        alert("Video upload failed");
      }
    };

    input.click();
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
        executionStatus={executionStatus ?? 'idle'}
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
