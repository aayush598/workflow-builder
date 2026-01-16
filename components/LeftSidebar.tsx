'use client';

import { Type, Image, Video, Sparkles, Crop, Film, Search, FolderOpen, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import useWorkflowStore from '@/lib/store';

const nodeTypes = [
  { type: 'text', icon: Type, label: 'Text', color: '#3B82F6' },
  { type: 'uploadImage', icon: Image, label: 'Upload Image', color: '#D946EF' },
  { type: 'uploadVideo', icon: Video, label: 'Upload Video', color: '#2DD4BF' },
  { type: 'llm', icon: Sparkles, label: 'Run Any LLM', color: '#FFD700' },
  { type: 'cropImage', icon: Crop, label: 'Crop Image', color: '#10B981' },
  { type: 'extractFrame', icon: Film, label: 'Extract Frame', color: '#F59E0B' },
];

const navigationItems = [
  { icon: Search, label: 'Search' },
  { icon: FolderOpen, label: 'Projects' },
  { icon: Settings, label: 'Settings' },
];

export default function LeftSidebar() {
  const { addNode, nodes } = useWorkflowStore();

  const handleAddNode = (type: string) => {
    const newNode = {
      id: uuidv4(),
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: nodeTypes.find(n => n.type === type)?.label || 'New Node',
      },
    };
    addNode(newNode);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-[#1A1A1A] border-r border-white/10 flex flex-col items-center py-4 z-50">
      {/* Navigation */}
      <div className="flex flex-col gap-4 mb-8">
        {navigationItems.map((item, idx) => (
          <button
            key={idx}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-2" />

      {/* Quick Access - Node Types */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="text-[10px] text-white/40 uppercase tracking-wider px-2 text-center">Quick</div>
        {nodeTypes.map((node) => (
          <button
            key={node.type}
            onClick={() => handleAddNode(node.type)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-white/30 transition group"
            title={node.label}
            style={{
              borderColor: `${node.color}40`,
            }}
          >
            <node.icon className="w-5 h-5" style={{ color: node.color }} />
          </button>
        ))}
      </div>
    </div>
  );
}