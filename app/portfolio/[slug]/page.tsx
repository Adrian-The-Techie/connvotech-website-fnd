import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, Tag as TagIcon } from 'lucide-react';
import { Metadata } from 'next';
import { getProjectBySlug } from '@/lib/api';
import { Project } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project: Project = await getProjectBySlug(params.slug).catch(() => null);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Connvotech Portfolio`,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: project.thumbnail ? [getMediaUrl(project.thumbnail)] : [],
      type: 'website',
    },
  };
}


export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project: Project = await getProjectBySlug(params.slug).catch(() => null);

  if (!project) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Project Not Found</h1>
        <Link href="/portfolio" className="text-brand-blue font-bold">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 bg-white relative overflow-hidden">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-brand-bg flex items-center justify-center border-b border-border-gray">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-brand-blue/5 blur-[120px] rounded-full"></div>

        <div className="max-w-4xl text-center relative z-10 px-6">
          <Link 
            href="/portfolio" 
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-gray hover:text-brand-blue transition-all mb-10 group"
          >
            <div className="w-10 h-10 rounded-full border border-border-gray flex items-center justify-center group-hover:border-brand-blue transition-colors bg-white shadow-premium-soft">
              <ArrowLeft size={16} />
            </div>
            Back to Portfolio
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-brand-black mb-8 tracking-tighter leading-[0.9]">
            {project.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-3">
            {project.tags.map(tag => (
              <span key={tag.id} className="bg-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue border border-brand-blue/10 shadow-premium-soft">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            <div className="relative aspect-video rounded-[48px] overflow-hidden shadow-premium-card border border-border-gray group bg-white p-3">
               <div className="relative w-full h-full rounded-[36px] overflow-hidden">
                {project.thumbnail && (
                   <Image 
                    src={getMediaUrl(project.thumbnail)} 
                    alt={project.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                )}
               </div>
            </div>

            <div className="prose prose-xl prose-slate max-w-none">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-brand-black mb-10 tracking-tighter">Project Overview</h2>
              <div 
                className="text-text-gray font-medium leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: project.long_description }} 
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-brand-bg p-10 rounded-[48px] border border-border-gray shadow-premium-card sticky top-32">
               <h3 className="text-2xl font-display font-black text-brand-black mb-10 tracking-tight border-b border-border-gray pb-6">Project Details</h3>
               <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border-gray flex items-center justify-center text-brand-blue shadow-premium-soft">
                       <TagIcon size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-text-gray mb-1">Services Provided</p>
                       <p className="font-bold text-brand-black leading-tight">Systems Development, UI/UX Design</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border-gray flex items-center justify-center text-brand-blue shadow-premium-soft">
                       <Calendar size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-text-gray mb-1">Project Date</p>
                       <p className="font-bold text-brand-black leading-tight">October 2024</p>
                    </div>
                 </div>

                 {project.project_url && (
                   <a 
                    href={project.project_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-primary-gradient text-white py-5 rounded-2xl flex items-center justify-center font-bold gap-3 mt-10 shadow-premium-soft hover:shadow-glow hover:-translate-y-1 transition-all"
                   >
                     Visit Website
                     <ExternalLink size={20} />
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
