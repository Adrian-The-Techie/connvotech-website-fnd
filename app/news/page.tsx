"use client";

import React, { useEffect, useState } from 'react';
import { getBlogPosts, getSectors, getServices } from '@/lib/api';
import { BlogPost } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Newspaper, Clock, ArrowRight, Filter, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { getMediaUrl } from '@/lib/utils';

export default function NewsPage() {
  const [news, setNews] = useState<BlogPost[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    sector: '',
    service: '',
    category: '',
  });

  useEffect(() => {
    Promise.all([getSectors(), getServices()]).then(([sec, ser]) => {
      setSectors(sec.results || sec);
      setServices(ser.results || ser);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { page };
    if (filters.category) params.category = filters.category;
    if (filters.sector) params.target_sectors = filters.sector;
    if (filters.service) params.related_services = filters.service;

    getBlogPosts(params).then(data => {
      setNews(data.results || data);
      setTotalCount(data.count || (data.results ? data.results.length : 0));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, filters]);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        badge="Daily Tech Pulse"
        title={<>Global <span className="text-gradient">ICT & Tech</span> News</>}
        subtitle="Stay updated with tech news and insights from the global tech landscape, optimized for global future alignments."
      />
      <div className="max-w-7xl mx-auto px-6 pb-24">

        {/* Filters */}
        <div className="mb-12 flex flex-wrap items-center gap-4 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
           <div className="flex items-center gap-2 text-brand-blue mr-4">
              <Filter size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Filter By</span>
           </div>
           
           <select 
             value={filters.sector}
             onChange={e => { setFilters({...filters, sector: e.target.value}); setPage(1); }}
             className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-brand-blue transition-all"
           >
             <option value="">All Sectors</option>
             {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
           </select>

           <select 
             value={filters.service}
             onChange={e => { setFilters({...filters, service: e.target.value}); setPage(1); }}
             className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-brand-blue transition-all"
           >
             <option value="">All Services</option>
             {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
           </select>

           <select 
             value={filters.category}
             onChange={e => { setFilters({...filters, category: e.target.value}); setPage(1); }}
             className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-brand-blue transition-all"
           >
             <option value="">All Categories</option>
             <option value="Insights">Insights</option>
             <option value="Tech News">Tech News</option>
           </select>

           {(filters.sector || filters.service || filters.category) && (
             <button 
               onClick={() => { setFilters({ sector: '', service: '', category: '' }); setPage(1); }}
               className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 ml-auto"
             >
               <X size={14} /> Clear
             </button>
           )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
             <Loader2 className="animate-spin mb-4" size={32} />
             <p className="font-bold uppercase tracking-widest text-[10px]">Loading News...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No news updates yet. Check back later!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, i) => (
                <Link key={item.id} href={`/blog/${item.slug}`} className="block h-full group">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[32px] border border-border-gray overflow-hidden hover:shadow-premium-card transition-all duration-500 h-full flex flex-col hover:-translate-y-2"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.external_image_url && item.external_image_url.startsWith('http') ? item.external_image_url : getMediaUrl(item.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800')}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{item.category}</span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-gray mb-4">
                          <Clock size={12} className="text-brand-blue" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                        <h3 className="text-lg font-display font-black text-brand-black group-hover:text-brand-blue transition-colors leading-tight line-clamp-3 mb-6">
                          {item.title}
                        </h3>
                      </div>
                      <div className="inline-flex items-center gap-2 text-brand-blue font-black text-[10px] uppercase tracking-widest group-hover:underline">
                        Read Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalCount > 10 && (
              <div className="mt-16 flex items-center justify-center gap-8">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-12 h-12 rounded-full border border-border-gray flex items-center justify-center text-brand-black disabled:opacity-30 hover:bg-soft-gray transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-black uppercase tracking-widest text-text-gray">
                  Page {page} of {Math.ceil(totalCount / 10)}
                </span>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 10 >= totalCount}
                  className="w-12 h-12 rounded-full border border-border-gray flex items-center justify-center text-brand-black disabled:opacity-30 hover:bg-soft-gray transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
