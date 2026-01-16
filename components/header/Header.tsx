'use client';

/**
 * Header
 *
 * Responsibilities:
 * - Top application chrome
 * - Display project name
 * - Display credits (mock for now)
 * - Provide share entry point
 *
 * IMPORTANT:
 * - No workflow logic
 * - No execution logic
 */

import { Share2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function Header() {
  return (
    <header className="fixed left-16 right-[300px] top-0 z-30 h-16 border-b border-white/5 bg-[#0A0A0A]/70 backdrop-blur flex items-center justify-between px-6">
      {/* Left: Project */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">
          untitled-workflow
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Credits */}
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-1.5">
          <CreditCard className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-white">
            150 credits
          </span>
        </div>

        {/* Share */}
        <Button
          size="sm"
          className="bg-white text-black hover:bg-white/90"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  );
}
