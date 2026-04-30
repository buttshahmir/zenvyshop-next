'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ featured: 'true' })
      .then((data) => setProducts(data.products.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold text-sm tracking-widest uppercase mb-3">Curated For You</p>
          <h2 className="text-3xl sm:text-4xl font-light text-black mb-4">
            Featured <span className="font-semibold">Collection</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Handpicked pieces that define elegance. Each crafted with our signature anti-tarnish technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading
            ? [...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gold font-semibold tracking-wider hover:text-gold-dark transition-colors"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
