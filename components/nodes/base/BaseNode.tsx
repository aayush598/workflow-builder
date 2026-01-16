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

export interface BaseNodeProps {
  /** Node display label (already resolved from domain layer) */
  title: string;

  /** Accent color used for selection ring and glow */
  accentColor: string;

  /** Whether this node is currently selected */
  selected?: boolean;

  /** Whether this node is currently executing */
  isRunning?: boolean;

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
  isRunning = false,
  header,
  footer,
  className,
  minWidth = 280,
  children,
}: PropsWithChildren<BaseNodeProps>) {
  return (
    <div
      className={clsx(
        'relative rounded-xl border bg-[#1A1A1A] text-white',
        'border-white/10',
        'transition-shadow duration-200',
        selected && 'ring-2',
        isRunning && 'node-running',
        className
      )}
      style={{
        minWidth,
        // Selection ring color
        ...(selected && {
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
