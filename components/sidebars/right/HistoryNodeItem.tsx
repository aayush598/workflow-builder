'use client';

/**
 * HistoryNodeItem
 *
 * Responsibilities:
 * - Render execution details for a single node inside a workflow run
 * - Display status, duration, and output/error preview
 *
 * IMPORTANT:
 * - Pure presentational component
 * - No store access
 * - No side effects
 */

import clsx from 'clsx';
import type { WorkflowRunNode } from '@/store/history.store';

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

interface HistoryNodeItemProps {
  node: WorkflowRunNode;
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

function statusColor(status: WorkflowRunNode['status']) {
  switch (status) {
    case 'success':
      return 'text-green-400';
    case 'failed':
      return 'text-red-400';
    case 'running':
      return 'text-yellow-400';
    default:
      return 'text-white/60';
  }
}

function statusSymbol(status: WorkflowRunNode['status']) {
  switch (status) {
    case 'success':
      return '✓';
    case 'failed':
      return '✗';
    case 'running':
      return '•';
    default:
      return '';
  }
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function HistoryNodeItem({ node }: HistoryNodeItemProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-white/5 bg-[#0A0A0A] p-2'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white truncate">
          {node.name}
        </span>

        <span
          className={clsx(
            'text-xs font-semibold',
            statusColor(node.status)
          )}
        >
          {statusSymbol(node.status)}
        </span>
      </div>

      {/* Meta */}
      {node.duration && (
        <div className="mt-0.5 text-[10px] text-white/40">
          {node.duration}
        </div>
      )}

      {/* Output */}
      {node.output && (
        <div className="mt-1 text-[10px] text-white/60 line-clamp-2">
          Output: {String(node.output)}
        </div>
      )}

      {/* Error */}
      {node.error && (
        <div className="mt-1 text-[10px] text-red-400 line-clamp-2">
          Error: {String(node.error)}
        </div>
      )}
    </div>
  );
}
