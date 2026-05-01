"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Project } from '@/lib/types';
import { Plus, Edit, Trash2, X, Check, Loader2, Star } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminPortfolioPage() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    short_description: '',
    long_description: '',
    is_featured: false,
    github_link: '',
    live_link: '',
    thumbnail: null,
    client_logo: null
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/portfolio/');
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
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/admin/portfolio/${slug}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      const val = (formData as any)[key];
      if (key === 'thumbnail' || key === 'client_logo') {
        if (val instanceof FileList && val[0]) {
          data.append(key, val[0]);
        }
      } else if (val !== null && val !== undefined) {
        data.append(key, val);
      }
    });

    try {
      if (editingItem) {
        await api.patch(`/admin/portfolio/${editingItem.slug}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/portfolio/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ 
        title: '', 
        short_description: '', 
        long_description: '', 
        is_featured: false, 
        github_link: '', 
        live_link: '',
        thumbnail: null,
        client_logo: null
      });
      fetchData();
    } catch (err) {
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item: Project) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      short_description: item.short_description,
      long_description: item.long_description,
      is_featured: item.is_featured,
      github_link: item.project_url || '', // Backend model has project_url
      live_link: item.project_url || '',   // Mapping project_url
      thumbnail: null,
      client_logo: null
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-brand-black">Portfolio Projects</h1>
        <button 
          onClick={() => { 
            setEditingItem(null); 
            setFormData({ 
              title: '', 
              short_description: '', 
              long_description: '', 
              is_featured: false, 
              github_link: '', 
              live_link: '',
              thumbnail: null,
              client_logo: null
            }); 
            setIsModalOpen(true); 
          }}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Project</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Featured</th>
              <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && !isModalOpen ? (
              <tr>
                <td colSpan={3} className="px-8 py-12 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" /> Loading portfolio...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-8 py-12 text-center text-gray-400">No projects found.</td>
              </tr>
            ) : data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    {item.client_logo && (
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                         <img src={item.client_logo} alt="" className="w-full h-full object-contain p-1" />
                      </div>
                    )}
                    <span className="font-medium text-brand-black">{item.title}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  {item.is_featured ? <Star className="text-amber-500 fill-amber-500" size={16} /> : "-"}
                </td>
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
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
             <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-display font-bold text-brand-black">
                  {editingItem ? 'Edit Project' : 'Add New Project'}
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
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Featured</label>
                    <div className="flex items-center h-[52px]">
                      <input 
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                      />
                      <span className="ml-2 text-sm text-gray-600 font-medium">Highlight on Home Page</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Thumbnail (Main Image)</label>
                    <div className="flex items-center gap-4">
                       <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                          {editingItem?.thumbnail && !formData.thumbnail ? (
                            <img src={editingItem.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400 text-center p-2">No Image</span>
                          )}
                       </div>
                       <input 
                        type="file" 
                        onChange={e => setFormData({...formData, thumbnail: e.target.files})}
                        className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 transition-all cursor-pointer" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Client Logo (Overlay)</label>
                    <div className="flex items-center gap-4">
                       <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                          {editingItem?.client_logo && !formData.client_logo ? (
                            <img src={editingItem.client_logo} alt="" className="w-full h-full object-contain p-2" />
                          ) : (
                            <span className="text-[10px] text-gray-400 text-center p-2">No Logo</span>
                          )}
                       </div>
                       <input 
                        type="file" 
                        onChange={e => setFormData({...formData, client_logo: e.target.files})}
                        className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 transition-all cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Live Link / Project URL</label>
                    <input 
                      value={formData.live_link}
                      onChange={e => setFormData({...formData, live_link: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Short Description</label>
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
                    disabled={loading}
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-brand-blue text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-blue-dark transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                    {editingItem ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
