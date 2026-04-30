'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productsAPI } from '@/lib/api';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ bestseller: 'true' })
      .then((data) => setProducts(data.products.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold text-sm tracking-widest uppercase mb-3">Most Loved</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
            Best <span className="font-semibold text-gold-gradient">Sellers</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Our customers can't get enough of these timeless pieces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {loading
            ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} dark />)
            : products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
}
