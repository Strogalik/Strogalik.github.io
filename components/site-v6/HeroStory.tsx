'use client';
import Image from 'next/image';
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {StoryBackdrop} from '../review-v6/glass/StoryBackdrop';
import s from '../review-v6/review.module.css';
import a from './adapter.module.css';
import {createHeroMotion,type HeroMotion,type MotionView} from '../review-v6/glass/hero-motion';

const steps = ['Обращение', 'Договорённости', 'Передача', 'Действие команды'];
export function ControlIcon({kind}: {kind:'pause'|'play'|'replay'|'close'}) {
 return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{kind==='pause'?<><path d="M8 5v14M16 5v14"/></>:kind==='play'?<path d="m8 5 11 7-11 7Z"/>:kind==='close'?<path d="m6 6 12 12M18 6 6 18"/>:<><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/></>}</svg>;
}
function Check(){return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}

export function HeroStory() {
 const figure=useRef<HTMLElement>(null),root=useRef<HTMLDivElement>(null),background=useRef<HTMLDivElement>(null),outgoing=useRef<HTMLDivElement>(null),first=useRef<HTMLDivElement>(null);
 const motion=useRef<HeroMotion|null>(null);
 const [view,setView]=useState<MotionView>({phase:3,paused:false,completed:true,reduced:true,started:false,compact:false,settled:true});
 useEffect(()=>{if(!figure.current||!root.current)return;const controller=createHeroMotion(figure.current,root.current,setView);motion.current=controller;return()=>{controller.dispose();motion.current=null;};},[]);
 const {phase,paused,completed,reduced,compact,settled}=view;
 const replayHere=compact&&completed&&settled&&!paused;
 const label=reduced?'История показана целиком':replayHere?'Повторить историю':paused?'Продолжить анимацию':'Пауза анимации';
 return <figure ref={figure} className={s.story} data-v6-story data-phase="3" data-playback="static" data-playing="false" data-elapsed="6000">
  <div className={s.heroLight} aria-hidden="true" data-hero-light/>
  <div ref={root} className={`${s.glassWindow} ${a.sceneRoot}`} data-glass data-hero-scene data-glass-state="css">
   <div ref={background} className={`${s.storyBackdrop} ${a.background}`} aria-hidden="true" data-glass-background><StoryBackdrop/></div>
   <div className={s.windowTop}><span className={s.windowMark}><Image src="/brand/tms-logo.png" width={32} height={30} alt=""/>TMS</span><span>Один заказ · вся история</span><span className={s.windowDots} aria-hidden="true"><i/><i/><i/></span></div>
   <div className={s.windowBody}>
    <div ref={first} data-hero-step="0" data-hero-meaning data-glass-message="incoming" className={`${s.message} ${s.incoming}`}><span className={s.messageLabel}>Клиент</span><p>Можно повторить прошлый заказ?</p></div>
    <div className={s.contextStrip} data-hero-step="1" data-hero-reveal><div><b>Договорённости рядом</b><span>История общения · состав · срок</span></div></div>
    <div ref={outgoing} data-glass-message="outgoing" className={`${s.message} ${s.outgoing}`} data-hero-step="2" data-hero-reveal><div className={s.messageSupport}><span className={s.messageLabel}>Менеджер · CRM</span><p>Заказ согласован. Передаём в работу.</p></div></div>
    <div className={s.handoff} data-hero-step="3" data-hero-reveal><div className={s.handoffTop}><span className={s.omsBadge}>OMS</span><b>Заказ принят в работу</b><Check/></div><div className={s.nextAction}><span>Следующее действие</span><strong>Подготовить заказ к передаче</strong><span className={s.owner}><i aria-hidden="true"/>Ответственный назначен</span></div></div>
   </div>
  </div>
  <figcaption className={s.storyCaption}><div><b>Пример процесса</b><span>{reduced?'От обращения до действия команды':steps[phase]}</span></div><div className={s.storyControls}>
   <div className={s.playbackCapsule} aria-label={`Этап ${phase+1} из 4: ${steps[phase]}`} role="img">{steps.map((step,i)=><span key={step} data-progress data-current={i===phase} style={{'--step-progress':1} as CSSProperties}><i/></span>)}</div>
   <button type="button" className={s.iconButton} aria-label={label} disabled={reduced} onClick={()=>replayHere?motion.current?.replay():motion.current?.toggle()}><ControlIcon kind={replayHere?'replay':paused?'play':'pause'}/></button>
   <button type="button" className={s.iconButton} aria-label="Повторить историю" disabled={reduced||!completed||compact} aria-hidden={compact||undefined} style={compact?{visibility:'hidden'}:undefined} onClick={()=>motion.current?.replay()}><ControlIcon kind="replay"/></button>
  </div></figcaption>
  <noscript><p className={s.noJs}>Показана вся история. Управление воспроизведением доступно с JavaScript.</p></noscript>
 </figure>;
}
