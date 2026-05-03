"use client";

import React, { useEffect, useState } from 'react';
import { getBlogPosts } from '@/lib/api';
import { BlogPost } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Newspaper, Clock, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { getMediaUrl } from '@/lib/utils';

export default function NewsPage() {
  const [news, setNews] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts({ category: 'Tech News' }).then(res => {
      setNews(res.results || res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        badge="Daily Tech Pulse"
        title={<>Global <span className="text-gradient">ICT & Tech</span> News</>}
        subtitle="Stay updated with tech news and insights from the global tech landscape, optimized for global future alignments."
      />
      <div className="max-w-7xl mx-auto px-6 pb-24">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-gray-50 rounded-[32px] animate-pulse"></div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No news updates yet. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-gray-50 hover:bg-white rounded-[40px] border border-gray-100 hover:shadow-2xl hover:shadow-brand-blue/10 transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.external_image_url && item.external_image_url.startsWith('http') ? item.external_image_url : getMediaUrl(item.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800')}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-blue/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                      <Clock size={12} />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-display font-bold text-brand-black mb-4 group-hover:text-brand-blue transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="inline-flex items-center gap-2 text-brand-blue font-bold text-sm hover:underline mt-4"
                  >
                    Read Full Update
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
