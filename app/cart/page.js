'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (productId) => {
    setRemovingId(productId);
    setTimeout(() => { removeFromCart(productId); setRemovingId(null); }, 300);
  };

  const shipping = cartTotal > 3000 ? 0 : 250;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-light text-black mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Discover our beautiful collection and add something special.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-gold text-black px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-light text-black mb-8">
          Shopping <span className="font-semibold">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <motion.div
                key={product._id}
                layout
                animate={{ opacity: removingId === product._id ? 0 : 1, x: removingId === product._id ? 80 : 0 }}
                className="bg-white rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border border-gray-100"
              >
                <Link href={`/product/${product._id}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=200'}
                    alt={product.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Link href={`/product/${product._id}`}>
                      <h3 className="font-medium text-black hover:text-gold transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                    <p className="text-gold font-bold mt-2">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(product._id, quantity - 1)} className="p-2 hover:bg-gray-100 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                      <button onClick={() => updateQuantity(product._id, quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      aria-label="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <button onClick={clearCart} className="text-gray-500 hover:text-red-500 text-sm transition-colors">
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-black mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {shipping === 0 && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Package size={14} />
                    <span>Free shipping applied!</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-black">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-gold text-black py-4 rounded-lg font-semibold tracking-wider hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
              <Link href="/shop" className="block text-center text-gray-500 hover:text-gold text-sm mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
