'use client';

import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api';
import { Package, ShoppingBag, TrendingUp, Clock } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUS_COLORS = {
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zenvy_token');

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()),
      productsAPI.getAll(),
    ])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData.orders || []);
        setProducts(productsData.products || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-400' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'text-gold' },
    { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-yellow-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-semibold text-white">Recent Orders</h2>
          <a href="/admin/orders" className="text-gold text-sm hover:text-gold-light">View All →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Items</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Total</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.slice(0, 8).map((order) => (
                <tr key={order._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-medium">{order.shippingAddress?.fullName}</p>
                    <p className="text-gray-500 text-xs">{order.shippingAddress?.city}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">
                    {order.items?.length} item(s)
                  </td>
                  <td className="px-5 py-4 text-gold text-sm font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}