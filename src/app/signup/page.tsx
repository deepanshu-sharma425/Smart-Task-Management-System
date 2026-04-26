'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Layout, Mail, Lock, User, ChevronRight, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import BackgroundShapes from '../components/BackgroundShapes';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    const result = await signup(name, email, password, role);
    if (!result.success) {
      setError(result.error || 'Signup failed');
    }
    setIsLoading(false);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col">
      <BackgroundShapes count={8} />

      <div className="flex-grow flex items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex p-3 rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20 mb-6">
              <Layout className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Start managing your team with TaskForge
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-8 space-y-5 shadow-xl shadow-slate-900/5 dark:shadow-none"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    role === 'admin'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    role === 'member'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Member
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400 transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.form>

          {/* Footer link */}
          <motion.p
            variants={itemVariants}
            className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400"
          >
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
