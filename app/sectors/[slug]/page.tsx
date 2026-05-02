import React from 'react';
import { getSectorBySlug, getBlogPosts } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import InsightsSection from '@/components/home/InsightsSection';
import { notFound } from 'next/navigation';

export default async function SectorPage({ params }: { params: { slug: string } }) {
  let sector;
  let blogPosts = [];

  try {
    sector = await getSectorBySlug(params.slug);
    if (!sector) return notFound();

    const blogData = await getBlogPosts({ sector_name: sector.name });
    blogPosts = blogData.results || [];
  } catch (err) {
    console.error("Sector page error:", err);
    return notFound();
  }

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Strategic Industry"
        title={<>Solutions for <span className="text-gradient">{sector.name}</span></>}
        subtitle={sector.description || `Explore our specialized ICT solutions and strategic insights specifically engineered for the ${sector.name} industry.`}
        withBackLink={true}
        backLinkHref="/news"
        backLinkLabel="Back to News"
      />
      
      <div className="pb-24">
        {blogPosts.length > 0 ? (
          <InsightsSection posts={blogPosts} hideHeading={true} />
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-20 text-center border border-dashed border-gray-200 rounded-[40px] bg-brand-bg">
            <p className="text-text-gray font-medium">No specific insights published for this sector yet. Check back soon for our latest case studies and industry trends.</p>
          </div>
        )}
      </div>
    </main>
  );
}
