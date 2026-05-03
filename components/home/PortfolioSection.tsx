"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Project, Tag, SiteSettings } from '@/lib/types';
import { getSiteSettings } from '@/lib/api';
import { getMediaUrl } from '@/lib/utils';
import SectionHeading from '../ui/SectionHeading';

interface PortfolioSectionProps {
  projects: Project[];
  hideHeading?: boolean;
}

export default function PortfolioSection({ projects, hideHeading = false }: PortfolioSectionProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  // Unique tags for filter
  const allTags = projects.reduce((acc: Tag[], project) => {
    project.tags.forEach(tag => {
      if (!acc.find(t => t.slug === tag.slug)) {
        acc.push(tag);
      }
    });
    return acc;
  }, []);

  const [activeTag, setActiveTag] = useState<string>('all');

  const filteredProjects = activeTag === 'all' 
    ? projects 
    : projects.filter(p => p.tags.some(t => t.slug === activeTag));

  return (
    <section className="py-24 px-6 bg-brand-bg relative overflow-hidden" id="portfolio">
      <div className="absolute top-1/2 left-0 w-[30%] h-[30%] bg-brand-blue/5 blur-[120px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {!hideHeading && (
          <SectionHeading 
            badge="Our Portfolio"
            title="Exceptional Digital Experiences"
            subtitle="A showcase of our recent projects across various industries, from retail to healthcare."
          />
        )}

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <FilterButton 
            active={activeTag === 'all'} 
            onClick={() => setActiveTag('all')}
            label="All Projects"
          />
          {allTags.map(tag => (
            <FilterButton 
              key={tag.id}
              active={activeTag === tag.slug}
              onClick={() => setActiveTag(tag.slug)}
              label={tag.name}
            />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={i} 
                fallbackLogo={settings?.logo}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/portfolio" 
            className="inline-flex items-center text-brand-blue font-bold hover:gap-3 transition-all group uppercase text-sm tracking-widest"
          >
            View All Projects
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${
        active 
          ? "bg-primary-gradient text-white shadow-premium-soft" 
          : "bg-white text-text-gray hover:bg-soft-gray border border-border-gray"
      }`}
    >
      {label}
    </button>
  );
}

function ProjectCard({ project, index, fallbackLogo }: { project: Project; index: number; fallbackLogo?: string }) {
  const displayLogo = project.client_logo || fallbackLogo;

  return (
    <Link href={`/portfolio/${project.slug}`} className="block h-full">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="group relative bg-white rounded-[40px] overflow-hidden border border-border-gray hover:border-brand-blue/20 transition-all duration-500 shadow-premium-soft hover:shadow-premium-card hover:-translate-y-2 h-full flex flex-col"
      >
        <div className="relative h-72 w-full overflow-hidden shrink-0">
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-brand-black/20 z-10 group-hover:bg-brand-blue/30 transition-colors duration-500"></div>
          
          {project.thumbnail ? (
            <Image 
              src={getMediaUrl(project.thumbnail)} 
              alt={project.title} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-1000" 
            />
          ) : (
            <div className="absolute inset-0 bg-soft-gray"></div>
          )}

          {/* Client Logo Layer */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
            {displayLogo ? (
              <div className="relative w-full h-full flex items-center justify-center">
                 <img 
                   src={getMediaUrl(displayLogo)} 
                   alt={project.title} 
                   className="max-w-[75%] max-h-[55%] object-contain drop-shadow-lg filter brightness-0 invert group-hover:scale-110 transition-all duration-700 ease-out opacity-90" 
                 />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/10">
                 <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Hover Action */}
          <div className="absolute inset-0 z-30 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
             <div className="w-full bg-primary-gradient text-white py-4 rounded-2xl flex items-center justify-center font-bold gap-2 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 shadow-premium-soft">
               View Case Study
               <ArrowRight size={18} />
             </div>
          </div>
        </div>
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex gap-2 mb-4">
            {project.tags.slice(0, 2).map(tag => (
              <span key={tag.id} className="text-[10px] font-bold uppercase tracking-widest text-brand-blue px-3 py-1 bg-brand-blue/5 border border-brand-blue/10 rounded-full">
                {tag.name}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-display font-bold text-brand-black mb-3 group-hover:text-brand-blue transition-colors">
            {project.title}
          </h3>
          <p className="text-text-gray text-sm line-clamp-2 leading-relaxed font-medium mb-4">
            {project.short_description}
          </p>
          <div className="mt-auto pt-4 flex items-center gap-2 text-brand-blue font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Discover Project <ArrowRight size={14} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
