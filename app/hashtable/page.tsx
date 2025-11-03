'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { DataStructureType } from '@/types';
import CodeDisplay from '@/components/CodeDisplay';
import LogPanel from '@/components/LogPanel';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HASH_TABLE_CODE } from '@/dsa-codes';

interface HashTableEntry {
  key: string;
  value: number;
}

const TABLE_SIZE = 10;

export default function HashTablePage() {
  const { user } = useAuth();
  const [table, setTable] = useState<(HashTableEntry | null)[][]>(Array(TABLE_SIZE).fill(null).map(() => []));
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [insertKeyInput, setInsertKeyInput] = useState('');
  const [getInput, setGetInput] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      logger.setUser(user.uid);
    }
    logger.setDataStructure('hashtable' as DataStructureType);
    
    return () => {
      logger.saveToFirestore();
    };
  }, [user]);

  const hashFunction = (key: string): number => {
    return Math.abs(key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % TABLE_SIZE;
  };

  const highlightCode = (lines: number[], duration = 2000) => {
    setHighlightedLines(lines);
    setTimeout(() => setHighlightedLines([]), duration);
  };

  const handleInsert = () => {
    if (!insertKeyInput || valueInput === '') return;
    const value = parseInt(valueInput);
    if (isNaN(value)) return;

    const index = hashFunction(insertKeyInput);
    setTable((prev) => {
      const newTable = [...prev];
      const bucket = [...newTable[index]];
      const existingIndex = bucket.findIndex((entry) => entry && entry.key === insertKeyInput);
      
      if (existingIndex !== -1) {
        bucket[existingIndex] = { key: insertKeyInput, value };
        logger.log('insert', { key: insertKeyInput, value }, `Updated ${insertKeyInput}`);
        highlightCode([13]);
      } else {
        bucket.push({ key: insertKeyInput, value });
        logger.log('insert', { key: insertKeyInput, value }, `Inserted ${insertKeyInput}`);
        highlightCode([14]);
      }
      newTable[index] = bucket;
      return newTable;
    });

    setInsertKeyInput('');
    setValueInput('');
  };

  const handleGet = (key: string) => {
    const index = hashFunction(key);
    const bucket = table[index];
    const entry = bucket.find((e) => e && e.key === key);
    if (entry) {
      logger.log('get', { key, value: entry.value }, `Retrieved ${key}`);
      highlightCode([18]);
      return entry.value;
    } else {
      logger.log('get', key, 'Key not found');
      highlightCode([18]);
      return null;
    }
  };

  const handleDelete = (key: string) => {
    const index = hashFunction(key);
    setTable((prev) => {
      const newTable = [...prev];
      const bucket = [...newTable[index]];
      const entryIndex = bucket.findIndex((entry) => entry && entry.key === key);
      
      if (entryIndex !== -1) {
        bucket.splice(entryIndex, 1);
        logger.log('delete', key, `Deleted ${key}`);
        highlightCode([24]);
        newTable[index] = bucket;
        return newTable;
      }
      return newTable;
    });
  };

  const handleClear = () => {
    setTable(Array(TABLE_SIZE).fill(null).map(() => []));
    logger.log('clear', null, 'Hash table cleared');
  };

  const getEntryCount = () => {
    return table.reduce((count, bucket) => count + bucket.filter(e => e !== null).length, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ← Data Structures
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Hash Table Visualization</h1>
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Hash Table Visualization</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {table.map((bucket, index) => (
                  <div key={index} className="border-2 border-gray-300 rounded-lg p-3 min-h-[150px] bg-white">
                    <div className="font-bold text-gray-600 mb-2 text-sm">Index {index}</div>
                    <AnimatePresence>
                      {bucket.length === 0 ? (
                        <div className="text-gray-400 text-xs">Empty</div>
                      ) : (
                        bucket.map((entry, idx) => (
                          entry && (
                            <motion.div
                              key={`${entry.key}-${idx}`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="mb-1"
                            >
                              <div className="bg-white border-2 border-blue-600 rounded p-2 text-center text-xs font-bold text-blue-600">
                                {entry.key}: {entry.value}
                              </div>
                            </motion.div>
                          )
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Entries: {getEntryCount()} | Table Size: {TABLE_SIZE}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Operations</h3>
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={insertKeyInput}
                  onChange={(e) => setInsertKeyInput(e.target.value)}
                  placeholder="Enter key"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <input
                  type="number"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder="Value"
                  className="w-24 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleInsert}
                  disabled={isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Insert
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getInput}
                  onChange={(e) => setGetInput(e.target.value)}
                  placeholder="Enter key"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    if (getInput) {
                      const value = handleGet(getInput);
                      alert(value !== null ? `Value: ${value}` : 'Key not found');
                    }
                  }}
                  disabled={isProcessing || !getInput}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Get
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="Enter key"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    if (deleteInput) {
                      handleDelete(deleteInput);
                      setDeleteInput('');
                    }
                  }}
                  disabled={isProcessing || !deleteInput}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
              <div className="flex justify-center mt-5">
                <button
                  onClick={handleClear}
                  disabled={getEntryCount() === 0 || isProcessing}
                  className="w-32 sm:w-28 md:w-32 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <CodeDisplay code={HASH_TABLE_CODE} highlightedLines={highlightedLines} />
          <LogPanel currentLogs={logger.getLogs()} />
        </div>
      </main>
    </div>
  );
}

