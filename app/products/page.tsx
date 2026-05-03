import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Cpu, Check, ArrowLeft } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import PageHeader from '@/components/ui/PageHeader';

export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage() {
  let products: Product[] = [];
  
  try {
    const data = await getProducts();
    products = data.results || data;
  } catch (err) {
    console.error("Failed to fetch products", err);
  }

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Product Ecosystem"
        title={<>The <span className="text-gradient">Ecosystem.</span></>}
        subtitle="Discover our suite of enterprise-grade software solutions, designed to optimize your operations, secure your data, and scale your business globally."
      />
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">

        {/* Product List */}
        <div className="space-y-40">
          {products.map((product, idx) => (
            <div 
              key={product.id} 
              className={`flex flex-col lg:flex-row gap-20 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Product Visual */}
              <div className="flex-1 w-full">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden shadow-premium-card border border-border-gray group bg-white p-3">
                     <div className="relative w-full h-full rounded-[36px] overflow-hidden">
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
                    <div className="absolute top-8 left-8 flex gap-2">
                       {product.is_coming_soon ? (
                          <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg animate-pulse border border-white/20">
                            Coming Soon
                          </span>
                       ) : (
                          <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg border border-white/20">
                            Live Now
                          </span>
                       )}
                    </div>
                  </div>
                </Link>
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-10">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">
                       {product.tagline}
                    </p>
                    <Link href={`/products/${product.slug}`}>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-black text-brand-black leading-[0.9] tracking-tighter hover:text-brand-blue transition-colors">
                         {product.name}
                      </h2>
                    </Link>
                 </div>

                <div 
                  className="text-lg text-text-gray leading-relaxed font-medium prose-sm max-w-none line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {product.features_list.map((feature, fidx) => (
                     <div key={fidx} className="flex items-start gap-4 p-5 rounded-2xl bg-brand-bg border border-border-gray shadow-sm group/feature">
                        <div className="w-6 h-6 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue shrink-0 border border-brand-blue/10 group-hover/feature:bg-brand-blue group-hover/feature:text-white transition-all">
                           <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-bold text-brand-black leading-tight">{feature}</span>
                     </div>
                   ))}
                </div>

                <div className="flex flex-col gap-3 pt-6 w-full max-w-md">
                    <Link 
                      href={`/products/${product.slug}`}
                      className="px-8 py-4 rounded-2xl border border-border-gray font-bold text-text-gray flex items-center justify-center gap-2 hover:bg-soft-gray transition-all shadow-premium-soft bg-white text-xs uppercase tracking-widest whitespace-nowrap"
                    >
                       View More <ExternalLink size={16} className="shrink-0" />
                    </Link>
                    <Link 
                      href={`/contact?type=product&id=${product.slug || product.id}&name=${encodeURIComponent(product.name)}&intent=${product.is_coming_soon ? 'notify' : 'access'}`}
                      className={`${product.is_coming_soon ? 'bg-brand-black' : 'bg-primary-gradient'} text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-premium-soft hover:shadow-glow hover:-translate-y-1 transition-all text-xs uppercase tracking-widest whitespace-nowrap`}
                    >
                       {product.is_coming_soon ? 'Get Notified' : 'Request Access'} <ChevronRight size={18} className="shrink-0" />
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-40 p-12 md:p-24 rounded-[64px] bg-brand-bg border border-border-gray text-center relative overflow-hidden shadow-premium-card">
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 blur-[120px] rounded-full"></div>
           <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-black mb-8 leading-[0.9] tracking-tighter text-brand-black">
                Ready to build something <span className="text-gradient">Custom?</span>
              </h2>
              <p className="text-text-gray text-xl max-w-2xl mx-auto mb-12 font-medium">
                Our products are just the beginning. We also build bespoke solutions tailored specifically to your unique workflow.
              </p>
              <Link 
                href={`/contact?type=service&id=bespoke-solution&name=Bespoke+Consultation&intent=service`}
                className="bg-primary-gradient text-white px-12 py-6 rounded-2xl text-xl font-black transition-all shadow-premium-soft hover:shadow-glow hover:-translate-y-1 relative z-10"
              >
                Schedule a Consultation <ChevronRight size={24} />
              </Link>
           </div>
        </div>
      </div>
    </main>
  );
}
