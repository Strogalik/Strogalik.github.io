"use client";
import {useLayoutEffect,useRef} from 'react';

type Frame={node:HTMLElement;height:number;copy:HTMLElement|null};
/** Presentation only: state changes synchronously; all unfinished motion is disposable. */
export function useLayoutMotion(target:unknown,{duration=320,ghosts=false}:{duration?:number;ghosts?:boolean}={}){
 const root=useRef<HTMLDivElement>(null),before=useRef<Frame[]>([]),running=useRef<Animation[]>([]),layers=useRef<HTMLElement[]>([]);
 const anchor=useRef<HTMLElement|null>(null);
 const selected=useRef<{node:HTMLElement;rect:DOMRect}[]>([]);
 function stop(){running.current.forEach(a=>a.cancel());running.current=[];layers.current.forEach(n=>{n.parentElement?.removeAttribute('data-motion-leaving');n.remove();});layers.current=[];}
 function prepare(){
  const scope=root.current;if(!scope)return;
  anchor.current=(scope.matches('[data-active-case],[data-case-selection]')&&document.activeElement instanceof HTMLElement&&document.activeElement.matches('summary')&&scope.contains(document.activeElement))?document.activeElement:null;
  const frames=[...scope.querySelectorAll<HTMLElement>('[data-motion-size]')].map(node=>({node,height:node.getBoundingClientRect().height,copy:ghosts&&node.matches('details[open]')?node.querySelector<HTMLElement>(':scope > [data-motion-copy]')?.cloneNode(true) as HTMLElement??null:null}));
  const choices=[...scope.querySelectorAll<HTMLElement>('[data-motion-selection]')].map(group=>group.querySelector<HTMLElement>('[aria-selected="true"],[aria-pressed="true"]')).filter((n):n is HTMLElement=>!!n).map(node=>({node,rect:node.getBoundingClientRect()}));
  stop();before.current=frames;selected.current=choices;
 }
 useLayoutEffect(()=>{
  const scope=root.current;if(!scope)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const frames=before.current;before.current=[];
  if(reduced.matches||!scope.animate){stop();return;}
  const play=(node:HTMLElement,frames:Keyframe[],options:KeyframeAnimationOptions={})=>{const a=node.animate(frames,{duration,easing:'cubic-bezier(.22,.75,.25,1)',...options});running.current.push(a);void a.finished.then(()=>{a.cancel();running.current=running.current.filter(x=>x!==a);},()=>{});return a;};
  // Read every target before writing any animation style.
  const measures=frames.map(f=>({...f,end:f.node.getBoundingClientRect().height,top:f.node.querySelector('summary')?.getBoundingClientRect().height??0}));
  for(const f of measures){
   if(Math.abs(f.height-f.end)<.5)continue;
   const compactCase=!f.node.closest('[data-b1-cases],[data-case-selection]')||matchMedia('(max-width:900px)').matches;
   if(!compactCase)continue;
   if(f.copy&&!f.node.matches('[open]')&&compactCase){
    const layer=f.copy;layer.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));layer.removeAttribute('id');layer.setAttribute('aria-hidden','true');layer.inert=true;layer.setAttribute('data-motion-ghost','');
    Object.assign(layer.style,{position:'absolute',top:`${f.top}px`,left:'0',right:'0',display:getComputedStyle(f.copy).display==='none'?'block':'',pointerEvents:'none'});
    // Detached computed style is empty: the class restores its original display.
    f.node.setAttribute('data-motion-leaving','');f.node.append(layer);layers.current.push(layer);
   }
   const a=play(f.node,[{height:`${f.height}px`,...(compactCase?{overflow:'clip'}:{})},{height:`${f.end}px`,...(compactCase?{overflow:'clip'}:{})}]);
   void a.finished.then(()=>{layers.current.filter(n=>n.parentElement===f.node).forEach(n=>{n.remove();f.node.removeAttribute('data-motion-leaving');});},()=>{});
  }
  if(frames.length)scope.querySelectorAll<HTMLElement>('[data-motion-copy]').forEach(n=>{if(n.closest('[data-motion-ghost]')||n.closest('details:not([open])'))return;const nodes=n.closest('[data-b1-cases],[data-case-selection]')?[...n.querySelectorAll<HTMLElement>('p,h2,svg')]:[n];for(const text of nodes)play(text,[{translate:'0 3px'},{translate:'0 0'}],{duration:240});});
  for(const old of selected.current){
   const group=old.node.closest('[data-motion-selection]');const node=group?.querySelector<HTMLElement>('[aria-selected="true"],[aria-pressed="true"]');
   if(!node||node===old.node||!node.getClientRects().length)continue;
   const r=node.getBoundingClientRect();
   play(node,[{transform:`translate(${old.rect.x-r.x}px,${old.rect.y-r.y}px)`,width:`${old.rect.width}px`,height:`${old.rect.height}px`},{transform:'translate(0,0)',width:`${r.width}px`,height:`${r.height}px`}],{pseudoElement:'::before'});
  }
  selected.current=[];
  let valid=true;const initiator=anchor.current;
  const cancel=()=>{valid=false;stop();};const manual=()=>{valid=false;};const hidden=()=>{if(document.hidden)cancel();};
  // Only compensate a selected case summary lost under the sticky header. Never
  // navigate back to the section, and never override a user's wheel/touch scroll.
  if(initiator&&matchMedia('(max-width:900px)').matches){
   void Promise.all(running.current.map(a=>a.finished.catch(()=>{}))).then(()=>{
    if(!valid||document.activeElement!==initiator||!initiator.isConnected)return;
    const top=initiator.getBoundingClientRect().top,edge=(document.querySelector('header')?.getBoundingClientRect().bottom??0)+12;
    if(top<edge)window.scrollBy({top:top-edge,behavior:'instant'});
   });
  }
  window.addEventListener('wheel',manual,{passive:true});window.addEventListener('touchmove',manual,{passive:true});window.addEventListener('resize',cancel);window.visualViewport?.addEventListener('resize',cancel);reduced.addEventListener('change',cancel);document.addEventListener('visibilitychange',hidden);
  return()=>{valid=false;stop();window.removeEventListener('wheel',manual);window.removeEventListener('touchmove',manual);window.removeEventListener('resize',cancel);window.visualViewport?.removeEventListener('resize',cancel);reduced.removeEventListener('change',cancel);document.removeEventListener('visibilitychange',hidden);};
 },[target,duration]);
 return{root,prepare};
}
