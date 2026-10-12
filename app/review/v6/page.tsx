import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import {allowDesignReview} from '@/lib/design-review';
import {ReviewV6} from '@/components/review-v6/ReviewV6';

export const metadata: Metadata = {
  title: {absolute: 'TMS V6 · дизайн на согласование'},
  description: 'Закрытый локальный предпросмотр этапа A',
  robots: {index: false, follow: false, noarchive: true},
  alternates: {canonical: '/review/v6'},
};
export default async function DesignReviewPage() {
  const h = await headers();
  if (!allowDesignReview(process.env.TMS_DESIGN_REVIEW, h.get('host'), h.get('x-forwarded-host'))) notFound();
  return <ReviewV6/>;
}
