'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Zap, Calendar, ChevronRight, User, Trash2 } from 'lucide-react';
import { format, differenceInDays, isPast, isToday } from 'date-fns';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: string;
    assignedTo?: string;
    assignedBy?: string;
    createdAt: string;
  };
  assigneeName?: string;
  onStatusUpdate?: (id: string, status: string) => void;
  showAssignee?: boolean;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function TaskCard({ task, assigneeName, onStatusUpdate, showAssignee = false, isAdmin = false, onDelete }: TaskCardProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: <AlertCircle className="w-3 h-3" /> };
      case 'high':
        return { color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300', icon: <AlertCircle className="w-3 h-3" /> };
      case 'medium':
        return { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', icon: <Zap className="w-3 h-3" /> };
      case 'low':
        return { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: <Clock className="w-3 h-3" /> };
      default:
        return { color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: <Clock className="w-3 h-3" /> };
    }
  };

  const getDeadlineConfig = (deadlineStr: string) => {
    const date = new Date(deadlineStr);
    const days = differenceInDays(date, new Date());
    if (isPast(date) && !isToday(date)) {
      return { color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30', label: 'Overdue', urgent: true };
    }
    if (isToday(date) || days <= 2) {
      return { color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30', label: days === 0 ? 'Due Today' : `${days}d left`, urgent: false };
    }
    return { color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30', label: `${days}d left`, urgent: false };
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const deadlineConfig = task.deadline ? getDeadlineConfig(task.deadline) : null;
  const isCompleted = task.status === 'completed';

  const getNextStatus = () => {
    if (task.status === 'pending') return 'in_progress';
    if (task.status === 'in_progress') return 'completed';
    return null;
  };

  const getStatusLabel = () => {
    if (task.status === 'pending') return 'Start Task';
    if (task.status === 'in_progress') return 'Complete';
    return 'Done';
  };

  const statusBadge = () => {
    if (task.status === 'pending') return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    if (task.status === 'in_progress') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 transition-all ${
        isCompleted
          ? 'border-slate-100 dark:border-slate-800 opacity-60'
          : deadlineConfig?.urgent
            ? 'border-red-200 dark:border-red-900/40 shadow-lg shadow-red-500/5'
            : 'border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/50'
      }`}
    >
      {/* Decorative corner shape */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />

      {/* Overdue pulse */}
      {deadlineConfig?.urgent && !isCompleted && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-grow">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`font-bold text-lg text-slate-900 dark:text-white leading-tight ${isCompleted ? 'line-through opacity-60' : ''}`}>
                {task.title}
              </h3>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${priorityConfig.color} flex items-center gap-1`}>
                {priorityConfig.icon}
                {task.priority}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusBadge()}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{task.description}</p>
          </div>
          {isAdmin && onDelete && (
            <button 
              onClick={() => onDelete(task._id)}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete Task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            {/* Assignee */}
            {showAssignee && assigneeName && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="font-medium">{assigneeName}</span>
              </div>
            )}

            {/* Deadline */}
            {task.deadline && deadlineConfig && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${deadlineConfig.color}`}>
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(task.deadline), 'MMM d')}</span>
                <span className="text-[9px] uppercase tracking-tight opacity-80">· {deadlineConfig.label}</span>
              </div>
            )}
          </div>

          {/* Action button */}
          {!isCompleted && !isAdmin && onStatusUpdate && getNextStatus() && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStatusUpdate(task._id, getNextStatus()!)}
              className="flex items-center gap-1.5 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {getStatusLabel()}
              <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
