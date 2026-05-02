import ContactSection from '@/components/home/ContactSection';
import PageHeader from '@/components/ui/PageHeader';

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Get In Touch"
        title={<>Let&apos;s Build Something <span className="text-gradient">Great</span></>}
        subtitle="Ready to transform your business scale? Reach out to us for a consultation and let's discuss your next big project."
      />
      <div className="pb-24">
        <ContactSection hideHeading={true} />
      </div>
    </main>
  );
}
