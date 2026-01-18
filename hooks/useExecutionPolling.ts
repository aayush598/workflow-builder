'use client';

import { useEffect, useRef } from 'react';
import useExecutionStore from '@/store/execution.store';

export function useExecutionPolling() {
    const syncFromBackend = useExecutionStore(
        (s) => s.syncFromBackend
    );
    const workflowRun = useExecutionStore(
        (s) => s.workflowRun
    );

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!workflowRun || workflowRun.status !== 'running') {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(async () => {
            try {
                const res = await fetch('/api/executions', {
                    credentials: 'include',
                });

                if (!res.ok) return;

                const json = await res.json();
                syncFromBackend(json.data);
            } catch {
                // silent failure for polling
            }
        }, 1500);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [workflowRun, syncFromBackend]);
}
