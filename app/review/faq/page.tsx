import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import {allowDesignReview} from '@/lib/design-review';
import {FaqReview} from '@/components/faq-spotlight/FaqReview';
import {SiteShell} from '@/components/site-v6/SiteShell';
import {analyticsOff} from '@/lib/privacy/profile';
export const metadata:Metadata={title:{absolute:'TMS B6 · FAQ на согласование'},description:'Закрытый локальный прототип FAQ',robots:{index:false,follow:false,noarchive:true},alternates:{canonical:'/review/faq'}};
export default async function FaqReviewPage(){
 const h=await headers();
 if(!allowDesignReview(process.env.TMS_FAQ_REVIEW,h.get('host'),h.get('x-forwarded-host')))notFound();
 return <SiteShell analyticsConfig={analyticsOff}><FaqReview/></SiteShell>;
}
