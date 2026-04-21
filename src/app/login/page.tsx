'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Layout, Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import BackgroundShapes from '../components/BackgroundShapes';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
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
      <Navbar />

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
              Welcome back
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Sign in to your TaskForge account
            </p>
          </motion.div>

          {/* Demo credentials */}
          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30"
          >
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Demo Admin Login</p>
            <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <p>Email: <code className="bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-mono text-xs">admin@taskforge.io</code></p>
              <p>Password: <code className="bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-mono text-xs">admin123</code></p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-8 space-y-6 shadow-xl shadow-slate-900/5 dark:shadow-none"
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
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.form>

          {/* Footer link */}
          <motion.p
            variants={itemVariants}
            className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400"
          >
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-bold">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
