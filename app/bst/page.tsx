'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { DataStructureType } from '@/types';
import CodeDisplay from '@/components/CodeDisplay';
import LogPanel from '@/components/LogPanel';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BINARY_SEARCH_TREE_CODE } from '@/data-structures/python-codes';

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  id: string;
}

export default function BSTPage() {
  const { user } = useAuth();
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [insertionPath, setInsertionPath] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      logger.setUser(user.uid);
    }
    logger.setDataStructure('bst' as DataStructureType);
    
    return () => {
      logger.saveToFirestore();
    };
  }, [user]);

  const highlightCode = (lines: number[], duration = 2000) => {
    setHighlightedLines(lines);
    setTimeout(() => setHighlightedLines([]), duration);
  };

  const insertNode = (node: BSTNode | null, value: number, path: number[] = []): BSTNode => {
    if (!node) {
      highlightCode([11]);
      logger.log('insert', value, `Inserted ${value}${path.length > 0 ? ` after comparing with ${path.join(', ')}` : ' as root'}`);
      return { value, left: null, right: null, id: `node-${Date.now()}-${Math.random()}` };
    }

    // Animate comparison
    setInsertionPath([...path, node.value]);
    setTimeout(() => setInsertionPath([]), 500);

    if (value < node.value) {
      highlightCode([13]);
      return { ...node, left: insertNode(node.left, value, [...path, node.value]) };
    } else if (value > node.value) {
      highlightCode([17]);
      return { ...node, right: insertNode(node.right, value, [...path, node.value]) };
    } else {
      logger.log('insert', value, 'Value already exists');
      return node;
    }
  };

  const handleInsert = (value: number) => {
    setRoot((prev) => insertNode(prev, value));
  };

  const handleClear = () => {
    setRoot(null);
    logger.log('clear', null, 'BST cleared');
  };

  const calculateLayout = (node: BSTNode | null, x: number = 0, y: number = 0, depth: number = 0): ReactNode => {
    if (!node) return null;

    const spacing = 120 * (1 / (depth + 1));
    const isHighlighted = insertionPath.includes(node.value);
    const nodeSize = 64; // 16 * 4 (w-16)

    return (
      <>
        {/* Draw lines to children */}
        {node.left && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: spacing,
              height: '80px',
              transform: 'translateX(-100%)',
              pointerEvents: 'none'
            }}
          >
            <svg width="100%" height="100%">
              <line
                x1="100%"
                y1="0"
                x2="0"
                y2="100%"
                stroke="#2563eb"
                strokeWidth="2"
              />
            </svg>
          </motion.div>
        )}
        {node.right && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: spacing,
              height: '80px',
              pointerEvents: 'none'
            }}
          >
            <svg width="100%" height="100%">
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="#2563eb"
                strokeWidth="2"
              />
            </svg>
          </motion.div>
        )}

        {/* Node itself */}
        <motion.div
          key={node.id}
          className="absolute"
          style={{ left: `${x}px`, top: `${y}px` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: -32, y: -32 }}
        >
          <div
          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
            isHighlighted
              ? 'bg-white text-yellow-600 scale-110 border-2 border-yellow-600'
              : 'bg-white text-blue-600 border-2 border-blue-600'
          }`}
          >
            {node.value}
          </div>
        </motion.div>

        {calculateLayout(node.left, x - spacing, y + 80, depth + 1)}
        {calculateLayout(node.right, x + spacing, y + 80, depth + 1)}
      </>
    );
  };

  const getTreeHeight = (node: BSTNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };

  const countNodes = (node: BSTNode | null): number => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
              ← Data Structures
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Binary Search Tree Visualization</h1>
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-8">BST Visualization</h2>
              <div className="relative min-h-[400px] overflow-auto bg-white rounded-lg p-8 border-2 border-gray-200">
                <AnimatePresence>
                  {!root ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
                      BST is empty
                    </div>
                  ) : (
                    <div className="relative" style={{ left: '50%', width: '0px' }}>
                      {calculateLayout(root)}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Nodes: {countNodes(root)} | Height: {getTreeHeight(root)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Operations</h3>
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(inputValue);
                    if (!isNaN(value)) {
                      handleInsert(value);
                      setInputValue('');
                    }
                  }}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Insert
                </button>
              </div>
              <button
                onClick={handleClear}
                disabled={!root || isProcessing}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <CodeDisplay code={BINARY_SEARCH_TREE_CODE} highlightedLines={highlightedLines} />
          <LogPanel currentLogs={logger.getLogs()} />
        </div>
      </main>
    </div>
  );
}

