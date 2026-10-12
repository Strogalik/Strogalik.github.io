'use client';
import {useEffect,useRef,useState,type MouseEvent} from 'react';
import {useLayoutMotion} from '../motion/useLayoutMotion';
import {useCaseMotion} from '../case-motion/useCaseMotion';
import {IntrinsicSlot} from '../b9-stability/IntrinsicSlot';
import stable from '../b9-stability/scenes.module.css';
import motion from '../case-motion/cases.module.css';
import Link from 'next/link';
import {CaseOpenLink} from './CaseExplorer';
import {Action} from './Consultation';
import {Calculator} from './Calculator';
import s from './b1.module.css';
import studio from './calculator-studio.module.css';
import {useCalculatorAnchor} from '../calculator-studio/useCalculatorAnchor';
import approved from '../review-v6/review.module.css';

const stories=[
 {slug:'b2b-wholesale',label:'Оптовая торговля',summary:'Собрали историю клиентов и настроили повторные контакты. Команда видит, где продолжить разговор.',proof:'История и повторные контакты'},
 {slug:'flooring-manufacturer',label:'Производство',summary:'Клиент оформляет заказ, видит статус и получает документы. Кабинет связан с 1С в рамках отдельного проекта.',proof:'до 15 минут'},
 {slug:'online-school',label:'Образование',summary:'Связали маркетинговые данные, CRM и запись на занятие. Обращение не остаётся отдельной перепиской.',proof:'Обращение и запись связаны'},
] as const;
const starts=[{id:'process',label:'Обсудим процесс',body:'Что происходит сейчас, кто участвует в работе и что нужно изменить.'},{id:'system',label:'Покажем систему',body:'Посмотрим, как TMS может работать в контексте вашей задачи.'},{id:'solution',label:'Определим решение',body:'Определим, что подходит из готовых продуктов и где нужна индивидуальная разработка.'}];
function useSceneHeader(){const ref=useRef<HTMLElement>(null);useEffect(()=>{const header=document.querySelector('header');if(!header)return;const update=()=>ref.current?.style.setProperty('--b1-header',`${header.getBoundingClientRect().height}px`);update();const observer=new ResizeObserver(update);observer.observe(header);return()=>observer.disconnect();},[]);return ref;}
function ToggleIcon(){return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;}
/** Editorial objects, not a working interface, customer record or product screenshot. */
function CaseObject({slug}:{slug:string}){return <svg className={s.object} viewBox="0 0 520 250" fill="none" aria-hidden="true" focusable="false">{slug==='flooring-manufacturer'?<>
 <path d="m71 178 235-68 144 75-234 58Z" fill="#0F52BA"/><path d="m71 163 235-68 144 75-234 58Z" fill="#A6C5D7"/><path d="m71 148 235-68 144 75-234 58Z" fill="#D6E6F3"/><path d="m112 136 143 77m-78-96 145 77m-78-96 144 77" stroke="#A6C5D7" strokeWidth="2"/>
 <path d="M294 32h96l32 32v131H294Z" fill="#fff"/><path d="M390 32v32h32" fill="#D6E6F3"/><path d="M315 85h61m-61 18h80m-80 18h47" stroke="#A6C5D7" strokeWidth="5" strokeLinecap="round"/><circle cx="398" cy="179" r="37" fill="#0F52BA" stroke="#000926" strokeWidth="7"/><path d="m383 180 10 10 21-22" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
 </>:slug==='b2b-wholesale'?<>
 <path d="M105 82q0-14 14-14h100l22 22h124q14 0 14 14v101H105Z" fill="#0F52BA"/><rect x="132" y="42" width="166" height="162" rx="14" fill="#A6C5D7" transform="rotate(-9 132 42)"/><rect x="175" y="38" width="166" height="168" rx="14" fill="#D6E6F3"/><rect x="205" y="57" width="166" height="158" rx="14" fill="white" transform="rotate(7 205 57)"/><path d="m228 98 78 9m-81 15 108 13m-111 13 72 8" stroke="#A6C5D7" strokeWidth="6" strokeLinecap="round"/><path d="M113 139h122l20-19h129l-20 106H98Z" fill="#0F52BA"/>
 <path d="M391 44c37 4 61 29 58 62m-9 25c-10 24-35 38-64 33" stroke="#D6E6F3" strokeWidth="7" strokeLinecap="round"/><circle cx="392" cy="44" r="9" fill="white"/><circle cx="377" cy="164" r="9" fill="white"/>
 </>:<>
 <path d="M82 95c59-23 111-19 170 9v119c-60-28-112-30-170-7Z" fill="#A6C5D7"/><path d="M252 104c58-28 110-32 172-9v121c-62-23-114-21-172 7Z" fill="#0F52BA"/><path d="M97 79c59-12 103-3 155 25v103c-56-26-100-35-155-23Z" fill="#fff"/><path d="M252 104c53-28 102-37 158-25v105c-58-12-105-3-158 23Z" fill="#D6E6F3"/><path d="m123 113 85 18m-85 3 85 18m-85 3 55 12" stroke="#A6C5D7" strokeWidth="4" strokeLinecap="round"/>
 <rect x="292" y="26" width="117" height="110" rx="14" fill="white"/><path d="M293 58h115M317 19v20m65-20v20" stroke="#0F52BA" strokeWidth="7" strokeLinecap="round"/><path d="m329 95 15 15 30-32" stroke="#0F52BA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
 </>}</svg>;}

