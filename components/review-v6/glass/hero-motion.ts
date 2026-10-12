export const STORY_DURATION=6000;
export const COMPACT_MOTION='(max-width:900px), (pointer:coarse), (hover:none)';
export type MotionView={phase:number;paused:boolean;completed:boolean;reduced:boolean;started:boolean;compact:boolean;settled:boolean};
export type HeroMotion={frame:(now:number,quiet?:boolean)=>boolean;toggle:()=>void;replay:()=>void;dispose:()=>void};

// One clock for CSS and the diagnostic SDK's before-sampling callback. Duplicate
// timestamps do not paint twice. Compact playback actually ends its rAF chain.
export function createHeroMotion(figure:HTMLElement,scene:HTMLElement,notify:(v:MotionView)=>void):HeroMotion {
 const steps=[...scene.querySelectorAll<HTMLElement>('[data-hero-step]')];
 const progress=[...figure.querySelectorAll<HTMLElement>('[data-progress]')];
 const preference=matchMedia('(prefers-reduced-motion: reduce), (prefers-contrast: more), (prefers-reduced-transparency: reduce), (forced-colors: active)');
 const compact=matchMedia(COMPACT_MOTION);
 let elapsed=0,last:number|undefined,raf=0,paused=false,started=false,inView=false,disposed=false,previous='';
 let weightFrom=compact.matches?0:1,weightTo=weightFrom,policyStart=-320;
 const ease=(value:number)=>1-Math.pow(1-Math.max(0,Math.min(1,value)),3);
 const weight=()=>weightFrom+(weightTo-weightFrom)*ease((elapsed-policyStart)/320);
 const settling=()=>weightFrom!==weightTo&&elapsed<policyStart+320;
 const active=()=>!disposed&&started&&!paused&&!preference.matches&&inView&&document.visibilityState==='visible'&&(!compact.matches||elapsed<STORY_DURATION||settling());
 const paint=()=>{
  const reduced=preference.matches,time=reduced||!started?STORY_DURATION:elapsed;
  const phase=Math.min(3,Math.floor(time/1500)),completed=time>=STORY_DURATION;
  figure.dataset.phase=String(phase);figure.dataset.elapsed=String(Math.round(Math.min(time,STORY_DURATION)));figure.dataset.ambientTime=String(Math.round(time));
  figure.dataset.playing=String(active());figure.dataset.playback=reduced?'static':paused?'paused':!started?'idle':completed?'completed':'running';
  figure.dataset.motionPolicy=compact.matches?'finite':'ambient';
  steps.forEach((el,i)=>{
   const local=time-i*1500,shown=reduced||!started||local>=0;
   el.style.visibility=shown?'visible':'hidden';el.style.opacity='1';
   let x=0,y=0;
   if(!reduced&&started&&shown){
    if(el.dataset.glassMessage){
     const entrance=10*(1-ease(local/480)),envelope=Math.max(0,Math.min(1,local/800));
     const smooth=envelope*envelope*(3-2*envelope)*weight();
     const outgoing=el.dataset.glassMessage==='outgoing',angle=local/(outgoing?10200:8400)*Math.PI*2;
     x=Math.sin(angle+(outgoing?.4:0))*(outgoing?.8:.6)*smooth;
     y=entrance+Math.sin(angle+(outgoing?.65:0))*(outgoing?2:1.5)*smooth;
    }else if(i===3){
     // OMS and its text enter together; reserved layout and background stay put.
     y=5*(1-ease(local/320));
    }
   }
   el.style.translate=`${x.toFixed(4)}px ${y.toFixed(4)}px`;
  });
  progress.forEach((el,i)=>{el.style.setProperty('--step-progress',String(Math.max(0,Math.min(1,(time-i*1500)/1500))));el.dataset.current=String(i===phase);});
  const view={phase,paused,completed,reduced,started,compact:compact.matches,settled:!settling()},key=JSON.stringify(view);
  if(key!==previous){previous=key;notify(view);}
 };
 const frame=(now:number,quiet=false)=>{
  if(disposed||quiet||!active()||now===last)return false;
  if(last!==undefined&&now>last){elapsed+=now-last;if(compact.matches)elapsed=Math.min(elapsed,Math.max(STORY_DURATION,policyStart+320));}
  last=now;paint();return true;
 };
 const schedule=()=>{
  cancelAnimationFrame(raf);last=undefined;paint();
  if(active()){const tick=(now:number)=>{frame(now);if(active())raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}
 };
 const visibility=()=>schedule();
 const preferences=()=>{if(preference.matches){elapsed=Math.max(elapsed,STORY_DURATION);started=true;}schedule();};
 const policy=()=>{weightFrom=weight();weightTo=compact.matches?0:1;policyStart=elapsed;schedule();};
 const observer=new IntersectionObserver(entries=>{inView=entries.some(e=>e.isIntersecting);schedule();},{rootMargin:'100px 0px'});
 observer.observe(scene);
 const firstObserver=new IntersectionObserver(entries=>{if(!started&&entries.some(e=>e.isIntersecting)){started=true;elapsed=preference.matches?STORY_DURATION:0;schedule();firstObserver.disconnect();}},{threshold:.65});
 firstObserver.observe(steps[0]);
 document.addEventListener('visibilitychange',visibility);preference.addEventListener('change',preferences);compact.addEventListener('change',policy);
 if(preference.matches){started=true;elapsed=STORY_DURATION;}paint();
 return {frame,toggle(){if(preference.matches||compact.matches&&elapsed>=STORY_DURATION&&!settling()&&!paused)return;paused=!paused;schedule();},replay(){if(preference.matches)return;started=true;paused=false;elapsed=0;weightFrom=weightTo=compact.matches?0:1;policyStart=-320;schedule();},dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();firstObserver.disconnect();document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',preferences);compact.removeEventListener('change',policy);}};
}
