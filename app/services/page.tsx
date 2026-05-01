import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { getServices } from '@/lib/api';
import { Service } from '@/lib/types';
import PageHeader from '@/components/ui/PageHeader';

export const revalidate = 3600;

export default async function ServicesPage() {
  let services: Service[] = [];
  
  try {
    const data = await getServices();
    services = Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error("Failed to fetch services", err);
  }

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Our Expertise"
        title={<>Our <span className="text-gradient">Specializations.</span></>}
        subtitle="We offer a comprehensive range of ICT solutions designed to help your business thrive in the digital economy. From custom software to global cloud scale."
      />
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => {
             const IconName = (service.icon.charAt(0).toUpperCase() + service.icon.slice(1)) as keyof typeof Icons;
             const Icon = (Icons[IconName] as React.ElementType) || Icons.HelpCircle;
             
             return (
               <Link 
                key={service.id}
                href={`/services/${service.slug}`}
                className="group p-10 rounded-[40px] bg-white border border-border-gray hover:border-brand-blue/20 shadow-premium-soft hover:shadow-premium-card transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
               >
                 <div>
                    <div className="w-16 h-16 bg-soft-gray rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-primary-gradient group-hover:text-white transition-all duration-500 mb-8 border border-border-gray">
                      <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-brand-black mb-4 group-hover:text-brand-blue transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-text-gray leading-relaxed mb-8 font-medium">
                      {service.short_description}
                    </p>
                 </div>
                 <div className="flex items-center text-brand-blue font-bold text-xs uppercase tracking-widest">
                    Learn More <Icons.ArrowRight size={18} className="ml-2 group-hover:ml-4 transition-all" />
                 </div>
               </Link>
             );
          })}
        </div>

        {/* Support Section */}
        <div className="mt-32 p-12 md:p-24 rounded-[64px] bg-primary-gradient text-white overflow-hidden relative shadow-premium-card">
           <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
           <div className="relative z-10 flex flex-col lg:row justify-between items-center gap-10">
              <div className="max-w-2xl text-center lg:text-left">
                 <h2 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tighter">Not sure what you need?</h2>
                 <p className="text-white/80 text-xl leading-relaxed font-medium">
                    Our consultants are ready to audit your current infrastructure and recommend 
                    the best path forward for your business.
                 </p>
              </div>
              <Link 
                href="/contact"
                className="bg-white text-brand-black px-12 py-6 rounded-2xl text-xl font-bold hover:bg-brand-black hover:text-white transition-all whitespace-nowrap shadow-premium-soft"
              >
                 Book a Tech Audit
              </Link>
           </div>
        </div>
      </div>
    </main>
  );
}
