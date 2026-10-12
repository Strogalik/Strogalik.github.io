"use client";
import {useLayoutEffect,useRef,useState,useSyncExternalStore} from 'react';
import ui from '@/content/calculator-ui.b9.ru.json';
import {IntrinsicSlot} from '../b9-stability/IntrinsicSlot';
import spec from '@/content/calculator-spec.json';
import {numeric} from '@/lib/calculator';
import {conversionScenario,timeScenario} from '@/lib/calculator-extension';
import {useLayoutMotion} from '../motion/useLayoutMotion';
import s from './sections.module.css';
import d from './disclosure.module.css';
import m from './calculator-motion.module.css';
import studio from './calculator-studio.module.css';
import mobile from './calculator-mobile.module.css';
import {useCompactEditorMotion} from '../calculator-studio/useCompactEditorMotion';
import {DisclosureIcon} from './DisclosureIcon';
const fmt=(v:number)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:3}).format(v);
const signed=(v:number)=>(v>0?'+':'')+fmt(v);
const subscribe=(fn:()=>void)=>{const q=matchMedia('(max-width:900px)');q.addEventListener('change',fn);return()=>q.removeEventListener('change',fn);};
const hydration=()=>()=>{};
export function Calculator({className=''}:{className?:string}){
 const [mode,setMode]=useState<'conversion'|'manualWork'>('conversion');
 const [values,setValues]=useState<Record<string,string>>({requests:'400',baseRate:'10',scenarioRate:'12',people:'5',minutesPerDay:'30',workingDays:'22',averageDealValue:'',automationSharePercent:'',hourValue:''});
 const [editing,setEditing]=useState(false),[optional,setOptional]=useState(false),[dirty,setDirty]=useState(false),[announcement,setAnnouncement]=useState('');
 const compact=useSyncExternalStore(subscribe,()=>matchMedia('(max-width:900px)').matches,()=>false),hydrated=useSyncExternalStore(hydration,()=>true,()=>false);
 const edit=useRef<HTMLButtonElement>(null),editor=useRef<HTMLDivElement>(null);
 const {root:motionRoot,prepare:prepareMotion}=useLayoutMotion(`${mode}:${editing}:${optional}`,{duration:280});
 const prepareCompact=useCompactEditorMotion(motionRoot,`${mode}:${editing}`,compact);
 const prepareEditor=()=>{if(compact)prepareCompact();else prepareMotion();};
 let error='',deals:ReturnType<typeof conversionScenario>|undefined,time:ReturnType<typeof timeScenario>|undefined;
 try{if(mode==='conversion')deals=conversionScenario(values.requests,values.baseRate,values.scenarioRate,values.averageDealValue);else time=timeScenario(values.people,values.minutesPerDay,values.workingDays,values.automationSharePercent,values.hourValue);}catch(e){error=(e as Error).message;}
 const summary=mode==='conversion'?`${values.requests} обращений · с ${values.baseRate}% до ${values.scenarioRate}%`:`${values.people} сотрудников · ${values.minutesPerDay} мин/день · ${values.workingDays} дня`;
 const announce=()=>setAnnouncement(error|| (deals?`Изменение: ${signed(deals.deltaDeals)} ожидаемых сделок в месяц.`:`Объём: ${fmt(time?.currentHours??0)} часов в месяц.`));
 function done(){
  announce();
  if(error){
   const keys=[...spec[mode].inputs.map(i=>i.key),...(mode==='conversion'?['averageDealValue']:['automationSharePercent','hourValue'])];
   const invalid=keys.find(key=>{if(!spec[mode].inputs.some(i=>i.key===key)&&!values[key].trim())return false;try{numeric(values[key],['baseRate','scenarioRate','automationSharePercent'].includes(key)?100:Infinity);return false;}catch{return true;}})??keys[0];
   editor.current?.querySelector<HTMLElement>(`#calc-${invalid}`)?.focus();return;
  }
  prepareEditor();setEditing(false);edit.current?.focus({preventScroll:true});
 }
 useLayoutEffect(()=>{
  if(!announcement)return;const node=motionRoot.current?.querySelector<HTMLElement>('[data-calc-result]');const reduced=matchMedia('(prefers-reduced-motion:reduce)');if(!node?.animate||reduced.matches)return;
  const a=node.animate([{boxShadow:'inset 0 0 0 2px #a6c5d7'},{boxShadow:'inset 0 0 0 2px transparent'}],{duration:160,easing:'ease-out'});
  const stop=()=>a.cancel();void a.finished.then(stop,()=>{});reduced.addEventListener('change',stop);window.addEventListener('resize',stop);
  return()=>{stop();reduced.removeEventListener('change',stop);window.removeEventListener('resize',stop);};
 },[announcement,motionRoot]);
 const field=(key:string,label:string)=><label className={s.field} key={key} htmlFor={`calc-${key}`}><IntrinsicSlot reserve={spec.conversion.inputs.some(i=>i.key===key)||spec.manualWork.inputs.some(i=>i.key===key)?[spec.conversion,spec.manualWork].map((mode,n)=><span key={n}>{mode.inputs[[...spec.conversion.inputs,...spec.manualWork.inputs].findIndex(i=>i.key===key)%3]?.label}</span>):<span>{label}</span>}>{label}</IntrinsicSlot><input type="text" inputMode="decimal" id={`calc-${key}`} value={values[key]} onChange={e=>{setValues({...values,[key]:e.target.value});setDirty(true);}} onBlur={announce} aria-invalid={!!error} aria-describedby={error?'calc-error':'calc-note'}/></label>;
 return <div ref={motionRoot} className={`${s.calculator} ${className} ${m.calculator} ${studio.shell} ${mobile.shell}`} data-calculator data-editing={editing} data-ready={hydrated}>
 <div className={m.modeArea}><div className={s.modes} data-calc-modes aria-label="Режим расчёта"><button type="button" aria-pressed={mode==='conversion'} onClick={()=>{if(mode!=='conversion'){if(compact)prepareCompact();setMode('conversion');}}}>{ui.modes.conversion}</button><button type="button" aria-pressed={mode==='manualWork'} onClick={()=>{if(mode!=='manualWork'){if(compact)prepareCompact();setMode('manualWork');}}}>{ui.modes.manualWork}</button></div></div>
 <div className={`${s.output} calculator-result`} data-calc-result data-numeric-role="result"><p className={m.example}>{dirty?'По вашим данным':'Пример расчёта'}</p>{error?<p id="calc-error" className={s.error} role="alert">{error}</p>:<>
 <IntrinsicSlot className={m.resultTitle} reserve={[ui.sales.title,ui.team.title].map(t=><p key={t}>{t}</p>)}><p data-calc-title>{mode==='conversion'?ui.sales.title:ui.team.title}</p></IntrinsicSlot>
 <strong data-calc-value>{deals?signed(deals.deltaDeals):fmt(time?.currentHours??0)}</strong>
 <IntrinsicSlot reserve={[ui.sales.unit,ui.team.unit].map(t=><p key={t}>{t}</p>)}><p data-calc-unit>{deals?ui.sales.unit:ui.team.unit}</p></IntrinsicSlot>
 <IntrinsicSlot className={!deals?m.emptyComparison:''} reserve={<div className={s.comparison}><div><span>{ui.sales.now}</span><b>40</b></div><div><span>{ui.sales.scenario}</span><b>48</b></div></div>}>
 {deals&&<div className={s.comparison}><div><span>{ui.sales.now}</span><b>{fmt(deals.baseDeals)}</b></div><div><span>{ui.sales.scenario}</span><b>{fmt(deals.scenarioDeals)}</b></div></div>}
 </IntrinsicSlot>
 {deals?.deltaRevenue!==undefined&&<div className={s.extra}><b>{signed(deals.deltaRevenue)}{compact?<> <span data-calc-extra-unit>₽/мес.</span></>:' ₽/мес.'}</b><p>{ui.sales.revenueNote}</p></div>}
 {time?.possibleReleasedHours!==undefined&&<div className={s.extra}><b>{fmt(time.possibleReleasedHours)}{compact?<> <span data-calc-extra-unit>ч/мес.</span></>:' ч/мес.'}</b><p>{ui.team.releasedNote}</p></div>}
 {time?.timeResourceValue!==undefined&&<div className={s.extra}><b>{fmt(time.timeResourceValue)}{compact?<> <span data-calc-extra-unit>₽/мес.</span></>:' ₽/мес.'}</b><p>{ui.team.moneyNote}</p></div>}
 {time&&values.hourValue.trim()&&!values.automationSharePercent.trim()&&<p>Для денежной оценки укажите долю автоматизации.</p>}
 </>}<IntrinsicSlot reserve={[ui.sales.note,ui.team.note].map(t=><p key={t}>{t}</p>)}><p id="calc-note" data-calc-note>{mode==='conversion'?ui.sales.note:ui.team.note}</p></IntrinsicSlot></div>
 <div className={m.compactControls}><p>{error?'Проверьте исходные данные':summary}</p><button ref={edit} type="button" aria-expanded={editing} aria-controls="calc-editor" onClick={()=>{if(editing)done();else{prepareEditor();setEditing(true);}}} disabled={!hydrated}>{ui.editLabel}</button></div>
 <div className={`${s.inputs} ${m.inputs}`} data-calc-inputs data-motion-size inert={compact&&!editing}>
 <div ref={editor} id="calc-editor" onBlurCapture={e=>{if(!e.relatedTarget&&matchMedia('(max-width:900px)').matches&&e.target instanceof HTMLInputElement&&!e.target.getClientRects().length){edit.current?.focus({preventScroll:true});}}} className={m.editor} data-motion-copy>
 <div className={s.fields} data-calc-fields>{spec[mode].inputs.map(i=>field(i.key,i.label))}</div>
 <details className={`${s.optional} ${d.disclosure}`} open={compact||optional} data-motion-size><summary className={d.trigger} tabIndex={compact?-1:undefined} onClick={e=>{e.preventDefault();if(compact)return;prepareMotion();setOptional(v=>!v);}}><span>Дополнительные допущения</span><DisclosureIcon/></summary><div className={s.fields} data-calc-fields>{mode==='conversion'?field('averageDealValue','Средний чек, ₽ · необязательно'):<>{field('automationSharePercent','Доля автоматизации, % · необязательно')}{field('hourValue','Оценка часа, ₽ · необязательно')}</>}</div></details>
 {error&&<p className={s.error}>{error}</p>}<button className={m.done} type="button" onClick={done}>{ui.doneLabel}</button>
 </div></div>
 <details className={`${m.method} ${d.disclosure}`} data-calc-method><summary className={d.trigger}><span>{ui.methodLabel}</span><DisclosureIcon/></summary><div><ul>{ui.method[mode].map(line=><li key={line}>{line}</li>)}</ul>{deals&&<p>{ui.sales.percentagePoints}: {signed(deals.deltaPercentagePoints)}</p>}<p>{ui.method.shared}</p></div></details>
 <p className={m.live} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
 <noscript><p className={s.notice}>Статичный пример: 400 обращений × 10% = 40 ожидаемых сделок, при 12% = 48; разница +8 сделок и +2 п. п. При среднем чеке 50 000 ₽ изменение сценарной выручки +400 000 ₽/мес. Время: 5 × 30 × 22 ÷ 60 = 55 ч/мес.; при доле 50% ресурс 27,5 ч, при 1 000 ₽/ч — оценка 27 500 ₽/мес. Это допущения, не прогноз. Для редактирования нужен JavaScript.</p></noscript></div>;
}
