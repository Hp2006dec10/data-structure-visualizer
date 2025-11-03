'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { DataStructureType } from '@/types';
import Link from 'next/link';

export default function HeapPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      logger.setUser(user.uid);
    }
    logger.setDataStructure('heap' as DataStructureType);
    
    return () => {
      logger.saveToFirestore();
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ← Data Structures
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Heap Visualization</h1>
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Heap Data Structure</h2>
          <p className="text-gray-600 mb-8">Heap visualization with heapify operations coming soon!</p>
          <Link href="/bst" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium mr-4">
            View BST
          </Link>
          <Link href="/" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

