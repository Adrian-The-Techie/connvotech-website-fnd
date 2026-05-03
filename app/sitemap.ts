import { MetadataRoute } from 'next'
import { getServices, getProducts, getBlogPosts } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://connvotech.com'

  // Fetch dynamic data
  const [services, products, blogPosts] = await Promise.all([
    getServices().catch(() => ({ results: [] })),
    getProducts().catch(() => ({ results: [] })),
    getBlogPosts().catch(() => ({ results: [] })),
  ])

  const serviceUrls = (services.results || []).map((s: any) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
  }))

  const productUrls = (products.results || []).map((p: any) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
  }))

  const blogUrls = (blogPosts.results || []).map((b: any) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...serviceUrls,
    ...productUrls,
    ...blogUrls,
  ]
}
