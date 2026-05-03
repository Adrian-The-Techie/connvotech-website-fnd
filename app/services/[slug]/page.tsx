import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { getServiceBySlug } from '@/lib/api';
import { Service } from '@/lib/types';

export const revalidate = 3600;

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  let service: Service | null = null;
  
  try {
    service = await getServiceBySlug(params.slug);
  } catch (err) {
    console.error("Failed to fetch service detail", err);
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
           <h1 className="text-4xl font-bold mb-4">Service not found</h1>
           <Link href="/services" className="text-brand-blue font-bold underline">Back to Services</Link>
        </div>
      </div>
    );
  }

  const IconName = (service.icon.charAt(0).toUpperCase() + service.icon.slice(1)) as keyof typeof Icons;
  const Icon = (Icons[IconName] as React.ElementType) || Icons.HelpCircle;

  return (
    <main className="min-h-screen pt-40 pb-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-blue/5 blur-[120px] rounded-full"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[10px] font-black text-text-gray mb-16 uppercase tracking-[0.2em]">
           <Link href="/" className="hover:text-brand-blue transition-colors px-3 py-1.5 bg-brand-bg rounded-full border border-border-gray shadow-sm">Home</Link>
           <Icons.ChevronRight size={14} className="text-brand-blue/30" />
           <Link href="/services" className="hover:text-brand-blue transition-colors px-3 py-1.5 bg-brand-bg rounded-full border border-border-gray shadow-sm">Services</Link>
           <Icons.ChevronRight size={14} className="text-brand-blue/30" />
           <span className="text-brand-blue font-black">{service.title}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
           <div className="w-20 h-20 bg-white border border-border-gray rounded-3xl flex items-center justify-center text-brand-blue shadow-premium-card">
              <Icon size={36} />
           </div>
           <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-brand-black tracking-tighter leading-[0.9]">
              {service.title}
           </h1>
        </div>

        <p className="text-lg md:text-xl text-brand-black font-display font-bold leading-[1.4] mb-20 border-l-4 border-brand-blue pl-8 max-w-4xl tracking-tight">
           {service.short_description}
        </p>

        <div className="prose prose-lg prose-slate max-w-none mb-32">
           <div 
             className="text-text-gray font-medium leading-[1.8]"
             dangerouslySetInnerHTML={{ __html: service.long_description.replace(/\n/g, '<br/>') }} 
           />
        </div>

        {/* CTA */}
         <div className="bg-brand-bg rounded-[50px] p-12 md:p-16 border border-border-gray flex flex-col items-center text-center gap-10 shadow-premium-soft relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-blue/5 blur-[80px] rounded-full"></div>
            <div className="max-w-3xl relative z-10">
               <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-brand-black mb-6 tracking-tighter leading-[1.1]">Start your project with <span className="text-gradient">Connvotech</span></h2>
               <p className="text-text-gray text-lg font-medium leading-relaxed">
                  Let&apos;s discuss how our {service.title} expertise can help transform your business and drive digital excellence.
               </p>
            </div>
            <Link 
             href={`/contact?type=service&id=${service.slug || service.id}&name=${encodeURIComponent(service.title)}&intent=service`}
             className="bg-primary-gradient text-white px-12 py-6 rounded-2xl text-xl font-black transition-all shadow-premium-soft hover:shadow-glow hover:-translate-y-1 relative z-10 whitespace-nowrap"
            >
               Get Started Now
            </Link>
         </div>
      </div>
    </main>
  );
}
