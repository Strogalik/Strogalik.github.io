'use client';
// Establish the shared base before review controls; keep the public CSS cascade stable.
import '@/components/site-v6/sections.module.css';
import '@/components/review-v6/review.module.css';
import '@/components/review-v6/content.module.css';
import '@/components/site-v6/faq.module.css';
import '@/components/site-v6/disclosure.module.css';
import '@/components/site-v6/reflow.module.css';
import '@/components/site-v6/adapter.module.css';
import '@/components/site-v6/footer.module.css';
import '@/components/site-v6/b1.module.css';
import '@/components/site-v6/legal.module.css';
import '@/components/site-v6/privacy/privacy.module.css';
import '@/components/site-v6/internal.module.css';
import {FinalCTA} from '@/components/site-v6/Sections';
import {B1Cooperation} from '@/components/site-v6/B1Sections';
import {FaqSpotlight} from './FaqSpotlight';
export function FaqReview(){return <main id="main" data-faq-review><h1 className="sr-only">TMS — ответы на вопросы</h1><B1Cooperation/><FaqSpotlight/><FinalCTA/></main>;}
