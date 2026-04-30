'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { _id, name, email, role }
  const [loading, setLoading] = useState(true); // true while we verify the stored token
  const router = useRouter();

  // On mount: if a token exists, fetch the current user to validate it
  useEffect(() => {
    const token = localStorage.getItem('zenvy_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authAPI.getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        // Token invalid/expired — clear it
        localStorage.removeItem('zenvy_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem('zenvy_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register({ name, email, password });
    localStorage.setItem('zenvy_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('zenvy_token');
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
