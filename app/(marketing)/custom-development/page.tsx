import Link from 'next/link';
import copy from '@/content/site-copy.ru.json';
import {cases} from '@/content/cases';
import {pageMetadata} from '@/lib/seo';
import {Action} from '@/components/site-v6/Consultation';
import {InternalHero,InternalSection,CaseSpotlight} from '@/components/site-v6/InternalViews';
import {InternalTopics} from '@/components/site-v6/InternalTopics';
import s from '@/components/site-v6/internal.module.css';
const c=copy.customDevelopment;
export const metadata=pageMetadata(c.seo.title,c.seo.description,c.path);
export default function CustomPage(){return <main id="main" data-internal-page><InternalHero label={c.eyebrow} title={c.title} body={c.body}><div className={s.actions}><Action options={{context:'custom'}}>Обсудить проект</Action><a className={s.link} href="#approach">Наш подход</a></div></InternalHero><InternalSection id="approach" kicker="От задачи к решению" title="Согласуем границы до реализации" body="Индивидуальный проект начинается с процесса компании. Его объём, интеграции и условия согласуются отдельно от подписки CRM или OMS."><InternalTopics items={c.process.map(x=>({heading:x.title,body:<p>{x.body}</p>}))}/></InternalSection><section className={s.caseSection}><div className={s.container}><h2>Контекст индивидуального внедрения</h2><CaseSpotlight item={cases.find(x=>x.slug==='flooring-manufacturer')!}/><p className={s.note}>{c.caseContext}</p><div className={s.actions}><Link className={s.link} href="/cases/online-school">Как связали обращение и запись в онлайн-школе</Link></div></div></section></main>;}
