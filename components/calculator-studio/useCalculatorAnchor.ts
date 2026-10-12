'use client';
import {useEffect,type RefObject} from 'react';
/** Resolve the initial desktop fragment once after fonts/hydration. Never handles
 * disclosure, resize or subsequent scrolling; any user navigation cancels it. */
export function useCalculatorAnchor(section:RefObject<HTMLElement|null>){
 useEffect(()=>{
  if(location.hash!=='#calculator'||!matchMedia('(min-width:901px)').matches)return;
  let cancelled=false,frame=0;
  const cancel=()=>{cancelled=true;cancelAnimationFrame(frame);};
  const align=()=>{void document.fonts.ready.then(()=>{
   if(cancelled)return;
   frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
    if(!cancelled&&location.hash==='#calculator')section.current?.scrollIntoView({behavior:'instant',block:'start'});
   });});
  });};
  window.addEventListener('wheel',cancel,{passive:true});window.addEventListener('touchstart',cancel,{passive:true});window.addEventListener('keydown',cancel);window.addEventListener('pointerdown',cancel);
  if(document.readyState==='complete')align();else window.addEventListener('load',align,{once:true});
  return()=>{cancel();window.removeEventListener('load',align);window.removeEventListener('wheel',cancel);window.removeEventListener('touchstart',cancel);window.removeEventListener('keydown',cancel);window.removeEventListener('pointerdown',cancel);};
 },[section]);
}
