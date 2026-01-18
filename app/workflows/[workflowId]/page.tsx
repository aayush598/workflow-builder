'use client';

import { ReactFlowProvider } from '@xyflow/react';
import WorkflowCanvas from '@/components/canvas/WorkflowCanvas';

export default function WorkflowEditorPage() {
    return (
        <ReactFlowProvider>
            <WorkflowCanvas />
        </ReactFlowProvider>
    );
}
