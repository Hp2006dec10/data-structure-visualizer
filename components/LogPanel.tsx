'use client';

import { useState } from 'react';
import { LogEntry } from '@/types';

interface LogPanelProps {
  currentLogs: LogEntry[];
  pastLogs?: LogEntry[][];
}

export default function LogPanel({ currentLogs, pastLogs = [] }: LogPanelProps) {
  const [showPastLogs, setShowPastLogs] = useState(false);
  const [selectedPastLogIndex, setSelectedPastLogIndex] = useState(0);

  const displayLogs = showPastLogs && pastLogs.length > 0 
    ? pastLogs[selectedPastLogIndex] 
    : currentLogs;

  return (
    <div className="mt-5 bg-slate-900 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Activity Log</h3>

      <div className="bg-black rounded-md p-3 max-h-96 overflow-y-auto font-mono text-sm text-green-300">
        {displayLogs.length === 0 ? (
          <div className="text-slate-400 text-center py-8">No operations performed yet</div>
        ) : (
          <div className="space-y-2">
            {displayLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="text-slate-500 w-24">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">&gt;</span>
                    <span className="font-semibold text-green-200">{log.operation}</span>
                    {log.value !== undefined && (
                      <span className="ml-2 text-slate-300">{JSON.stringify(log.value)}</span>
                    )}
                  </div>
                  {log.details && (
                    <div className="text-slate-400 mt-0.5">{log.details}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


