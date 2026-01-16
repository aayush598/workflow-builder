'use client';

import { Hand, MousePointer, Undo2, Redo2, ZoomIn, ZoomOut } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

export default function BottomToolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-white/10 rounded-full px-4 py-2 flex items-center gap-1 shadow-2xl z-30">
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white">
        <Hand className="w-4 h-4" />
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white">
        <MousePointer className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-white/10 mx-2" />
      
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white">
        <Undo2 className="w-4 h-4" />
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white">
        <Redo2 className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-white/10 mx-2" />
      
      <button
        onClick={() => zoomOut()}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={() => fitView()}
        className="px-3 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white text-xs font-medium"
      >
        Fit
      </button>
      <button
        onClick={() => zoomIn()}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>
  );
}