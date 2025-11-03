'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { DataStructureType } from '@/types';
import CodeDisplay from '@/components/CodeDisplay';
import LogPanel from '@/components/LogPanel';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ARRAY_CODE } from '@/data-structures/python-codes';

export default function ArrayPage() {
  const { user } = useAuth();
  const [array, setArray] = useState<number[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [appendValue, setAppendValue] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [removeValue, setRemoveValue] = useState('');
  const [inputIndex, setInputIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      logger.setUser(user.uid);
    }
    logger.setDataStructure('array' as DataStructureType);
    
    return () => {
      logger.saveToFirestore();
    };
  }, [user]);

  const highlightCode = (lines: number[], duration = 2000) => {
    setHighlightedLines(lines);
    setTimeout(() => setHighlightedLines([]), duration);
  };

  const handleAppend = (value: number) => {
    setArray((prev) => [...prev, value]);
    logger.log('append', value, `Added ${value} at end of array`);
    highlightCode([7]);
  };

  const handleInsert = (index: number, value: number) => {
    if (index >= 0 && index <= array.length) {
      setArray((prev) => {
        const newArray = [...prev];
        newArray.splice(index, 0, value);
        return newArray;
      });
      logger.log('insert', { index, value }, `Inserted ${value} at index ${index}`);
      highlightCode([11]);
    }
  };

  const handleRemove = (value: number) => {
    const index = array.indexOf(value);
    if (index !== -1) {
      setArray((prev) => prev.filter((v) => v !== value));
      logger.log('remove', value, `Removed first occurrence of ${value}`);
      highlightCode([16]);
    }
  };

  const handlePop = (index: number = -1) => {
    if (array.length > 0) {
      const popped = array[index === -1 ? array.length - 1 : index];
      setArray((prev) => {
        const newArray = [...prev];
        newArray.splice(index === -1 ? array.length - 1 : index, 1);
        return newArray;
      });
      logger.log('pop', popped, `Removed ${popped} from index ${index === -1 ? array.length - 1 : index}`);
      highlightCode([21]);
    }
  };

  const handleClear = () => {
    setArray([]);
    logger.log('clear', null, 'Array cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ← Data Structures
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Array Visualization</h1>
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Array Visualization</h2>
              <div className="flex flex-wrap items-center gap-3 min-h-[300px]">
                <AnimatePresence>
                  {array.length === 0 ? (
                    <div className="text-gray-400 text-lg w-full text-center">Array is empty</div>
                  ) : (
                    array.map((item, index) => (
                      <motion.div
                        key={`${item}-${index}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative"
                      >
                        <div className="w-20 bg-white border-2 border-blue-600 rounded-lg p-4 text-center font-bold text-lg text-blue-600">
                          {item}
                        </div>
                        <div className="absolute -bottom-6 left-0 right-0 text-xs text-gray-600 font-normal text-center">
                          [{index}]
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-8 text-center text-sm text-gray-600">
                Size: {array.length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Operations</h3>
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={appendValue}
                  onChange={(e) => setAppendValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
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
                  className="w-32 sm:w-28 md:w-32 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Append
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputIndex}
                  onChange={(e) => setInputIndex(parseInt(e.target.value) || 0)}
                  placeholder="Index"
                  className="w-24 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <input
                  type="number"
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(insertValue);
                    if (!isNaN(value)) {
                      handleInsert(inputIndex, value);
                      setInsertValue('');
                    }
                  }}
                  disabled={isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Insert
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={removeValue}
                  onChange={(e) => setRemoveValue(e.target.value)}
                  placeholder="Remove value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(removeValue);
                    if (!isNaN(value)) {
                      handleRemove(value);
                      setRemoveValue('');
                    }
                  }}
                  disabled={array.length === 0 || isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Remove
                </button>
              </div>
              <div className='flex gap-5 mt-5 justify-center'>
                <button
                  onClick={() => handlePop(-1)}
                  disabled={array.length === 0 || isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Pop (Last)
                </button>
                <button
                  onClick={handleClear}
                  disabled={array.length === 0 || isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <CodeDisplay code={ARRAY_CODE} highlightedLines={highlightedLines} />
          <LogPanel currentLogs={logger.getLogs()} />
        </div>
      </main>
    </div>
  );
}

