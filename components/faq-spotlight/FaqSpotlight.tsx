'use client';
import {useId,useLayoutEffect,useRef,useState,useSyncExternalStore,type KeyboardEvent} from 'react';
import {IntrinsicSlot} from '../b9-stability/IntrinsicSlot';
import {Action} from '@/components/site-v6/Consultation';
import {searchFaq} from '@/lib/faq-search';
import {faqItems,faqCopy,type FaqId} from './content';
import {FaqIcon} from './FaqIcon';
import './faq-spotlight.css';
const subscribe=()=>()=>{};
const clientSnapshot=()=>true,serverSnapshot=()=>false;
export function FaqSpotlight(){
 const hydrated=useSyncExternalStore(subscribe,clientSnapshot,serverSnapshot);
 const uid=useId(),inputId=`${uid}-search`,listId=`${uid}-results`,headingId=`${uid}-heading`;
 const [selectedId,setSelectedId]=useState<FaqId>('products');
 const [query,setQuery]=useState(''),[popupOpen,setPopupOpen]=useState(false),[activeId,setActiveId]=useState<FaqId|null>(null);
 const [previousId,setPreviousId]=useState<FaqId|null>(null),[announcement,setAnnouncement]=useState('');
 const input=useRef<HTMLInputElement>(null),panel=useRef<HTMLDivElement>(null),copy=useRef<HTMLDivElement>(null),ghost=useRef<HTMLDivElement>(null),action=useRef<HTMLDivElement>(null);
 const previousHeight=useRef<number|null>(null),composing=useRef(false),animations=useRef<Animation[]>([]);
 const selected=faqItems.find(x=>x.id===selectedId)!,previous=faqItems.find(x=>x.id===previousId);
 const results=searchFaq(faqItems,query),searching=popupOpen&&query.trim().length>0;
 const expanded=searching&&results.length>0;
 function cancelMotion(){animations.current.forEach(a=>a.cancel());animations.current=[];}
 function closeSearch(){setPopupOpen(false);setActiveId(null);}
 function choose(id:FaqId){
  setQuery('');closeSearch();
  if(id===selectedId)return;
  previousHeight.current=panel.current?.getBoundingClientRect().height??null;
  setPreviousId(searching?null:selectedId);setSelectedId(id);
  setAnnouncement(`Выбран ответ: ${faqItems.find(x=>x.id===id)!.question}`);
 }
 function confirm(id:FaqId){choose(id);input.current?.focus({preventScroll:true});}
 function keyboard(event:KeyboardEvent<HTMLInputElement>){
  if(composing.current||event.nativeEvent.isComposing||event.keyCode===229)return;
  if(event.key==='Escape'){closeSearch();return;}
  if(event.key==='Tab'){closeSearch();return;}
  if((event.key==='ArrowDown'||event.key==='ArrowUp')&&query.trim()&&results.length){
   event.preventDefault();setPopupOpen(true);
   const current=results.findIndex(x=>x.id===activeId);
   const next=event.key==='ArrowDown'?Math.min(current+1,results.length-1):current<0?results.length-1:Math.max(0,current-1);
   setActiveId(results[next].id);return;
  }
  if(event.key==='Enter'&&expanded){
   const result=results.find(x=>x.id===activeId)??(results.length===1?results[0]:null);
   if(result){event.preventDefault();confirm(result.id);}
  }
 }
 useLayoutEffect(()=>{
  cancelMotion();
  if(!hydrated||!panel.current||!copy.current||searching||previousHeight.current===null)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches||typeof copy.current.animate!=='function'){previousHeight.current=null;return;}
  const height=panel.current.getBoundingClientRect().height;
  const stable=matchMedia('(min-width:901px)').matches&&parseFloat(getComputedStyle(document.documentElement).fontSize)<=20;
  const shape=stable?undefined:panel.current.animate([{height:`${previousHeight.current}px`},{height:`${height}px`}],{duration:360,easing:'cubic-bezier(.22,.75,.25,1)'});
  const enter=copy.current.animate([{transform:stable?'translateX(4px)':'translateY(4px)'},{transform:'translate(0)'}],{duration:240,easing:'cubic-bezier(.2,.7,.25,1)'});
  const leave=undefined; // No translucent or overlapping readable copy.
  const arrive=stable?undefined:action.current?.animate([{translate:'0 2px'},{translate:'0 0'}],{duration:160,easing:'ease-out'});
  animations.current=[...(shape?[shape]:[]),enter,...(leave?[leave]:[]),...(arrive?[arrive]:[])];
  // No timers/rAF or callback that can restore an obsolete selection.
  for(const animation of animations.current)void animation.finished.then(()=>animation.cancel(),()=>{});
  previousHeight.current=null;
  const stop=()=>cancelMotion();const hidden=()=>{if(document.hidden)cancelMotion();};document.addEventListener('visibilitychange',hidden);window.addEventListener('resize',stop);reduced.addEventListener('change',stop);
  return()=>{cancelMotion();document.removeEventListener('visibilitychange',hidden);window.removeEventListener('resize',stop);reduced.removeEventListener('change',stop);};
 },[selectedId,searching,hydrated]);
 return <section className={'tms-b6-faq-section'} id="faq" aria-labelledby={headingId} data-faq-spotlight data-selected={selectedId} data-hydrated={hydrated}>
  <div className={'tms-b6-faq-container'}><h2 id={headingId}>{faqCopy.heading}</h2>
  <div className={'tms-b6-faq-interactive'} inert={!hydrated}>
   <div className={'tms-b6-faq-toolbar'}>
    <div className={'tms-b6-faq-search'}><label htmlFor={inputId} className={'tms-b6-faq-srOnly'}>{faqCopy.searchLabel}</label><FaqIcon kind="search"/><input ref={input} disabled={!hydrated} id={inputId} type="text" role="combobox" value={query} placeholder={faqCopy.placeholder} maxLength={200} autoComplete="off" autoCapitalize="none" spellCheck={false} aria-autocomplete="list" aria-expanded={expanded} aria-controls={listId} aria-activedescendant={expanded&&activeId?`${uid}-option-${activeId}`:undefined}
     onChange={e=>{setQuery(e.target.value);setPopupOpen(true);setActiveId(null);}}
     onFocus={()=>{if(query.trim())setPopupOpen(true);}} onBlur={e=>{if(!e.currentTarget.closest('[data-faq-spotlight]')?.contains(e.relatedTarget))closeSearch();}} onKeyDown={keyboard}
     onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={()=>{composing.current=false;}}/>
     {query&&<button className={'tms-b6-faq-clear'} type="button" aria-label="Очистить поиск" onClick={()=>{setQuery('');closeSearch();input.current?.focus({preventScroll:true});}}><FaqIcon kind="clear"/></button>}
    </div>
    <div className={'tms-b6-faq-topics'} role="group" aria-label="Темы ответов">{faqItems.map(item=><button key={item.id} type="button" className={'tms-b6-faq-topic'} aria-pressed={item.id===selectedId} onClick={e=>{e.currentTarget.focus({preventScroll:true});choose(item.id);}} data-faq-topic={item.id}><span className={'tms-b6-faq-lens'} aria-hidden="true"/><FaqIcon kind={item.id}/><span className={'tms-b6-faq-topicLabel'}>{item.label}</span></button>)}</div>
   </div>
   <div ref={panel} className={'tms-b6-faq-panel'} data-faq-panel>
    <IntrinsicSlot className={'tms-b6-faq-copyArea'} enabled={!searching} reserve={faqItems.map(item=><div key={item.id}><h3>{item.question}</h3><p>{item.answer}</p></div>)}>
     <div id={listId} role="listbox" aria-label="Совпадения в ответах" hidden={!expanded} className={'tms-b6-faq-results'}>{expanded&&results.map(item=><div key={item.id} id={`${uid}-option-${item.id}`} role="option" aria-selected={activeId===item.id} className={'tms-b6-faq-result'} onPointerDown={e=>e.preventDefault()} onClick={()=>confirm(item.id)}><FaqIcon kind={item.id}/><div><span>{item.label}</span><p>{item.question}</p></div></div>)}</div>
     {searching?!results.length&&<div><h3>{faqCopy.emptyTitle}</h3><p>{faqCopy.emptyBody}</p></div>:<><div ref={copy} data-faq-answer><h3>{selected.question}</h3><p>{selected.answer}</p></div>{previous&&<div ref={ghost} className={'tms-b6-faq-ghost'} aria-hidden="true" inert><h3>{previous.question}</h3><p>{previous.answer}</p></div>}</>}
    </IntrinsicSlot>
    <div ref={action} className={'tms-b6-faq-action'}><Action/></div>
   </div>
   <p className={'tms-b6-faq-srOnly'} role="status" aria-live="polite" aria-atomic="true">{searching?(results.length?`Найдено ответов: ${results.length}`:faqCopy.emptyTitle):announcement}</p>
  </div>
  <noscript><style>{'.tms-b6-faq-interactive{display:none!important}'}</style><div className={'tms-b6-faq-staticAnswers'} data-faq-static>{faqItems.map(item=><article className={'tms-b6-faq-panel'} key={item.id}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div></noscript>
  </div>
 </section>;
}
