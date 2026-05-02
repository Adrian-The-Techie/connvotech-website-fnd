import React from 'react';
import Link from 'next/link';
import { getSectors } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowRight, Globe } from 'lucide-react';

export default async function SectorsPage() {
  let sectors = [];
  try {
    const data = await getSectors();
    sectors = Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error("Failed to fetch sectors", err);
  }

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Strategic Verticals"
        title={<>Strategic <span className="text-gradient">Sectors.</span></>}
        subtitle="We specialize in delivering mission-critical ICT infrastructure and digital products for key high-growth industries across Africa."
      />
      
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sectors.map((sector: any) => (
            <Link 
              key={sector.id}
              href={`/sectors/${sector.slug}`}
              className="group p-10 rounded-[40px] bg-white border border-border-gray hover:border-brand-blue/20 shadow-premium-soft hover:shadow-premium-card transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-16 h-16 bg-soft-gray rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-primary-gradient group-hover:text-white transition-all duration-500 mb-8 border border-border-gray">
                  <Globe size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-black text-brand-black mb-4 group-hover:text-brand-blue transition-colors">
                  {sector.name}
                </h3>
                <p className="text-text-gray leading-relaxed mb-8 font-medium line-clamp-3">
                  {sector.description || `Specialized ICT solutions tailored for the ${sector.name} industry, focusing on scalability and security.`}
                </p>
              </div>
              <div className="flex items-center text-brand-blue font-black text-[10px] uppercase tracking-widest">
                Explore Sector <ArrowRight size={16} className="ml-2 group-hover:ml-4 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
