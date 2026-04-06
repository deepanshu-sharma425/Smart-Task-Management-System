'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format, isPast, isToday, differenceInDays } from 'date-fns';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Layout, 
  ChevronRight,
  Zap,
  CheckCircle,
  Archive
} from 'lucide-react';

interface ITask {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, deadline }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDeadline('');
        fetchTasks();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create task');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsDone = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': return { 
        color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
        icon: <AlertCircle className="w-3 h-3" />
      };
      case 'medium': return { 
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        icon: <Zap className="w-3 h-3" />
      };
      case 'low': return { 
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        icon: <Clock className="w-3 h-3" />
      };
      default: return { 
        color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
        icon: <Layout className="w-3 h-3" />
      };
    }
  };

  const getDeadlineConfig = (deadlineStr: string) => {
    const date = new Date(deadlineStr);
    const daysRemaining = differenceInDays(date, new Date());
    
    if (isPast(date) && !isToday(date)) {
      return { color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30', label: 'Overdue' };
    }
    if (isToday(date) || daysRemaining <= 2) {
      return { color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30', label: daysRemaining === 0 ? 'Due Today' : `Due in ${daysRemaining}d` };
    }
    return { color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30', label: `Due in ${daysRemaining}d` };
  };

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-4 md:p-8 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Header Section */}
        <header className="lg:col-span-12 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                Task <span className="text-blue-600">Forge</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium pl-1">
              Precision workflow for high-performance teams.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="px-4 py-2 text-center border-r border-slate-100 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Active</p>
              <p className="text-xl font-black text-blue-600">{activeTasks.length}</p>
            </div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Done</p>
              <p className="text-xl font-black text-emerald-500">{completedTasks.length}</p>
            </div>
          </motion.div>
        </header>

        {/* Sidebar: Creation Form */}
        <aside className="lg:col-span-4">
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 sticky top-8"
          >
            <h2 className="text-2xl font-black mb-8 text-slate-800 dark:text-white flex items-center gap-3 italic uppercase">
              <Plus className="w-6 h-6 text-blue-600" />
              Initialize
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest pl-1">Target Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-600 focus:ring-0 outline-none transition-all dark:text-white font-bold placeholder:font-normal placeholder:text-slate-400"
                  placeholder="Deployment Alpha..."
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest pl-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-600 focus:ring-0 outline-none transition-all dark:text-white font-medium resize-none placeholder:font-normal placeholder:text-slate-400"
                  placeholder="System requirements and mission parameters..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest pl-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-600 focus:ring-0 outline-none dark:text-white font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest pl-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-600 focus:ring-0 outline-none dark:text-white font-bold"
                  />
                </div>
              </div>
              {error && <p className="text-rose-500 text-sm font-bold pl-1">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/40 disabled:opacity-50 uppercase tracking-widest italic"
              >
                {isLoading ? 'Syncing...' : 'Deploy Protocol'}
              </motion.button>
            </form>
          </motion.section>
        </aside>

        {/* Task Feed Section */}
        <section className="lg:col-span-8 space-y-12">
          
          {/* Active Tasks Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-600" />
                Active <span className="text-blue-600">Feed</span>
              </h2>
              <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <motion.div layout className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {activeTasks.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-slate-900 border-4 border-dotted border-slate-200 dark:border-slate-800 rounded-[2.5rem] py-24 text-center"
                  >
                    <Layout className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-400 dark:text-slate-600 text-xl font-black uppercase italic tracking-widest">No active protocols.</p>
                  </motion.div>
                ) : (
                  activeTasks.map((task) => {
                    const priorityConfig = getPriorityConfig(task.priority);
                    const deadlineConfig = task.deadline ? getDeadlineConfig(task.deadline) : null;
                    const timeAgo = formatDistanceToNow(new Date(task.createdAt), { addSuffix: true });
                    
                    return (
                      <motion.div
                        layout
                        key={task._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -4 }}
                        className="group relative overflow-hidden bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border-2 border-slate-100 dark:border-slate-800 transition-all hover:border-blue-600 dark:hover:border-blue-500/50"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                          <div className="space-y-4 flex-grow">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-black text-2xl text-slate-900 dark:text-white leading-none uppercase tracking-tight">
                                {task.title}
                              </h3>
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${priorityConfig.color}`}>
                                {priorityConfig.icon}
                                {task.priority}
                              </div>
                            </div>
                            
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
                              {task.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                              <motion.button
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => markAsDone(task._id)}
                                className="group/btn flex items-center gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Terminate Protocol
                                <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-4 text-right shrink-0 min-w-[140px]">
                            {task.deadline && deadlineConfig && (
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Deadline</span>
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${deadlineConfig.color}`}>
                                  <Calendar className="w-4 h-4" />
                                  <div className="flex flex-col items-end">
                                    <span className="text-sm font-black leading-tight">
                                      {format(new Date(task.deadline), 'MMM d, yy')}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">
                                      {deadlineConfig.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-col items-end pt-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Log Timestamp</span>
                              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-xs tracking-tight">{timeAgo}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Completed Tasks Section */}
          <div className="space-y-8 pt-4">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3">
                <Archive className="w-8 h-8 text-emerald-500" />
                Completed <span className="text-emerald-500">Archive</span>
              </h2>
              <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <motion.div layout className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {completedTasks.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] py-16 text-center"
                  >
                    <p className="text-slate-400 dark:text-slate-600 text-lg font-bold uppercase italic tracking-widest">Archive empty.</p>
                  </motion.div>
                ) : (
                  completedTasks.map((task) => (
                    <motion.div
                      layout
                      key={task._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 opacity-60 grayscale-[0.8] hover:grayscale-0 transition-all"
                    >
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                          <div>
                            <h3 className="font-black text-xl text-slate-900 dark:text-white uppercase line-through decoration-emerald-500/50">
                              {task.title}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium line-clamp-1">{task.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged At</p>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{format(new Date(task.createdAt), 'MMM d, yy')}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </section>
      </main>
    </div>
  );
}