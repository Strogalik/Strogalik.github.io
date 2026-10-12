import type { Metadata } from 'next';
import { fontClass } from './fonts';
import { site } from '@/content/site';
import { pageMetadata, siteUrl, noIndex } from '@/lib/seo';
import './globals.css';
import reflow from '@/components/site-v6/reflow.module.css';
export const metadata: Metadata = {
  ...pageMetadata(site.title, site.description, '/'),
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: '%s | TMS' },
  icons: { icon: '/brand/favicon.png', apple: '/brand/apple-touch-icon.png' },
  robots: { index: !noIndex, follow: !noIndex },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" className={fontClass}><body><a href="#main" className={`skip-link ${reflow.skipLink}`}>Перейти к содержимому</a>{children}</body></html>;
}
