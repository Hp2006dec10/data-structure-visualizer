'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { DataStructureType } from '@/types';
import CodeDisplay from '@/components/CodeDisplay';
import LogPanel from '@/components/LogPanel';
import Link from 'next/link';
import {GRAPH_CODE} from '@/data-structures/python-codes';

export default function GraphPage() {
  const { user } = useAuth();
  const [vertices, setVertices] = useState<Set<number>>(new Set());
  const [edges, setEdges] = useState<Array<[number, number]>>([]);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [vertexInput, setVertexInput] = useState('');
  const [edgeInput1, setEdgeInput1] = useState('');
  const [edgeInput2, setEdgeInput2] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      logger.setUser(user.uid);
    }
    logger.setDataStructure('graph' as DataStructureType);
    
    return () => {
      logger.saveToFirestore();
    };
  }, [user]);

  const highlightCode = (lines: number[], duration = 2000) => {
    setHighlightedLines(lines);
    setTimeout(() => setHighlightedLines([]), duration);
  };

  const handleAddVertex = (vertex: number) => {
    if (!vertices.has(vertex)) {
      setVertices((prev) => new Set([...prev, vertex]));
      logger.log('add_vertex', vertex, `Added vertex ${vertex}`);
      highlightCode([8]);
    }
  };

  const handleAddEdge = (v1: number, v2: number) => {
    if (vertices.has(v1) && vertices.has(v2) && v1 !== v2) {
      const edgeExists = edges.some(([a, b]) => 
        (a === v1 && b === v2) || (a === v2 && b === v1)
      );
      if (!edgeExists) {
        setEdges((prev) => [...prev, [v1, v2]]);
        logger.log('add_edge', { v1, v2 }, `Added edge (${v1}, ${v2})`);
        highlightCode([12]);
      }
    }
  };

  const handleClear = () => {
    setVertices(new Set());
    setEdges([]);
    logger.log('clear', null, 'Graph cleared');
  };

  // layout refs/state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const NODE_SIZE = 64; // matches w-16 h-16
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});

  // compute positions on vertices change or resize
  useEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const N = vertices.size || 1;
      const verts = Array.from(vertices);
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.max(80, Math.min(width, height) / 2 - 80);
      const newPos: Record<number, { x: number; y: number }> = {};
      verts.forEach((v, i) => {
        const angle = (2 * Math.PI * i) / N - Math.PI / 2; // start at top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        newPos[v] = { x, y };
      });
      setPositions(newPos);
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [vertices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              ← Data Structures
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Graph Visualization</h1>
            <div className="w-48"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Graph Visualization</h2>
              <div ref={containerRef} className="relative min-h-[300px] bg-white rounded-lg p-8 border-2 border-gray-200">
                {/* SVG layer for edges */}
                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                  {edges.map(([v1, v2], idx) => {
                    const p1 = positions[v1];
                    const p2 = positions[v2];
                    if (!p1 || !p2) return null;
                    return (
                      <line
                        key={`edge-${idx}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#2563eb"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {vertices.size === 0 ? (
                  <div className="text-gray-400 text-lg w-full text-center">Graph is empty</div>
                ) : (
                  Array.from(vertices).map((vertex) => {
                    const pos = positions[vertex];
                    const left = pos ? pos.x - NODE_SIZE / 2 : 0;
                    const top = pos ? pos.y - NODE_SIZE / 2 : 0;
                    return (
                      <div
                        key={vertex}
                        data-vertex={vertex}
                        className="absolute w-16 h-16 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center font-bold text-lg text-blue-600"
                        style={{ left: `${left}px`, top: `${top}px` }}
                      >
                        {vertex}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Vertices: {vertices.size} | Edges: {edges.length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Operations</h3>
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={vertexInput}
                  onChange={(e) => setVertexInput(e.target.value)}
                  placeholder="Vertex value"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const value = parseInt(vertexInput);
                    if (!isNaN(value)) {
                      handleAddVertex(value);
                      setVertexInput('');
                    }
                  }}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add Vertex
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={edgeInput1}
                  onChange={(e) => setEdgeInput1(e.target.value)}
                  placeholder="Vertex 1"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <input
                  type="number"
                  value={edgeInput2}
                  onChange={(e) => setEdgeInput2(e.target.value)}
                  placeholder="Vertex 2"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => {
                    const v1 = parseInt(edgeInput1);
                    const v2 = parseInt(edgeInput2);
                    if (!isNaN(v1) && !isNaN(v2)) {
                      handleAddEdge(v1, v2);
                      setEdgeInput1('');
                      setEdgeInput2('');
                    }
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add Edge
                </button>
              </div>
              <button
                onClick={handleClear}
                disabled={vertices.size === 0 || isProcessing}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <CodeDisplay code={GRAPH_CODE} highlightedLines={highlightedLines} />
          <LogPanel currentLogs={logger.getLogs()} />
        </div>
      </main>
    </div>
  );
}

