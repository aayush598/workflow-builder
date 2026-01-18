'use client';

/**
 * BaseNode
 *
 * Responsibilities:
 * - Shared visual container for all nodes
 * - Selection ring handling
 * - Running / executing glow state
 * - Consistent padding, radius, background
 *
 * IMPORTANT:
 * - No node-specific logic
 * - No execution logic
 * - No store mutation here
 *
 * All nodes should COMPOSE this component.
 */

import clsx from 'clsx';
import type { PropsWithChildren, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

export type BaseNodeStatus = 'idle' | 'running' | 'success' | 'failed';

export interface BaseNodeProps {
  /** Node display label (already resolved from domain layer) */
  title: string;

  /** Accent color used for selection ring and glow */
  accentColor: string;

  /** Whether this node is currently selected */
  selected?: boolean;

  /** Execution status of the node */
  executionStatus?: BaseNodeStatus;

  /** Optional header slot (icon, menu button, etc.) */
  header?: ReactNode;

  /** Optional footer slot (run button, status, etc.) */
  footer?: ReactNode;

  /** Optional extra className */
  className?: string;

  /** Min width override */
  minWidth?: number | string;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function BaseNode({
  title,
  accentColor,
  selected = false,
  executionStatus = 'idle',
  header,
  footer,
  className,
  minWidth = 280,
  children,
}: PropsWithChildren<BaseNodeProps>) {
  const isRunning = executionStatus === 'running';
  const isSuccess = executionStatus === 'success';
  const isFailed = executionStatus === 'failed';

  return (
    <div
      className={clsx(
        'relative rounded-xl border bg-[#1A1A1A] text-white',
        'border-white/10',
        'transition-all duration-300', // Smooth transition for colors
        selected && 'ring-2',
        isRunning && 'node-running border-blue-500/50',
        isSuccess && 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
        isFailed && 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
        className
      )}
      style={{
        minWidth,
        // Selection ring color (only when not in a special execution state to avoid clash)
        ...(selected && executionStatus === 'idle' && {
          boxShadow: `0 0 0 2px ${accentColor}`,
        }),
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}
      {header && (
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          {header}
          {/* Status Indicator Icon */}
          {isSuccess && <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
          {isFailed && <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Body */}
      {/* ------------------------------------------------------------------ */}
      <div className={clsx('px-4', header ? 'pb-3' : 'py-4')}>
        {children}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer */}
      {/* ------------------------------------------------------------------ */}
      {footer && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5">
          {footer}
        </div>
      )}
    </div>
  );
}
