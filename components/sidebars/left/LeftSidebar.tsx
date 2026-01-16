'use client';

/**
 * LeftSidebar
 *
 * Responsibilities:
 * - Own overall left sidebar layout
 * - Render top toolbar (logo + dropdown)
 * - Render main navigation icons
 * - Mount NodeCatalog panel
 *
 * IMPORTANT:
 * - No drag logic
 * - No node creation logic
 * - No React Flow logic
 */

import { useState } from 'react';
import {
  ChevronDown,
  Search,
  Grid,
  Image as ImageIcon,
  Video,
  Box,
  Sparkles,
} from 'lucide-react';

import SidebarNav from './SidebarNav';
import NodeCatalog from './NodeCatalog';
import Image from 'next/image';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type SidebarMode =
  | 'search'
  | 'quick'
  | 'toolbox'
  | 'image'
  | 'video'
  | 'models'
  | 'three';

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function LeftSidebar() {
  const [activeMode, setActiveMode] = useState<SidebarMode>('quick');
  const [showFileMenu, setShowFileMenu] = useState(false);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Primary Icon Rail */}
      {/* ------------------------------------------------------------------ */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-16 flex-col items-center border-r border-white/10 bg-[#1A1A1A]">
        {/* ------------------------------------------------------------------ */}
        {/* Top Logo + Dropdown */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative mt-4 flex flex-col items-center gap-2">
          <button
            onClick={() => setShowFileMenu((v) => !v)}
            className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/10 transition"
          >
            <Image src="https://app.weavy.ai/icons/logo.svg" alt="Logo" className="h-5 w-5" width={24} height={24}/>
            <ChevronDown className="h-3 w-3 text-white/70" />
          </button>

          {/* File menu (placeholder – behavior added later) */}
          {showFileMenu && (
            <div className="absolute left-16 top-0 w-48 rounded-lg border border-white/10 bg-[#1A1A1A] shadow-xl">
              <ul className="py-1 text-sm text-white/80">
                {[
                  'Back to files',
                  'Create new file',
                  'Duplicate file',
                  'Share file',
                  'Preferences',
                ].map((item) => (
                  <li
                    key={item}
                    className="cursor-pointer px-3 py-2 hover:bg-white/10"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Navigation Icons */}
        {/* ------------------------------------------------------------------ */}
        <SidebarNav
          active={activeMode}
          onChange={setActiveMode}
          items={[
            { id: 'search', icon: Search, label: 'Search' },
            { id: 'quick', icon: Grid, label: 'Quick access' },
            { id: 'toolbox', icon: Sparkles, label: 'Toolbox' },
            { id: 'image', icon: ImageIcon, label: 'Image models' },
            { id: 'video', icon: Video, label: 'Video models' },
            { id: 'three', icon: Box, label: '3D models' },
            { id: 'models', icon: Sparkles, label: 'My & community models' },
          ]}
        />

        {/* ------------------------------------------------------------------ */}
        {/* Bottom Extras */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-auto mb-4 flex flex-col gap-2">
          <button
            className="h-9 w-9 rounded-md text-white/60 hover:bg-white/10 hover:text-white transition"
            title="Assets"
          >
            <ImageIcon className="h-5 w-5 mx-auto" />
          </button>
          <button
            className="h-9 w-9 rounded-md text-white/60 hover:bg-white/10 hover:text-white transition"
            title="Docs"
          >
            ?
          </button>
          <button
            className="h-9 w-9 rounded-md text-white/60 hover:bg-white/10 hover:text-white transition"
            title="Discord"
          >
            #
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Node Catalog Panel */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className="
          fixed left-16 top-0 z-40
          h-screen w-[260px]
          border-r border-white/10
          bg-[#1A1A1A]
          flex flex-col
        "
      >
        <NodeCatalog activeMode={activeMode} />
      </aside>

    </>
  );
}
