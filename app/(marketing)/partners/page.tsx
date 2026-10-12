import copy from '@/content/site-copy.ru.json';
import {pageMetadata} from '@/lib/seo';
import {Action} from '@/components/site-v6/Consultation';
import {InternalHero,InternalSection} from '@/components/site-v6/InternalViews';
import {InternalTopics} from '@/components/site-v6/InternalTopics';
import s from '@/components/site-v6/internal.module.css';
const c=copy.partners;
export const metadata=pageMetadata(c.seo.title,c.seo.description,c.path);
export default function PartnersPage(){return <main id="main" data-internal-page><InternalHero document label="Партнёрам" title={c.title} body={c.intro}><div className={s.actions}><Action options={{context:'partner'}}>Обсудить партнёрство</Action></div></InternalHero><InternalSection kicker="Совместная работа" title="Сначала определим роли" body="Формат участия и коммерческие условия обсуждаются для конкретной задачи."><InternalTopics items={c.sections.map(x=>({heading:x.title,body:<p>{x.body}</p>}))}/></InternalSection></main>;}
