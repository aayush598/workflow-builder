'use client';

/**
 * RightSidebar
 *
 * Responsibilities:
 * - Layout + positioning of the right sidebar
 * - Render sidebar header
 * - Mount WorkflowHistory container
 *
 * IMPORTANT:
 * - No store access
 * - No business logic
 * - Pure composition + layout
 */

import WorkflowHistory from './WorkflowHistory';

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function RightSidebar() {
  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-[300px] border-l border-white/10 bg-[#1A1A1A] flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">
          Workflow History
        </h2>
        <p className="mt-0.5 text-xs text-white/40">
          Execution runs
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <WorkflowHistory />
      </div>
    </aside>
  );
}
