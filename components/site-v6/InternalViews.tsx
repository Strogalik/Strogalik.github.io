import {CaseOpenLink} from './CaseExplorer';
import Link from 'next/link';
import type {ReactNode} from 'react';
import type {CaseStudy} from '@/content/cases';
import {Action} from './Consultation';
import s from './internal.module.css';
export function InternalHero({label,title,body,children,document=false}:{label:string;title:string;body:string;children?:ReactNode;document?:boolean}){return <section className={`${s.hero} ${document?s.documentHero:''}`} data-internal-hero><div className={s.container}><nav className={s.breadcrumb} aria-label="Хлебные крошки"><Link href="/">Главная</Link><span aria-hidden="true">/</span><span>{label}</span></nav><p className={s.kicker}>{label}</p><h1>{title}</h1><p className={s.intro}>{body}</p>{children}</div></section>;}
export function InternalSection({id,kicker,title,body,children}:{id?:string;kicker:string;title:string;body?:string;children:ReactNode}){return <section className={s.section} id={id}><div className={`${s.container} ${s.split}`}><div className={s.sectionIntro}><p className={s.kicker}>{kicker}</p><h2>{title}</h2>{body&&<p>{body}</p>}</div><div className={s.sectionContent}>{children}</div></div></section>;}
export function CaseSpotlight({item}:{item:CaseStudy}){return <article className={s.spotlight} data-case-spotlight><div><p className={s.caseLabel}>{item.industry} · отдельное внедрение</p><h3>{item.title}</h3><p>{item.summary}</p><p className={s.scope}>Результаты и интеграции относятся к этому проекту, не определяют состав подписки и не гарантируют результат другой компании.</p></div><CaseOpenLink className={s.caseLink} slug={item.slug}>Разбор проекта</CaseOpenLink></article>;}
export function InternalContact(){return <section className={s.contact}><div className={`${s.container} ${s.contactInner}`}><div><h2>Обсудим вашу задачу</h2><p>Покажем реальную систему в контексте вашего процесса.</p></div><Action/></div></section>;}
