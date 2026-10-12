'use client';
import {useId,useState,type ReactNode} from 'react';
import {useLayoutMotion} from '../motion/useLayoutMotion';
import s from './internal.module.css';
export function InternalTopics({items}:{items:{heading:string;body:ReactNode}[]}){
 const id=useId(),[active,setActive]=useState(0);const {root:motionRoot,prepare:prepareMotion}=useLayoutMotion(active,{ghosts:true});
 return <div ref={motionRoot} className={s.topics} data-internal-topics>{items.map((item,i)=><details data-motion-size key={item.heading} name={`topics-${id}`} open={active===i}><summary aria-controls={`${id}-${i}`} onClick={e=>{e.preventDefault();e.currentTarget.focus({preventScroll:true});if(i!==active){prepareMotion();setActive(i);}}}>{item.heading}<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M10 4v12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></summary><div id={`${id}-${i}`} data-motion-copy className={s.topicBody}>{item.body}</div></details>)}</div>;
}
