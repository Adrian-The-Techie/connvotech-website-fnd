"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, X, Check, Loader2, Target, Info } from 'lucide-react';

interface Sector {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export default function AdminSectorsPage() {
  const [data, setData] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/target-sectors/');
      // Handle both paginated and non-paginated responses
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this sector? AI will no longer target it.')) return;
    try {
      await api.delete(`/admin/target-sectors/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete sector');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/target-sectors/', formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', is_active: true });
      fetchData();
    } catch (err) {
      alert('Failed to save sector');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-black">Strategy & Sectors</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl">
            Define the industries Connvotech solves problems in. These sectors are used by the AI Content Engine 
            to generate targeted Insights and crawl relevant tech news.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-blue/20"
        >
          <Plus size={20} /> Add Sector
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            <Loader2 className="animate-spin mx-auto mb-2" />
            Loading strategy data...
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
            <Target className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-medium">No target sectors defined yet.</p>
            <p className="text-gray-400 text-sm">Add your first sector to start steering the AI engine.</p>
          </div>
        ) : data.map(item => (
          <div key={item.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-2 h-full ${item.is_active ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue">
                  <Target size={24} />
               </div>
               <button 
                 onClick={() => handleDelete(item.id)}
                 className="p-2 text-gray-300 hover:text-red-500 transition-colors"
               >
                 <Trash2 size={18} />
               </button>
            </div>

            <h3 className="text-xl font-display font-bold text-brand-black mb-2">{item.name}</h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-6">{item.description || "Solving high-stakes technical problems in this industry."}</p>
            
            <div className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                 {item.is_active ? 'Active Strategy' : 'Paused'}
               </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-[30px] border border-blue-100 flex gap-4 items-start">
         <Info className="text-brand-blue shrink-0 mt-1" size={20} />
         <div>
            <p className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-1">AI Behavior Tip</p>
            <p className="text-sm text-blue-700/80 leading-relaxed">
              When the News Crawler runs every hour, it will pick one of these sectors to bias its search. 
              The AI Writer will then frame the &quot;Challenge&quot; and &quot;Solution&quot; specifically around this industry&apos;s unique needs.
            </p>
         </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-display font-bold text-brand-black">Add Target Sector</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-brand-black transition-colors">
                   <X size={24} />
                </button>
             </div>
             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Sector Name</label>
                  <input 
                    placeholder="e.g. Healthcare, Finance..."
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Strategy Description</label>
                  <textarea 
                    placeholder="Briefly describe the focus..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue outline-none transition-all h-24"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-blue-dark transition-all shadow-lg shadow-brand-blue/20"
                >
                  <Check size={20} />
                  Save Sector
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
