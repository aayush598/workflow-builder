'use client';

/**
 * NodeFooter
 *
 * Responsibilities:
 * - Render execution controls (Run button)
 * - Display running / idle / disabled states
 * - Remain generic and reusable across node types
 *
 * IMPORTANT:
 * - No store access
 * - No React Flow logic
 * - No execution logic
 */

import type { ReactNode } from 'react';
import { Play, Loader2 } from 'lucide-react';
import clsx from 'clsx';

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

export interface NodeFooterProps {
  /** Whether this node supports execution */
  executable?: boolean;

  /** Whether node is currently running */
  isRunning?: boolean;

  /** Whether execution is allowed */
  disabled?: boolean;

  /** Execute callback */
  onRun?: () => void;

  /** Optional status text (error, success, etc.) */
  statusText?: string;

  /** Optional custom footer content override */
  children?: ReactNode;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function NodeFooter({
  executable = false,
  isRunning = false,
  disabled = false,
  onRun,
  statusText,
  children,
}: NodeFooterProps) {
  if (!executable && !children) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Left: Status */}
      <div className="text-xs text-white/60 truncate">
        {statusText}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {children}

        {executable && (
          <button
            type="button"
            onClick={onRun}
            disabled={disabled || isRunning}
            className={clsx(
              'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition',
              'bg-[#3B82F6] text-white',
              'hover:bg-[#2563EB]',
              (disabled || isRunning) &&
                'opacity-50 cursor-not-allowed hover:bg-[#3B82F6]'
            )}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Run
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
