'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import useWorkflowStore from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowRunNode {
  name: string;
  status: string;
  output?: any;
  error?: any;
}

interface WorkflowRun {
  id: string;
  status: string;
  timestamp: string;
  type: string;
  duration?: string;
  nodes?: WorkflowRunNode[];
}

export default function RightSidebar() {
  const { workflowHistory } = useWorkflowStore();
  const history = workflowHistory as WorkflowRun[];
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'running': return 'text-yellow-500';
      default: return 'text-white/60';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'running': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-[300px] bg-[#1A1A1A] border-l border-white/10 flex flex-col z-40">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">Workflow History</h2>
        <p className="text-xs text-white/50 mt-1">{history.length} runs</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center text-white/40 text-xs">
            No workflow runs yet.
            <br />
            Execute nodes to see history.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {history.map((run) => (
              <div key={run.id} className="p-3">
                <button
                  onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                  className="w-full flex items-start gap-2 hover:bg-white/5 p-2 rounded-lg transition"
                >
                  {expandedRun === run.id ? (
                    <ChevronDown className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">
                        Run #{run.id.slice(0, 6)}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusBadge(run.status)}`}>
                        {run.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/50 mt-1">
                      {run.timestamp && formatDistanceToNow(new Date(run.timestamp), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/40">
                        {run.type === 'full' ? 'Full Workflow' : run.type === 'single' ? 'Single Node' : 'Selected Nodes'}
                      </span>
                      <span className="text-[10px] text-white/40">•</span>
                      <span className="text-[10px] text-white/40">{run.duration}</span>
                    </div>
                  </div>
                </button>

                {expandedRun === run.id && run.nodes && (
                  <div className="mt-2 ml-6 space-y-2">
                    {run.nodes.map((node, idx) => (
                      <div key={idx} className="bg-[#0A0A0A] rounded-lg p-2 border border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white font-medium">{node.name}</span>
                          <span className={`text-xs ${getStatusColor(node.status)}`}>
                            {node.status === 'success' ? '✓' : '✗'}
                          </span>
                        </div>
                        {node.output && (
                          <div className="text-[10px] text-white/60 mt-1 line-clamp-2">
                            {node.output}
                          </div>
                        )}
                        {node.error && (
                          <div className="text-[10px] text-red-400 mt-1">
                            Error: {node.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}