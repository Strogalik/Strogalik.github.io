import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const root=process.argv.includes('--before')?'qa/v6-a47/before-sdk':'qa/v6-a47/sdk';await mkdir(root,{recursive:true});const browser=await chromium.launch({headless:false});
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
const go=async(mode)=>{await page.goto(`http://127.0.0.1:3200/review/v6?v=a4.7&glass=${mode}`);await page.evaluate(()=>document.fonts.ready);if(mode==='sdk')await page.waitForFunction(()=>document.querySelector('[data-hero-scene]')?.dataset.glassState==='enhanced',{},{timeout:15000});await page.waitForTimeout(200);};
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
await context.close();await browser.close();await writeFile(`${root}/audit.json`,JSON.stringify(results,null,2));
