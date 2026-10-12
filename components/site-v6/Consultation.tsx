'use client';
import {createContext,useContext,useEffect,useRef,useState,type ReactNode,type FormEvent,type KeyboardEvent} from 'react';
import {usePathname} from 'next/navigation';
import {currentUTM} from '@/lib/utm';
import {consentVersion,type topicIds} from '@/lib/consent';
import {leadSchema} from '@/lib/validation';
import s from '../review-v6/review.module.css';
import a from './adapter.module.css';
import {ControlIcon} from './HeroStory';
type Options={topicId?:typeof topicIds[number];productSlug?:'crm'|'oms'|'crm-oms';caseSlug?:'b2b-wholesale'|'flooring-manufacturer'|'online-school';context?:'saas'|'custom'|'partner'|'builder_interest'};
const Context=createContext<(options?:Options,returnFocus?:HTMLElement|null)=>void>(()=>{});
export const useConsultation=()=>useContext(Context);
export function Action({children='Обсудить задачу',options,className}:{children?:ReactNode;options?:Options;className?:string}){const open=useConsultation();return <button type="button" className={className??`${s.button} ${s.primary}`} onClick={()=>open(options)}>{children}</button>;}
export function ConsultationProvider({children}:{children:ReactNode}){
 const pathname=usePathname().replace(/\/$/,'')||'/';
 const clicked=useRef<HTMLElement|null>(null);
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null),priorOverflow=useRef('');
 const marker=useRef<string|null>(null),closing=useRef(false);
 const [options,setOptions]=useState<Options>({}),[version,setVersion]=useState(0),[opened,setOpened]=useState(false);
 function open(value?:Options,returnFocus?:HTMLElement|null){if(dialog.current?.open)return;const product=pathname.match(/^\/products\/(crm|oms|crm-oms)$/)?.[1] as Options['productSlug'];const caseSlug=pathname.match(/^\/cases\/(b2b-wholesale|flooring-manufacturer|online-school)$/)?.[1] as Options['caseSlug'];value=value??(product?{context:'saas',productSlug:product}:caseSlug?{context:'custom',caseSlug}:pathname==='/partners'?{context:'partner'}:pathname==='/custom-development'?{context:'custom'}:{});const active=returnFocus??clicked.current??document.activeElement as HTMLElement;trigger.current=returnFocus??active.closest('details')?.querySelector('summary')??active;marker.current=crypto.randomUUID();history.pushState({...history.state,tmsForm:marker.current},'');closing.current=false;setOptions(value);setVersion(v=>v+1);setOpened(true);priorOverflow.current=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.showModal();dialog.current?.querySelector<HTMLElement>('h2')?.focus();}
 function finish(){dialog.current?.close();setOpened(false);document.body.style.overflow=priorOverflow.current;trigger.current?.focus({preventScroll:true});marker.current=null;closing.current=false;}
 function close(){if(closing.current)return;closing.current=true;if(history.state?.tmsForm===marker.current)history.back();else finish();}
 useEffect(()=>{const pop=()=>{if(dialog.current?.open&&history.state?.tmsForm!==marker.current)finish();};window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 useEffect(()=>{const el=dialog.current;const capture=(event:MouseEvent)=>{clicked.current=event.target instanceof Element?event.target.closest<HTMLElement>('button'):null;};document.addEventListener('click',capture,true);return()=>{document.removeEventListener('click',capture,true);if(el?.open)document.body.style.overflow=priorOverflow.current;};},[]);
 function trap(event:KeyboardEvent<HTMLDialogElement>){if(event.key!=='Tab')return;const controls=[...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not([tabindex="-1"]),textarea')].filter(e=>e.getClientRects().length);const first=controls[0],last=controls.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement?.tagName==='H2')){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
 return <Context.Provider value={open}>{children}<dialog data-b7-dialog ref={dialog} className={s.formDialog} onKeyDown={trap} aria-labelledby="consultation-title" onCancel={e=>{e.preventDefault();close();}}><div className={s.formInner}><button type="button" className={s.closeButton} onClick={close} aria-label="Закрыть форму"><ControlIcon kind="close"/></button><p className={s.eyebrow}>Первый разговор с TMS</p><h2 id="consultation-title" tabIndex={-1}>Обсудить задачу</h2><p>Расскажите, что хочется наладить в работе. На встрече покажем систему в контексте вашей задачи.</p><div className={s.previewNotice}>Подтверждение появится только после доставки запроса. Если отправка недоступна, напишите на <a href="mailto:tmsasub@yandex.ru">tmsasub@yandex.ru</a>.</div>{opened&&<ConsultationForm key={version} options={options}/>}</div></dialog></Context.Provider>;
}
function ConsultationForm({options}:{options:Options}){
 const [errors,setErrors]=useState<Record<string,string>>({}),[state,setState]=useState<'idle'|'sending'|'success'|'error'>('idle'),[message,setMessage]=useState('');
 const busy=useRef(false),result=useRef<HTMLParagraphElement>(null),abort=useRef<AbortController|null>(null);
 useEffect(()=>()=>abort.current?.abort(),[]);
 useEffect(()=>{if(state==='success'||state==='error')result.current?.focus();},[state]);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(busy.current)return;const form=e.currentTarget,values=Object.fromEntries(new FormData(form));const parsed=leadSchema.safeParse({...values,...options,intent:'consultation',message:values.task,consentVersion,consent:values.consent==='on',context:options.context??'consultation',page:location.pathname,utm:values.consent==='on'?currentUTM(location.search):{}});setErrors({});setMessage('');
  if(!parsed.success){const fields=Object.fromEntries(parsed.error.issues.map(i=>[i.path[0]==='message'?'task':String(i.path[0]),i.message]));setErrors(fields);(form.elements.namedItem(Object.keys(fields)[0])as HTMLElement)?.focus();return;}
  if(process.env.NEXT_PUBLIC_STATIC_HOSTING==='true'){setState('error');setMessage('Отправка недоступна. Данные не доставлены. Напишите на tmsasub@yandex.ru.');return;}
  busy.current=true;setState('sending');const controller=new AbortController();abort.current=controller;
  try{const response=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed.data),signal:AbortSignal.any([controller.signal,AbortSignal.timeout(12000)])});const body=await response.json();if(controller.signal.aborted)return;if(!response.ok||body.ok!==true){if(response.status===409){const checkbox=form.elements.namedItem('consent');if(checkbox instanceof HTMLInputElement)checkbox.checked=false;}setMessage(body.message||'Отправка недоступна. Данные не доставлены. Попробуйте ещё раз.');setState('error');if(body.errors)setErrors(Object.fromEntries(Object.entries(body.errors).map(([k,v])=>[k==='message'?'task':k,String((v as string[])[0])])));return;}setState('success');}
  catch{if(!controller.signal.aborted){setState('error');setMessage('Не удалось связаться с сервером. Доставка не подтверждена. Проверьте подключение и попробуйте ещё раз.');}}finally{busy.current=false;}
 }
 if(state==='success')return <p ref={result} tabIndex={-1} className={s.formResult} role="status">Запрос доставлен команде TMS. Спасибо за обращение.</p>;
 const error=(name:string)=>errors[name]&&<p id={`consultation-${name}-error`} className={s.fieldError}>{errors[name]}</p>;
 const attributes=(name:string)=>({'aria-invalid':!!errors[name],'aria-describedby':errors[name]?`consultation-${name}-error`:undefined});
 return <form onSubmit={submit} noValidate>
 <label htmlFor="consultation-name">Ваше имя <span>обязательно</span></label><input id="consultation-name" name="name" autoComplete="name" placeholder="Как к вам обращаться" maxLength={100} required {...attributes('name')}/>{error('name')}
 <label htmlFor="consultation-contact">Email или телефон <span>обязательно</span></label><input id="consultation-contact" name="contact" autoComplete="email" placeholder="Для связи с вами" maxLength={160} required {...attributes('contact')}/>{error('contact')}
 <label htmlFor="consultation-company">Компания <span>необязательно</span></label><input id="consultation-company" name="company" autoComplete="organization" maxLength={160} {...attributes('company')}/>{error('company')}
 <label htmlFor="consultation-task">Что хотите изменить <span>необязательно</span></label><textarea id="consultation-task" name="task" rows={3} placeholder="Например: после продажи теряются договорённости" maxLength={2000} {...attributes('task')}/>{error('task')}
 <div className={a.honeypot} aria-hidden="true"><label htmlFor="consultation-website">Ваш сайт</label><input id="consultation-website" name="website" tabIndex={-1} autoComplete="off"/></div>
 <label className={s.consent}><input type="checkbox" name="consent" required {...attributes('consent')}/><span>Даю согласие на обработку персональных данных для ответа на обращение. <a href="/consent" target="_blank" rel="noopener noreferrer">Текст согласия (новая вкладка)</a></span></label>{error('consent')}
 <button type="submit" className={`${s.button} ${s.primary}`} disabled={state==='sending'}>{state==='sending'?'Отправляем…':'Отправить запрос'}</button>
 {state==='error'&&<p ref={result} tabIndex={-1} role="alert" className={s.fieldError}>{message}</p>}
 </form>;
}
