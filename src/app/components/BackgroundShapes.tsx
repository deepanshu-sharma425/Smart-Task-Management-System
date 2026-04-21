'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Shape {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'circle' | 'square' | 'diamond' | 'ring' | 'dot';
  color: string;
  duration: number;
  delay: number;
}

const COLORS = [
  'bg-blue-500/8 dark:bg-blue-400/8',
  'bg-violet-500/8 dark:bg-violet-400/8',
  'bg-emerald-500/6 dark:bg-emerald-400/6',
  'bg-amber-500/6 dark:bg-amber-400/6',
  'bg-rose-500/5 dark:bg-rose-400/5',
  'bg-cyan-500/6 dark:bg-cyan-400/6',
];

const BORDER_COLORS = [
  'border-blue-500/15 dark:border-blue-400/15',
  'border-violet-500/15 dark:border-violet-400/15',
  'border-emerald-500/10 dark:border-emerald-400/10',
];

function generateShapes(count: number): Shape[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 40 + Math.random() * 200,
    type: (['circle', 'square', 'diamond', 'ring', 'dot'] as const)[Math.floor(Math.random() * 5)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 5,
  }));
}

function ShapeElement({ shape }: { shape: Shape }) {
  const baseClasses = `absolute pointer-events-none ${shape.color}`;

  switch (shape.type) {
    case 'circle':
      return (
        <motion.div
          className={`${baseClasses} rounded-full`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      );
    case 'square':
      return (
        <motion.div
          className={`${baseClasses} rounded-3xl`}
          style={{
            width: shape.size * 0.8,
            height: shape.size * 0.8,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, 20, -15, 0],
            rotate: [0, 45, 90, 45, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      );
    case 'diamond':
      return (
        <motion.div
          className={`${baseClasses} rounded-2xl`}
          style={{
            width: shape.size * 0.6,
            height: shape.size * 0.6,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: 'rotate(45deg)',
          }}
          animate={{
            y: [0, -25, 15, 0],
            x: [0, -10, 20, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      );
    case 'ring':
      return (
        <motion.div
          className={`absolute pointer-events-none rounded-full border-2 ${BORDER_COLORS[shape.id % BORDER_COLORS.length]} bg-transparent`}
          style={{
            width: shape.size * 1.2,
            height: shape.size * 1.2,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -20, 10, 0],
            scale: [1, 1.15, 0.9, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration * 1.2,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      );
    case 'dot':
      return (
        <motion.div
          className={`${baseClasses} rounded-full`}
          style={{
            width: shape.size * 0.15,
            height: shape.size * 0.15,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -40, 20, 0],
            x: [0, 20, -15, 0],
            opacity: [0.4, 0.8, 0.3, 0.4],
          }}
          transition={{
            duration: shape.duration * 0.7,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      );
  }
}

interface BackgroundShapesProps {
  count?: number;
  className?: string;
}

export default function BackgroundShapes({ count = 12, className = '' }: BackgroundShapesProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    setShapes(generateShapes(count));
  }, [count]);

  if (shapes.length === 0) return null;

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating shapes */}
      {shapes.map((shape) => (
        <ShapeElement key={shape.id} shape={shape} />
      ))}
    </div>
  );
}
