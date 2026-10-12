'use client';
import {useLayoutEffect,useRef,useState,useSyncExternalStore,type FocusEvent,type KeyboardEvent} from 'react';
import {storyContent, type TopicId} from './story-content';
import {useLayoutMotion} from '../motion/useLayoutMotion';
import {StoryCopy} from './StoryCopy';
import {StoryAtmosphere} from './StoryAtmosphere';
import s from './content.module.css';
import shared from './review.module.css';

const subscribe=(fn:()=>void)=>{const q=matchMedia('(max-width:900px)');q.addEventListener('change',fn);return()=>q.removeEventListener('change',fn);};
const subscribeHydration=()=>()=>{};

export function StoryExperience({openForm}:{openForm:(topic:TopicId)=>void}) {
 const [active,setActive]=useState<TopicId>('crm-history');
 const [focused,setFocused]=useState<TopicId>('crm-history');
 const nav=useRef<HTMLDivElement>(null);
 const mobile=useSyncExternalStore(subscribe,()=>matchMedia('(max-width:900px)').matches,()=>false);
 const enhanced=useSyncExternalStore(subscribeHydration,()=>true,()=>false);
 const {root:motionRoot,prepare:prepareMotion}=useLayoutMotion(active);
 const scene=storyContent.scenes.find(t=>t.id===active)!;
 useLayoutEffect(()=>{
  const repairBeforeBlur=()=>{
   const el=document.activeElement;
   if(matchMedia('(max-width:900px)').matches&&el instanceof HTMLElement&&nav.current?.contains(el)&&el.matches('[role="tab"]')&&!el.getClientRects().length){
    nav.current.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus({preventScroll:true});
   }
  };
  window.addEventListener('resize',repairBeforeBlur);
  return()=>window.removeEventListener('resize',repairBeforeBlur);
 },[]);
 function keepVisibleFocus(e:FocusEvent<HTMLButtonElement>){
  // A tab hidden at the mobile boundary is blurred by the browser. Handle the
  // blur itself: resize and media-query events can arrive before or after it.
  if(!e.relatedTarget&&matchMedia('(max-width:900px)').matches&&!e.currentTarget.getClientRects().length){
   const hiddenTab=e.currentTarget;
   // Let the native blur finish before restoring focus; do not override a new destination.
   queueMicrotask(()=>{
    if(hiddenTab.isConnected&&!hiddenTab.getClientRects().length&&(document.activeElement===document.body||document.activeElement===hiddenTab)){
     nav.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus({preventScroll:true});
    }
   });
  }
 }
 function choose(id:TopicId){if(id===active)return;prepareMotion();setActive(id);setFocused(id);}
 function keyboard(e:KeyboardEvent<HTMLButtonElement>){
  // CSS can switch before the media-store render commits after resize.
  const compact=matchMedia('(max-width:900px)').matches;
  const visible=storyContent.scenes.filter(t=>!compact||t.product===scene.product);
  const index=visible.findIndex(t=>t.id===e.currentTarget.dataset.topic);
  const next=e.key==='ArrowDown'?(index+1)%visible.length:e.key==='ArrowUp'?(index-1+visible.length)%visible.length:e.key==='Home'?0:e.key==='End'?visible.length-1:-1;
  if(next<0)return;e.preventDefault();const id=visible[next].id;setFocused(id);nav.current?.querySelector<HTMLButtonElement>(`[data-topic="${id}"]`)?.focus({preventScroll:true});
 }
 return <section className={s.section} aria-labelledby="products-title" data-story-experience data-topic={active} data-enhanced={enhanced}>
  <StoryAtmosphere/>
  <div className={`${shared.container} ${s.layout}`}>
   <div id="products" className={s.intro} data-a3-intro><div><p className={shared.eyebrow}>{storyContent.section.eyebrow}</p><h2 id="products-title">{storyContent.section.heading}</h2></div></div>
   <div ref={motionRoot} className={s.workspace} data-a3-workspace>
    <div className={s.navigation}>
     <div className={s.mobileProducts} data-motion-selection aria-label="Направления TMS">{storyContent.products.map(p=><button type="button" key={p.id} aria-pressed={scene.product===p.id} onClick={()=>choose(storyContent.scenes.find(t=>t.product===p.id)!.id)}><b>{p.name}</b></button>)}</div>
     <div ref={nav} className={s.topics} data-motion-selection role="tablist" aria-label="Темы о TMS" aria-orientation="vertical">{storyContent.products.map(p=><div key={p.id} role="presentation" className={s.topicGroup} data-selected-product={p.id===scene.product}>
      <div className={s.groupLabel} data-a3-group><b>{p.name}</b></div>
      {storyContent.scenes.filter(t=>t.product===p.id).map(t=><button type="button" role="tab" id={`topic-${t.id}`} key={t.id} data-topic={t.id} aria-controls="tms-story-panel" aria-selected={active===t.id} tabIndex={(mobile&&storyContent.scenes.find(v=>v.id===focused)?.product!==scene.product?active:focused)===t.id?0:-1} onFocus={()=>setFocused(t.id)} onBlur={keepVisibleFocus} onKeyDown={keyboard} onClick={()=>choose(t.id)}><span>{t.navLabel}</span><svg className={s.selectionMark} aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></button>)}
     </div>)}</div>
    </div>
    <div className={s.panel} data-motion-size id="tms-story-panel" role={enhanced?'tabpanel':undefined} aria-labelledby={enhanced?`topic-${active}`:'scene-title'} tabIndex={enhanced?0:undefined}>
     <div className={s.scene} data-motion-copy key={active} data-scene={active}>
      <StoryCopy topic={active} openForm={openForm}/>
     </div>
    </div>
   </div>
   <noscript><div className={s.staticOverview}><p>Все темы доступны ниже. Для переключения тем нужен JavaScript.</p>{storyContent.scenes.map(t=><details key={t.id}><summary>{storyContent.products.find(p=>p.id===t.product)!.name} · {t.navLabel}</summary><h3>{t.heading}</h3><p>{t.body}</p><p>{t.explanation.body}</p><a href={t.secondaryLink.href}>{t.secondaryLink.label}</a></details>)}</div></noscript>
  </div>
 </section>;
}
