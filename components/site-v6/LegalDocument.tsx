import Link from 'next/link';
import {InternalHero} from './InternalViews';
import s from './internal.module.css';
import l from './legal.module.css';
import type {ReactNode} from 'react';
import {AnalyticsSettings} from './privacy/AnalyticsSettings';
import {ShowCookieNotice} from './CookieNotice';
type Block={kind:string;text?:string;items?:string[]};
type Document={title:string;revisionLabel?:string;introduction?:string;blocks?:Block[];sections?:{number:string;title:string;blocks:Block[]}[]};
function Blocks({blocks}:{blocks:Block[]}){return blocks.map((b,i)=>b.kind==='list'?<ul key={i}>{b.items?.map((text,j)=><li key={j}>{text}</li>)}</ul>:<p key={i}>{b.text}</p>);}
export function LegalDocument({document,cookies=false,children}:{document:Document;cookies?:boolean;children?:ReactNode}){return <main id="main" data-internal-page data-legal-document><InternalHero document label="Документы" title={document.title} body={document.revisionLabel??''}/><div className={s.container}><article data-numeric-role="legal" className={`${s.article} ${l.document}`}>{document.introduction&&<p>{document.introduction}</p>}{document.blocks&&<Blocks blocks={document.blocks}/>} {document.sections?.map(section=><section key={section.number}><h2>{section.number}. {section.title}</h2><Blocks blocks={section.blocks}/></section>)}{children}{cookies&&<><AnalyticsSettings/><ShowCookieNotice/></>}<nav className={s.actions} aria-label="Навигация документа"><Link href="/">На главную</Link><a href="/privacy">Политика конфиденциальности</a></nav></article></div></main>;}
