'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/auth?redirect=/admin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Admin Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <span className="text-gold font-bold text-lg tracking-wider">ZENVY ADMIN</span>
          <div className="hidden sm:flex items-center gap-4">
            <a href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</a>
            <a href="/admin/orders" className="text-gray-400 hover:text-white text-sm transition-colors">Orders</a>
            <a href="/admin/products" className="text-gray-400 hover:text-white text-sm transition-colors">Products</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-gray-400 hover:text-gold text-sm transition-colors">
            View Site ↗
          </a>
          <span className="text-gray-500 text-sm">{user.email}</span>
        </div>
      </nav>

      {/* Page Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}