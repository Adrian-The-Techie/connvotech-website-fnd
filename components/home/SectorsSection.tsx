"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { getSectors } from '@/lib/api';
import SectionHeading from '../ui/SectionHeading';

export default function SectorsSection() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSectors().then(data => {
      setSectors((data.results || data).slice(0, 3));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading || sectors.length === 0) return null;

  return (
    <section id="sectors" className="py-24 px-6 bg-brand-bg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-brand-blue/5 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading 
          badge="Market Verticals"
          title="Industry-Specific ICT Excellence"
          subtitle="We deliver specialized technical solutions tailored to the unique operational challenges of high-growth industries."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 rounded-[40px] bg-white border border-border-gray hover:border-brand-blue/20 shadow-premium-soft hover:shadow-premium-card transition-all duration-500"
            >
              <div className="w-14 h-14 bg-soft-gray rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-primary-gradient group-hover:text-white transition-all duration-500 mb-8">
                <Globe size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black text-brand-black mb-4 group-hover:text-brand-blue transition-colors">
                {sector.name}
              </h3>
              <p className="text-text-gray font-medium leading-relaxed mb-8 line-clamp-3">
                {sector.description || `Engineering high-performance digital ecosystems and ICT infrastructure for the ${sector.name} sector.`}
              </p>
              <Link 
                href={`/sectors/${sector.slug}`}
                className="inline-flex items-center text-brand-blue font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
              >
                Explore Sector <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/sectors"
            className="inline-flex items-center gap-2 text-text-gray hover:text-brand-blue font-black text-xs uppercase tracking-widest transition-all group"
          >
            View All Strategic Sectors 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