function CaseVisualContent({story}:{story:typeof stories[number]}){return <><CaseObject slug={story.slug}/><figcaption><strong className={story.slug==='flooring-manufacturer'?s.numericProof:s.qualitativeProof} data-numeric-role="metric">{story.proof}</strong>{story.slug==='flooring-manufacturer'&&<><p className={s.metricLabel}>на обработку заказа</p><p className={s.qualifier}>Ранее — до 3 дней. Через 30 дней, по материалам проекта. Значения «до», не среднее время и не норматив.</p></>}<p className={s.visibleScope}>Отдельное внедрение TMS. Результат не является гарантией для другой компании.</p></figcaption></>;}

export function B1Cases(){
 const section=useSceneHeader();
 const [selected,setSelected]=useState<string>('flooring-manufacturer');
 const {root:motionRoot,prepare:prepareMotion,presented}=useCaseMotion(selected);
 const select=(event:MouseEvent<HTMLElement>,slug:string)=>{event.preventDefault();event.currentTarget.focus({preventScroll:true});if(slug!==selected){prepareMotion();setSelected(slug);}};
 return <section ref={section} id="cases" className={s.scene} data-b1-cases><div className={s.container}><h2 className={s.sectionTitle}>Как TMS работает в бизнесе</h2><div ref={motionRoot} className={`${s.caseStage} ${motion.root}`} data-active-case={selected}>
 {stories.map(story=><details key={story.slug} name="tms-case-stories" open={selected===story.slug} data-motion-size className={s.caseChoice} data-case-choice={story.slug}><summary onClick={e=>select(e,story.slug)} aria-controls={`case-story-${story.slug}`}>{story.label}<ToggleIcon/></summary><div id={`case-story-${story.slug}`} data-motion-copy className={s.casePanel}><div className={s.caseCopy}><p>{story.summary}</p><CaseOpenLink slug={story.slug} className={`${approved.button} ${approved.secondary}`}>Разбор проекта</CaseOpenLink></div><figure className={s.caseVisual} data-case-inline><CaseVisualContent story={story}/></figure></div></details>)}
 <div className={`${s.caseVisual} ${motion.desktopVisual}`} data-case-visual-stage><figure className={motion.visualLayer} data-case-live={presented}><CaseVisualContent story={stories.find(x=>x.slug===presented)!}/></figure></div>
 </div></div></section>;
}
export function B1Cooperation(){const section=useSceneHeader();const [active,setActive]=useState('process');const {root:motionRoot,prepare:prepareMotion}=useLayoutMotion(active,{ghosts:true});return <section ref={section} id="cooperation" className={`${s.scene} ${s.startScene} ${stable.cooperation}`} data-b1-start><div className={s.container}><div className={s.startGrid}><div className={s.offer}><h2>Покажем TMS на вашей задаче</h2><p>Обсудим, как устроена работа сейчас, и посмотрим, что можно изменить с TMS.</p><Action/></div><IntrinsicSlot reserve={starts.map(chosen=><div key={chosen.id} className={s.startChoices}>{starts.map(x=><div key={x.id} className={`${s.startChoice} ${stable.measureChoice}`}><div className={stable.startSummary}>{x.label}</div>{chosen.id===x.id&&<p>{x.body}</p>}</div>)}</div>)}><div ref={motionRoot} className={s.startChoices}>{starts.map(x=><details name="tms-start" key={x.id} open={active===x.id} data-motion-size className={s.startChoice}><summary onClick={e=>{e.preventDefault();e.currentTarget.focus({preventScroll:true});if(x.id!==active){prepareMotion();setActive(x.id);}}} aria-controls={`start-${x.id}`}>{x.label}<ToggleIcon/></summary><p data-motion-copy id={`start-${x.id}`}>{x.body}</p></details>)}</div></IntrinsicSlot></div><p className={s.partnerLine}>Работаете с бизнесом? Обсудим партнёрство. <Link href="/partners" className={s.textLink}>Партнёрам</Link></p></div></section>;}
export function B1Calculator(){const section=useSceneHeader();useCalculatorAnchor(section);return <section ref={section} id="calculator" className={`${s.scene} ${s.calculatorScene} ${stable.calculatorScene} ${studio.scene}`} data-b1-calculator><div className={s.container}><h2 className={s.sectionTitle}>Посмотрите, что меняется</h2><Calculator className={s.calculator}/></div></section>;}
