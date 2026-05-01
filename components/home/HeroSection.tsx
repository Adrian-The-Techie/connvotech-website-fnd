"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Laptop, Sparkles, Globe, Shield } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  headline: string;
  subheadline: string;
}

export default function HeroSection({ headline, subheadline }: HeroProps) {
  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden py-24 px-6">
      {/* Refined Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(248,250,252,1),transparent_70%)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-sm">
              <Sparkles size={14} className="text-brand-blue animate-pulse" />
              <span>Leading ICT Consultancy in Nairobi</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-black text-brand-black leading-[0.9] mb-8 tracking-tighter">
              {headline?.split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase() === 'bespoke' || word.toLowerCase() === 'growing' ? "text-gradient" : ""}>
                  {word}{' '}
                </span>
              )) || (
                <>
                  <span className="text-gradient">Bespoke</span> ICT Solutions for <span className="text-gradient">Growing</span> Enterprises
                </>
              )}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-gray text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto lg:ml-0 font-medium"
          >
            {subheadline || "We provide cutting-edge software development, cloud infrastructure, and ICT consultancy to help your business scale in the digital age."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start"
          >
            <Link 
              href="/services" 
              className="group w-full sm:w-auto bg-primary-gradient text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-premium-soft hover:shadow-glow hover:-translate-y-1"
            >
              Explore Our Services
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/portfolio" 
              className="w-full sm:w-auto bg-white border border-border-gray hover:bg-soft-gray text-brand-black px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
            >
              View Our Work
              <ChevronRight size={20} />
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex flex-wrap justify-center lg:justify-start gap-8"
          >
            <div className="flex items-center gap-2 text-text-gray font-bold text-[10px] uppercase tracking-widest px-4 py-2 bg-soft-gray rounded-full border border-border-gray">
              <Globe size={16} className="text-brand-blue" /> Global Standards
            </div>
            <div className="flex items-center gap-2 text-text-gray font-bold text-[10px] uppercase tracking-widest px-4 py-2 bg-soft-gray rounded-full border border-border-gray">
              <Shield size={16} className="text-brand-accent" /> Secure Infrastructure
            </div>
          </motion.div>
        </div>

        {/* Right Decorative Element */}
        <div className="lg:col-span-5 hidden lg:block relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative perspective-1000"
          >
             {/* Main Glass Card */}
             <div className="relative z-10 w-full aspect-[4/5] bg-white/40 backdrop-blur-3xl border border-white/20 rounded-[48px] p-10 flex flex-col justify-between shadow-premium-card overflow-hidden group">
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center shadow-premium-soft group-hover:rotate-6 transition-transform duration-500">
                    <Laptop className="text-white" size={32} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-1">System Health</p>
                    <p className="text-3xl font-display font-bold text-brand-black tracking-tighter">99.9%</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                   <div className="space-y-3">
                      <div className="w-1/2 h-2 bg-brand-blue/10 rounded-full"></div>
                      <div className="w-full h-8 bg-soft-gray/50 rounded-2xl border border-border-gray"></div>
                      <div className="w-4/5 h-8 bg-soft-gray/50 rounded-2xl border border-border-gray"></div>
                   </div>
                   <div className="p-8 bg-white rounded-[32px] border border-border-gray shadow-premium-soft">
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-[10px] font-bold text-text-gray uppercase tracking-widest">Growth Analytics</span>
                         <span className="text-sm font-bold text-brand-blue">+24%</span>
                      </div>
                      <div className="flex items-end gap-2 h-24">
                         {[40, 60, 45, 90, 65, 80, 55].map((h, i) => (
                           <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 1.5 + (i * 0.1), duration: 1 }}
                            className={`flex-1 ${i === 3 ? 'bg-brand-blue' : 'bg-soft-gray'} rounded-sm`}
                           ></motion.div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="flex justify-between items-center relative z-10">
                   <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-soft-gray overflow-hidden">
                           <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="" />
                        </div>
                      ))}
                   </div>
                   <div className="px-4 py-2 bg-soft-gray border border-border-gray rounded-full">
                      <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Active Solutions</span>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-gray">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-blue to-transparent"></div>
      </motion.div>
    </section>
  );
}
