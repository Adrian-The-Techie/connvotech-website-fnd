import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { getSiteSettings } from "@/lib/api";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = null;
  try {
    settings = await getSiteSettings();
  } catch (err) {
    console.error("Failed to fetch settings for metadata", err);
  }

  const title = settings?.seo_title || "Connvotech Solutions | ICT Consultancy Nairobi";
  const description = settings?.seo_description || "Bespoke ICT Solutions for Growing Enterprises. Web Development, System Development, Cloud Infrastructure, and more.";
  const logo = settings?.logo || "/logo.png";
  const favicon = settings?.favicon || "/favicon.ico";

  return {
    metadataBase: new URL('https://connvotech.com'),
    title,
    description,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title,
      description,
      images: [logo],
      type: 'website',
      url: 'https://connvotech.com',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [logo],
    }
  };
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: any = null;
  try {
    settings = await getSiteSettings();
  } catch (err) {
    console.error("Failed to fetch settings for layout", err);
  }


  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.company_name || 'Connvotech Solutions',
    url: 'https://connvotech.com',
    logo: settings?.logo || 'https://connvotech.com/logo.png',
    sameAs: [
      settings?.twitter_url,
      settings?.linkedin_url,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings?.phone || '+254-700-000000',
      contactType: 'customer service',
      areaServed: 'KE',
      availableLanguage: 'en',
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        {process.env.NEXT_PUBLIC_GSC_ID && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GSC_ID} />
        )}
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.className} ${montserrat.variable} font-sans`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
