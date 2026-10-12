import {chromium} from 'playwright';
import sharp from 'sharp';
import {mkdir,writeFile,rename} from 'node:fs/promises';
const root='qa/v6-a45/sdk';await mkdir(root,{recursive:true});const browser=await chromium.launch({headless:false});
const results={date:new Date().toISOString(),browser:browser.version(),headless:false,comparisons:[],performance:[],lifecycle:{},errors:[]};
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',recordVideo:{dir:root,size:{width:1440,height:900}}});
await context.addInitScript(()=>{
 window.__glassAudit={statuses:[],devices:0,destroyed:0,longTasks:[]};
 new PerformanceObserver(list=>{window.__glassAudit.longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})));}).observe({type:'longtask',buffered:true});
 const request=navigator.gpu?.requestAdapter.bind(navigator.gpu);
 if(request)navigator.gpu.requestAdapter=async(...args)=>{const a=await request(...args);if(a){window.__glassAudit.adapter={vendor:a.info.vendor,architecture:a.info.architecture,device:a.info.device,description:a.info.description,isFallbackAdapter:a.info.isFallbackAdapter};const device=a.requestDevice.bind(a);a.requestDevice=async(...args)=>{const d=await device(...args);window.__glassAudit.devices++;const destroy=d.destroy.bind(d);d.destroy=()=>{window.__glassAudit.destroyed++;destroy();};return d;};}return a;};
 document.addEventListener('DOMContentLoaded',()=>{document.querySelector('[data-hero-scene]')?.addEventListener('tms:glass-status',e=>{const a=window.__glassAudit.statuses;if(a.length<100)a.push({...e.detail,time:performance.now()});});});
});
const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));
const go=async(mode)=>{await page.goto(`http://127.0.0.1:3200/review/v6?v=a4.5&glass=${mode}`);await page.evaluate(()=>document.fonts.ready);if(mode==='sdk')await page.waitForFunction(()=>document.querySelector('[data-hero-scene]')?.dataset.glassState==='enhanced',{},{timeout:15000});await page.waitForTimeout(200);};
for(const width of [1920,1728,1440,1366,1024,430,390,320]){
 const height=width===1920?1080:width===1728?960:width===430?932:width<500?844:900;
 await page.setViewportSize({width,height});
 const row={width,height,dpr:1,modes:{}};
 for(const mode of ['css','sdk']){
  await go(mode);await page.mouse.move(0,0);await page.screenshot({path:`${root}/${mode}-${width}.png`});await page.locator('[data-v6-story]').screenshot({path:`${root}/${mode}-story-${width}.png`});
  row.modes[mode]=await page.evaluate(()=>({state:document.querySelector('[data-hero-scene]').dataset.glassState,diagnostic:JSON.parse(document.querySelector('[data-hero-scene]').dataset.glassDiagnostic),boxes:[...document.querySelectorAll('[data-glass-message]')].map(e=>e.getBoundingClientRect().toJSON()),texts:[...document.querySelectorAll('[data-glass-message]')].map(e=>({filter:getComputedStyle(e).filter,visibility:getComputedStyle(e).visibility,opacity:getComputedStyle(e).opacity})),overflow:document.documentElement.scrollWidth>innerWidth,adapter:window.__glassAudit.adapter}));
 }
 row.sameBounds=JSON.stringify(row.modes.css.boxes)===JSON.stringify(row.modes.sdk.boxes);results.comparisons.push(row);
}
await page.setViewportSize({width:1440,height:900});await go('sdk');
// Optical control: the SAME real scene, geometry, tone and blur. Only the two
// SVG displacement scales become zero; a screenshot delta proves refraction
// is doing pixel work, not just the blur/tint. Restore immediately afterwards.
const before=await page.locator('[data-hero-scene]').screenshot({path:`root.png`.replace('root',`${root}/refraction-on`)});
const scales=await page.locator('[data-hero-scene] feDisplacementMap').evaluateAll(es=>es.map(e=>{const v=e.getAttribute('scale');e.setAttribute('scale','0');return v;}));
const zero=await page.locator('[data-hero-scene]').screenshot({path:`${root}/refraction-zero.png`});
await page.locator('[data-hero-scene] feDisplacementMap').evaluateAll((es,scales)=>es.forEach((e,i)=>e.setAttribute('scale',scales[i])),scales);
const a=await sharp(before).ensureAlpha().raw().toBuffer({resolveWithObject:true}),b=await sharp(zero).ensureAlpha().raw().toBuffer();let changed=0,maxDelta=0,total=0;const diff=Buffer.alloc(a.data.length);
for(let i=0;i<a.data.length;i+=4){let d=0;for(let k=0;k<3;k++){const v=Math.abs(a.data[i+k]-b[i+k]);d=Math.max(d,v);total+=v;diff[i+k]=Math.min(255,v*12);}diff[i+3]=255;if(d>2)changed++;maxDelta=Math.max(maxDelta,d);}
await sharp(diff,{raw:a.info}).png().toFile(`${root}/refraction-difference-12x.png`);results.refraction={scales,changedPixelsAbove2:changed,pixels:a.info.width*a.info.height,maxChannelDelta:maxDelta,meanChannelDelta:total/(a.info.width*a.info.height*3)};
for(const mode of ['css','sdk']){
 await go(mode);await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(200);
 const firstInteraction=await page.evaluate(async()=>{const start=performance.now();document.querySelector('[data-v6-story] button').click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-start;});
 const perf=await page.evaluate(async()=>{const started=performance.now(),gaps=[];let previous;await new Promise(resolve=>{function tick(t){if(previous!==undefined)gaps.push(t-previous);previous=t;if(performance.now()-started<4400)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});return{gaps,longTasks:window.__glassAudit.longTasks.filter(e=>e.start>=started),diagnostic:JSON.parse(document.querySelector('[data-hero-scene]').dataset.glassDiagnostic),adapter:window.__glassAudit.adapter,devices:window.__glassAudit.devices,destroyed:window.__glassAudit.destroyed};});
 const sorted=[...perf.gaps].sort((a,b)=>a-b),over=perf.gaps.filter(v=>v>50);let run=0,maxRun=0;for(const v of perf.gaps){run=v>50?run+1:0;maxRun=Math.max(maxRun,run);}
 results.performance.push({mode,firstInteractionTwoRafMs:firstInteraction,...perf,summary:{median:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],max:Math.max(...sorted),over50:over.length,maxConsecutiveOver50:maxRun}});await page.emulateMedia({reducedMotion:'reduce'});
}
await go('sdk');await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('button',{name:'Повторить историю'}).click();await page.waitForTimeout(2230);await page.getByRole('button',{name:'Пауза',exact:true}).click();
const frozen=await page.locator('[data-hero-reveal]').evaluateAll(es=>es.map(e=>e.getAttribute('style'))),elapsed=await page.locator('[data-v6-story]').getAttribute('data-elapsed');await page.waitForTimeout(500);
results.lifecycle.pause={elapsed,unchanged:elapsed===await page.locator('[data-v6-story]').getAttribute('data-elapsed')&&JSON.stringify(frozen)===JSON.stringify(await page.locator('[data-hero-reveal]').evaluateAll(es=>es.map(e=>e.getAttribute('style'))))};
await page.screenshot({path:`${root}/paused-mid-reveal.png`});await page.getByRole('button',{name:'Продолжить историю'}).click();await page.waitForTimeout(2500);
await page.emulateMedia({contrast:'more'});await page.waitForTimeout(300);results.lifecycle.preference=await page.locator('[data-hero-scene]').evaluate(e=>({state:e.dataset.glassState,reason:e.dataset.glassReason,filters:e.querySelectorAll('filter').length,visible:getComputedStyle(e.querySelector('[data-glass-message]')).visibility}));await page.emulateMedia({contrast:'no-preference'});await page.waitForFunction(()=>document.querySelector('[data-hero-scene]').dataset.glassState==='enhanced');
await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(2300);results.lifecycle.background=await page.evaluate(()=>({state:document.querySelector('[data-hero-scene]').dataset.glassState,filters:document.querySelectorAll('[data-hero-scene] filter').length,audit:window.__glassAudit}));
await page.evaluate(()=>{delete document.visibilityState;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForFunction(()=>document.querySelector('[data-hero-scene]').dataset.glassState==='enhanced');
await page.locator('footer').evaluate(e=>e.scrollIntoView());await page.waitForTimeout(3100);results.lifecycle.offscreen=await page.evaluate(()=>({state:document.querySelector('[data-hero-scene]').dataset.glassState,filters:document.querySelectorAll('[data-hero-scene] filter').length,devices:window.__glassAudit.devices,destroyed:window.__glassAudit.destroyed}));
await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>document.querySelector('[data-hero-scene]').dataset.glassState==='enhanced');await page.waitForTimeout(300);results.lifecycle.returned=await page.evaluate(()=>({surfaces:document.querySelectorAll('[data-glass-message]').length,svg:document.querySelectorAll('[data-hero-scene]>svg').length,audit:window.__glassAudit,playback:document.querySelector('[data-v6-story]').dataset.playback}));
await page.locator('header a').first().click();await page.waitForTimeout(2500);results.lifecycle.fullDocumentNavigation=await page.evaluate(()=>({scene:document.querySelectorAll('[data-hero-scene]').length,devices:window.__glassAudit.devices,destroyed:window.__glassAudit.destroyed}));
const video=page.video();await context.close();await rename(await video.path(),`${root}/sdk-comparison-playback.webm`);await browser.close();
results.status=results.comparisons.every(c=>c.sameBounds&&!c.modes.sdk.overflow)&&changed>0&&results.errors.length===0&&results.lifecycle.offscreen.state==='suspended'&&results.lifecycle.offscreen.devices===results.lifecycle.offscreen.destroyed?'verified_chromium_desktop':'needs_review';await writeFile(`${root}/audit.json`,JSON.stringify(results,null,2));console.log(JSON.stringify({status:results.status,refraction:results.refraction,performance:results.performance.map(p=>({mode:p.mode,cold:p.diagnostic.coldMs,mapTime:p.diagnostic.mapTime,...p.summary})),lifecycle:results.lifecycle,errors:results.errors},null,2));
