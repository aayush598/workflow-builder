'use client';

/**
 * NodeHeader
 *
 * Responsibilities:
 * - Render node icon + title
 * - Provide optional right-side actions (menu, buttons)
 * - Remain stateless and reusable
 *
 * IMPORTANT:
 * - No store access
 * - No React Flow logic
 */

import type { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import clsx from 'clsx';

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

export interface NodeHeaderProps {
  /** Node icon element (already resolved in node component) */
  icon: ReactNode;

  /** Node title */
  title: string;

  /** Accent color (icon + subtle emphasis) */
  accentColor: string;

  /** Optional right-side actions (menu override, buttons) */
  actions?: ReactNode;

  /** Whether header is clickable (future rename, focus, etc.) */
  interactive?: boolean;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function NodeHeader({
  icon,
  title,
  accentColor,
  actions,
  interactive = false,
}: NodeHeaderProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-2',
        interactive && 'cursor-pointer'
      )}
    >
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="flex h-5 w-5 items-center justify-center"
          style={{ color: accentColor }}
        >
          {icon}
        </span>

        <span className="text-sm font-semibold truncate text-white">
          {title}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 text-white/60">
        {actions ?? (
          <button
            type="button"
            className="rounded-md p-1 hover:bg-white/10 hover:text-white transition"
            aria-label="Node menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
