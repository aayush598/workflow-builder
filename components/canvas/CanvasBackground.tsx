'use client';

/**
 * CanvasBackground
 *
 * Responsibilities:
 * - Render Weavy-style dot grid
 * - Keep canvas visually grounded
 *
 * IMPORTANT:
 * - No props
 * - No state
 */

import { Background, BackgroundVariant } from '@xyflow/react';

export default function CanvasBackground() {
  return (
    <Background
      variant={BackgroundVariant.Dots}
      gap={20}
      size={1}
      color="#2A2A2A"
    />
  );
}
