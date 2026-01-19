'use client';

/**
 * UploadImageNode
 *
 * Responsibilities:
 * - Allow user to upload an image (mock for now)
 * - Display preview + filename
 * - Expose image output port
 *
 * Execution:
 * - Non-executable (data source node)
 */

import type { NodeProps } from '@xyflow/react';
import { Image as ImageIcon, Upload } from 'lucide-react';

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

type UploadImageNodeData = {
  label?: string;
  imageUrl?: string;
  fileName?: string;
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function UploadImageNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = data as UploadImageNodeData;

  const updateNodeData = useWorkflowStore(
    (s) => s.updateNodeData
  );

  const executionStatus = useExecutionStore(
    (s) => s.getNodeStatus(id)
  );

  const definition = NODE_TYPES['upload-image'];

  /* ------------------------------------------------------------------ */
  /* Mock upload (replace with Transloadit later) */
  /* ------------------------------------------------------------------ */

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      if (!input.files?.[0]) return;

      try {
        const file = input.files[0];

        const { url, fileName } =
          await uploadWithTransloadit(
            file,
            process.env
              .NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_IMAGE!
          );

        updateNodeData(id, {
          imageUrl: url,
          fileName,
        });
      } catch (err) {
        console.error("Image upload failed", err);
        alert("Image upload failed");
      }
    };

    input.click();
  };



  return (
    <>
      <NodeHandles
        nodeType={'upload-image' satisfies NodeTypeId}
        accentColor={definition.color}
      />

      <BaseNode
        title={nodeData.label ?? definition.label}
        accentColor={definition.color}
        selected={selected}
        executionStatus={executionStatus ?? 'idle'}
        header={
          <NodeHeader
            icon={<ImageIcon className="h-4 w-4" />}
            title={nodeData.label ?? definition.label}
            accentColor={definition.color}
          />
        }
      >
        {!nodeData.imageUrl ? (
          <Button
            type="button"
            onClick={handleUpload}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        ) : (
          <div className="space-y-2">
            <img
              src={nodeData.imageUrl}
              alt="Uploaded"
              className="w-full h-32 object-cover rounded-lg border border-white/10"
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
