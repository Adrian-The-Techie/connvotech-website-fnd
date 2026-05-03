import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Cpu, Check, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/api';
import { Product } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product: Product = await getProductBySlug(params.slug).catch(() => null);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Connvotech Products`,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.image_url ? [product.image_url] : [],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product: Product = await getProductBySlug(params.slug).catch(() => null);

  if (!product) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h1 className="text-3xl font-display font-bold mb-4 tracking-tighter">Product Not Found</h1>
        <Link href="/products" className="text-brand-blue font-bold">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 bg-white relative overflow-hidden">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[350px] bg-brand-bg flex items-center justify-center border-b border-border-gray">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-brand-blue/5 blur-[120px] rounded-full"></div>

        <div className="max-w-4xl text-center relative z-10 px-6">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-gray hover:text-brand-blue transition-all mb-8 group"
          >
            <div className="w-10 h-10 rounded-full border border-border-gray flex items-center justify-center group-hover:border-brand-blue transition-colors bg-white shadow-premium-soft">
              <ArrowLeft size={16} />
            </div>
            Back to Products
          </Link>
          <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] mb-4">
             {product.tagline}
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-brand-black mb-6 tracking-tighter leading-[0.9]">
            {product.name}
          </h1>
          <div className="flex justify-center gap-2">
             {product.is_coming_soon ? (
                <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg border border-white/20">
                  Coming Soon
                </span>
             ) : (
                <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg border border-white/20">
                  Live Now
                </span>
             )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-premium-card border border-border-gray group bg-white p-2">
               <div className="relative w-full h-full rounded-[32px] overflow-hidden">
                {product.image_url ? (
                   <Image 
                    src={product.image_url} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full bg-soft-gray flex items-center justify-center">
                    <Cpu className="text-slate-300" size={64} />
                  </div>
                )}
               </div>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
              <h2 className="text-xl md:text-2xl font-display font-black text-brand-black mb-8 tracking-tighter">Product Description</h2>
              <div 
                className="text-text-gray font-medium leading-[1.7] text-base"
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-brand-bg p-8 rounded-[40px] border border-border-gray shadow-premium-card sticky top-32">
               <h3 className="text-xl font-display font-black text-brand-black mb-8 tracking-tight border-b border-border-gray pb-4">Key Features</h3>
               <div className="space-y-4">
                  {product.features_list && product.features_list.length > 0 ? (
                    product.features_list.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border-gray shadow-sm">
                        <div className="w-5 h-5 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue shrink-0 border border-brand-blue/10">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-bold text-brand-black leading-tight">{feature}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-gray font-medium italic">No features listed.</p>
                  )}
               </div>

               {product.tech_stack && (
                 <div className="mt-10 pt-8 border-t border-border-gray space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-gray mb-2">Technology Stack</p>
                    <div className="flex flex-wrap gap-2">
                       {product.tech_stack.split(',').map((tech, i) => (
                         <span key={i} className="px-3 py-1 bg-white border border-border-gray rounded-full text-[9px] font-bold text-brand-blue shadow-sm">
                            {tech.trim()}
                         </span>
                       ))}
                    </div>
                 </div>
               )}

               <div className="pt-10">
                  <Link 
                    href={`/contact?type=product&id=${product.slug || product.id}&name=${encodeURIComponent(product.name)}&intent=${product.is_coming_soon ? 'notify' : 'access'}`}
                    className={`w-full ${product.is_coming_soon ? 'bg-brand-black' : 'bg-primary-gradient'} text-white py-4 rounded-xl flex items-center justify-center font-bold gap-3 shadow-premium-soft hover:shadow-glow hover:-translate-y-1 transition-all text-sm`}
                  >
                    {product.is_coming_soon ? 'Get Notified' : 'Request Access'}
                    <ChevronRight size={16} />
                  </Link>
                  {product.demo_url && (
                    <a 
                      href={product.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full border border-border-gray text-text-gray py-4 rounded-xl flex items-center justify-center font-bold gap-3 mt-3 hover:bg-soft-gray transition-all text-sm bg-white"
                    >
                      Live Demo
                      <ExternalLink size={16} />
                    </a>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
