import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsBar from '../components/home/StatsBar';
import ServicesSection from '../components/home/ServicesSection';
import PortfolioSection from '../components/home/PortfolioSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import InsightsSection from '../components/home/InsightsSection';
import ContactSection from '../components/home/ContactSection';
import ProductsSection from '../components/home/ProductsSection';
import {
  getSiteSettings,
  getServices,
  getPortfolio,
  getTestimonials,
  getBlogPosts
} from '../lib/api';

// This is a server component in Next.js 13/14 App Router
export default async function HomePage() {
  // Fetch data with ISR
  let siteSettings, services, portfolio, testimonials, blogPosts;

  try {
    // API calls (Next.js will cache these according to fetch options if used inside api.ts, 
    // but here we use the centralized api which is axios. 
    // For real ISR, you might use fetch directly, but axios is requested.)
    const data = await Promise.all([
      getSiteSettings(),
      getServices(),
      getPortfolio(),
      getTestimonials(),
      getBlogPosts()
    ]);

    const [rawSettings, s, p, t, b] = data;
    siteSettings = Array.isArray(rawSettings) ? rawSettings[0] : rawSettings;
    services = s;
    portfolio = p;
    testimonials = t;
    blogPosts = b;
    
    // Ensure siteSettings is valid
    if (!siteSettings) throw new Error("No site settings found");
  } catch (error) {
    console.error("Failed to fetch home page data", error);
    // Fallbacks if backend is not running
    siteSettings = {
      hero_headline: "Bespoke ICT Solutions for Growing Enterprises",
      hero_subheadline: "We provide cutting-edge software development, cloud infrastructure, and ICT consultancy to help your business scale in the digital age.",
      stat_projects: 45,
      stat_clients: 32,
      stat_years: 8,
      stat_industries: 12
    } as any;
    services = [];
    portfolio = { results: [] } as any;
    testimonials = [];
    blogPosts = { results: [] } as any;
  }

  return (
    <div>
      <HeroSection
        headline={siteSettings.hero_headline}
        subheadline={siteSettings.hero_subheadline}
      />
      <StatsBar
        projects={siteSettings.stat_projects}
        clients={siteSettings.stat_clients}
        years={siteSettings.stat_years}
        industries={siteSettings.stat_industries}
      />
      <ServicesSection services={services?.results || services || []} />
      <ProductsSection />
      <PortfolioSection projects={portfolio?.results || []} />
      <TestimonialsSection testimonials={testimonials?.results || testimonials || []} />
      <InsightsSection posts={blogPosts?.results || []} />
      <ContactSection />
    </div>
  );
}
