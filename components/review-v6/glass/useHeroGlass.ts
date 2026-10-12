'use client';
import {useEffect,type RefObject} from 'react';
import type {HeroMotion} from './hero-motion';
import {autoPolicy,startGlassSession,type GlassMode,type GlassRuntime,type GlassStatus} from './session';

// One shared renderer lease. The upstream /gpu API explicitly provides disposal.
// A short grace period avoids cold reloads at the viewport edge / StrictMode.
let users=0,releaseTimer:ReturnType<typeof setTimeout>|undefined;
let disposal:Promise<void>=Promise.resolve();
async function acquire():Promise<GlassRuntime>{
 const [dom,gpu]=await Promise.all([import('@glass-sdk/liquid-glass/dom'),import('@glass-sdk/liquid-glass/gpu')]);
 clearTimeout(releaseTimer);users++;await disposal;
 let released=false;
 return {createGlassScene:dom.createGlassScene,release(){
  if(released)return;released=true;users--;
  if(!users)releaseTimer=setTimeout(()=>{
   dom.clearMaterialMapCache();
   disposal=gpu.disposeMaterialRenderer().catch(()=>{});
  },2000);
 }};
}
const owners=new WeakMap<HTMLElement,()=>void>();
type Refs={motion:RefObject<HeroMotion|null>;root:RefObject<HTMLDivElement|null>;background:RefObject<HTMLDivElement|null>;incoming:RefObject<HTMLDivElement|null>;outgoing:RefObject<HTMLDivElement|null>};
type NavigatorGPU=Navigator & {gpu?:{requestAdapter:()=>Promise<unknown>}};
export function useHeroGlass(refs:Refs){
 const {root,background,incoming,outgoing,motion}=refs;
 useEffect(()=>{
  const scene=root.current,bg=background.current,first=incoming.current,last=outgoing.current;
  if(!scene||!bg||!first||!last)return;
  owners.get(scene)?.();
  let disposed=false,inRange=false,stop:(()=>void)|undefined,offTimer:ReturnType<typeof setTimeout>|undefined;
  const query=new URLSearchParams(location.search).get('glass');
  const mode:GlassMode=query==='css'||query==='sdk'?query:'auto';
  const prefs=['(forced-colors: active)','(prefers-reduced-transparency: reduce)','(prefers-contrast: more)'].map(q=>matchMedia(q));
  const compact=matchMedia('(max-width:600px)');
  const publish=(s:GlassStatus)=>{
   if(disposed)return;
   scene.setAttribute('data-glass-state',s.state);scene.setAttribute('data-glass-reason',s.reason??'');
   // A bounded latest sample for local QA; nothing leaves this page.
   scene.setAttribute('data-glass-diagnostic',JSON.stringify(s));
   scene.dispatchEvent(new CustomEvent('tms:glass-status',{detail:s}));
  };
  scene.setAttribute('data-glass-mode',mode);
  const halt=(reason:string)=>{clearTimeout(offTimer);const release=stop;stop=undefined;release?.();publish({state:'suspended',reason});};
  const start=()=>{
   if(disposed||stop)return;
   const restricted=prefs.find(p=>p.matches);
   const reason=mode==='css'?'css-mode':restricted?'accessibility-preference':!isSecureContext?'insecure-context':mode==='auto'?autoPolicy(navigator.userAgent,navigator.maxTouchPoints,matchMedia('(pointer: coarse)').matches):null;
   if(reason){publish({state:mode==='css'||reason==='diagnostic-only-material-parity'?'css':'fallback',reason});return;}
   if(!(navigator as NavigatorGPU).gpu){publish({state:'fallback',reason:'gpu-unavailable'});return;}
   if(!inRange||document.visibilityState!=='visible'){publish({state:'suspended',reason:'offscreen'});return;}
   stop=startGlassSession({root:scene,background:bg,incoming:first,outgoing:last},{compact:compact.matches,animator:{frame:(now,quiet)=>motion.current?.frame(now,quiet),dispose(){}}},{
    probe:()=> (navigator as NavigatorGPU).gpu!.requestAdapter(),load:acquire,now:()=>performance.now(),publish,
   });
  };
  const sync=()=>{halt('environment-change');start();};
  const visibility=()=>{if(document.visibilityState!=='visible')halt('background');else start();};
  const observer=new IntersectionObserver(entries=>{
   inRange=entries.some(e=>e.isIntersecting);clearTimeout(offTimer);
   if(inRange)start();else offTimer=setTimeout(()=>halt('offscreen'),750);
  },{rootMargin:'200px 0px',threshold:0});
  observer.observe(scene);
  for(const p of prefs)p.addEventListener('change',sync);
  compact.addEventListener('change',sync);document.addEventListener('visibilitychange',visibility);
  // CSS mode is synchronous after mount and does not even import the SDK.
  if(mode==='css')publish({state:'css',reason:'css-mode'});
  const cleanup=()=>{
   if(disposed)return;halt('unmount');disposed=true;observer.disconnect();
   for(const p of prefs)p.removeEventListener('change',sync);
   compact.removeEventListener('change',sync);document.removeEventListener('visibilitychange',visibility);
   if(owners.get(scene)===cleanup)owners.delete(scene);
  };
  owners.set(scene,cleanup);return cleanup;
 },[root,background,incoming,outgoing,motion]);
}
