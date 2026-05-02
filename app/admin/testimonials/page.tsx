"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Testimonial } from '@/lib/types';
import { Plus, Edit, Trash2, X, Check, Loader2, Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminTestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    client_company: '',
    content: '',
    rating: 5,
    is_active: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/testimonials/');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/admin/testimonials/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete testimonial');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/testimonials/${editingItem.id}/`, formData);
      } else {
        await api.post('/admin/testimonials/', formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      fetchData();
    } catch (err) {
      alert('Failed to save testimonial. Ensure all fields are filled correctly.');
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_role: '',
      client_company: '',
      content: '',
      rating: 5,
      is_active: true
    });
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      client_name: item.client_name,
      client_role: item.client_role,
      client_company: item.client_company,
      content: item.content,
      rating: item.rating,
      is_active: item.is_active
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-black">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Social proof from our valued clients.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); resetForm(); setIsModalOpen(true); }}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20 w-full md:w-auto justify-center"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Client</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Testimonial</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Rating</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" /> Loading testimonials...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400">No testimonials found.</td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <p className="font-bold text-brand-black">{item.client_name}</p>
                    <p className="text-xs text-gray-500">{item.client_role} at {item.client_company}</p>
                  </td>
                  <td className="px-8 py-4 max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2 italic italic">&quot;{item.content}&quot;</p>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="font-bold">{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                     <span className={cn(
                       "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                       item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                     )}>
                       {item.is_active ? 'Visible' : 'Hidden'}
                     </span>
                  </td>
                  <td className="px-8 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-brand-blue transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-brand-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
             <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-display font-bold text-brand-black">
                  {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-brand-black transition-colors p-2">
                   <X size={24} />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Client Name</label>
                    <input 
                      value={formData.client_name}
                      onChange={e => setFormData({...formData, client_name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Rating (1-5)</label>
                    <select 
                      value={formData.rating}
                      onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                    >
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Role/Position</label>
                    <input 
                      value={formData.client_role}
                      onChange={e => setFormData({...formData, client_role: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                      placeholder="e.g. CTO"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Company</label>
                    <input 
                      value={formData.client_company}
                      onChange={e => setFormData({...formData, client_company: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Testimonial Content</label>
                  <textarea 
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all h-32 resize-none"
                    placeholder="Enter the client's feedback here..."
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Display on Website</label>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-blue-dark transition-all shadow-lg shadow-brand-blue/20 order-1 sm:order-2"
                  >
                    <Check size={20} />
                    {editingItem ? 'Update Testimonial' : 'Add Testimonial'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
