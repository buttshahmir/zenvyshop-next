'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      router.push(`/shop?search=${encodeURIComponent(e.target.value.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-wider text-gold-gradient">ZENVY</span>
            <span className="text-xs sm:text-sm text-gray-400 tracking-widest hidden sm:inline">SHOP.PK</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`luxury-underline text-sm tracking-widest uppercase transition-colors ${
                  pathname === link.path ? 'text-gold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-300 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 text-gray-300 hover:text-gold transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline text-sm">{user?.name?.split(' ')[0] ?? 'Account'}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-black-light border border-gray-800 rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-white text-sm font-medium truncate">{user?.name ?? 'Account'}</p>
                        <p className="text-gray-500 text-xs truncate">{user?.email ?? ''}</p>
                      </div>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-gold hover:bg-white/5 transition-colors text-sm"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package size={16} />
                        My Orders
                      </Link>

{user.role === 'admin' && (
  <Link
    href="/admin"
    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-gold hover:bg-white/5 transition-colors text-sm"
    onClick={() => setUserMenuOpen(false)}
  >
    ⚙️ Admin Panel
  </Link>
)}

                      <button
                        onClick={() => {setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-white/5 transition-colors text-sm"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth" className="text-gray-300 hover:text-gold transition-colors" aria-label="Sign in">
                <User size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-300 hover:text-gold transition-colors" aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-gold transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black-light border-t border-gray-800 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <input
                type="text"
                placeholder="Search for jewellery... (press Enter)"
                onKeyDown={handleSearchSubmit}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black-light border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block text-lg tracking-widest uppercase ${
                    pathname === link.path ? 'text-gold' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-800 pt-4 space-y-3">
                {user ? (
                  <>
                    <Link href="/orders" className="block text-gray-300 text-sm">My Orders</Link>
                    <button onClick={logout} className="block text-red-400 text-sm">Sign Out</button>
                  </>
                ) : (
                  <Link href="/auth" className="block text-gold text-sm tracking-widest uppercase">Sign In</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
