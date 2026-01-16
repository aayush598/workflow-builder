'use client';

/**
 * HistoryRunItem
 *
 * Responsibilities:
 * - Render a single workflow run summary
 * - Handle expand / collapse
 * - Delegate node-level rendering
 *
 * IMPORTANT:
 * - No store mutation
 * - No layout positioning
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import type { WorkflowRun } from '@/store/history.store';
import HistoryNodeItem from './HistoryNodeItem';

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

interface HistoryRunItemProps {
  run: WorkflowRun;
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

function statusBadge(status: WorkflowRun['status']) {
  switch (status) {
    case 'success':
      return 'bg-green-500/20 text-green-400';
    case 'failed':
      return 'bg-red-500/20 text-red-400';
    case 'running':
      return 'bg-yellow-500/20 text-yellow-400';
    default:
      return 'bg-white/10 text-white/60';
  }
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function HistoryRunItem({ run }: HistoryRunItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-3 py-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-2 rounded-lg p-2 text-left transition hover:bg-white/5"
      >
        {/* Chevron */}
        <div className="mt-0.5 text-white/60">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white">
              Run #{run.id.slice(0, 6)}
            </span>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge(
                run.status
              )}`}
            >
              {run.status}
            </span>
          </div>

          <div className="mt-1 text-[10px] text-white/50">
            {formatDistanceToNow(new Date(run.timestamp), {
              addSuffix: true,
            })}
          </div>

          <div className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
            <span>
              {run.scope === 'full'
                ? 'Full Workflow'
                : run.scope === 'single'
                ? 'Single Node'
                : 'Partial'}
            </span>
            {run.duration && (
              <>
                <span>•</span>
                <span>{run.duration}</span>
              </>
            )}
          </div>
        </div>
      </button>

      {/* Expanded node list */}
      {expanded && run.nodes && (
        <div className="mt-2 ml-6 space-y-2">
          {run.nodes.map((node) => (
            <HistoryNodeItem key={node.nodeId} node={node} />
          ))}
        </div>
      )}
    </div>
  );
}
