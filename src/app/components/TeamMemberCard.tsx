'use client';

import { motion } from 'framer-motion';
import { User, Hash } from 'lucide-react';

interface TeamMemberCardProps {
  member: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  taskCount?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-teal-600',
];

export default function TeamMemberCard({ member, taskCount = 0, isSelected, onClick }: TeamMemberCardProps) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colorIndex = member.name.charCodeAt(0) % AVATAR_COLORS.length;
  const avatarColor = AVATAR_COLORS[colorIndex];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className={`w-9 h-9 rounded-lg ${avatarColor} flex items-center justify-center shrink-0`}>
        <span className="text-white text-xs font-black">{initials}</span>
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.name}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{member.email}</p>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
        <Hash className="w-3 h-3 text-slate-400" />
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{taskCount}</span>
      </div>
    </motion.button>
  );
}
