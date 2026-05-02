'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { Plus, Edit, Trash2, Star, Zap } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(price);

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');
  const router = useRouter();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('zenvy_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(prev => prev.filter(p => p._id !== id));
      setToast('Product deleted!');
      setTimeout(() => setToast(''), 2500);
    } catch (err) {
      setToast('Error: ' + err.message);
      setTimeout(() => setToast(''), 3000);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {toast && (
        <div className="fixed top-20 right-6 bg-gold text-black px-4 py-2 rounded-lg text-sm font-medium z-50">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products</p>
        </div>
        <button
          onClick={() => router.push('/admin/products/add')}
          className="flex items-center gap-2 bg-gold text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Product</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Price</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Stock</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Tags</th>
                <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=60'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <p className="text-white text-sm font-medium">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{product.category}</td>
                  <td className="px-5 py-4">
                    <p className="text-gold text-sm font-medium">{formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-gray-500 text-xs line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${product.stock > 5 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {product.isFeatured && (
                        <span className="flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full border border-gold/20">
                          <Zap size={10} /> Featured
                        </span>
                      )}
                      {product.isBestseller && (
                        <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                          <Star size={10} /> Bestseller
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                        className="p-1.5 text-gray-400 hover:text-gold transition-colors"
                        title="Edit"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id, product.name)}
                        disabled={deleting === product._id}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}