import {connection} from 'next/server';
import off from '@/content/legal/analytics-disabled.json';
import metrica from '@/content/legal/analytics-consent.metrica.json';
import {LegalDocument} from '@/components/site-v6/LegalDocument';
import {ProviderLinks} from '@/components/site-v6/privacy/ProviderLinks';
import {getAnalyticsConfig} from '@/lib/privacy/config.server';
import {pageMetadata} from '@/lib/seo';
export const metadata=pageMetadata('Необязательная аналитика','Условия отдельного выбора необязательной аналитики','/analytics-consent');
export default async function Page(){if(process.env.TMS_GITHUB_PAGES!=='true')await connection();const config=getAnalyticsConfig();return <LegalDocument document={config.enabled?metrica:off}><ProviderLinks config={config}/></LegalDocument>;}
