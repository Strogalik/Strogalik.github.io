import {features,safePagePath,safeReferrer,type AvailableConfig} from './profile';
export type RuntimeState='off'|'idle'|'loading'|'ready'|'failed';
type Ym=((id:number,method:string,...args:unknown[])=>void)&{a?:unknown[];l?:number};
type MetricaWindow=Window&{ym?:Ym;[key:`disableYaCounter${string}`]:boolean|undefined};
export function removeAccessibleIdentifiers(id:string){
 const storageKeys=['_ym_uid','_ym_retryReqs',`_ym${id}_lastHit`,`_ym${id}_lsid`,`_ym${id}_reqNum`];
 for(const name of storageKeys){try{localStorage.removeItem(name);}catch{}}
 const names=['_ym_uid','_ym_d','_ym_isad','_ym_metrika_enabled','_ym_fa','_ym_ucs','_ym_hostIndex',`_ym_visorc_${id}`];
 const parts=location.hostname.split('.'),domains=['',location.hostname];
 if(!/^\d+(\.\d+){3}$/.test(location.hostname))for(let i=1;i<parts.length-1;i++)domains.push(parts.slice(i).join('.'));
 const paths=new Set(['/']);let path='';for(const part of location.pathname.split('/').filter(Boolean)){path+='/'+part;paths.add(path);paths.add(path+'/');}
 for(const name of names)for(const domain of domains)for(const p of paths){try{document.cookie=`${name}=; Max-Age=0; Path=${p}${domain?`; Domain=${domain}`:''}; SameSite=Lax`;}catch{}}
}
/** One tag per mounted public shell; no pre-consent event queue. */
export class MetricaAdapter{
 private generation=0;private config:AvailableConfig|null=null;private initialized=false;private ready=false;private loading:Promise<void>|null=null;private loaded=false;private script:HTMLScriptElement|null=null;private initTimer:ReturnType<typeof setTimeout>|undefined;private onInitialized:(()=>void)|null=null;private ownedStub:Ym|undefined;private lastPath:string|null=null;
 constructor(private allowed:()=>boolean,private status:(s:RuntimeState)=>void){}
 private load(){
  if(this.loaded)return Promise.resolve();if(this.loading)return this.loading;
  const w=window as unknown as MetricaWindow;
  if(!w.ym){const stub:Ym=()=>{/* Nothing is queued before tag readiness. */};stub.a=[];stub.l=Date.now();w.ym=stub;this.ownedStub=stub;}
  this.loading=new Promise<void>((resolve,reject)=>{const script=document.createElement('script');this.script=script;script.src='https://mc.yandex.ru/metrika/tag.js';script.async=true;script.referrerPolicy='no-referrer';script.dataset.tmsAnalytics='metrica';
   const fail=()=>{clearTimeout(timer);script.onload=null;script.onerror=null;script.remove();this.script=null;this.loading=null;reject(new Error('Analytics tag unavailable'));};
   const timer=setTimeout(fail,8000);script.onerror=fail;script.onload=()=>{clearTimeout(timer);script.onload=null;script.onerror=null;this.loaded=true;resolve();};document.head.append(script);
  });return this.loading;
 }
 async enable(config:AvailableConfig){
  if(!this.allowed())return;
  if(this.config?.profileDigest===config.profileDigest&&(this.initialized||this.loading))return;
  this.stop(false);this.config=config;const generation=++this.generation;this.status('loading');
  try{await this.load();if(generation!==this.generation||!this.allowed())return;
   const w=window as unknown as MetricaWindow;if(typeof w.ym!=='function'||w.ym===this.ownedStub)throw new Error('Analytics API unavailable');
   w[`disableYaCounter${config.counterId}`]=false;
   const event=`yacounter${config.counterId}inited`;
   this.onInitialized=()=>{if(generation!==this.generation||!this.allowed())return;clearTimeout(this.initTimer);this.ready=true;this.status('ready');this.hit(location.pathname);};
   document.addEventListener(event,this.onInitialized,{once:true});this.initialized=true;
   this.initTimer=setTimeout(()=>{if(generation===this.generation){this.stop();this.status('failed');}},8000);
   w.ym(Number(config.counterId),'init',{...features,triggerEvent:true});
  }catch{if(generation===this.generation){this.stop();this.status('failed');}}
 }
 hit(input:string){
  if(!this.ready||!this.config||!this.allowed())return;const path=safePagePath(input);if(!path||path===this.lastPath)return;
  this.lastPath=path;
  try{(window as unknown as MetricaWindow).ym?.(Number(this.config.counterId),'hit',path,{referer:safeReferrer(document.referrer),title:''});}catch{this.stop();this.status('failed');}
 }
 stop(cleanup=true){
  ++this.generation;clearTimeout(this.initTimer);this.ready=false;this.lastPath=null;
  const config=this.config,w=typeof window==='undefined'?null:window as unknown as MetricaWindow;
  if(config&&w){w[`disableYaCounter${config.counterId}`]=true;if(this.onInitialized)document.removeEventListener(`yacounter${config.counterId}inited`,this.onInitialized);if(this.initialized){try{w.ym?.(Number(config.counterId),'destruct');}catch{}}if(cleanup)removeAccessibleIdentifiers(config.counterId);}
  // The in-flight tag may finish downloading; it has no queued init/hit and its old continuation is invalid.
  if(this.ownedStub?.a)this.ownedStub.a.length=0;
  this.initialized=false;this.onInitialized=null;this.config=null;
 }
}
