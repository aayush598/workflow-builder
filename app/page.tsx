'use client';

import { ReactFlowProvider } from '@xyflow/react';
import WorkflowCanvas from '@/components/WorkflowCanvas';

export default function Home() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  );
}