"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BlogPost } from '@/lib/types';
import { Plus, Edit, Trash2, X, Check, Loader2, Calendar, Share2 } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminBlogPage() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    target_sectors: '',
    related_services: '',
    created_at__gte: '',
    created_at__lte: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    body: '',
    status: 'draft',
    scheduled_at: '',
    target_sectors: [] as number[],
    related_services: [] as string[],
  });

  const fetchData = React.useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await api.get('/admin/blog/', { 
        params: { page: pageNum, ...activeFilters } 
      });
      setData(res.data.results || res.data);
      setTotalCount(res.data.count || (res.data.results ? res.data.results.length : 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchDependencies = async () => {
    try {
      const [secRes, serRes] = await Promise.all([
        api.get('/admin/target-sectors/'),
        api.get('/services/') // Public services list is fine
      ]);
      setSectors(secRes.data.results || secRes.data);
      setServices(serRes.data.results || serRes.data);
    } catch (err) {
      console.error("Failed to fetch filter dependencies", err);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/admin/blog/${slug}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Only send scheduled_at if status is 'scheduled'
      if (payload.status !== 'scheduled') {
        (payload as any).scheduled_at = null;
      } else if (!payload.scheduled_at) {
        alert('Please select a date and time for scheduled posts.');
        return;
      }

      if (editingItem) {
        await api.patch(`/admin/blog/${editingItem.slug}/`, payload);
      } else {
        await api.post('/admin/blog/', payload);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ title: '', category: 'Insights', body: '', status: 'draft', scheduled_at: '', target_sectors: [], related_services: [] });
      fetchData();
    } catch (err: any) {
      console.error(err.response?.data);
      alert('Failed to save post. Ensure all required fields are filled.');
    }
  };

  const openEdit = (item: BlogPost) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      body: item.body,
      status: item.status,
      scheduled_at: item.scheduled_at ? new Date(item.scheduled_at).toISOString().slice(0, 16) : '',
      target_sectors: item.target_sectors || [],
      related_services: item.related_services || [],
    });
    setIsModalOpen(true);
  };

  const getWhatsAppLink = (post: BlogPost) => {
    const text = encodeURIComponent(`${post.title}\n\nRead more: https://connvotech.com/blog/${post.slug}`);
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-black">Blog & News</h1>
          <p className="text-gray-500 text-sm mt-1">Manage manual posts and AI-generated drafts. ({totalCount} total)</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
        >
          <Plus size={20} /> New Post
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 p-6 rounded-[30px] border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Filter Insights</h3>
           <button 
            onClick={() => setFilters({
              category: '', status: '', target_sectors: '', related_services: '', created_at__gte: '', created_at__lte: ''
            })}
            className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:underline"
           >
             Clear All
           </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
           <select 
            value={filters.category}
            onChange={e => setFilters({...filters, category: e.target.value})}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue"
           >
             <option value="">All Categories</option>
             <option value="Insights">Insights</option>
             <option value="Tech News">Tech News</option>
           </select>

           <select 
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue"
           >
             <option value="">All Statuses</option>
             <option value="draft">Draft</option>
             <option value="scheduled">Scheduled</option>
             <option value="published">Published</option>
           </select>

           <select 
            value={filters.target_sectors}
            onChange={e => setFilters({...filters, target_sectors: e.target.value})}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue"
           >
             <option value="">All Sectors</option>
             {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
           </select>

           <select 
            value={filters.related_services}
            onChange={e => setFilters({...filters, related_services: e.target.value})}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue"
           >
             <option value="">All Services</option>
             {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
           </select>

           <input 
            type="date"
            value={filters.created_at__gte}
            onChange={e => setFilters({...filters, created_at__gte: e.target.value})}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue"
            title="Created From"
           />

           <input 
            type="date"
            value={filters.created_at__lte}
            onChange={e => setFilters({...filters, created_at__lte: e.target.value})}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue"
            title="Created To"
           />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Post</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Category</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" /> Loading content...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-gray-400">No posts found.</td>
              </tr>
            ) : data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-4">
                  <p className="font-medium text-brand-black">{item.title}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                    <Calendar size={10} />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${item.category === 'Tech News' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-brand-blue'}`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-8 py-4">
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                     {item.status}
                   </span>
                </td>
                <td className="px-8 py-4 text-right space-x-2">
                  {item.status === 'published' && (
                    <a 
                      href={getWhatsAppLink(item)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      title="Share to WhatsApp Status"
                    >
                      <Share2 size={18} />
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

        {/* Pagination Controls */}
        {totalCount > 10 && (
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs font-bold uppercase tracking-widest text-brand-blue disabled:text-gray-300 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-gray-400">
              Page {page} of {Math.ceil(totalCount / 10)}
            </span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page * 10 >= totalCount}
              className="text-xs font-bold uppercase tracking-widest text-brand-blue disabled:text-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
             <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-display font-bold text-brand-black">
                  {editingItem ? 'Edit Post' : 'New Post'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-brand-black transition-colors">
                   <X size={24} />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-6 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Title</label>
                    <input 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all appearance-none"
                    >
                      <option value="Insights">Insights</option>
                      <option value="Tech News">Tech News</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Action</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className={`w-full border rounded-xl px-4 py-3 font-bold outline-none transition-all appearance-none ${
                        formData.status === 'published' ? 'bg-green-50 border-green-200 text-green-700' : 
                        formData.status === 'scheduled' ? 'bg-blue-50 border-blue-200 text-brand-blue' :
                        'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="scheduled">Schedule Post</option>
                      <option value="published">Approve & Publish</option>
                    </select>
                  </div>
                </div>

                {formData.status === 'scheduled' && (
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-blue-400">Scheduled Date & Time</label>
                        <input 
                          type="datetime-local"
                          value={formData.scheduled_at}
                          onChange={e => setFormData({...formData, scheduled_at: e.target.value})}
                          className="w-full bg-white border border-blue-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                          required={formData.status === 'scheduled'}
                        />
                      </div>
                      <div className="text-sm text-blue-800/60 max-w-xs">
                        <p className="font-medium">Automation will handle the rest.</p>
                        <p className="text-xs mt-1">The post will automatically transition to &apos;Published&apos; and trigger social media at the chosen time.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Target Sectors</label>
                     <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border border-gray-100 rounded-xl min-h-[60px]">
                        {sectors.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              const current = formData.target_sectors;
                              if (current.includes(s.id)) {
                                setFormData({...formData, target_sectors: current.filter(id => id !== s.id)});
                              } else {
                                setFormData({...formData, target_sectors: [...current, s.id]});
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${formData.target_sectors.includes(s.id) ? 'bg-brand-blue text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
                          >
                            {s.name}
                          </button>
                        ))}
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Related Services</label>
                     <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border border-gray-100 rounded-xl min-h-[60px]">
                        {services.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              const current = formData.related_services;
                              if (current.includes(s.id)) {
                                setFormData({...formData, related_services: current.filter(id => id !== s.id)});
                              } else {
                                setFormData({...formData, related_services: [...current, s.id]});
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${formData.related_services.includes(s.id) ? 'bg-brand-blue text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
                          >
                            {s.title}
                          </button>
                        ))}
                     </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Content</label>
                  <div className="prose-editor">
                    <RichTextEditor 
                      value={formData.body}
                      onChange={content => setFormData({...formData, body: content})}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 italic">Tip: Publishing will automatically trigger social media announcements.</p>
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
                    {editingItem ? 'Save Changes' : 'Create Post'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
