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
        className="group bg-white rounded-[40px] border border-border-gray p-3 shadow-premium-soft hover:shadow-premium-card transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
      >
        <div className="relative h-64 rounded-[32px] overflow-hidden mb-8 shrink-0 bg-brand-bg flex items-center justify-center p-8">
          {/* Background Image with blur overlay */}
          {project.thumbnail && (
            <Image 
              src={getMediaUrl(project.thumbnail)} 
              alt={project.title} 
              fill 
              className="object-cover opacity-20 blur-[2px] transition-transform duration-1000 group-hover:scale-110" 
            />
          )}
          
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {displayLogo ? (
              <img 
                src={getMediaUrl(displayLogo)} 
                alt={project.title} 
                className="max-w-full max-h-full object-contain drop-shadow-xl filter brightness-0 transition-all duration-700 ease-out group-hover:scale-110" 
              />
            ) : (
              <div className="w-16 h-16 rounded-full border border-brand-blue/20 flex items-center justify-center backdrop-blur-md bg-white/10">
                 <div className="w-8 h-8 rounded-full bg-brand-blue/20 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-8 flex-1 flex flex-col items-center text-center">
          <div className="mb-6">
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border shadow-sm ${
              project.status === 'development' 
                ? 'bg-amber-50 text-amber-600 border-amber-100' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {project.status === 'development' ? 'In Development' : 'Delivered'}
            </span>
          </div>
          
          <div className="mt-auto flex items-center gap-2 text-brand-blue font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Case Study <ArrowRight size={14} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
