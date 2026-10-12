'use client';
import{useCallback,useLayoutEffect,useRef,type RefObject}from'react';
/** One existing editor, finite height animation; hidden state is restored on
 * completion, interruption, resize, reduced motion or unmount. No copied inputs. */
export function useCompactEditorMotion(root:RefObject<HTMLDivElement|null>,target:string,compact:boolean){
 const before=useRef<{height:number,paddingTop:string,paddingBottom:string,borderTopWidth:string}|null>(null),running=useRef<Animation|null>(null),restore=useRef<(()=>void)|null>(null);
 const stop=useCallback(()=>{running.current?.cancel();running.current=null;restore.current?.();restore.current=null;},[]);
 function prepare(){const node=root.current?.querySelector<HTMLElement>('[data-calc-inputs]');if(!node)return;const height=node.getBoundingClientRect().height,css=getComputedStyle(node);const frame={height,paddingTop:height?css.paddingTop:'0px',paddingBottom:height?css.paddingBottom:'0px',borderTopWidth:height?css.borderTopWidth:'0px'};stop();before.current=frame;}
 useLayoutEffect(()=>{
  const start=before.current;before.current=null;const node=root.current?.querySelector<HTMLElement>('[data-calc-inputs]');const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  if(!compact||start===null||!node||reduced.matches||!node.animate){stop();return;}
  const end=node.getBoundingClientRect().height,css=getComputedStyle(node);if(Math.abs(end-start.height)<.5)return;const endFrame={height:`${end}px`,paddingTop:end?css.paddingTop:'0px',paddingBottom:end?css.paddingBottom:'0px',borderTopWidth:end?css.borderTopWidth:'0px'};
  const display=node.style.display,overflow=node.style.overflow;
  node.style.display='block';node.style.overflow='clip';restore.current=()=>{node.style.display=display;node.style.overflow=overflow;};
  const a=node.animate([{...start,height:`${start.height}px`},endFrame],{duration:260,easing:'cubic-bezier(.22,.75,.25,1)'});running.current=a;
  void a.finished.then(()=>{if(running.current===a)stop();},()=>{});
  const hidden=()=>{if(document.hidden)stop();};window.addEventListener('resize',stop);window.visualViewport?.addEventListener('resize',stop);reduced.addEventListener('change',stop);document.addEventListener('visibilitychange',hidden);
  return()=>{stop();window.removeEventListener('resize',stop);window.visualViewport?.removeEventListener('resize',stop);reduced.removeEventListener('change',stop);document.removeEventListener('visibilitychange',hidden);};
 },[root,target,compact,stop]);
 return prepare;
}
