'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI } from '@/lib/api';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700',     icon: CheckCircle },
  shipped:   { label: 'Shipped',   color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700',   icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700',       icon: XCircle },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth?redirect=/orders');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    ordersAPI.getMyOrders()
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-black">
            My <span className="font-semibold">Orders</span>
          </h1>
          {user && <p className="text-gray-500 text-sm mt-1">{user.email}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={36} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-light text-black mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
            <Link href="/shop" className="bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-block">
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                        <Package size={20} className="text-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-black text-sm">Order placed</p>
                        <p className="text-gray-500 text-xs">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                      <span className="font-bold text-black">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=80'}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                      <div className="ml-2">
                        <p className="text-sm font-medium text-black">
                          {order.items.map((i) => i.name).slice(0, 2).join(', ')}
                          {order.items.length > 2 ? ` +${order.items.length - 2} more` : ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                          · {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Deliver to: <span className="text-black">{order.shippingAddress?.city}, {order.shippingAddress?.province}</span>
                      </div>
                      <Link
                        href={`/orders/${order._id}`}
                        className="flex items-center gap-1 text-gold text-sm font-medium hover:text-gold-dark transition-colors"
                      >
                        View Details <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
