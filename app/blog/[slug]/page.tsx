import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Metadata } from 'next';
import { getBlogPostBySlug } from '@/lib/api';
import { BlogPost } from '@/lib/types';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post: BlogPost = await getBlogPostBySlug(params.slug).catch(() => null);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Connvotech Insights`,
    description: post.summary || post.body.substring(0, 160).replace(/<[^>]*>/g, ''),
    openGraph: {
      title: post.title,
      description: post.summary || post.excerpt,
      images: [
        post.external_image_url || 
        (post.cover_image?.startsWith('http') ? post.cover_image : (post.cover_image ? `${process.env.NEXT_PUBLIC_API_URL}${post.cover_image}` : ''))
      ].filter(Boolean),
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || post.excerpt,
      images: [
        post.external_image_url || 
        (post.cover_image?.startsWith('http') ? post.cover_image : (post.cover_image ? `${process.env.NEXT_PUBLIC_API_URL}${post.cover_image}` : ''))
      ].filter(Boolean),
    },
  };
}

const Mermaid = dynamic(() => import('@/components/Mermaid'), { ssr: false });

const FormattedContent = ({ html }: { html: string }) => {
  // Split content by mermaid blocks
  const parts = html.split(/(<pre class="mermaid">[\s\S]*?<\/pre>)/);

  return (
    <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
      {parts.map((part, index) => {
        if (part.startsWith('<pre class="mermaid">')) {
          const chart = part
            .replace(/<pre class="mermaid">/, '')
            .replace(/<\/pre>/, '')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .trim();
          return <Mermaid key={index} chart={chart} />;
        }
        return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </div>
  );
};

export default async function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post: BlogPost = await getBlogPostBySlug(params.slug).catch(() => null);

  if (!post) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-brand-blue font-bold">Back to Insights</Link>
      </div>
    );
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.cover_image,
    datePublished: post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author ? `${post.author.first_name} ${post.author.last_name || post.author.username}` : 'Connvotech Team',
    },
  };

  const date = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="pt-24 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <Link href="/blog" className="inline-flex items-center text-gray-500 hover:text-brand-blue mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Insights
        </Link>
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
             {post.category}
           </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brand-black leading-tight mb-8">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-2">
            <User size={18} className="text-brand-blue" />
            <span className="font-medium text-gray-900">
              {post.author ? `${post.author.first_name} ${post.author.last_name || post.author.username}` : 'Connvotech Team'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-brand-blue" />
            <span>{date}</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="relative h-[50vh] min-h-[300px] rounded-[40px] overflow-hidden shadow-2xl">
            <Image 
              src={post.cover_image} 
              alt={post.title} 
              fill 
              className="object-cover" 
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <FormattedContent html={post.body} />
        
        <div className="mt-16 pt-8 border-t border-gray-100">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold">
                    {post.author ? post.author.username.charAt(0).toUpperCase() : 'C'}
                 </div>
                 <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Written By</p>
                    <p className="font-bold text-brand-black">{post.author ? post.author.username : 'Connvotech Team'}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand-blue transition-all">
                    <Tag size={18} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
