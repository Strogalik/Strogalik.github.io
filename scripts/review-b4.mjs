import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const root='qa/v6-b4',browser=await chromium.launch(),report={routes:[],recordings:[]};
await mkdir(`${root}/videos`,{recursive:true});
for(const path of ['/','/products/crm','/products/oms','/products/crm-oms','/custom-development','/about','/partners','/cases','/cases/b2b-wholesale','/cases/flooring-manufacturer','/cases/online-school','/privacy','/consent','/cookies']){
 const c=await browser.newContext(),p=await c.newPage(),remote=[],setCookies=[],posts=[],errors=[];p.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:3200/'))remote.push(r.url());if(r.method()==='POST')posts.push(r.url());});p.on('response',r=>{if(r.headers()['set-cookie'])setCookies.push(r.url());});p.on('pageerror',e=>errors.push(e.message));
 const response=await p.goto('http://127.0.0.1:3200'+path+'?utm_source=probe');await p.waitForTimeout(150);
 const state=await p.evaluate(async()=>({local:{...localStorage},session:{...sessionStorage},cookies:document.cookie,caches:await caches.keys(),serviceWorkers:(await navigator.serviceWorker.getRegistrations()).length}));report.routes.push({path,status:response.status(),remote,setCookies,posts,errors,state});await c.close();
}

for(const scenario of ['footer-resize','faq']){
 const c=await browser.newContext({viewport:{width:1920,height:1080},recordVideo:{dir:`${root}/videos`,size:{width:1920,height:1080}}}),p=await c.newPage();await p.addInitScript(()=>localStorage.setItem('tms:cookie-notice:v1','closed'));await p.goto('http://127.0.0.1:3200/');await p.evaluate(()=>document.fonts.ready);
 for(const width of [1920,1728,1440,1121,1120,1101,1100,901,900,701,700,601,600,430,390,360,320,1440]){await p.setViewportSize({width,height:900});await p.locator(scenario==='faq'?'#faq':'footer').evaluate(e=>e.scrollIntoView({behavior:'instant'}));if(scenario==='faq'){for(const el of await p.locator('#faq summary').all())await el.click();}await p.waitForTimeout(220);}
 const video=p.video();await c.close();await video.saveAs(`${root}/videos/${scenario}.webm`);report.recordings.push(scenario);
}
const p=await browser.newPage({viewport:{width:390,height:844}});await p.goto('http://127.0.0.1:3200/');await p.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});await p.locator('#faq').evaluate(e=>e.scrollIntoView());await p.screenshot({path:`${root}/faq/forced-colors-390.png`});await p.locator('footer').evaluate(e=>e.scrollIntoView());await p.screenshot({path:`${root}/footer/forced-colors-390.png`});await browser.close();await writeFile(`${root}/supplement.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
