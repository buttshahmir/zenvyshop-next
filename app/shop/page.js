'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

const CATEGORIES = ['All', 'Necklaces', 'Earrings', 'Bracelets', 'Rings'];

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const search = params.get('search');
    if (cat) setSelectedCategory(cat);
    if (search) setSearchQuery(search);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        ...(sortBy && { sort: sortBy }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      };
      const data = await productsAPI.getAll(params);
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const url = cat === 'All' ? '/shop' : `/shop?category=${cat}`;
    router.replace(url, { scroll: false });
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('');
    setMinPrice('');
    setMaxPrice('');
    router.replace('/shop', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-offwhite pt-20">
      <div className="bg-black py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-light text-white mb-3"
          >
            Our <span className="font-semibold text-gold-gradient">Collection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Discover our curated selection of anti-tarnish jewellery
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-black"
            >
              <option value="">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name A to Z</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${
                showFilters
                  ? 'bg-gold text-black border-gold'
                  : 'bg-white text-black border-gray-200'
              }`}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gold text-black'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-white rounded-xl p-6 mb-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-black">Price Range (Rs.)</h3>
              <button
                onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                className="text-sm text-gold hover:text-gold-dark"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="number" placeholder="Min" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number" placeholder="Max" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg"
              />
              <button
                onClick={fetchProducts}
                className="bg-gold text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-light transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}

        {!loading && !error && (
          <p className="text-gray-500 text-sm mb-6">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchProducts} className="text-gold hover:text-gold-dark font-medium">
              Try again
            </button>
          </div>
        )}

        {!error && (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products found.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-gold hover:text-gold-dark font-medium"
              >
                Clear all filters
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}