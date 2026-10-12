'use client';
import {useLayoutEffect,useRef,type ReactNode} from 'react';
import s from './intrinsic.module.css';
/** CSS grid takes the intrinsic maximum before interaction, including SSR/font reflow.
 * Only text is passed as reserves. The probe disables desktop reserves for enlarged text.
 * Observe the probe, never the reserved surface: writes cannot resize the observed node. */
export function IntrinsicSlot({children,reserve,className='',enabled=true}:{children:ReactNode;reserve:ReactNode;className?:string;enabled?:boolean}){
 const root=useRef<HTMLDivElement>(null),probe=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{const node=root.current,p=probe.current;if(!node||!p)return;let observer:ResizeObserver|undefined;
 const update=()=>{node.dataset.largeText=String(p.getBoundingClientRect().height>20);};
 const observe=()=>{observer?.disconnect();if(document.hidden)return;update();observer=new ResizeObserver(update);observer.observe(p);};
 observe();document.addEventListener('visibilitychange',observe);return()=>{observer?.disconnect();document.removeEventListener('visibilitychange',observe);};},[]);
 return <div ref={root} className={`${s.slot} ${className}`} data-b9-slot data-reserve={enabled}><span ref={probe} className={s.probe} aria-hidden="true" inert/><div className={s.live} data-b9-live>{children}</div><div className={s.reserve} data-b9-reserve aria-hidden="true" inert>{reserve}</div></div>;
}
