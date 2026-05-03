"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BlogPost } from '@/lib/types';
import { Plus, Edit, Trash2, X, Check, Loader2, Calendar, Share2 } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminBlogPage() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    body: '',
    status: 'draft',
  });

  const fetchData = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/blog/', { params: { page: pageNum } });
      setData(res.data.results || res.data);
      setTotalCount(res.data.count || (res.data.results ? res.data.results.length : 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

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
      if (editingItem) {
        await api.patch(`/admin/blog/${editingItem.slug}/`, formData);
      } else {
        await api.post('/admin/blog/', formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ title: '', category: 'General', body: '', status: 'draft' });
      fetchData();
    } catch (err) {
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
                      <option value="General">General</option>
                      <option value="Systems">Systems</option>
                      <option value="Web Dev">Web Dev</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Design">Design</option>
                      <option value="Tech News">Tech News</option>
                      <option value="Insights">Insights</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Action</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className={`w-full border rounded-xl px-4 py-3 font-bold outline-none transition-all appearance-none ${formData.status === 'published' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="published">Approve & Publish</option>
                    </select>
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
