import type {GlassDiagnostic, GlassSceneController, GlassSceneOptions, SurfaceOptions, SurfaceAnimator} from '@glass-sdk/liquid-glass/dom';

export type GlassMode = 'auto' | 'css' | 'sdk';
export type GlassStatus = {state:'css'|'checking'|'loading-sdk'|'initializing'|'enhanced'|'fallback'|'suspended'|'disposed';reason?:string;surfaces?:number;maps?:number;mapTime?:number;coldMs?:number};
type ElementSet = {root:HTMLElement;background:HTMLElement;incoming:HTMLElement;outgoing:HTMLElement};
export type GlassRuntime = {createGlassScene:(root:HTMLElement,options:GlassSceneOptions)=>GlassSceneController;release:()=>void};
export type GlassDependencies = {
 probe:()=>Promise<unknown>;
 load:()=>Promise<GlassRuntime>;
 publish:(status:GlassStatus)=>void;
 now:()=>number;
 timeoutMs?:number;
};

// Async ownership is per activation, never per playback frame. All continuations
// check cancellation, including a module that arrives after unmount/timeout.
export function startGlassSession(elements:ElementSet,options:{compact:boolean;animator?:SurfaceAnimator},deps:GlassDependencies) {
 let alive=true,controller:GlassSceneController|undefined,runtime:GlassRuntime|undefined;
 const removers:Array<()=>void>=[];const started=deps.now();let ready=false,coldMs:number|undefined;
 function dispose(){
  for(const remove of removers.splice(0).reverse())remove();
  controller?.dispose();controller=undefined;runtime?.release();runtime=undefined;
 }
 function fail(reason:string){if(!alive)return;alive=false;clearTimeout(timer);dispose();deps.publish({state:'fallback',reason});}
 let timer=setTimeout(()=>fail('initialization-timeout'),deps.timeoutMs??10_000);
 const diagnostic=(d:GlassDiagnostic)=>{
  if(!alive)return;
  if(d.error){queueMicrotask(()=>fail(`diagnostic: ${d.error!.message}`));return;}
  if(d.surfaces===2&&d.maps===2){
   ready=true;coldMs??=deps.now()-started;clearTimeout(timer);
   deps.publish({state:'enhanced',surfaces:d.surfaces,maps:d.maps,mapTime:d.mapTime,coldMs});
  }else if(ready){clearTimeout(timer);timer=setTimeout(()=>fail('map-update-timeout'),deps.timeoutMs??10_000);deps.publish({state:'initializing',surfaces:d.surfaces,maps:d.maps});}
 };
 deps.publish({state:'checking'});
 void (async()=>{
  try{
   const adapter=await deps.probe();if(!alive)return;
   if(!adapter){fail('adapter-null');return;}
   deps.publish({state:'loading-sdk'});
   const loaded=await deps.load();if(!alive){loaded.release();return;}runtime=loaded;
   deps.publish({state:'initializing'});
   controller=runtime.createGlassScene(elements.root,{maxSurfaces:2,onDiagnostic:diagnostic});
   controller.setContent(elements.background);
   if(options.animator)removers.push(controller.addAnimator(options.animator));
   const common:SurfaceOptions={material:'clear',radius:options.compact?20:24,refraction:options.compact?6:10,interactive:false,fluid:false,motion:'none'};
   removers.push(controller.addSurface(elements.incoming,{...common,appearance:'dark'}));
   removers.push(controller.addSurface(elements.outgoing,{...common,appearance:'light'}));
  }catch(error){fail(error instanceof Error?error.message:String(error));}
 })();
 return ()=>{if(!alive)return;alive=false;clearTimeout(timer);dispose();deps.publish({state:'disposed'});};
}

export function autoPolicy(userAgent:string,touchPoints:number,coarse:boolean){
 // A4.7: opaque colored material + quiet fields make the 0.0.1 optical
 // difference negligible (1–2 channel levels); its clipping drops CSS shadows.
 // Preserve cross-engine material parity in auto; SDK remains diagnostic.
 if(/Android|iPhone|iPad|Mobile/i.test(userAgent)||touchPoints>1||coarse)return 'unverified-mobile';
 if(!/(Chrome|Chromium)\//.test(userAgent)||/EdgiOS|CriOS|OPiOS/.test(userAgent))return 'unverified-engine';
 return 'diagnostic-only-material-parity';
}
