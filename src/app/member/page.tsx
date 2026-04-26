'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  Target,
  Bell,
  Mail,
  XCircle,
  Zap,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
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

interface AppNotification {
  _id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Invitation {
  _id: string;
  projectId: string;
  adminId: string;
  status: string;
  createdAt: string;
}

export default function MemberPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const fetchMyTasks = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/tasks?assignedTo=${user._id}`);
      if (res.ok) setTasks(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/notifications?userId=${user._id}`);
      if (res.ok) setNotifications(await res.json());
    } catch (err) { console.error(err); }
  }, [user?._id]);

  const fetchInvitations = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/invitations?memberId=${user._id}`);
      if (res.ok) setInvitations(await res.json());
    } catch (err) { console.error(err); }
  }, [user?._id]);

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
      fetchNotifications();
      fetchInvitations();
    }
  }, [user, authLoading, router, fetchMyTasks, fetchNotifications, fetchInvitations]);

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

  const handleMarkNotificationsRead = async () => {
    if (!user?._id) return;
    try {
      await fetch(`/api/notifications?userId=${user._id}`, { method: 'PATCH' });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const handleInvitation = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchInvitations();
    } catch (err) { console.error(err); }
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
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My <span className="text-blue-600">Tasks</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome, {user?.name}. Here are your assigned tasks.
            </p>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && notifications.some(n => !n.read)) {
                  handleMarkNotificationsRead();
                }
              }}
              className="p-3 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-colors relative"
            >
              <Bell className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} className={`p-3 mb-2 rounded-xl text-sm ${n.read ? 'opacity-70' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                          <p className="text-slate-900 dark:text-white font-medium">{n.message}</p>
                          <span className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

        {/* Pending Invitations */}
        {invitations.filter(i => i.status === 'pending').length > 0 && (
          <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Pending Invitations
              </h2>
            </div>
            <div className="space-y-3">
              {invitations.filter(i => i.status === 'pending').map(inv => (
                <div key={inv._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">You have been invited to a project.</p>
                    <span className="text-xs text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleInvitation(inv._id, 'accepted')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-colors">
                      Accept
                    </button>
                    <button onClick={() => handleInvitation(inv._id, 'declined')} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
