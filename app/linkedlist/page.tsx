'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { DataStructureType } from '@/types';
import CodeDisplay from '@/components/CodeDisplay';
import LogPanel from '@/components/LogPanel';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LINKED_LIST_CODE } from '@/data-structures/python-codes';

interface Node {
  value: number;
  id: string;
}

export default function LinkedListPage() {
  const { user } = useAuth();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [prependValue, setPrependValue] = useState('');
  const [appendValue, setAppendValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      logger.setUser(user.uid);
    }
    logger.setDataStructure('linkedlist' as DataStructureType);
    
    return () => {
      logger.saveToFirestore();
    };
  }, [user]);

  const highlightCode = (lines: number[], duration = 2000) => {
    setHighlightedLines(lines);
    setTimeout(() => setHighlightedLines([]), duration);
  };

  const handleAppend = (value: number) => {
    const newId = `node-${Date.now()}-${Math.random()}`;
    setNodes((prev) => [...prev, { value, id: newId }]);
    logger.log('append', value, `Added ${value} at end`);
    highlightCode([11]);
  };

  const handlePrepend = (value: number) => {
    const newId = `node-${Date.now()}-${Math.random()}`;
    setNodes((prev) => [{ value, id: newId }, ...prev]);
    logger.log('prepend', value, `Added ${value} at beginning`);
    highlightCode([17]);
  };

  const handleDelete = (value: number) => {
    const index = nodes.findIndex((n) => n.value === value);
    if (index !== -1) {
      setNodes((prev) => prev.filter((n) => n.value !== value));
      logger.log('delete', value, `Deleted first occurrence of ${value}`);
      highlightCode([23]);
    }
  };

  const handleClear = () => {
    setNodes([]);
    logger.log('clear', null, 'Linked list cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ← Data Structures
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Linked List Visualization</h1>
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Linked List Visualization</h2>
              <div className="flex items-center space-x-4 min-h-[300px] overflow-x-auto py-8">
                <AnimatePresence>
                  {nodes.length === 0 ? (
                    <div className="text-gray-400 text-lg w-full text-center">List is empty</div>
                  ) : (
                    nodes.map((node, index) => (
                      <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex items-center"
                      >
                        <div className="relative">
                          <div className="w-24 bg-white border-2 border-blue-600 rounded-lg p-4 text-center font-bold text-lg text-blue-600">
                            {node.value}
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-6 left-0 right-0 text-xs text-gray-600 font-normal text-center">
                              Head
                            </div>
                          )}
                          {index === nodes.length - 1 && (
                            <div className="absolute -bottom-6 left-0 right-0 text-xs text-gray-600 font-normal text-center">
                              Tail
                            </div>
                          )}
                        </div>
                        {index < nodes.length - 1 && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            className="w-8 h-0.5 bg-blue-600"
                          />
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Length: {nodes.length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Operations</h3>
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={prependValue}
                  onChange={(e) => setPrependValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(prependValue);
                    if (!isNaN(value)) {
                      handlePrepend(value);
                      setPrependValue('');
                    }
                  }}
                  disabled={isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Prepend
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={appendValue}
                  onChange={(e) => setAppendValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(appendValue);
                    if (!isNaN(value)) {
                      handleAppend(value);
                      setAppendValue('');
                    }
                  }}
                  disabled={isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Append
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  placeholder="Delete value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(deleteValue);
                    if (!isNaN(value)) {
                      handleDelete(value);
                      setDeleteValue('');
                    }
                  }}
                  disabled={nodes.length === 0 || isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
              <div className='flex justify-center mt-5'>
                <button
                  onClick={handleClear}
                  disabled={nodes.length === 0 || isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <CodeDisplay code={LINKED_LIST_CODE} highlightedLines={highlightedLines} />
          <LogPanel currentLogs={logger.getLogs()} />
        </div>
      </main>
    </div>
  );
}

