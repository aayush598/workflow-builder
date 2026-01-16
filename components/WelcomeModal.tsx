'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-[#1A1A1A] border-white/10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex h-[500px]"
        >
          {/* Left Side */}
          <div className="flex-1 bg-[#0A0A0A] p-8 flex flex-col justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold text-white mb-4">
                Welcome to Weavy Editor
              </DialogTitle>
              <p className="text-white/60 text-sm mb-6">
                Build powerful AI workflows with our visual node-based editor.
                Connect LLMs, process images and videos, and create amazing applications.
              </p>

              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#3B82F6] text-xs font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Add Nodes</div>
                    <div className="text-white/50 text-xs">Click buttons in the left sidebar to add nodes</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D946EF]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D946EF] text-xs font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Connect Nodes</div>
                    <div className="text-white/50 text-xs">Drag from output handles to input handles</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2DD4BF] text-xs font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Run Workflows</div>
                    <div className="text-white/50 text-xs">Execute individual nodes or entire workflows</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  onClose();
                }}
                className="w-full bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold"
              >
                Start Tutorial
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-white/60 hover:text-white hover:bg-white/5"
              >
                Skip for now
              </Button>
            </div>
          </div>

          {/* Right Side - AI Generated Image */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 via-[#D946EF]/20 to-[#2DD4BF]/20" />
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
              alt="AI Illustration"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
          </div>
        </motion.div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition z-10"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </DialogContent>
    </Dialog>
  );
}