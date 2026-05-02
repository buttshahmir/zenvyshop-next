'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';

const CATEGORIES = ['Necklaces', 'Earrings', 'Bracelets', 'Rings'];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [imageInput, setImageInput] = useState('');

  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: 'Rings',
    images: [],
    stock: '',
    isFeatured: false,
    isBestseller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    setForm(prev => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
    setImageInput('');
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      setToast('Please add at least one image URL');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('zenvy_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
          stock: Number(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setToast('Product added!');
      setTimeout(() => router.push('/admin/products'), 1000);
    } catch (err) {
      setToast('Error: ' + err.message);
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {toast && (
        <div className="fixed top-20 right-6 bg-gold text-black px-4 py-2 rounded-lg text-sm font-medium z-50">{toast}</div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/admin/products')} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-light text-white">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Basic Info</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price (Rs.) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Original Price (Rs.)</label>
              <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange}
                placeholder="Leave blank if no discount"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold outline-none placeholder-gray-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Stock *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold outline-none resize-none" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Images</h2>
          <p className="text-gray-500 text-xs">Paste image URLs (from Unsplash, Cloudinary, etc.)</p>

          <div className="flex gap-2">
            <input value={imageInput} onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold outline-none placeholder-gray-600 text-sm" />
            <button type="button" onClick={addImage}
              className="bg-gold text-black px-4 py-3 rounded-lg hover:bg-gold-light transition-colors">
              <Plus size={16} />
            </button>
          </div>

          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-700" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flags */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Labels</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                className="w-4 h-4 accent-gold" />
              <span className="text-white text-sm">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isBestseller" checked={form.isBestseller} onChange={handleChange}
                className="w-4 h-4 accent-gold" />
              <span className="text-white text-sm">Bestseller</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/admin/products')}
            className="flex-1 py-3 border border-gray-700 text-gray-400 rounded-lg hover:border-gray-500 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold-light transition-colors disabled:opacity-70">
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}