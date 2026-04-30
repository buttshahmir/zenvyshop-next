'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl sm:text-3xl font-light mb-3">
              Join the <span className="text-gold">Zenvy</span> Family
            </h3>
            <p className="text-gray-400 mb-6">
              Subscribe for exclusive offers, new arrivals, and jewellery care tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-black-light border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold"
              />
              <button className="bg-gold text-black font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h4 className="text-xl font-bold tracking-wider text-gold-gradient mb-4">ZENVY SHOP</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Pakistan's premier destination for anti-tarnish jewellery. We believe luxury should be accessible and lasting.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-semibold tracking-widest uppercase mb-4">Quick Links</h5>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: 'About Us', href: '/about-us' },
                { label: 'Contact', href: '/contact' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-400 hover:text-gold transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-sm font-semibold tracking-widest uppercase mb-4">Categories</h5>
            <ul className="space-y-3">
              {['Necklaces', 'Earrings', 'Bracelets', 'Rings'].map(item => (
                <li key={item}>
                  <Link
                    href={`/shop?category=${item}`}
                    className="text-gray-400 hover:text-gold transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-sm font-semibold tracking-widest uppercase mb-4">Contact Us</h5>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                <span>+92 333 845 5459</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="text-gold shrink-0" />
                <span>hello@zenvyshop.pk</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <span>Karachi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} ZenvyShop.pk. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-gold" /> in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
