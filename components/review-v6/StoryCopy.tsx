'use client';
import Link from 'next/link';
import {useLayoutEffect,useRef,useState} from 'react';
import {storyContent,type TopicId} from './story-content';
import s from './content.module.css';
import shared from './review.module.css';

// One copy group owns the disclosure. Resize only measures available space; it
// never changes the selected topic, moves focus, or scrolls the page.
export function StoryCopy({topic,openForm}:{topic:TopicId;openForm:(topic:TopicId)=>void}) {
 const scene=storyContent.scenes.find(t=>t.id===topic)!;
 const product=storyContent.products.find(p=>p.id===scene.product)!;
 const [expanded,setExpanded]=useState(false);
 const copy=useRef<HTMLDivElement>(null);
 const content=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const el=copy.current!,body=content.current!;
  const section=el.closest('[data-story-experience]')!;
  const intro=section.querySelector('[data-a3-intro]')!;
  const workspace=section.querySelector('[data-a3-workspace]')!;
  const measure=()=>{
   const gap=workspace.getBoundingClientRect().top-intro.getBoundingClientRect().bottom;
   const roomy=innerWidth>1250&&innerHeight>=900&&parseFloat(getComputedStyle(document.documentElement).fontSize)<=18;
   const rise=roomy?Math.max(0,Math.min(32,body.scrollHeight*.22,gap-24)):0;
   el.style.setProperty('--disclosure-rise',`${rise}px`);
  };
  measure();const ro=new ResizeObserver(measure);ro.observe(body);ro.observe(intro);ro.observe(workspace);window.addEventListener('resize',measure);
  return()=>{ro.disconnect();window.removeEventListener('resize',measure);};
 },[]);
 return <div ref={copy} className={s.copyGroup} data-a3-copy data-expanded={expanded}>
  <div className={s.narrative}><p className={s.sceneProduct} data-a3-meta>{product.name}</p><h3 id="scene-title">{scene.heading}</h3><p className={s.body}>{scene.body}</p></div>
  <div className={s.sceneMore}>
   <div className={s.explanation}>
    <button type="button" data-a3-disclosure aria-expanded={expanded} aria-controls={`explanation-${topic}`} onClick={()=>setExpanded(v=>!v)}>{scene.explanation.label}<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 9h12" stroke="currentColor" strokeWidth="1.5"/>{!expanded&&<path d="M9 3v12" stroke="currentColor" strokeWidth="1.5"/>}</svg></button>
    <div id={`explanation-${topic}`} className={s.disclosureBody} aria-hidden={!expanded}><div ref={content}><p>{scene.explanation.body}</p></div></div>
   </div>
   <div className={s.sceneActions}><button type="button" onClick={()=>openForm(topic)} className={`${shared.button} ${shared.primary}`}>Обсудить задачу</button><Link href={scene.secondaryLink.href}>{scene.secondaryLink.label}</Link></div>
  </div>
 </div>;
}
