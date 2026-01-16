'use client';

import { Share2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <div className="fixed top-0 left-16 right-[300px] h-16 bg-transparent backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-6 z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/60">untitled</span>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-white/10">
          <CreditCard className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-sm text-white font-medium">150 credits</span>
        </div>
        
        <Button className="bg-white text-black hover:bg-white/90">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}