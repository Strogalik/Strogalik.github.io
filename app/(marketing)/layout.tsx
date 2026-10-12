import {connection} from 'next/server';
import {SiteShell} from '@/components/site-v6/SiteShell';
import {getAnalyticsConfig} from '@/lib/privacy/config.server';
export default async function MarketingLayout({children}:{children:React.ReactNode}){if(process.env.TMS_GITHUB_PAGES!=='true')await connection();return <SiteShell analyticsConfig={getAnalyticsConfig()}>{children}</SiteShell>;}
