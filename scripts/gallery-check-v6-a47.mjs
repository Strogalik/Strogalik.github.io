import {chromium}from'playwright';import{writeFile}from'node:fs/promises';import{resolve}from'node:path';import{pathToFileURL}from'node:url';
const b=await chromium.launch(),p=await b.newPage(),report={date:new Date().toISOString(),errors:[],combinations:0,videos:[]};await p.goto(pathToFileURL(resolve('qa/v6-a47/index.html')).href);
for(const t of ['hero','footer','crm-history','crm-next-step','oms-continuity','oms-responsibility','custom-process','custom-solution'])for(const w of ['1920','1728','1440','1366','1024','901','900','768','601','600','430','390','360','320']){
 await p.selectOption('#topic',t);await p.selectOption('#width',w);for(const open of [false,true]){if(!['hero','footer'].includes(t))await p.locator('#opened').setChecked(open);await p.waitForFunction(()=>[...document.querySelectorAll('#before,#after')].every(e=>e.complete));const ok=await p.locator('#before,#after').evaluateAll(es=>es.every(e=>e.naturalWidth>0));if(!ok)report.errors.push({t,w,open});report.combinations++;}
}
for(const size of [390,1440]){await p.setViewportSize({width:size,height:900});if(!await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))report.errors.push({overflow:size});}
for(const v of await p.locator('video').all()){
 await v.evaluate(async e=>{e.load();await new Promise((r,j)=>{e.onloadedmetadata=r;e.onerror=j;});if(!Number.isFinite(e.duration)){e.currentTime=1e9;await new Promise(r=>e.onseeked=r);}});
 report.videos.push(await v.evaluate(e=>({src:e.getAttribute('src'),seconds:e.duration,width:e.videoWidth,height:e.videoHeight})));
}
report.images=await p.locator('img').evaluateAll(async es=>{await Promise.all(es.map(e=>{e.loading='eager';return e.decode().catch(()=>{});}));return es.map(e=>({src:e.getAttribute('src'),valid:!!e.naturalWidth}));});await b.close();await writeFile('qa/v6-a47/gallery-check.json',JSON.stringify(report,null,2));console.log(report);
