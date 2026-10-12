import type { Metadata } from 'next';
import { site } from '@/content/site';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const noIndex = process.env.NEXT_PUBLIC_NOINDEX !== 'false' || !process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://');
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const socialTitle = title.includes('TMS') ? title : `${title} | TMS`;
  return { title: { absolute: socialTitle }, description, alternates: { canonical: path },
    openGraph: { title: socialTitle, description, url: path, siteName: 'TMS', locale: 'ru_RU', type: 'website' },
    twitter: { card: 'summary', title: socialTitle, description },
  };
}
export const structuredData = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'TMS', url: siteUrl, logo: `${siteUrl}/brand/tms-logo.png` },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: site.title, url: siteUrl, inLanguage: 'ru', publisher: { '@id': `${siteUrl}/#organization` } },
    { '@type': 'SoftwareApplication', name: 'TMS', applicationCategory: 'BusinessApplication', description: site.description, operatingSystem: 'Web', url: siteUrl, publisher: { '@id': `${siteUrl}/#organization` } },
  ],
};
