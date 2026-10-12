'use client';
export function Tabs<T extends string>({items,value,onChange,label,panelId}:{items:readonly {id:T;label:string}[];value:T;onChange:(v:T)=>void;label:string;panelId:string}) {
 const id=`${panelId}-tab`;
 return <div className="work-tabs" role="tablist" aria-label={label}>{items.map((item,index)=><button type="button" role="tab" key={item.id} id={`${id}-${item.id}`} aria-selected={value===item.id} aria-controls={panelId} tabIndex={value===item.id?0:-1} onClick={()=>onChange(item.id)} onKeyDown={e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%items.length;else if(e.key==='ArrowLeft')next=(index+items.length-1)%items.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=items.length-1;else return;e.preventDefault();onChange(items[next].id);e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();}}>{item.label}</button>)}</div>;
}
