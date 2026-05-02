'use client';

import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api';
import { Package, ChevronDown } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const token = localStorage.getItem('zenvy_token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      setToast('Status updated!');
      setTimeout(() => setToast(''), 2500);
    } catch (err) {
      setToast('Error: ' + err.message);
      setTimeout(() => setToast(''), 3000);
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 bg-gold text-black px-4 py-2 rounded-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-light text-white">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === s ? 'bg-gold text-black' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Package size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{order.shippingAddress?.fullName}</p>
                    <p className="text-gray-500 text-xs">{order.shippingAddress?.phone} · {order.shippingAddress?.city}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-gold font-semibold">{formatPrice(order.total)}</span>

                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-medium border cursor-pointer disabled:opacity-50 ${STATUS_COLORS[order.status]} bg-transparent`}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} className="bg-gray-900 text-white capitalize">{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>

                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="text-gray-400 hover:text-white text-xs transition-colors"
                  >
                    {expandedOrder === order._id ? 'Hide ▲' : 'Details ▼'}
                  </button>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-800 p-5 bg-gray-800/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Items Ordered</h3>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img src={item.image || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=60'}
                              alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{item.name}</p>
                              <p className="text-gray-500 text-xs">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping + Summary */}
                    <div>
                      <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Shipping Address</h3>
                      <p className="text-white text-sm">{order.shippingAddress?.fullName}</p>
                      <p className="text-gray-400 text-sm">{order.shippingAddress?.address}</p>
                      <p className="text-gray-400 text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
                      <p className="text-gray-400 text-sm">{order.shippingAddress?.phone}</p>

                      <div className="mt-4 pt-4 border-t border-gray-700 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Shipping</span>
                          <span className="text-white">{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold pt-1 border-t border-gray-700">
                          <span className="text-white">Total</span>
                          <span className="text-gold">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}