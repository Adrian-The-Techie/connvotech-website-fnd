import { MetadataRoute } from 'next';
import api from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://connvotech.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/services',
    '/portfolio',
    '/blog',
    '/contact',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch dynamic blog posts
    const blogRes = await api.get('/blog/');
    const blogPosts = (blogRes.data.results || []).map((post: any) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Fetch dynamic projects
    const portfolioRes = await api.get('/portfolio/');
    const projects = (portfolioRes.data.results || []).map((project: any) => ({
      url: `${SITE_URL}/portfolio/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...routes, ...blogPosts, ...projects];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return routes;
  }
}
