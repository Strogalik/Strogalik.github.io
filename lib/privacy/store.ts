import {analyticsChoiceKey,analyticsOff,readPublicConfig,safePagePath,type AnalyticsConfig} from './profile';
import {makeChoice,parseChoice,type ChoiceRecord,type ChoiceReason,type Decision} from './choice';
import type {MetricaAdapter,RuntimeState} from './metrica';
export type PrivacyState={config:AnalyticsConfig;decision:Decision|'unknown';reason:ChoiceReason;runtime:RuntimeState;hydrated:boolean;memoryOnly:boolean;checking:boolean};
export class PrivacyStore{
 private state:PrivacyState;private listeners=new Set<()=>void>();private record:ChoiceRecord|null=null;private memory:string|null=null;private started=false;private adapter:MetricaAdapter|null=null;private adapterModule:Promise<typeof import('./metrica')>|null=null;private expiry:ReturnType<typeof setTimeout>|undefined;private poll:ReturnType<typeof setInterval>|undefined;private refreshRequest:AbortController|null=null;private choiceGeneration=0;
 constructor(config:AnalyticsConfig){this.state={config,decision:'unknown',reason:config.enabled?'missing':'operator-off',runtime:config.enabled?'idle':'off',hydrated:false,memoryOnly:false,checking:false};}
 getSnapshot=()=>this.state;
 subscribe=(fn:()=>void)=>{this.listeners.add(fn);return()=>{this.listeners.delete(fn);};};
 private update(patch:Partial<PrivacyState>){this.state={...this.state,...patch};this.listeners.forEach(fn=>fn());}
 private read(){try{const raw=localStorage.getItem(analyticsChoiceKey);if(!this.state.memoryOnly)this.memory=raw;return this.state.memoryOnly?this.memory:raw;}catch{if(!this.state.memoryOnly)this.update({memoryOnly:true});return this.memory;}}
 private persist(raw:string|null){this.memory=raw;try{if(raw===null)localStorage.removeItem(analyticsChoiceKey);else localStorage.setItem(analyticsChoiceKey,raw);}catch{this.update({memoryOnly:true});}}
 private hasGrant(){return this.started&&safePagePath(location.pathname)!==null&&this.state.config.enabled&&parseChoice(this.read(),this.state.config,Date.now()).record?.decision==='granted';}
 private sync=()=>{
  if(!this.started)return;clearTimeout(this.expiry);const {record,reason}=parseChoice(this.read(),this.state.config,Date.now());this.record=record;
  const decision=record?.decision??'unknown';this.update({decision,reason,hydrated:true});
  if(decision==='granted'&&this.state.config.enabled){this.adapterModule??=import('./metrica');void this.adapterModule.then(({MetricaAdapter})=>{if(!this.hasGrant()||!this.state.config.enabled)return;this.adapter??=new MetricaAdapter(()=>this.hasGrant(),runtime=>this.update({runtime}));void this.adapter.enable(this.state.config);}).catch(()=>this.update({runtime:'failed'}));}else{this.adapter?.stop();this.update({runtime:this.state.config.enabled?'idle':'off'});}
  if(record)this.expiry=setTimeout(this.sync,Math.min(Math.max(1,record.expiresAt-Date.now()+1),2_000_000_000));
 };
 private storage=(event:StorageEvent)=>{if(event.key===analyticsChoiceKey||event.key===null){++this.choiceGeneration;this.memory=event.key===null?null:event.newValue;this.sync();}};
 private visibility=()=>{if(document.visibilityState==='visible'){this.sync();void this.refresh();}};
 private focus=()=>{this.sync();void this.refresh();};
 start(){if(this.started)return;this.started=true;window.addEventListener('storage',this.storage);window.addEventListener('focus',this.focus);document.addEventListener('visibilitychange',this.visibility);this.sync();this.poll=setInterval(()=>{if(this.state.config.enabled)void this.refresh();},30000);}
 dispose(){this.started=false;++this.choiceGeneration;this.refreshRequest?.abort();this.adapter?.stop();clearTimeout(this.expiry);clearInterval(this.poll);window.removeEventListener('storage',this.storage);window.removeEventListener('focus',this.focus);document.removeEventListener('visibilitychange',this.visibility);}
 applyConfig(config:AnalyticsConfig){
  if(JSON.stringify(config)===JSON.stringify(this.state.config))return;
  ++this.choiceGeneration;this.adapter?.stop();
  // A changed/withdrawn operator profile cannot inherit the previous permission.
  if(this.state.config.enabled)this.persist(null);
  this.update({config,runtime:config.enabled?'idle':'off'});this.sync();
 }
 async refresh(){
  this.refreshRequest?.abort();const controller=new AbortController();this.refreshRequest=controller;
  try{const response=await fetch('/api/analytics-config',{cache:'no-store',credentials:'omit',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(5000)])});if(!response.ok)throw new Error('Configuration unavailable');const config=readPublicConfig(await response.json());if(!controller.signal.aborted)this.applyConfig(config);return !controller.signal.aborted;}
  catch{if(!controller.signal.aborted){this.applyConfig(analyticsOff);}return false;}
 }
 choose=async(decision:Decision)=>{
  const config=this.state.config;if(!config.enabled)return;
  const generation=++this.choiceGeneration;
  if(decision==='granted'){
   this.update({checking:true});const fresh=await this.refresh();this.update({checking:false});
   if(!fresh||generation!==this.choiceGeneration||this.state.config.profileDigest!==config.profileDigest)return;
  }else{this.adapter?.stop();}
  if(!this.started)return;
  const record=makeChoice(decision,config,Date.now());this.persist(JSON.stringify(record));this.sync();
 };
 page(path:string){this.sync();this.adapter?.hit(path);}
}
