import Link from 'next/link';
import copy from '@/content/site-copy.ru.json';
import {pageMetadata} from '@/lib/seo';
import {InternalHero,InternalSection,InternalContact} from '@/components/site-v6/InternalViews';
import s from '@/components/site-v6/internal.module.css';
const c=copy.about;
export const metadata=pageMetadata(c.seo.title,c.seo.description,c.path);
export default function AboutPage(){return <main id="main" data-internal-page><InternalHero document label="О компании" title={c.title} body={c.intro}/><InternalSection kicker="Подход TMS" title="Рабочий контекст доступен команде" body="CRM — для продаж, OMS — для исполнения. Их можно использовать отдельно или связать на общих данных."><div className={s.facts}>{c.sections.map(x=><div key={x.title}><h3>{x.title}</h3><p>{x.body}</p></div>)}</div><nav className={s.actions} aria-label="Продукты TMS"><Link className={s.link} href="/products/crm">CRM</Link><Link className={s.link} href="/products/oms">OMS</Link><Link className={s.link} href="/products/crm-oms">CRM + OMS</Link></nav></InternalSection><InternalContact/></main>;}
