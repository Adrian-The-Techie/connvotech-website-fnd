"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Service, PaginatedResponse } from '@/lib/types';
import SectionHeading from '../ui/SectionHeading';

interface ServicesSectionProps {
  services: Service[] | PaginatedResponse<Service>;
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const serviceList = Array.isArray(services) ? services : services?.results || [];

  return (
    <section className="py-24 px-6 bg-brand-bg relative overflow-hidden" id="services">
      {/* Refined Background Elements */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-brand-blue/5 blur-[120px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading 
          badge="What We Do"
          title="Innovative Solutions for the Digital Age"
          subtitle="We help businesses modernize their operations with cutting-edge technology and custom software solutions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        <div className="mt-16 text-center">
           <Link 
            href="/services"
            className="inline-flex items-center gap-2 bg-primary-gradient text-white px-8 py-4 rounded-full font-bold shadow-premium-soft hover:shadow-glow transition-all"
           >
              Explore All Services <Icons.ArrowRight size={20} />
           </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  // Dynamically get Lucide icon
  const IconName = (service.icon.charAt(0).toUpperCase() + service.icon.slice(1)) as keyof typeof Icons;
  const Icon = (Icons[IconName] as React.ElementType) || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group p-6 rounded-3xl border border-border-gray bg-white hover:border-brand-blue/20 hover:shadow-premium-card transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="w-12 h-12 bg-soft-gray rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-primary-gradient group-hover:text-white transition-all mb-6">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-display font-bold text-brand-black mb-4 group-hover:text-brand-blue transition-colors">
          {service.title}
        </h3>
        <p className="text-text-gray/80 text-sm leading-loose font-medium">
          {service.short_description}
        </p>
      </div>
      <Link 
        href={`/services/${service.slug}`}
        className="mt-8 pt-6 border-t border-border-gray flex items-center text-text-gray group-hover:text-brand-blue font-bold text-sm transition-colors cursor-pointer uppercase tracking-widest"
      >
        Learn More
        <Icons.ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
