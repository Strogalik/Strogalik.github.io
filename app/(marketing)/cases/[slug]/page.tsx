import {notFound} from 'next/navigation';
import Link from 'next/link';
import {cases} from '@/content/cases';
import {pageMetadata} from '@/lib/seo';
import {Action} from '@/components/site-v6/Consultation';
import {InternalHero} from '@/components/site-v6/InternalViews';
import s from '@/components/site-v6/internal.module.css';
export function generateStaticParams(){return cases.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=cases.find(x=>x.slug===slug);return c?pageMetadata(c.seo.title,c.seo.description,`/cases/${c.slug}`):{};}
export default async function CasePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params,c=cases.find(x=>x.slug===slug);if(!c)notFound();
 return <main id="main" data-internal-page><InternalHero document label={`${c.industry} · обезличенный кейс`} title={c.title} body={c.summary}><div className={s.actions}><Link className={s.link} href="#results">Результат и его границы</Link></div></InternalHero><div className={s.container}><article className={s.article}><section><h2>Исходная ситуация</h2><p>{c.clientContext}</p><p>{c.challenge}</p></section><section><h2>Что сделали в проекте</h2><ul>{c.work.map(x=><li key={x}>{x}</li>)}</ul></section><section><h2>Как изменилась работа</h2><p>{c.processChange}</p></section><section id="results"><h2>Результат и его границы</h2><div className={s.results}>{c.results.map(r=><div key={r.label}><strong>{r.value}</strong><p>{r.label}</p><span>{r.period||'Отдельный период не указан'}</span></div>)}</div><p>{c.primaryMetric.context}</p><p>{c.measurementNote}</p><p>{c.disclaimer}</p><p className={s.notice}>{c.implementationScopeNote}</p></section><section><h2>У вас похожая задача?</h2><p>Обсудим ваш процесс и покажем реальную систему в его контексте.</p><div className={s.actions}><Action options={{context:'custom',caseSlug:c.slug as 'b2b-wholesale'|'flooring-manufacturer'|'online-school'}}>{c.cta.label}</Action><Link className={s.link} href="/cases">Все кейсы</Link></div><nav className={s.actions} aria-label="Связанные направления">{c.relatedProducts.map(p=><Link className={s.link} key={p.href} href={p.href}>{p.label}</Link>)}</nav></section></article></div></main>;
}
