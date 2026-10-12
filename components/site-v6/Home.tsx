'use client';
import {Hero} from './ApprovedViews';
import {StoryExperience} from '../review-v6/StoryExperience';
import {useConsultation} from './Consultation';
import {FinalCTA} from './Sections';
import {FaqSpotlight} from '../faq-spotlight/FaqSpotlight';
import {B1Cases,B1Calculator,B1Cooperation} from './B1Sections';
export function Home(){const open=useConsultation();return <main id="main"><Hero/><StoryExperience openForm={topicId=>open({topicId,...(topicId.startsWith('custom')?{context:'custom' as const}:{context:'saas' as const,productSlug:topicId.startsWith('crm')?'crm' as const:'oms' as const})})}/><B1Cases/><B1Calculator/><B1Cooperation/><FaqSpotlight/><FinalCTA/></main>;}
