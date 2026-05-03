import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Cpu, Check, ArrowRight, Clock } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';
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

        {/* Product Grid - Portfolio Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-white rounded-[40px] border border-border-gray p-3 shadow-premium-soft hover:shadow-premium-card transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              <div className="relative h-64 rounded-[32px] overflow-hidden mb-8 shrink-0">
                {product.image_url ? (
                  <Image
                    src={getMediaUrl(product.image_url)}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-soft-gray flex items-center justify-center">
                    <Cpu className="text-slate-300" size={48} />
                  </div>
                )}

                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  {product.is_coming_soon ? (
                    <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                      Live Now
                    </span>
                  )}
                </div>
              </div>

              <div className="px-5 pb-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-display font-bold text-brand-black group-hover:text-brand-blue transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[9px] font-black text-brand-accent uppercase tracking-widest">
                      {product.tagline}
                    </p>
                  </div>
                </div>

                <div 
                  className="text-text-gray text-xs line-clamp-3 mb-8 font-medium leading-relaxed prose-sm"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                <div className="space-y-3 mb-8 mt-auto">
                  {product.features_list?.slice(0, 3).map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-3 text-xs text-text-gray font-medium">
                      <div className="w-5 h-5 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue border border-brand-blue/10">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-brand-blue font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Discover Product <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-40 p-12 md:p-24 rounded-[64px] bg-brand-bg border border-border-gray text-center relative overflow-hidden shadow-premium-card">
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 blur-[120px] rounded-full"></div>
           <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-black mb-8 leading-[0.9] tracking-tighter text-brand-black">
                Ready to build something <span className="text-gradient">Custom?</span>
              </h2>
              <p className="text-text-gray text-lg max-w-2xl mx-auto mb-12 font-medium">
                Our products are just the beginning. We also build bespoke solutions tailored specifically to your unique workflow.
              </p>
              <Link 
                href={`/contact?type=service&id=bespoke-solution&name=Bespoke+Consultation&intent=service`}
                className="bg-primary-gradient text-white px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-premium-soft hover:shadow-glow hover:-translate-y-1 relative z-10 inline-flex items-center gap-3"
              >
                Schedule a Consultation <ChevronRight size={20} />
              </Link>
           </div>
        </div>
      </div>
    </main>
  );
}
