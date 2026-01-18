'use client';

/**
 * NodeCatalogSection
 *
 * Responsibilities:
 * - Render a labeled section in the node catalog
 * - Provide consistent spacing and structure
 * - Act as a layout boundary only
 *
 * IMPORTANT:
 * - No drag logic
 * - No domain imports
 * - No store access
 */

import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface NodeCatalogSectionProps {
  /** Section title (e.g. "Text", "Image", "Video") */
  title: string;

  /** Optional subtitle or description */
  description?: string;

  /** Section content (usually DraggableNodeItem[]) */
  children: ReactNode;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function NodeCatalogSection({
  title,
  description,
  children,
}: NodeCatalogSectionProps) {
  return (
    <section className="mb-6">
      {/* Header */}
      <div className="mb-3 px-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-white/60">
          {title}
        </h3>

        {description && (
          <p className="mt-0.5 text-[11px] text-white/40">
            {description}
          </p>
        )}
      </div>

      {/* Items */}
      <div className="grid grid-cols-2 gap-2 px-2">
        {children}
      </div>
    </section>
  );
}
