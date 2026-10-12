import document from '@/content/legal/consent.json';
import {LegalDocument} from '@/components/site-v6/LegalDocument';
import {pageMetadata} from '@/lib/seo';
export const metadata=pageMetadata(document.title,document.title,'/consent');
export default function Page(){return <LegalDocument document={document} />;}
