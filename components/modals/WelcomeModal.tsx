'use client';

/**
 * WelcomeModal
 *
 * Responsibilities:
 * - Initial onboarding UI
 * - Explain core interactions
 *
 * IMPORTANT:
 * - Controlled by parent
 * - No side effects
 */

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function WelcomeModal({
  open,
  onClose,
}: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-hidden border-white/10 bg-[#1A1A1A] p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex h-[500px]"
        >
          {/* Left */}
          <div className="flex flex-1 flex-col justify-between bg-[#0A0A0A] p-8">
            <div>
              <DialogTitle className="mb-4 text-3xl font-bold text-white">
                Welcome to Weavy
              </DialogTitle>
              <p className="mb-6 text-sm text-white/60">
                Build powerful AI workflows using a visual,
                node-based editor.
              </p>

              <ul className="space-y-3 text-sm text-white/70">
                <li>• Add nodes from the left sidebar</li>
                <li>• Connect outputs to inputs</li>
                <li>• Execute nodes or full workflows</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onClose}
                className="w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-300"
              >
                Start Building
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-white/60 hover:bg-white/5 hover:text-white"
              >
                Skip
              </Button>
            </div>
          </div>

          {/* Right */}
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-teal-400/20" />
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"
              alt="AI illustration"
              className="h-full w-full object-cover opacity-90"
            />
          </div>
        </motion.div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
