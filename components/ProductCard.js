'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Eye, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Support both MongoDB _id and static id
  const productId = product._id || product.id;

  const handleAddToCart = (e) => {
    e.preventDefault();
    // Pass the full product object — CartContext stores it directly
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
        {/* Image */}
        <div className="relative img-zoom aspect-square bg-offwhite-dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=600'}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
              SALE
            </span>
          )}
          {product.isBestseller && (
            <span className="absolute top-3 right-3 bg-black text-gold text-xs font-bold px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Link
              href={`/product/${productId}`}
              className="bg-white text-black p-3 rounded-full hover:bg-gold transition-colors translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              aria-label="View product"
            >
              <Eye size={18} />
            </Link>
            <button
              onClick={handleAddToCart}
              className={`p-3 rounded-full transition-all translate-y-4 group-hover:translate-y-0 duration-300 delay-75 ${
                added ? 'bg-green-500 text-white' : 'bg-gold text-black hover:bg-gold-light'
              }`}
              aria-label="Add to cart"
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
          <Link href={`/product/${productId}`}>
            <h3 className="font-medium text-black mb-2 group-hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-black">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
