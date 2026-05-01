"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Service } from '@/lib/types';
import { Plus, Edit, Trash2, X, Check, Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    icon: 'Laptop',
    short_description: '',
    long_description: '',
    order: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/services/');
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
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/admin/services/${slug}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.patch(`/admin/services/${editingItem.slug}/`, formData);
      } else {
        await api.post('/admin/services/', formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ title: '', icon: 'Laptop', short_description: '', long_description: '', order: 0 });
      fetchData();
    } catch (err) {
      alert('Failed to save service');
    }
  };

  const openEdit = (item: Service) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      icon: item.icon,
      short_description: item.short_description,
      long_description: item.long_description,
      order: item.order
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-brand-black">Services</h1>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Title</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Icon</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-8 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" /> Loading services...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-8 py-12 text-center text-gray-400">No services found.</td>
              </tr>
            ) : data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-4 font-medium text-brand-black">{item.title}</td>
                <td className="px-8 py-4 text-gray-500">{item.icon}</td>
                <td className="px-8 py-4 text-right space-x-3">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
             <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-display font-bold text-brand-black">
                  {editingItem ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-brand-black transition-colors">
                   <X size={24} />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Title</label>
                    <input 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Icon (Lucide Name)</label>
                    <input 
                      value={formData.icon}
                      onChange={e => setFormData({...formData, icon: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Short Description (Summary)</label>
                  <textarea 
                    value={formData.short_description}
                    onChange={e => setFormData({...formData, short_description: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all h-20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Description (Styled Content)</label>
                  <RichTextEditor 
                    value={formData.long_description}
                    onChange={content => setFormData({...formData, long_description: content})}
                  />
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-50">
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
                    {editingItem ? 'Save Changes' : 'Create Service'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
