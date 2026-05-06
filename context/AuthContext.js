'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('zenvy_token');
    const savedUser = localStorage.getItem('zenvy_user');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Token expired — clean up
        if (payload.exp * 1000 <= Date.now()) {
          localStorage.removeItem('zenvy_token');
          localStorage.removeItem('zenvy_user');
          setLoading(false);
          return;
        }

        if (savedUser) {
          // Normal path: zenvy_user exists, use it directly
          setUser(JSON.parse(savedUser));
        } else {
          // Fallback: zenvy_user missing but token is valid
          // Happens when only zenvy_token was stored (old sessions)
          const userData = {
            _id: payload.id,
            role: payload.role,        // ← this is what shows Admin Panel
            email: payload.email,
            name: payload.name || 'User',
          };
          localStorage.setItem('zenvy_user', JSON.stringify(userData));
          setUser(userData);
        }
      } catch {
        localStorage.removeItem('zenvy_token');
        localStorage.removeItem('zenvy_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem('zenvy_token', data.token);
    localStorage.setItem('zenvy_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register({ name, email, password });
    localStorage.setItem('zenvy_token', data.token);
    localStorage.setItem('zenvy_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('zenvy_token');
    localStorage.removeItem('zenvy_user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}