'use client';
import {useEffect,useLayoutEffect,useRef,useState,useSyncExternalStore} from 'react';
import copy from '@/content/legal/privacy-ui.json';
import {usePrivacy} from './privacy/PrivacyProvider';
import notice from './cookie-notice.module.css';
import s from './legal.module.css';
const key='tms:cookie-notice:v1';let dismissed=false;
const subscribe=(fn:()=>void)=>{window.addEventListener('tms-notice',fn);window.addEventListener('storage',fn);return()=>{window.removeEventListener('tms-notice',fn);window.removeEventListener('storage',fn);};};
function snapshot(){try{return !dismissed&&localStorage.getItem(key)!=='closed';}catch{return !dismissed;}}
function notify(){window.dispatchEvent(new Event('tms-notice'));}
export function ShowCookieNotice(){const {state}=usePrivacy();if(state.config.enabled)return null;return <button type="button" className={s.textButton} onClick={()=>{dismissed=false;try{localStorage.removeItem(key);}catch{}notify();}}>Показать уведомление снова</button>;}
export function CookieNotice(){
 const acknowledgedVisible=useSyncExternalStore(subscribe,snapshot,()=>false),{state,choose}=usePrivacy();
 const available=state.config.enabled,visible=state.hydrated&&(available?state.decision==='unknown':acknowledgedVisible),ref=useRef<HTMLElement>(null),reserve=useRef<HTMLDivElement>(null);
 const [present,setPresent]=useState(visible),animation=useRef<Animation|null>(null);
 if(visible&&!present)setPresent(true);
 useLayoutEffect(()=>{
  const panel=ref.current;if(!panel||!present)return;
  animation.current?.cancel();
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const settle=()=>{animation.current?.cancel();animation.current=null;if(!visible)setPresent(false);};
  if(!visible&&panel.contains(document.activeElement)){
   const target=document.querySelector<HTMLElement>('main h1,main h2,main');target?.setAttribute('tabindex','-1');target?.focus({preventScroll:true});
  }
  if(reduced.matches||!panel.animate){if(!visible)queueMicrotask(settle);return;}
  const compact=matchMedia('(max-width:600px)').matches;
  const effect=panel.animate(visible?[{translate:`0 ${compact?6:9}px`},{translate:'0 0'}]:[{translate:'0 0'},{translate:`0 ${compact?4:6}px`}],{duration:visible?(compact?220:280):170,easing:'cubic-bezier(.22,.75,.25,1)'});
  animation.current=effect;let current=true;
  void effect.finished.then(()=>{if(current){effect.cancel();animation.current=null;if(!visible)setPresent(false);}},()=>{});
  const hidden=()=>{if(document.hidden)settle();};
  reduced.addEventListener('change',settle);window.addEventListener('resize',settle);document.addEventListener('visibilitychange',hidden);
  return()=>{current=false;effect.cancel();reduced.removeEventListener('change',settle);window.removeEventListener('resize',settle);document.removeEventListener('visibilitychange',hidden);};
 },[visible,present]);
 useEffect(()=>{if(!visible||!present)return;const panel=ref.current!,space=reserve.current!;const old=document.documentElement.style.scrollPaddingBottom;let active=true;
 const measure=()=>{
  if(!active)return;
  const focus=document.activeElement,typing=focus instanceof HTMLElement&&!panel.contains(focus)&&focus.matches('input,textarea,[contenteditable=true]');
  const modal=!!document.querySelector('dialog[open]');const viewport=window.visualViewport;
  const keyboard=viewport?Math.max(0,innerHeight-viewport.height-viewport.offsetTop):0;
  panel.hidden=modal||typing||keyboard>120;
  panel.style.setProperty('--keyboard-bottom',`${keyboard}px`);
  const measured=panel.getBoundingClientRect().height;panel.dataset.flow=String(measured>(viewport?.height??innerHeight)*.55);
  const height=panel.hidden||panel.dataset.flow==='true'?0:measured+32;space.style.height=`${height}px`;document.documentElement.style.scrollPaddingBottom=`${height}px`;
 };
 const keepFocusVisible=()=>{measure();const focused=document.activeElement;if(!(focused instanceof HTMLElement)||panel.contains(focused)||panel.hidden)return;const r=focused.getBoundingClientRect(),top=panel.getBoundingClientRect().top;if(r.bottom>top-16)window.scrollBy({top:r.bottom-top+24,behavior:'instant'});};
 const blur=()=>queueMicrotask(measure);
 const observer=new MutationObserver(measure);observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});const resize=new ResizeObserver(measure);resize.observe(panel);window.visualViewport?.addEventListener('resize',measure);document.addEventListener('focusin',keepFocusVisible);document.addEventListener('focusout',blur);measure();return()=>{active=false;observer.disconnect();resize.disconnect();window.visualViewport?.removeEventListener('resize',measure);document.removeEventListener('focusin',keepFocusVisible);document.removeEventListener('focusout',blur);space.style.height='0px';document.documentElement.style.scrollPaddingBottom=old;};
 },[visible,present]);
 if(!present)return null;

 return <><div ref={reserve} aria-hidden="true"/><aside ref={ref} className={notice.panel} data-available={available} data-presence={visible?'entered':'exit'} inert={!visible} aria-hidden={!visible} data-analytics-choice={available?'unknown':undefined} aria-label="О данных в браузере" data-cookie-notice><div><h2>{available?copy.available.title:copy.off.title}</h2><p>{available?copy.available.text:copy.off.text}</p><a href="/cookies">{available?copy.available.settings:copy.off.link}</a>{available&&<> · <a href="/analytics-consent">{copy.available.consentLink}</a></>}</div>{available?<div className={notice.actions}><button type="button" onClick={()=>void choose('denied')}>{copy.available.deny}</button><button type="button" disabled={state.checking} onClick={()=>void choose('granted')}>{state.checking?'Проверяем настройки…':copy.available.allow}</button></div>:<button type="button" onClick={()=>{dismissed=true;try{localStorage.setItem(key,'closed');}catch{}notify();}}>Понятно</button>}</aside></>;
}
