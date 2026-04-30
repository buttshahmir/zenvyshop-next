'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Package, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI } from '@/lib/api';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);
const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700',     icon: CheckCircle },
  shipped:   { label: 'Shipped',   color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700',   icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700',       icon: XCircle },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth?redirect=/orders');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    ordersAPI.getOne(id)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || 'Order not found.'}</p>
          <Link href="/orders" className="text-gold hover:text-gold-dark">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-offwhite pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => router.push('/orders')} className="flex items-center gap-2 text-gray-500 hover:text-gold mb-6 transition-colors">
          <ChevronLeft size={18} /> Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
          <div>
            <h1 className="text-2xl font-light text-black">Order Details</h1>
            <p className="text-gray-500 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
            <StatusIcon size={14} />
            {status.label}
          </span>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
          <div className="flex items-center gap-3 p-5 border-b border-gray-100">
            <Package size={18} className="text-gold" />
            <h2 className="font-semibold text-black">Items Ordered</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=120'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-black shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="p-5 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-bold text-black text-lg pt-2 border-t border-gray-100">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Shipping address */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-gold" />
              <h3 className="font-semibold text-black text-sm">Shipping Address</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.phone}
            </p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-gold" />
              <h3 className="font-semibold text-black text-sm">Payment</h3>
            </div>
            <p className="text-gray-600 text-sm">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Status: <span className="font-medium">{order.paymentMethod === 'cod' ? 'Pay on arrival' : 'Paid'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
