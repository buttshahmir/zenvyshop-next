'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Truck, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI } from '@/lib/api';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, getCartProducts, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', address: '', city: '', province: '', postalCode: '',
  });

  const cartProducts = getCartProducts();
  const shipping = cartTotal > 3000 ? 0 : 250;
  const total = cartTotal + shipping;

  // Redirect to login if not authenticated (after auth is resolved)
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  // Redirect to cart if cart is empty (and no placed order)
  useEffect(() => {
    if (!authLoading && cartItems.length === 0 && !placedOrder) {
      router.replace('/cart');
    }
  }, [cartItems, authLoading, placedOrder, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setError('');
    setSubmitting(true);
    try {
      const items = cartProducts.map(({ product, quantity }) => ({
        productId: product._id,
        quantity,
      }));

      const data = await ordersAPI.create({
        items,
        shippingAddress: formData,
        paymentMethod: 'cod',
      });

      clearCart();
      setPlacedOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state while auth resolves
  if (authLoading) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Order success screen
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-light text-black mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-1">Thank you, {user?.name?.split(' ')[0]}!</p>
          <p className="text-gray-400 text-sm mb-8">
            Your order will be delivered to <strong>{formData.city}</strong>. We'll contact you on <strong>{formData.phone}</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders" className="bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors">
              View My Orders
            </Link>
            <Link href="/shop" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gold hover:text-gold transition-colors">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push('/cart')} className="flex items-center gap-2 text-gray-500 hover:text-gold mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <h1 className="text-3xl font-light text-black mb-8">
          Secure <span className="font-semibold">Checkout</span>
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-10 max-w-xs">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-gold text-black' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              <span className={`text-sm hidden sm:inline ${step >= s ? 'text-black' : 'text-gray-400'}`}>
                {s === 1 ? 'Shipping' : 'Confirm'}
              </span>
              {s < 2 && <div className={`flex-1 h-0.5 w-8 ${step > s ? 'bg-gold' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin size={20} className="text-gold" />
                  <h2 className="text-lg font-semibold text-black">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
                      <input name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                        placeholder="+92 3XX XXXXXXX" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Street Address *</label>
                    <input name="address" value={formData.address} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                      placeholder="House/Flat no., Street, Area" required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">City *</label>
                      <input name="city" value={formData.city} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Province *</label>
                      <select name="province" value={formData.province} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg" required>
                        <option value="">Select</option>
                        <option>Sindh</option>
                        <option>Punjab</option>
                        <option>KPK</option>
                        <option>Balochistan</option>
                        <option>Gilgit-Baltistan</option>
                        <option>AJK</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                      <input name="postalCode" value={formData.postalCode} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.province) {
                      setError('Please fill in all required fields.');
                      return;
                    }
                    setError('');
                    setStep(2);
                  }}
                  className="w-full mt-6 bg-gold text-black py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors"
                >
                  Continue to Review
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard size={20} className="text-gold" />
                  <h2 className="text-lg font-semibold text-black">Review & Place Order</h2>
                </div>

                {/* Payment method */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Method</h3>
                  <label className="flex items-center gap-4 p-4 border-2 border-gold bg-gold/5 rounded-xl cursor-pointer">
                    <div className="w-5 h-5 rounded-full border-2 border-gold flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-black">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when your order arrives</p>
                    </div>
                    <Truck size={24} className="text-gold" />
                  </label>
                </div>

                {/* Shipping address summary */}
                <div className="bg-offwhite rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-black">Shipping To</h3>
                    <button onClick={() => setStep(1)} className="text-gold text-xs hover:text-gold-dark">Edit</button>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {formData.fullName}<br />
                    {formData.address}, {formData.city}, {formData.province} {formData.postalCode}<br />
                    {formData.phone}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-4 border border-gray-200 rounded-lg text-gray-600 hover:border-gold transition-colors">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="flex-1 bg-gold text-black py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Placing Order...</>
                    ) : (
                      `Place Order — ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-black mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartProducts.map(({ product, quantity }) => (
                  <div key={product._id} className="flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=100'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {quantity}</p>
                      <p className="text-sm text-gold font-semibold">{formatPrice(product.price * quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-black pt-2 border-t border-gray-100">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
