'use client';
import {useCallback,useLayoutEffect,useRef,useState} from 'react';
import {useLayoutMotion} from '../motion/useLayoutMotion';

type Frame={node:HTMLElement;height:number;top:number;bottom:string;copy:HTMLElement|null};
function inertCopy(node:HTMLElement){
 const copy=node.cloneNode(true) as HTMLElement;
 copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
 copy.setAttribute('aria-hidden','true');copy.inert=true;copy.style.pointerEvents='none';
 copy.querySelectorAll('a').forEach(a=>{a.removeAttribute('href');a.tabIndex=-1;});
 return copy;
}
/** Desktop-only presentation. Mobile retains the approved B7 disclosure controller. */
export function useCaseMotion(target:string){
 const {root,prepare:prepareMobile}=useLayoutMotion(target,{ghosts:true});
 const epoch=useRef(0);
 const [presented,setPresented]=useState(target);
 const latest=useRef(target);
 const offset=useRef('0 0');
 const frames=useRef<Frame[]>([]),animations=useRef<Animation[]>([]),ghosts=useRef<HTMLElement[]>([]);
 const clear=useCallback(()=>{
  epoch.current++;
  animations.current.forEach(a=>a.cancel());animations.current=[];
  ghosts.current.forEach(n=>{n.parentElement?.removeAttribute('data-case-leaving');n.remove();});ghosts.current=[];
 },[]);
 function prepare(){
  const scope=root.current;if(!scope)return;
  if(matchMedia('(max-width:900px)').matches){clear();prepareMobile();return;}
  // Capture the currently presented frame BEFORE cancelling, including an interrupted disclosure.
  frames.current=[...scope.querySelectorAll<HTMLElement>('[data-motion-size]')].map(node=>({node,height:node.getBoundingClientRect().height,top:node.querySelector('summary')!.getBoundingClientRect().height,bottom:getComputedStyle(node.querySelector('summary')!).paddingBottom,copy:node.querySelector<HTMLElement>(':scope > [data-motion-copy],:scope > [data-case-ghost]')?inertCopy(node.querySelector<HTMLElement>(':scope > [data-case-ghost]')??node.querySelector<HTMLElement>(':scope > [data-motion-copy]')!):null}));
  const stage=scope.querySelector<HTMLElement>('[data-case-visual-stage] > [data-case-live]');
  offset.current=stage?getComputedStyle(stage).translate:'0 0';
  clear();
 }
 useLayoutEffect(()=>{
  latest.current=target;
  const scope=root.current;if(!scope)return;
  scope.setAttribute('data-case-ready','');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const captured=frames.current;frames.current=[];
  if(!reduced.matches&&parseFloat(getComputedStyle(document.documentElement).fontSize)<=20&&matchMedia('(min-width:901px)').matches&&captured.length){
   const play=(node:Element,keyframes:Keyframe[],options:KeyframeAnimationOptions={})=>{const a=node.animate(keyframes,{duration:360,easing:'cubic-bezier(.22,.75,.25,1)',...options});animations.current.push(a);void a.finished.then(()=>{if(options.fill!=='forwards'){a.cancel();animations.current=animations.current.filter(x=>x!==a);}},()=>{});return a;};
   const measures=captured.map(f=>({...f,end:f.node.getBoundingClientRect().height,summary:f.node.querySelector<HTMLElement>('summary')!,endTop:f.node.querySelector('summary')!.getBoundingClientRect().height}));
   for(const f of measures){
    if(f.copy&&!f.node.matches('[open]')&&f.height>f.end+.5){f.copy.setAttribute('data-case-ghost','');Object.assign(f.copy.style,{position:'absolute',inset:`${f.top}px 0 auto`,display:'block'});f.node.setAttribute('data-case-leaving','');f.node.append(f.copy);ghosts.current.push(f.copy);play(f.copy,[{top:`${f.top}px`},{top:`${f.endTop}px`}]);}
    if(Math.abs(f.height-f.end)>.5)play(f.node,[{height:`${f.height}px`,overflow:'clip'},{height:`${f.end}px`,overflow:'clip'}]);
    const endPadding=getComputedStyle(f.summary).paddingBottom;if(f.bottom!==endPadding)play(f.summary,[{paddingBottom:f.bottom},{paddingBottom:endPadding}]);
   }
   const stage=scope.querySelector<HTMLElement>('[data-case-visual-stage] > [data-case-live]');
   const token=epoch.current;
   // One visible figure, no snapshot tree, no readable fade/mask. Retarget its current offset.
   if(stage){
    const depart=play(stage,[{translate:offset.current==='none'?'0 0':offset.current},{translate:'-4px 0'}],{duration:110,fill:'forwards'});
    void depart.finished.then(()=>{
     if(token!==epoch.current)return;
     setPresented(latest.current);
     const arrive=play(stage,[{translate:'-4px 0'},{translate:'0 0'}],{duration:250,fill:'forwards'});
     depart.cancel();
     void arrive.finished.then(()=>{if(token===epoch.current)clear();},()=>{});
    },()=>{});
   }
  }else{setPresented(target);clear();}
  const stop=()=>{clear();frames.current=[];setPresented(latest.current);};
  const hidden=()=>{if(document.hidden)stop();};
  window.addEventListener('resize',stop);window.visualViewport?.addEventListener('resize',stop);reduced.addEventListener('change',stop);document.addEventListener('visibilitychange',hidden);
  return()=>{clear();window.removeEventListener('resize',stop);window.visualViewport?.removeEventListener('resize',stop);reduced.removeEventListener('change',stop);document.removeEventListener('visibilitychange',hidden);};
 },[target,root,clear]);
 return{root,prepare,presented};
}
