'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  Zap,
  Target,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import Navbar from '../components/Navbar';
import BackgroundShapes from '../components/BackgroundShapes';
import TaskCard from '../components/TaskCard';
import StatsCard from '../components/StatsCard';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
  assignedTo?: string;
  assignedBy?: string;
  projectId?: string;
  createdAt: string;
}

export default function MemberPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchMyTasks = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/tasks?assignedTo=${user._id}`);
      if (res.ok) setTasks(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user?.role === 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) {
      fetchMyTasks();
    }
  }, [user, authLoading, router, fetchMyTasks]);

  const handleStatusUpdate = async (taskId: string, status: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchMyTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Zap className="w-8 h-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = tasks.filter(
    (t) =>
      t.deadline &&
      new Date(t.deadline) < new Date() &&
      t.status !== 'completed' &&
      t.status !== 'archived'
  );
  const activeTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'archived');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      <BackgroundShapes count={6} />
      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My <span className="text-blue-600">Tasks</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome, {user?.name}. Here are your assigned tasks.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Target}
            label="Assigned"
            value={tasks.length}
            color="bg-blue-600/10 text-blue-600"
            delay={0}
          />
          <StatsCard
            icon={Clock}
            label="Pending"
            value={pendingTasks.length}
            color="bg-amber-600/10 text-amber-600"
            delay={0.1}
          />
          <StatsCard
            icon={ListTodo}
            label="In Progress"
            value={inProgressTasks.length}
            color="bg-violet-600/10 text-violet-600"
            delay={0.2}
          />
          <StatsCard
            icon={AlertTriangle}
            label="Overdue"
            value={overdueTasks.length}
            color="bg-red-600/10 text-red-600"
            delay={0.3}
          />
        </div>

        {/* Active Tasks */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Active Tasks
            </h2>
            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {activeTasks.length} remaining
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {activeTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 border-4 border-dotted border-slate-200 dark:border-slate-800 rounded-2xl py-16 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-300 dark:text-emerald-800 mx-auto mb-3" />
                <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-sm">
                  All caught up! No pending tasks.
                </p>
              </motion.div>
            ) : (
              activeTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            )}
          </AnimatePresence>

          {/* Completed */}
          {completedTasks.length > 0 && (
            <>
              <div className="flex items-center gap-3 pt-6">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Completed
                </h2>
                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
