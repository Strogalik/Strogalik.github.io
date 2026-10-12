import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { noIndex, siteUrl } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots { return { rules: noIndex ? { userAgent: '*', disallow: '/' } : { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${siteUrl}/sitemap.xml` }; }
