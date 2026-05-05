'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('zenvy_user');

    if (!savedUser) {
      router.replace('/auth?redirect=/admin');
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser?.role !== 'admin') {
        router.replace('/');
        return;
      }

      setUser(parsedUser);
      setAuthorized(true);
    } catch (err) {
      router.replace('/auth?redirect=/admin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 🔄 Prevent flicker / unauthorized render
  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        
        {/* Left */}
        <div className="flex items-center gap-6">
          <span className="text-yellow-500 font-bold text-lg tracking-wider">
            ZENVY ADMIN
          </span>

          <div className="hidden sm:flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/orders" className="text-gray-400 hover:text-white text-sm transition-colors">
              Orders
            </Link>
            <Link href="/admin/products" className="text-gray-400 hover:text-white text-sm transition-colors">
              Products
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-gray-400 hover:text-yellow-500 text-sm transition-colors"
          >
            View Site ↗
          </Link>

          <span className="text-gray-500 text-sm">
            {user?.email}
          </span>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}