"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PageHeaderProps {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  withBackLink?: boolean;
  backLinkHref?: string;
  backLinkLabel?: string;
}

export default function PageHeader({ 
  badge, 
  title, 
  subtitle, 
  withBackLink = false,
  backLinkHref = "/",
  backLinkLabel = "Back to Home"
}: PageHeaderProps) {
  return (
    <div className="relative pt-40 pb-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-brand-blue/5 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {withBackLink ? (
             <Link 
               href={backLinkHref}
               className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-gray hover:text-brand-blue transition-all mb-10 group"
             >
               <div className="w-10 h-10 rounded-full border border-border-gray flex items-center justify-center group-hover:border-brand-blue transition-colors bg-white shadow-premium-soft">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
               </div>
               {backLinkLabel}
             </Link>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest mb-6">
              {badge}
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-display font-black text-brand-black mb-8 tracking-tighter leading-[1.1]">
            {title}
          </h1>
          <p className="text-xl text-text-gray max-w-3xl leading-relaxed font-medium">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
