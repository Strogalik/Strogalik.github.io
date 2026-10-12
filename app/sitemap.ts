import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { products } from '@/content/products';
import { publishedCases } from '@/content/cases';
import { siteUrl } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/cases', '/privacy', '/consent', '/cookies', '/custom-development', '/about', '/partners', ...products.map(item => `/products/${item.slug}`), ...publishedCases.map(item => `/cases/${item.slug}`)].map(path => ({ url: `${siteUrl}${path}`, changeFrequency: 'monthly', priority: path === '/' ? 1 : 0.7 }));
}
