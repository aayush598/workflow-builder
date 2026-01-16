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

import { NODE_TYPES } from '@/domain/nodes/node-types';
import type { NodeTypeId } from '@/domain/nodes/node-types';

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

  const definition = NODE_TYPES['upload-image'];

  /* ------------------------------------------------------------------ */
  /* Mock upload (replace with Transloadit later) */
  /* ------------------------------------------------------------------ */

  const handleUpload = () => {
    // Mock async upload
    setTimeout(() => {
      updateNodeData(id, {
        imageUrl:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
        fileName: 'product-image.jpg',
      });
    }, 800);
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
        isRunning={false}
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
