'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  Zap,
  ChevronRight,
  UserPlus,
  FolderPlus,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import Navbar from '../components/Navbar';
import BackgroundShapes from '../components/BackgroundShapes';
import TaskCard from '../components/TaskCard';
import StatsCard from '../components/StatsCard';
import TeamMemberCard from '../components/TeamMemberCard';
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

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<UserData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskProject, setTaskProject] = useState('');
  const [taskError, setTaskError] = useState('');
  const [taskLoading, setTaskLoading] = useState(false);

  // Add member form
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberError, setMemberError] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);

  // Project form
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectError, setProjectError] = useState('');
  const [projectLoading, setProjectLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'tasks' | 'team' | 'projects'>('tasks');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) setTasks(await res.json());
    } catch (err) { console.error(err); }
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const all: UserData[] = await res.json();
        setMembers(all.filter((u) => u.role === 'member'));
      }
    } catch (err) { console.error(err); }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjects(await res.json());
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user?.role !== 'admin') {
      router.push('/member');
      return;
    }
    if (user) {
      fetchTasks();
      fetchMembers();
      fetchProjects();
    }
  }, [user, authLoading, router, fetchTasks, fetchMembers, fetchProjects]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError('');
    setTaskLoading(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
          deadline: taskDeadline || undefined,
          assignedTo: taskAssignee || undefined,
          assignedBy: user?._id,
          projectId: taskProject || undefined,
        }),
      });
      if (res.ok) {
        setTaskTitle('');
        setTaskDesc('');
        setTaskPriority('medium');
        setTaskDeadline('');
        setTaskAssignee('');
        setTaskProject('');
        fetchTasks();
      } else {
        const data = await res.json();
        setTaskError(data.error || 'Failed to create task');
      }
    } catch {
      setTaskError('Network error');
    }
    setTaskLoading(false);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');
    setMemberLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: memberName,
          email: memberEmail,
          password: memberPassword,
          role: 'member',
        }),
      });
      if (res.ok) {
        setMemberName('');
        setMemberEmail('');
        setMemberPassword('');
        fetchMembers();
      } else {
        const data = await res.json();
        setMemberError(data.error || 'Failed to add member');
      }
    } catch {
      setMemberError('Network error');
    }
    setMemberLoading(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectError('');
    setProjectLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          description: projectDesc,
          ownerId: user?._id,
        }),
      });
      if (res.ok) {
        setProjectName('');
        setProjectDesc('');
        fetchProjects();
      } else {
        const data = await res.json();
        setProjectError(data.error || 'Failed to create project');
      }
    } catch {
      setProjectError('Network error');
    }
    setProjectLoading(false);
  };

  const handleStatusUpdate = async (taskId: string, status: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchTasks();
    } catch (err) { console.error(err); }
  };

  const getMemberName = (id?: string) => {
    if (!id) return 'Unassigned';
    const member = members.find((m) => m._id === id);
    return member?.name || 'Unknown';
  };

  const getTaskCountForMember = (memberId: string) => {
    return tasks.filter((t) => t.assignedTo === memberId && t.status !== 'completed').length;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Zap className="w-8 h-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  const activeTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'archived');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed' && t.status !== 'archived'
  );

  const tabs = [
    { id: 'tasks' as const, label: 'Tasks', icon: ListTodo },
    { id: 'team' as const, label: 'Team', icon: Users },
    { id: 'projects' as const, label: 'Projects', icon: FolderPlus },
  ];

  const inputClass = 'w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400 transition-colors text-sm';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      <BackgroundShapes count={6} />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Admin <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.name}. Here&apos;s your team overview.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatsCard icon={ListTodo} label="Total Tasks" value={tasks.length} color="bg-blue-600/10 text-blue-600" delay={0} />
          <StatsCard icon={Clock} label="Active" value={activeTasks.length} color="bg-amber-600/10 text-amber-600" delay={0.1} />
          <StatsCard icon={CheckCircle2} label="Completed" value={completedTasks.length} color="bg-emerald-600/10 text-emerald-600" delay={0.2} />
          <StatsCard icon={AlertTriangle} label="Overdue" value={overdueTasks.length} color="bg-red-600/10 text-red-600" delay={0.3} />
          <StatsCard icon={Users} label="Members" value={members.length} color="bg-violet-600/10 text-violet-600" delay={0.4} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* ─── TASKS TAB ─── */}
          {activeTab === 'tasks' && (
            <>
              {/* Task Form */}
              <motion.aside
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                    <Plus className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      Assign Task
                    </h2>
                  </div>

                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required placeholder="Task title" className={inputClass} />
                    <textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} required placeholder="Description" rows={3} className={`${inputClass} resize-none`} />

                    <div className="grid grid-cols-2 gap-3">
                      <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className={inputClass}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                      <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} className={inputClass} />
                    </div>

                    <select value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} className={inputClass}>
                      <option value="">Assign to member...</option>
                      {members.map((m) => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                      ))}
                    </select>

                    <select value={taskProject} onChange={(e) => setTaskProject(e.target.value)} className={inputClass}>
                      <option value="">Select project...</option>
                      {projects.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>

                    {taskError && <p className="text-red-500 text-xs font-bold">{taskError}</p>}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={taskLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {taskLoading ? 'Creating...' : 'Assign Task'}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </form>
                </div>
              </motion.aside>

              {/* Task Feed */}
              <motion.section
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-8 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Active Tasks
                  </h2>
                  <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {activeTasks.length} active
                  </span>
                </div>

                <AnimatePresence mode="popLayout">
                  {activeTasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white dark:bg-slate-900 border-4 border-dotted border-slate-200 dark:border-slate-800 rounded-2xl py-16 text-center"
                    >
                      <ListTodo className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                      <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-sm">
                        No active tasks. Assign one above!
                      </p>
                    </motion.div>
                  ) : (
                    activeTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        assigneeName={getMemberName(task.assignedTo)}
                        onStatusUpdate={handleStatusUpdate}
                        showAssignee
                      />
                    ))
                  )}
                </AnimatePresence>

                {/* Completed section */}
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
                        <TaskCard
                          key={task._id}
                          task={task}
                          assigneeName={getMemberName(task.assignedTo)}
                          showAssignee
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.section>
            </>
          )}

          {/* ─── TEAM TAB ─── */}
          {activeTab === 'team' && (
            <>
              <motion.aside
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      Add Member
                    </h2>
                  </div>

                  <form onSubmit={handleAddMember} className="space-y-4">
                    <input value={memberName} onChange={(e) => setMemberName(e.target.value)} required placeholder="Full name" className={inputClass} />
                    <input type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required placeholder="Email address" className={inputClass} />
                    <input type="password" value={memberPassword} onChange={(e) => setMemberPassword(e.target.value)} required placeholder="Password" className={inputClass} />

                    {memberError && <p className="text-red-500 text-xs font-bold">{memberError}</p>}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={memberLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {memberLoading ? 'Adding...' : 'Add Member'}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </form>
                </div>
              </motion.aside>

              <motion.section
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-violet-500" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Team Members
                  </h2>
                  <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {members.length} members
                  </span>
                </div>

                {members.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border-4 border-dotted border-slate-200 dark:border-slate-800 rounded-2xl py-16 text-center">
                    <Users className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                    <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-sm">
                      No team members yet. Add one to get started!
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {members.map((member) => (
                      <TeamMemberCard
                        key={member._id}
                        member={member}
                        taskCount={getTaskCountForMember(member._id)}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            </>
          )}

          {/* ─── PROJECTS TAB ─── */}
          {activeTab === 'projects' && (
            <>
              <motion.aside
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                    <FolderPlus className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      New Project
                    </h2>
                  </div>

                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <input value={projectName} onChange={(e) => setProjectName(e.target.value)} required placeholder="Project name" className={inputClass} />
                    <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} required placeholder="Description" rows={3} className={`${inputClass} resize-none`} />

                    {projectError && <p className="text-red-500 text-xs font-bold">{projectError}</p>}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={projectLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {projectLoading ? 'Creating...' : 'Create Project'}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </form>
                </div>
              </motion.aside>

              <motion.section
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FolderPlus className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Projects
                  </h2>
                  <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800" />
                </div>

                {projects.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border-4 border-dotted border-slate-200 dark:border-slate-800 rounded-2xl py-16 text-center">
                    <FolderPlus className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                    <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-sm">
                      No projects yet. Create one to organize your tasks!
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all"
                      >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{project.description}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {tasks.filter((t) => t.projectId === project._id).length} tasks
                          </span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {(project.memberIds || []).length} members
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
