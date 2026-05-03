"use client";

import React, { useState, useEffect } from 'react';
import { getBlogPosts, getSectors, getServices } from '@/lib/api';
import InsightsSection from '@/components/home/InsightsSection';
import PageHeader from '@/components/ui/PageHeader';
import { Filter, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
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
    getBlogPosts({ 
      page, 
      target_sectors: filters.sector,
      related_services: filters.service,
      category: filters.category
    }).then(data => {
      setPosts(data.results || data);
      setTotalCount(data.count || (data.results ? data.results.length : 0));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, filters]);

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Expert Insights"
        title={<>Solving <span className="text-gradient">Complex</span> Challenges</>}
        subtitle="Explore our deep-dives into industry problems and how Connvotech delivers strategic technical solutions."
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
             <p className="font-bold uppercase tracking-widest text-[10px]">Loading Insights...</p>
          </div>
        ) : (
          <>
            <InsightsSection posts={posts} hideHeading={true} />
            
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
    </main>
  );
}

