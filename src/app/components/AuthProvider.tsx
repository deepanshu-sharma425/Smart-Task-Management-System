'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar?: string;
}

interface Session {
  token: string;
  userId: string;
  role: 'admin' | 'member';
  expiresAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role?: 'admin' | 'member') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  isAdmin: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('taskforge-user');
      const savedSession = localStorage.getItem('taskforge-session');
      if (savedUser && savedSession) {
        const parsedSession = JSON.parse(savedSession) as Session;
        // Check if session is expired
        if (new Date(parsedSession.expiresAt) > new Date()) {
          setUser(JSON.parse(savedUser));
          setSession(parsedSession);
        } else {
          localStorage.removeItem('taskforge-user');
          localStorage.removeItem('taskforge-session');
        }
      }
    } catch {
      // Invalid data in localStorage
      localStorage.removeItem('taskforge-user');
      localStorage.removeItem('taskforge-session');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || 'Login failed' };
      }

      const data = await res.json();
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem('taskforge-user', JSON.stringify(data.user));
      localStorage.setItem('taskforge-session', JSON.stringify(data.session));

      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/member');
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, [router]);

  const signup = useCallback(async (name: string, email: string, password: string, role: 'admin' | 'member' = 'member') => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || 'Signup failed' };
      }

      const data = await res.json();
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem('taskforge-user', JSON.stringify(data.user));
      localStorage.setItem('taskforge-session', JSON.stringify(data.session));

      if (data.user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/member');
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem('taskforge-user');
    localStorage.removeItem('taskforge-session');
    router.push('/');
  }, [router]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
