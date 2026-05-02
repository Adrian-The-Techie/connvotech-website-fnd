import { getPortfolio } from '@/lib/api';
import PortfolioSection from '@/components/home/PortfolioSection';
import PageHeader from '@/components/ui/PageHeader';

export default async function PortfolioPage() {
  const portfolioData = await getPortfolio().catch(() => ({ results: [] }));

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Our Portfolio"
        title={<>Exceptional <span className="text-gradient">Digital</span> Experiences</>}
        subtitle="A showcase of our recent projects across various industries, from retail to healthcare and finance."
      />
      <div className="pb-24">
        <PortfolioSection projects={portfolioData?.results || portfolioData || []} hideHeading={true} />
      </div>
    </main>
  );
}
