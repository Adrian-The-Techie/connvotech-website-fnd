"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Target, CheckCircle2 } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';
import SectionHeading from '../ui/SectionHeading';

interface InsightsSectionProps {
  posts: BlogPost[];
  hideHeading?: boolean;
}

export default function InsightsSection({ posts, hideHeading = false }: InsightsSectionProps) {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden" id="insights">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-[30%] h-[30%] bg-brand-blue/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {!hideHeading && (
          <SectionHeading 
            badge="Expert Insights"
            title="Solving Complex Challenges"
            subtitle="Explore our deep-dives into industry problems and how Connvotech delivers strategic technical solutions."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Array.isArray(posts) && posts.map((post, i) => (
            <InsightCard key={post.id} post={post} index={i} />
          ))}
          {!Array.isArray(posts) && (
            <div className="col-span-full py-20 text-center text-text-gray font-medium">
              No insights available at the moment.
            </div>
          )}
        </div>

        <div className="mt-20 text-center">
          <Link 
            href="/blog" 
            className="group inline-flex items-center gap-4 bg-primary-gradient text-white px-12 py-5 rounded-2xl font-bold transition-all duration-300 shadow-premium-soft hover:shadow-glow hover:-translate-y-1"
          >
            Explore All Case Studies
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function InsightCard({ post, index }: { post: BlogPost; index: number }) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white flex flex-col h-full hover:-translate-y-2 transition-all duration-500"
      >
        <div className="relative h-64 rounded-[40px] overflow-hidden mb-8 shadow-premium-soft group-hover:shadow-premium-card transition-all duration-500 border border-border-gray p-2 bg-white">
          <div className="relative w-full h-full rounded-[32px] overflow-hidden">
            <Image 
              src={post.external_image_url && post.external_image_url.startsWith('http') ? post.external_image_url : getMediaUrl(post.cover_image || "/placeholder.jpg")} 
              alt={post.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-blue/20 transition-colors duration-500"></div>
            <div className="absolute top-6 left-6">
              <span className="bg-white/90 backdrop-blur-md text-brand-blue text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full shadow-premium-soft border border-brand-blue/10">
                {post.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="px-2 flex-1 flex flex-col">
          <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-gray mb-3">
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-brand-blue" />
              {date}
            </span>
            {post.author && (
              <span className="flex items-center gap-2">
                <User size={14} className="text-brand-blue" />
                {post.author.first_name || post.author.username}
              </span>
            )}
          </div>

          <h3 className="text-lg md:text-xl font-display font-black text-brand-black mb-4 group-hover:text-brand-blue transition-colors leading-[1.1] tracking-tight line-clamp-2">
            {post.title}
          </h3>

          {/* Sectors & Services Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.target_sectors?.slice(0, 2).map((s: any) => (
              <span key={s.id} className="text-[9px] font-bold uppercase tracking-wider bg-soft-gray text-text-gray px-2 py-1 rounded-md border border-border-gray">
                #{s.name.replace(/\s+/g, '')}
              </span>
            ))}
            {post.related_services?.slice(0, 2).map((s: any) => (
              <span key={s.id} className="text-[9px] font-bold uppercase tracking-wider bg-brand-blue/5 text-brand-blue px-2 py-1 rounded-md border border-brand-blue/10">
                #{s.title.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
          
          {/* Problem/Solution Preview */}
          <div className="space-y-4 mb-10 flex-1">
            <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-soft-gray border border-border-gray flex items-center justify-center shrink-0">
                  <Target size={18} className="text-amber-600" />
                </div>
                <p className="text-sm text-text-gray font-medium leading-relaxed italic line-clamp-2">
                  {post.excerpt || "Analyzing technical barriers to digital efficiency."}
                </p>
            </div>
            <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-soft-gray border border-border-gray flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-brand-blue" />
                </div>
                <p className="text-sm text-brand-black font-black leading-relaxed line-clamp-2">
                  Strategic Solution by Connvotech
                </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 text-brand-blue font-black text-[10px] uppercase tracking-widest group/btn bg-brand-blue/5 px-6 py-3 rounded-full self-start group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 border border-brand-blue/10">
            View Case Study
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
