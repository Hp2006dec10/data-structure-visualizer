'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TreeNodeProps {
  value: number;
  x: number;
  y: number;
  level: number;
  isHighlighted?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  label?: string;
}

export default function TreeNode({ 
  value, 
  x, 
  y, 
  level, 
  isHighlighted = false,
  left,
  right,
  label 
}: TreeNodeProps) {
  return (
    <>
      {/* SVG Line to parent - would be calculated in parent component */}
      <motion.div
        className="absolute"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={isHighlighted ? { scale: 1.2 } : { scale: 1 }}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg relative z-10 ${
            isHighlighted
              ? 'bg-yellow-400 text-yellow-900'
              : 'bg-gradient-to-br from-green-500 to-teal-500 text-white'
          }`}
        >
          {value}
        </div>
        {label && (
          <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-600">
            {label}
          </div>
        )}
      </motion.div>
      {left}
      {right}
    </>
  );
}


