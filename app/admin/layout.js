'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('zenvy_user');
    if (!savedUser) {
      router.replace('/auth?redirect=/admin');
      return;
    }
    try {
      const user = JSON.parse(savedUser);
      if (user.role !== 'admin') {
        router.replace('/');
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace('/auth?redirect=/admin');
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userStr = typeof window !== 'undefined' ? localStorage.getItem('zenvy_user') : null;
  const user = userStr ? JSON.parse(userStr) : {};

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <span className="text-yellow-500 font-bold text-lg tracking-wider">ZENVY ADMIN</span>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link>
            <Link href="/admin/orders" className="text-gray-400 hover:text-white text-sm transition-colors">Orders</Link>
            <Link href="/admin/products" className="text-gray-400 hover:text-white text-sm transition-colors">Products</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">
            View Site ↗
          </Link>
          <span className="text-gray-500 text-sm">{user.email}</span>
        </div>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}