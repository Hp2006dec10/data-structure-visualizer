'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { DataStructureType } from '@/types';
import CodeDisplay from '@/components/CodeDisplay';
import LogPanel from '@/components/LogPanel';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { QUEUE_CODE } from '@/dsa-codes';

export default function QueuePage() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<number[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [singleInputValue, setSingleInputValue] = useState('');
  const [multiInputValue, setMultiInputValue] = useState('');
  const [enqueueInputCount, setEnqueueInputCount] = useState('1');
  const [dequeueInputCount, setDequeueInputCount] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      logger.setUser(user.uid);
    }
    logger.setDataStructure('queue' as DataStructureType);
    
    return () => {
      logger.saveToFirestore();
    };
  }, [user]);

  const highlightCode = (lines: number[], duration = 2000) => {
    setHighlightedLines(lines);
    setTimeout(() => setHighlightedLines([]), duration);
  };

  const handleEnqueue = (value: number) => {
    setQueue((prev) => [...prev, value]);
    logger.log('enqueue', value, `Added ${value} to rear of queue`);
    highlightCode([6]);
  };

  const handleDequeue = () => {
    if (queue.length > 0) {
      const dequeued = queue[0];
      setQueue((prev) => prev.slice(1));
      logger.log('dequeue', dequeued, `Removed ${dequeued} from front`);
      highlightCode([12]);
    }
  };

  const handleClear = () => {
    setQueue([]);
    logger.log('clear', null, 'Queue cleared');
    highlightCode([25]);
  };

  const handleIterativeOperation = async (operation: 'enqueue' | 'dequeue', count: number, value?: number) => {
    setIsProcessing(true);
    for (let i = 0; i < count; i++) {
      if (operation === 'enqueue' && value !== undefined) {
        handleEnqueue(value);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (operation === 'dequeue') {
        handleDequeue();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    setIsProcessing(false);
  };

  const handleSequentialEnqueue = async (start: number, end: number, step: number) => {
    setIsProcessing(true);
    for (let i = start; i <= end; i += step) {
      handleEnqueue(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              ← Data Structures
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Queue Visualization</h1>
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Queue Visualization</h2>
              <div className="flex items-center space-x-2 min-h-[400px] overflow-x-auto py-8">
                <AnimatePresence>
                  {queue.length === 0 ? (
                    <div className="text-gray-400 text-lg w-full text-center">Queue is empty</div>
                  ) : (
                    queue.map((item, index) => (
                      <motion.div
                        key={`${item}-${index}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-32 bg-white border-2 border-blue-600 rounded-lg p-4 text-center font-bold text-lg text-blue-600 flex-shrink-0 relative"
                      >
                        {item}
                        {index === 0 && (
                          <div className="absolute -bottom-6 left-0 right-0 text-xs text-gray-600 font-normal">
                            Front
                          </div>
                        )}
                        {index === queue.length - 1 && (
                          <div className="absolute -bottom-6 left-0 right-0 text-xs text-gray-600 font-normal">
                            Rear
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Size: {queue.length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Operations</h3>
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={singleInputValue}
                  onChange={(e) => setSingleInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(singleInputValue);
                    if (!isNaN(value)) {
                      handleEnqueue(value);
                      setSingleInputValue('');
                    }
                  }}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Enqueue
                </button>
              </div>
              <div className='flex gap-5 mt-5'>
                <button
                  onClick={handleDequeue}
                  disabled={queue.length === 0 || isProcessing}
                  className="flex-1 w-1/3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Dequeue
                </button>
                <button
                  onClick={handleClear}
                  disabled={queue.length === 0 || isProcessing}
                  className="flex-1 w-1/3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Iterative Operations</h4>
              <div className="flex gap-2 mb-3">
                <div className='flex w-24 p-0 border-2 border-gray-300 rounded-lg items-center gap-0'>
                  <input
                    type="number"
                    value={enqueueInputCount}
                    onChange={(e) => setEnqueueInputCount(e.target.value)}
                    className="w-12 px-3 py-2 rounded-lg focus:outline-none"
                    min="1"
                    disabled={isProcessing}
                  />
                  <p className='relative -left-5'>time(s)</p>
                </div>
                <input
                  type="number"
                  value={multiInputValue}
                  onChange={(e) => setMultiInputValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(multiInputValue);
                    if (!isNaN(value)) {
                      handleIterativeOperation('enqueue', parseInt(enqueueInputCount), value);
                    }
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Enqueue x{enqueueInputCount || 0}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={dequeueInputCount}
                  onChange={(e) => setDequeueInputCount(e.target.value)}
                  className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  min="1"
                  max={queue.length}
                  disabled={isProcessing}
                />
                <button
                  onClick={() => handleIterativeOperation('dequeue', parseInt(dequeueInputCount))}
                  disabled={queue.length === 0 || isProcessing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dequeue x{dequeueInputCount || 0}
                </button>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Sequential Operations</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Start"
                  id="seq-start"
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <input
                  type="number"
                  placeholder="End"
                  id="seq-end"
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <input
                  type="number"
                  placeholder="Step"
                  id="seq-step"
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const start = parseInt((document.getElementById('seq-start') as HTMLInputElement)?.value || '1');
                    const end = parseInt((document.getElementById('seq-end') as HTMLInputElement)?.value || '10');
                    const step = parseInt((document.getElementById('seq-step') as HTMLInputElement)?.value || '1');
                    if (!isNaN(start) && !isNaN(end) && !isNaN(step)) {
                      handleSequentialEnqueue(start, end, step);
                    }
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Enqueue Range
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <CodeDisplay code={QUEUE_CODE} highlightedLines={highlightedLines} />
          <LogPanel currentLogs={logger.getLogs()} />
        </div>
      </main>
    </div>
  );
}

