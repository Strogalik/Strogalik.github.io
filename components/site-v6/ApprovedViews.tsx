'use client';
import '../motion/native-motion.css';
import {PublicFooter} from './Footer';
import Image from 'next/image';
import {useEffect,useRef,type MouseEvent} from 'react';
import s from '../review-v6/review.module.css';
import a from './adapter.module.css';
import {HeroStory} from './HeroStory';
import {useConsultation} from './Consultation';
function Brand({footer=false}:{footer?:boolean}) {return <a href={footer?'#v6-top':'/'} className={s.brand} aria-label={footer?'TMS — к началу страницы':'TMS — текущий сайт'}><Image src="/brand/tms-logo.png" width={48} height={44} alt="" priority={!footer}/><span><b>TMS</b><small>{footer?'Система автоматизации бизнеса':'CRM · OMS · Разработка'}</small></span></a>;}

export function Header(){
 const header=useRef<HTMLElement>(null),menu=useRef<HTMLDetailsElement>(null);const open=useConsultation();const openForm=()=>open();
 useEffect(()=>{const el=header.current;if(!el)return;const observer=new ResizeObserver(()=>el.closest<HTMLElement>('[data-v6-review]')?.style.setProperty('--review-header',`${el.getBoundingClientRect().height}px`));observer.observe(el);return()=>observer.disconnect();},[]);
 useEffect(()=>{const update=()=>header.current?.setAttribute('data-scrolled',String(window.scrollY>8));update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
 function closeMenu(){if(menu.current){menu.current.open=false;menu.current.querySelector('summary')?.focus({preventScroll:true});}}
 useEffect(()=>{const outside=(e:PointerEvent)=>{if(menu.current?.open&&e.target instanceof Node&&!menu.current.contains(e.target))menu.current.open=false;};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[]);
 // B2 behavior-only correction: all four destinations are sections of the homepage.
 const links=[['/#solution','Решение'],['/#products','Продукты'],['/#cases','Кейсы'],['/#cooperation','Сотрудничество']];
 function followSection(event:MouseEvent<HTMLAnchorElement>){if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;if(menu.current)menu.current.open=false;const hash=new URL(event.currentTarget.href).hash;if(location.pathname==='/')requestAnimationFrame(()=>focusSection(hash));}
 function focusSection(hash:string){const target=document.getElementById(hash.slice(1));if(!target)return;const heading=target.querySelector<HTMLElement>('h1,h2')??target;heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 useEffect(()=>{let frame=0,disposed=false;const focus=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!disposed)focusSection(location.hash);});};window.addEventListener('hashchange',focus);window.addEventListener('load',focus);if(location.hash&&document.readyState==='complete')void document.fonts.ready.then(()=>{if(!disposed)focus();});return()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('hashchange',focus);window.removeEventListener('load',focus);};},[]);
 return <header ref={header} className={s.header}><div className={`${s.container} ${s.headerInner}`}><Brand/><nav className={s.desktopNav} aria-label="Основная навигация">{links.map(([href,label])=><a href={href} key={href} onClick={followSection}>{label}</a>)}</nav><div className={s.headerActions}><span className={`${s.reviewBadge} ${a.badgeSlot}`} aria-hidden="true"/><button type="button" className={`${s.button} ${s.headerBlue}`} onClick={openForm}>Обсудить задачу</button><details data-b7-menu className={s.mobileMenu} ref={menu} onKeyDown={e=>{if(e.key==='Escape'){closeMenu();menu.current?.querySelector('summary')?.focus();}}}><summary role="button" aria-label="Меню"><span/><span/></summary><nav aria-label="Мобильная навигация">{links.map(([href,label])=><a href={href} key={href} onClick={followSection}>{label}</a>)}<button className={`${s.button} ${s.primary}`} type="button" onClick={()=>{closeMenu();openForm();}}>Обсудить задачу</button></nav></details></div></div></header>;
}
export function Footer(){return <PublicFooter brand={<Brand footer/>}/>;}

export function Hero(){const open=useConsultation();const openForm=()=>open();return <section className={s.hero} id="solution" aria-labelledby="v6-title"><div className={`${s.container} ${s.heroGrid}`}><div className={s.heroCopy}><p className={s.eyebrow}>TMS · CRM, OMS и автоматизация бизнеса</p><h1 id="v6-title">От первого обращения до выполненного заказа</h1><p className={s.lead}><span className={s.desktopLead}>Объединяем продажи, задачи и исполнение в одной системе. Подключаем готовые продукты или разрабатываем решение под процессы вашей компании.</span><span className={s.mobileLead}>Продажи и исполнение в одной системе. Готовые продукты или разработка под ваш процесс.</span></p><div className={s.heroActions}><button className={`${s.button} ${s.primary}`} type="button" onClick={openForm}>Обсудить задачу</button><a className={`${s.button} ${s.secondary}`} href="#products">Как работает TMS</a></div><noscript><p className={s.noJs}>Для просмотра формы нужен JavaScript. Свяжитесь с нами по email внизу страницы.</p></noscript><p className={s.meetingNote}>На встрече покажем реальную систему<br className={s.desktopBreak}/> и разберём ваш процесс</p></div><HeroStory/></div></section>;}
