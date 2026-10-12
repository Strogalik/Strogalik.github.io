import test from 'node:test';
import assert from 'node:assert/strict';
import {autoPolicy,startGlassSession,type GlassStatus,type GlassDependencies} from '../components/review-v6/glass/session';
import type {GlassDiagnostic} from '@glass-sdk/liquid-glass/dom';
const tick=()=>new Promise(r=>setTimeout(r,0));
function fixture(overrides:Partial<GlassDependencies>={}){
 const states:GlassStatus[]=[];const calls:string[]=[];let diagnostic:(d:GlassDiagnostic)=>void=()=>{};
 const elements={root:{} as HTMLElement,background:{} as HTMLElement,incoming:{} as HTMLElement,outgoing:{} as HTMLElement};
 const runtime={createGlassScene:(_root:HTMLElement,opts:{maxSurfaces?:number;onDiagnostic?:(d:GlassDiagnostic)=>void})=>{calls.push(`create:${opts.maxSurfaces}`);diagnostic=opts.onDiagnostic!;return {setContent(){calls.push('content');},addSurface(_el:HTMLElement,options:unknown){calls.push(`surface:${JSON.stringify(options)}`);return()=>{calls.push('remove');};},addForeground:()=>()=>{},addAnimator:()=>()=>{},addProgressiveBlur:()=>()=>{},addScrollEdges:()=>()=>{},dispose(){calls.push('dispose');}};},release(){calls.push('release');}};
 const stop=startGlassSession(elements,{compact:false},{probe:async()=>({}),load:async()=>runtime,publish:s=>states.push(s),now:()=>100,timeoutMs:200,...overrides});
 return {stop,states,calls,runtime,diagnostic:(d:GlassDiagnostic)=>diagnostic(d)};
}
test('glass maps ready is a diagnostic, with two bounded noninteractive surfaces and exact teardown',async()=>{
 const f=fixture();await tick();assert.equal(f.calls.filter(c=>c.startsWith('surface')).length,2);assert.ok(f.calls.includes('create:2'));assert.ok(f.calls.filter(c=>c.startsWith('surface')).every(c=>c.includes('"refraction":10')&&c.includes('"motion":"none"')));
 f.diagnostic({surfaces:2,maps:1,mapTime:3});assert.notEqual(f.states.at(-1)?.state,'enhanced');f.diagnostic({surfaces:2,maps:2,mapTime:6});assert.equal(f.states.at(-1)?.state,'enhanced');f.stop();f.stop();assert.deepEqual(f.calls.slice(-4),['remove','remove','dispose','release']);
});
test('null/rejected adapter leaves CSS; no import, controller or GPU lease',async()=>{
 for(const probe of [async()=>null,async()=>{throw Error('adapter-rejected');}]){const f=fixture({probe});await tick();assert.equal(f.states.at(-1)?.state,'fallback');assert.deepEqual(f.calls,[]);f.stop();}
});
test('import rejection, map diagnostic failure and map timeout cleanly fall back',async()=>{
 const failed=fixture({load:async()=>{throw Error('chunk-failed');}});await tick();assert.equal(failed.states.at(-1)?.reason,'chunk-failed');
 const f=fixture();await tick();f.diagnostic({surfaces:2,maps:0,mapTime:0,error:Error('GPU lost')});await tick();assert.equal(f.states.at(-1)?.reason,'diagnostic: GPU lost');assert.equal(f.calls.filter(c=>c==='dispose').length,1);
 const slow=fixture({timeoutMs:10});await new Promise(r=>setTimeout(r,25));assert.equal(slow.states.at(-1)?.reason,'initialization-timeout');assert.ok(slow.calls.includes('dispose'));
});
test('late probe after unmount and timeout cannot import or register surfaces',async()=>{
 for(const unmount of [true,false]){let resolve:(v:unknown)=>void=()=>{};const f=fixture({probe:()=>new Promise(r=>resolve=r),timeoutMs:10});if(unmount)f.stop();else await new Promise(r=>setTimeout(r,25));resolve({});await tick();assert.deepEqual(f.calls,[]);assert.equal(f.states.at(-1)?.state,unmount?'disposed':'fallback');}
});
test('late module releases its lease and StrictMode setup-cleanup-setup creates one live scene',async()=>{
 let resolve:(v:ReturnType<typeof fixture>['runtime'])=>void=()=>{};const f=fixture({load:()=>new Promise(r=>resolve=r)});await tick();f.stop();resolve(f.runtime);await tick();assert.deepEqual(f.calls,['release']);
 const second=fixture();await tick();assert.equal(second.calls.filter(c=>c.startsWith('create')).length,1);second.stop();
});
test('auto policy conservatively excludes mobile, iPad desktop UA, WebKit and unknown engines',()=>{
 assert.equal(autoPolicy('Mozilla Chrome/153.0 Safari/537.36',0,false),'diagnostic-only-material-parity');
 for(const [ua,touch,coarse] of [['Chrome/153.0 Mobile',0,false],['Macintosh Safari/605.1',5,false],['Chrome/153.0',0,true],['Version/27.2 Safari/605.1',0,false],['Firefox/140',0,false]] as const)assert.ok(autoPolicy(ua,touch,coarse));
});
