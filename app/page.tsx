'use client';

import { useState, useEffect } from 'react';
import DataStructureCard from '@/components/DataStructureCard';
import ProfilePopup from '@/components/ProfilePopup';
import { useAuth } from '@/lib/auth';

const DATA_STRUCTURES = [
  { name: 'Stack', href: '/stack', color: '#2563EB', description: 'Last In First Out (LIFO) data structure' },
  { name: 'Queue', href: '/queue', color: '#2563EB', description: 'First In First Out (FIFO) data structure' },
  { name: 'Linked List', href: '/linkedlist', color: '#2563EB', description: 'Linear data structure with nodes' },
  { name: 'Array', href: '/array', color: '#2563EB', description: 'Collection of elements at contiguous memory' },
  { name: 'Hash Table', href: '/hashtable', color: '#2563EB', description: 'Key-value pair storage' },
  { name: 'Graph', href: '/graph', color: '#2563EB', description: 'Network of interconnected nodes' },
  { name: 'Binary Search Tree', href: '/bst', color: '#2563EB', description: 'Sorted binary tree structure' },
  //{ name: 'Tree', href: '/tree', color: '#2563EB', description: 'Hierarchical data structure' },
  //{ name: 'AVL Tree', href: '/avl', color: '#2563EB', description: 'Self-balancing binary search tree' },
  //{ name: 'Heap', href: '/heap', color: '#2563EB', description: 'Complete binary tree for priority' },
];

export default function Home() {
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!showProfile) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const popup = document.getElementById('profile-popup');
      if (popup && !popup.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showProfile]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-2xl border-b border-gray-200 sticky top-0 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Data Structure Visualizer
          </h1>
          {user ? (
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center relative -left-5 space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {user.photoURL && (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" />
              )}
              <span>{user.displayName || 'Profile'}</span>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-purple-600 relative -left-5 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Sign in with Google
            </button>
          )}
        </div>
        {showProfile && user && (
          <ProfilePopup user={user} onClose={() => setShowProfile(false)} onLogout={logout} />
        )}
      </header>

      <main className="w-full bg-gray-100 px-4 sm:px-6 lg:px-8 py-12 min-h-screen relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Learn & Visualize Data Structures</h2>
          <p className="text-lg text-gray-600">
            Interactive visualizations to understand how data structures work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DATA_STRUCTURES.map((ds) => (
            <DataStructureCard key={ds.name} {...ds} />
          ))}
        </div>
      </main>
    </div>
  );
}
