import { getBlogPosts } from '@/lib/api';
import InsightsSection from '@/components/home/InsightsSection';
import PageHeader from '@/components/ui/PageHeader';

export default async function BlogPage() {
  const blogData = await getBlogPosts().catch(() => ({ results: [] }));
  
  // Filter out news to keep blog focused on insights and case studies
  const blogPosts = blogData.results.filter((post: any) => post.category !== 'Tech News');

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Expert Insights"
        title={<>Solving <span className="text-gradient">Complex</span> Challenges</>}
        subtitle="Explore our deep-dives into industry problems and how Connvotech delivers strategic technical solutions."
      />
      <div className="pb-24">
        <InsightsSection posts={blogPosts} hideHeading={true} />
      </div>
    </main>
  );
}
