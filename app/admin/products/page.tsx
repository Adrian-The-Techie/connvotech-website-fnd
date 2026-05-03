"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Product } from '@/lib/types';
import { Plus, Edit, Trash2, X, Check, Loader2, Package, ExternalLink, Cpu, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { getMediaUrl } from '@/lib/utils';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    features: '', // We'll handle conversion in the UI
    tech_stack: '',
    image: null as File | string | null,
    demo_url: '',
    price_starting_at: '',
    is_active: true,
    is_coming_soon: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/products/');
      setData(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${slug}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('tagline', formData.tagline);
    data.append('description', formData.description);
    data.append('features', formData.features);
    data.append('tech_stack', formData.tech_stack);
    data.append('demo_url', formData.demo_url);
    data.append('price_starting_at', formData.price_starting_at === '' ? '' : formData.price_starting_at);
    data.append('is_active', String(formData.is_active));
    data.append('is_coming_soon', String(formData.is_coming_soon));

    if (formData.image instanceof File) {
      data.append('image', formData.image);
    }

    try {
      if (editingItem) {
        await api.patch(`/admin/products/${editingItem.slug}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/products/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ 
        name: '', tagline: '', description: '', features: '', 
        tech_stack: '', image: null, demo_url: '', 
        price_starting_at: '', is_active: true, is_coming_soon: false
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save product. Ensure all fields are valid.');
    }
  };

  const openEdit = (item: Product) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      tagline: item.tagline,
      description: item.description,
      features: item.features_list ? item.features_list.join('\n') : '',
      tech_stack: item.tech_stack,
      image: item.image || '',
      demo_url: item.demo_url || '',
      price_starting_at: item.price_starting_at || '',
      is_active: item.is_active,
      is_coming_soon: item.is_coming_soon,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-black">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your enterprise digital offerings.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Product</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Tech Stack</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Price</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Roadmap</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" /> Loading products...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-gray-400">No products found.</td>
              </tr>
            ) : data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue overflow-hidden border border-gray-100 shadow-sm relative">
                         {item.image ? (
                           <Image 
                            src={getMediaUrl(item.image)} 
                            alt={item.name}
                            fill
                            className="object-cover"
                           />
                         ) : (
                           <Package size={20} />
                         )}
                      </div>
                      <div>
                         <p className="font-bold text-brand-black">{item.name}</p>
                         <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.tagline}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-4">
                   <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Cpu size={14} className="text-brand-blue" />
                      {item.tech_stack}
                   </div>
                </td>
                <td className="px-8 py-4">
                   <p className="font-bold text-brand-blue">${item.price_starting_at}</p>
                </td>
                <td className="px-8 py-4">
                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.is_coming_soon ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                     {item.is_coming_soon ? 'Coming Soon' : 'Live'}
                   </span>
                </td>
                <td className="px-8 py-4">
                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                     {item.is_active ? 'Active' : 'Hidden'}
                   </span>
                </td>
                <td className="px-8 py-4 text-right space-x-2">
                  {item.demo_url && (
                    <a href={item.demo_url} target="_blank" className="inline-block p-2 text-gray-400 hover:text-brand-blue">
                       <ExternalLink size={18} />
                    </a>
                  )}
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-brand-blue transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.slug)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
             <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-display font-bold text-brand-black">
                  {editingItem ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-brand-black transition-colors">
                   <X size={24} />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Name</label>
                      <input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                        required
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Tagline</label>
                      <input 
                        value={formData.tagline}
                        onChange={e => setFormData({...formData, tagline: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                        placeholder="e.g. Next-Gen Infrastructure Monitoring"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                   <RichTextEditor 
                     value={formData.description}
                     onChange={content => setFormData({...formData, description: content})}
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Features (one per line)</label>
                      <textarea 
                        value={formData.features}
                        onChange={e => setFormData({...formData, features: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all h-32"
                        placeholder="Feature 1\nFeature 2"
                      />
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Tech Stack</label>
                         <input 
                           value={formData.tech_stack}
                           onChange={e => setFormData({...formData, tech_stack: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                           placeholder="e.g. React, Node.js, AWS"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Starting Price ($)</label>
                         <input 
                           type="number"
                           value={formData.price_starting_at}
                           onChange={e => setFormData({...formData, price_starting_at: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                         />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Thumbnail Image</label>
                      
                      {/* Current Image Preview */}
                      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-24 h-24 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 overflow-hidden relative shadow-inner">
                          {formData.image ? (
                            <Image 
                              src={typeof formData.image === 'string' ? getMediaUrl(formData.image) : URL.createObjectURL(formData.image)}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon size={32} />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Current Thumbnail</p>
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) setFormData({...formData, image: file});
                            }}
                            className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 transition-all cursor-pointer"
                          />
                          {typeof formData.image === 'string' && formData.image && (
                            <p className="text-[10px] text-gray-400 truncate max-w-[200px]">File: {formData.image.split('/').pop()}</p>
                          )}
                        </div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Demo URL</label>
                      <input 
                        value={formData.demo_url}
                        onChange={e => setFormData({...formData, demo_url: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                        placeholder="https://demo.connvotech.com/..."
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={e => setFormData({...formData, is_active: e.target.checked})}
                        className="w-5 h-5 accent-brand-blue"
                      />
                      <label className="text-sm font-bold text-brand-black">Visible to Public</label>
                   </div>
                   <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={formData.is_coming_soon}
                        onChange={e => setFormData({...formData, is_coming_soon: e.target.checked})}
                        className="w-5 h-5 accent-amber-500"
                      />
                      <label className="text-sm font-bold text-brand-black">Mark as Coming Soon</label>
                   </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-brand-blue text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-blue-dark transition-all shadow-lg shadow-brand-blue/20"
                  >
                    <Check size={20} />
                    {editingItem ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
