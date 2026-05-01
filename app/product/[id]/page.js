'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Minus, Plus, ShoppingBag, Heart, Share2,
  Truck, Shield, RotateCcw, MessageCircle, ChevronLeft, Check
} from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setSelectedImage(0);
    setQuantity(1);

    productsAPI.getOne(id)
      .then(async (data) => {
        setProduct(data.product);
        // Fetch related products (same category)
        const relData = await productsAPI.getAll({ category: data.product.category });
        setRelated(relData.products.filter((p) => p._id !== data.product._id).slice(0, 4));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const msg = `Hi! I'm interested in *${product.name}* (${formatPrice(product.price)}). Can you help me with this order?`;
    window.open(`https://wa.me/923476301166?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-10 w-3/4 bg-gray-200 rounded" />
              <div className="h-8 w-32 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-14 bg-gray-200 rounded" />
              <div className="h-14 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-light text-black mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "This product doesn't exist."}</p>
          <Link href="/shop" className="bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-block">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-offwhite pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors mb-6"
        >
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-2xl overflow-hidden aspect-square mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }} className="flex flex-col"
          >
            <p className="text-gold text-sm tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-gold/10 text-gold text-sm font-semibold px-2 py-1 rounded">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Stock badge */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 font-medium">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-sm text-red-500 font-medium">✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-500 text-sm">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0}
                  className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-lg font-semibold tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-gold text-black hover:bg-gold-light'
                }`}
              >
                {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart</>}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 py-4 rounded-lg font-semibold tracking-wider flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={18} />
                Order via WhatsApp
              </button>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                  isWishlisted ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-200 text-gray-600 hover:border-gold'
                }`}
              >
                <Heart size={18} className={isWishlisted ? 'fill-red-500' : ''} />
                <span className="text-sm">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </button>
              <button
                onClick={() => { if (navigator.share) navigator.share({ title: product.name, url: window.location.href }); }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-600 hover:border-gold transition-colors"
              >
                <Share2 size={18} />
                <span className="text-sm">Share</span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-gray-100">
              <div className="text-center">
                <Truck size={20} className="mx-auto text-gold mb-1" />
                <p className="text-xs text-gray-500">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield size={20} className="mx-auto text-gold mb-1" />
                <p className="text-xs text-gray-500">Anti-Tarnish</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto text-gold mb-1" />
                <p className="text-xs text-gray-500">7-Day Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-light text-black mb-8">
              You May Also <span className="font-semibold">Like</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
