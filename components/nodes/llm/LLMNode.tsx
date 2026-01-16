'use client';

/**
 * LLMNode
 *
 * Responsibilities:
 * - Configure LLM model
 * - Trigger execution
 * - Display output
 *
 * Execution:
 * - Executable node
 * - Uses execution + history stores
 */

import type { NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';

import BaseNode from '@/components/nodes/base/BaseNode';
import NodeHeader from '@/components/nodes/base/NodeHeader';
import NodeFooter from '@/components/nodes/base/NodeFooter';
import NodeHandles from '@/components/nodes/base/NodeHandles';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { NODE_TYPES } from '@/domain/nodes/node-types';
import type { NodeTypeId } from '@/domain/nodes/node-types';

import useWorkflowStore from '@/store/workflow.store';
import useExecutionStore from '@/store/execution.store';
import useHistoryStore from '@/store/history.store';

import { useNodeExecution } from '@/hooks/useNodeExecution';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type LLMNodeData = {
  label?: string;
  model?: string;
  result?: string;
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function LLMNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = data as LLMNodeData;
  const definition = NODE_TYPES['llm'];

  const updateNodeData = useWorkflowStore(
    (s) => s.updateNodeData
  );

  const isRunning = useExecutionStore(
    (s) => s.isNodeRunning(id)
  );

  const executeNode = useNodeExecution(id);


  /* ------------------------------------------------------------------ */
  /* Handlers */
  /* ------------------------------------------------------------------ */

  const handleRun = async () => {
    const result = await executeNode();

    if (typeof result === 'string') {
      updateNodeData(id, { result });
    }
  };

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */

  return (
    <>
      <BaseNode
        title={nodeData.label ?? definition.label}
        accentColor={definition.color}
        selected={selected}
        isRunning={isRunning}
        header={
          <NodeHeader
            icon={<Sparkles className="h-4 w-4" />}
            title={nodeData.label ?? definition.label}
            accentColor={definition.color}
          />
        }
        footer={
          <NodeFooter>
            <Button
              size="sm"
              disabled={isRunning}
              onClick={handleRun}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              {isRunning ? 'Running…' : 'Run'}
            </Button>
          </NodeFooter>
        }
      >
        <div className="space-y-3">
          {/* Model selector */}
          <div>
            <label className="text-[11px] text-white/60 mb-1 block">
              Model
            </label>

            <Select
              value={nodeData.model ?? 'gemini-2.0-flash'}
              onValueChange={(value) =>
                updateNodeData(id, { model: value })
              }
            >
              <SelectTrigger className="h-8 bg-[#0A0A0A] border-white/10 text-xs text-white">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="bg-[#1A1A1A] border-white/10">
                <SelectItem value="gemini-2.0-flash">
                  Gemini 2.0 Flash
                </SelectItem>
                <SelectItem value="gemini-1.5-pro">
                  Gemini 1.5 Pro
                </SelectItem>
                <SelectItem value="gemini-1.5-flash">
                  Gemini 1.5 Flash
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Output */}
          {nodeData.result && (
            <div className="rounded-lg border border-white/10 bg-[#0A0A0A] p-3">
              <div className="mb-1 text-[11px] text-white/60">
                Output
              </div>

              <pre className="max-h-[220px] overflow-y-auto whitespace-pre-wrap text-xs text-white">
                {nodeData.result}
              </pre>
            </div>
          )}
        </div>
      </BaseNode>

      <NodeHandles
        nodeType={'llm' satisfies NodeTypeId}
        accentColor={definition.color}
      />
    </>
  );
}
