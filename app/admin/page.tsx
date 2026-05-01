"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ConciergeBell, 
  Briefcase, 
  FileText, 
  Mail, 
  Target, 
  Zap,
  Loader2,
  Users
} from 'lucide-react';
import api from '@/lib/api';

interface Stats {
  services: number;
  projects: number;
  insights: number;
  news_drafts: number;
  published_news: number;
  unread_contacts: number;
  active_sectors: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats/');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Solutions & Insights', value: stats?.insights || 0, icon: FileText, color: 'bg-blue-600', href: '/admin/insights' },
    { name: 'News Drafts', value: stats?.news_drafts || 0, icon: Zap, color: 'bg-amber-500', href: '/admin/insights' },
    { name: 'Active Sectors', value: stats?.active_sectors || 0, icon: Target, color: 'bg-brand-black', href: '/admin/sectors' },
    { name: 'Client Inquiries', value: stats?.unread_contacts || 0, icon: Mail, color: 'bg-green-600', href: '/admin/contact', unread: (stats?.unread_contacts || 0) > 0 },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium text-center">Loading platform analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-black">Platform Overview</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Real-time performance and strategy metrics.</p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-full border border-green-100 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card) => (
          <Link href={card.href} key={card.name} className="group bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 md:mb-6">
               <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-white ${card.color} shadow-lg`}>
                 <card.icon size={20} className="md:w-6 md:h-6" />
               </div>
               {card.unread && (
                 <span className="flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                 </span>
               )}
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{card.name}</p>
            <p className="text-2xl md:text-4xl font-display font-bold text-brand-black mt-1 md:mt-2">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
         <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 md:mb-10">
               <h3 className="text-xl md:text-2xl font-display font-bold text-brand-black">AI Content Pulse</h3>
               <Link href="/admin/insights" className="text-xs md:text-sm font-bold text-brand-blue hover:underline">Manage All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
               <div className="p-5 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total News Published</p>
                  <p className="text-2xl md:text-3xl font-display font-bold text-brand-black">{stats?.published_news}</p>
                  <div className="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-blue w-[65%]"></div>
                  </div>
               </div>
               <div className="p-5 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Strategy Sectors</p>
                  <p className="text-2xl md:text-3xl font-display font-bold text-brand-black">{stats?.active_sectors}</p>
                  <div className="mt-4 flex gap-2">
                     {[1, 2, 3].map(i => <div key={i} className="w-6 md:w-8 h-2 bg-brand-black/10 rounded-full"></div>)}
                     <div className="w-6 md:w-8 h-2 bg-brand-blue rounded-full"></div>
                  </div>
               </div>
            </div>

            <div className="mt-8 md:mt-12 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-dashed border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                     <Zap size={20} />
                  </div>
                  <div className="text-center sm:text-left">
                     <p className="font-bold text-sm">Automated News Pipeline</p>
                     <p className="text-[10px] md:text-xs text-gray-400">Next crawl scheduled in ~45 minutes</p>
                  </div>
               </div>
               <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
            </div>
         </div>

         <div className="bg-brand-black p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl text-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl"></div>
            <h3 className="text-xl md:text-2xl font-display font-bold mb-6 md:mb-8 relative z-10">Infrastructure</h3>
            <div className="space-y-6 md:space-y-8 relative z-10">
               <StatusItem label="Database" status="Connected" />
               <StatusItem label="Storage (S3)" status="Cloud" />
               <StatusItem label="AI Engine" status="Gemini 1.5" />
               <StatusItem label="Social API" status="LinkedIn" />
            </div>
            
            <div className="mt-8 md:mt-12 p-5 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border border-white/10">
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">System Load</p>
               <p className="text-lg md:text-xl font-display font-bold">Optimal</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string, status: string }) {
   return (
      <div className="flex justify-between items-center">
         <span className="text-xs md:text-sm text-white/60">{label}</span>
         <span className="text-[10px] md:text-xs font-bold px-3 py-1 bg-white/10 rounded-full">{status}</span>
      </div>
   );
}
