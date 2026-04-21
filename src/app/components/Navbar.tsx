'use client';

import { motion } from 'framer-motion';
import { Layout, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import Link from 'next/link';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? (isAdmin ? '/dashboard' : '/member') : '/'} className="flex items-center gap-3 group">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-shadow">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Task<span className="text-blue-600">Forge</span>
          </h1>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          {/* User info + logout */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    {user.role}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
