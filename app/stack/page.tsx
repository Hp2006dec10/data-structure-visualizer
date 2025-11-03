'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { DataStructureType } from '@/types';
import CodeDisplay from '@/components/CodeDisplay';
import LogPanel from '@/components/LogPanel';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { STACK_CODE } from '@/dsa-codes';

export default function StackPage() {
  const { user } = useAuth();
  const [stack, setStack] = useState<number[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [singleInputValue, setSingleInputValue] = useState('');
  const [multiInputValue, setMultiInputValue] = useState('');
  const [pushInputCount, setPushInputCount] = useState('1');
  const [popInputCount, setPopInputCount] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      logger.setUser(user.uid);
    }
    logger.setDataStructure('stack' as DataStructureType);
    
    // Save logs on page unload
    return () => {
      logger.saveToFirestore();
    };
  }, [user]);

  const highlightCode = (lines: number[], duration = 2000) => {
    setHighlightedLines(lines);
    setTimeout(() => setHighlightedLines([]), duration);
  };

  const handlePush = (value: number) => {
    setStack((prev) => [...prev, value]);
    logger.log('push', value, `Added ${value} to top of stack`);
    highlightCode([6]);
  };

  const handlePop = () => {
    if (stack.length > 0) {
      const popped = stack[stack.length - 1];
      setStack((prev) => prev.slice(0, -1));
      logger.log('pop', popped, `Removed ${popped} from top`);
      highlightCode([11]);
    }
  };

  const handleClear = () => {
    setStack([]);
    logger.log('clear', null, 'Stack cleared');
    highlightCode([25]);
  };

  const handleIterativeOperation = async (operation: 'push' | 'pop', count: number, value?: number) => {
    setIsProcessing(true);
    for (let i = 0; i < count; i++) {
      if (operation === 'push' && value !== undefined) {
        handlePush(value);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (operation === 'pop') {
        handlePop();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    setIsProcessing(false);
  };

  const handleSequentialPush = async (start: number, end: number, step: number) => {
    setIsProcessing(true);
    for (let i = start; i <= end; i += step) {
      handlePush(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsProcessing(false);
  };

  const handleCountChange = (choice : number, value : string) => {
    if (choice == 1) setPopInputCount(value);
    else setPushInputCount(value);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ← Data Structures
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Stack Visualization</h1>
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Stack Visualization</h2>
              <div className="relative flex justify-center h-[400px]">
                <div className="relative w-40 h-full bg-gradient-to-r from-white to-gray-200 rounded-lg shadow-inner border-l-4 border-r-4 border-t-4 border-gray-400">
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-200 to-transparent z-10 pointer-events-none"></div>
                  
                  {/* Stack content area with side rails and scrolling */}
                  <div className="absolute inset-0 overflow-y-auto no-scrollbar">
                    <div className="relative flex flex-col-reverse items-center pt-4 pb-20 min-h-full">
                      <AnimatePresence>
                        {stack.length === 0 ? (
                          <div className="text-gray-400 text-lg absolute bottom-20">Stack is empty</div>
                        ) : (
                          stack.map((item, index) => (
                            <motion.div
                              key={`${item}-${index}`}
                              initial={{ scale: 0, y: -20, opacity: 0 }}
                              animate={{ scale: 1, y: 0, opacity: 1 }}
                              exit={{ scale: 0, y: 20, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className="w-32 h-16 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg rounded-lg p-4 text-center font-bold text-lg text-white mb-1 relative group"
                              style={{
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                transform: "perspective(1000px) rotateX(5deg)"
                              }}
                            >
                              {/* Element content */}
                              <div className="absolute inset-0 flex items-center justify-center border-2 border-blue-400 rounded-lg bg-opacity-20 backdrop-blur-sm">
                                {item}
                              </div>
                              {/* Index indicator - show on hover */}
                              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                [{stack.length - 1 - index}]
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-0 right-0 h-12 bg-gradient-to-t from-gray-200 to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="absolute bottom-0 w-full h-4 bg-gray-400 rounded-b-lg"></div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-white bg-black px-3 py-1 rounded-full shadow">
                  Size: {stack.length}
                </div>
              </div>
              
              <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
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
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(singleInputValue);
                    if (!isNaN(value)) {
                      handlePush(value);
                      setSingleInputValue('');
                    }
                  }}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Push
                </button>
              </div>
              <div className='flex gap-5 mt-5'>
                <button
                  onClick={handlePop}
                  disabled={stack.length === 0 || isProcessing}
                  className="flex-1 w-1/3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Pop
                </button>
                <button
                  onClick={handleClear}
                  disabled={stack.length === 0 || isProcessing}
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
                    value={pushInputCount}
                    onChange={(e) => handleCountChange(0, e.target.value)}
                    className="w-12 px-3 py-2 focus:underline focus:outline-none"
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
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(multiInputValue);
                    if (!isNaN(value)) {
                      handleIterativeOperation('push', parseInt(pushInputCount), value);
                    }
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Push x{pushInputCount || 0}
                </button>
              </div>
              <div className="flex gap-2">
                <div className='flex w-24 p-0 border-2 border-gray-300 rounded-lg items-center gap-0'>
                  <input
                    type="number"
                    value={popInputCount}
                    onChange={(e) => handleCountChange(1, e.target.value)}
                    className="w-12 pl-3 py-2 focus:underline focus:outline-none"
                    min="1"
                    max={stack.length}
                    disabled={isProcessing}
                  />
                  <p className='relative -left-5'>time(s)</p>
                </div>
                <button
                  onClick={() => handleIterativeOperation('pop', parseInt(popInputCount))}
                  disabled={stack.length === 0 || isProcessing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed"
                >
                  Pop x{popInputCount || 0}
                </button>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Sequential Operations</h4>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="number"
                  placeholder="Start"
                  id="seq-start"
                  className="flex-1 w-1/4 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <input
                  type="number"
                  placeholder="End"
                  id="seq-end"
                  className="flex-1 w-1/4 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <input
                  type="number"
                  placeholder="Step"
                  id="seq-step"
                  className="flex-1 w-1/4 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const start = parseInt((document.getElementById('seq-start') as HTMLInputElement)?.value || '1');
                    const end = parseInt((document.getElementById('seq-end') as HTMLInputElement)?.value || '10');
                    const step = parseInt((document.getElementById('seq-step') as HTMLInputElement)?.value || '1');
                    if (!isNaN(start) && !isNaN(end) && !isNaN(step)) {
                      handleSequentialPush(start, end, step);
                    }
                  }}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Push Range
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-5 mt-5">
          <CodeDisplay code={STACK_CODE} highlightedLines={highlightedLines} />
          <LogPanel currentLogs={logger.getLogs()} />
        </div>
      </main>
    </div>
  );
}

