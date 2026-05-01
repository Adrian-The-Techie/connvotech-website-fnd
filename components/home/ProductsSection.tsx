"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Cpu, Shield, Zap, Check, ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data.results || data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section id="products" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-blue/5 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-4">
              <Zap size={14} className="animate-pulse" />
              Our Ecosystem
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-brand-black leading-tight tracking-tighter">
              Enterprise <span className="text-gradient">Digital Products</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-text-gray max-w-sm text-left md:text-right font-medium">
              Scalable, secure, and ready-to-deploy software solutions tailored for your business growth.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all text-sm uppercase tracking-widest"
            >
              View Full Ecosystem <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, idx) => (
            <div 
              key={product.id}
              className="group bg-white rounded-[40px] border border-border-gray p-3 shadow-premium-soft hover:shadow-premium-card transition-all duration-500 hover:-translate-y-2 flex flex-col"
            >
              <div className="relative h-64 rounded-[32px] overflow-hidden mb-8">
                {product.image_url ? (
                  <Image 
                    src={product.image_url} 
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                   <div className="w-full h-full bg-soft-gray flex items-center justify-center">
                      <Cpu className="text-slate-300" size={48} />
                   </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                   <div className="flex gap-2">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                        {product.tech_stack.split(',')[0]}
                      </span>
                   </div>
                </div>
              </div>

              <div className="px-5 pb-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-2xl font-display font-bold text-brand-black group-hover:text-brand-blue transition-colors">
                    {product.name}
                  </h3>
                  {product.price_starting_at && (
                    <div className="text-right">
                      <p className="text-[10px] text-text-gray font-bold uppercase tracking-widest">Starting at</p>
                      <p className="text-lg font-display font-bold text-brand-blue">${product.price_starting_at}</p>
                    </div>
                  )}
                </div>
                
                <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-4">
                  {product.tagline}
                </p>
                
                <p className="text-text-gray text-sm line-clamp-2 mb-8 font-medium">
                  {product.description}
                </p>

                <div className="space-y-3 mb-10">
                   {product.features_list.slice(0, 3).map((feature, fidx) => (
                     <div key={fidx} className="flex items-center gap-3 text-sm text-text-gray font-medium">
                        <div className="w-5 h-5 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue border border-brand-blue/10">
                           <Check size={12} strokeWidth={3} />
                        </div>
                        {feature}
                     </div>
                   ))}
                </div>

                <div className="flex gap-3 mt-auto">
                   <Link 
                    href="/products"
                    className="flex-1 bg-primary-gradient text-white px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-premium-soft hover:shadow-glow transition-all"
                   >
                      Learn More <ChevronRight size={16} />
                   </Link>
                   {product.demo_url && (
                     <a 
                      href={product.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl border border-border-gray flex items-center justify-center text-text-gray hover:text-brand-blue hover:bg-soft-gray transition-all"
                     >
                        <ExternalLink size={20} />
                     </a>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
