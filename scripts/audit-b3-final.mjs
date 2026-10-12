import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const root='qa/v6-b3',browser=await chromium.launch(),report={reflow:[],routes:[],notice:[]};
await mkdir(`${root}/comparison`,{recursive:true});await mkdir(`${root}/videos`,{recursive:true});
for(const version of ['B2','B3'])for(const width of [320,360,390]){
 const p=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
 await p.addInitScript(()=>localStorage.setItem('tms:cookie-notice:v1','closed'));
 await p.goto(`http://127.0.0.1:${version==='B2'?3220:3200}/`);await p.evaluate(()=>document.fonts.ready);
 await p.addStyleTag({content:'html{font-size:200%}*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'});
 const geometry=await p.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1}).map(e=>({tag:e.tagName,class:e.className,text:e.textContent?.slice(0,70),right:e.getBoundingClientRect().right})).slice(0,20)}));
 await p.screenshot({path:`${root}/comparison/${version}-text200-spacing-${width}.png`});report.reflow.push({version,width,...geometry});await p.close();
}
for(const width of [320,360,390]){
 const p=await browser.newPage({viewport:{width,height:844}});await p.goto('http://127.0.0.1:3200/');await p.addStyleTag({content:'html{font-size:200%}*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'});
 const panel=await p.locator('[data-cookie-notice]').boundingBox();await p.getByRole('button',{name:'Понятно',exact:true}).focus();const button=await p.getByRole('button',{name:'Понятно',exact:true}).boundingBox();await p.screenshot({path:`${root}/notice/independent-enlarged-${width}.png`});await p.keyboard.press('Enter');report.notice.push({width,panel,button,dismissed:await p.locator('[data-cookie-notice]').count()===0,stored:await p.evaluate(()=>localStorage.getItem('tms:cookie-notice:v1'))});await p.close();
}
for(const path of ['/','/products/crm','/products/oms','/products/crm-oms','/custom-development','/about','/partners','/cases','/cases/b2b-wholesale','/cases/flooring-manufacturer','/cases/online-school','/privacy','/consent','/cookies']){
 const c=await browser.newContext(),p=await c.newPage(),remote=[],setCookies=[],posts=[],errors=[];p.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:3200/'))remote.push(r.url());if(r.method()==='POST')posts.push(r.url());});p.on('response',r=>{if(r.headers()['set-cookie'])setCookies.push(r.url());});p.on('pageerror',e=>errors.push(e.message));
 const response=await p.goto('http://127.0.0.1:3200'+path+'?utm_source=probe');await p.waitForTimeout(150);
 const state=await p.evaluate(async()=>({local:{...localStorage},session:{...sessionStorage},cookies:document.cookie,caches:await caches.keys(),serviceWorkers:(await navigator.serviceWorker.getRegistrations()).length}));report.routes.push({path,status:response.status(),remote,setCookies,posts,errors,state});await c.close();
}
for(const width of [1440,390]){
 const c=await browser.newContext({viewport:{width,height:900},recordVideo:{dir:`${root}/videos`,size:{width,height:900}}}),p=await c.newPage();let payload;
 await p.route('**/api/lead',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:503,json:{ok:false,message:'Локальная QA-проверка: доставка отключена'}});});
 await p.goto('http://127.0.0.1:3200/cases');await p.getByRole('button',{name:'Понятно',exact:true}).click();await p.locator('a[href="/cases/flooring-manufacturer"]').filter({hasText:'Разбор проекта'}).click();await p.screenshot({path:`${root}/states/explorer-${width}.png`});await p.getByRole('button',{name:'Обсудить похожую задачу'}).click();await p.getByLabel('Ваше имя').fill('B3 QA');await p.getByLabel('Email или телефон').fill('b3@example.test');await p.getByRole('checkbox').check();await p.getByRole('button',{name:'Отправить запрос'}).click();await p.getByRole('dialog').getByRole('alert').waitFor();report['casePayload'+width]=payload;await p.screenshot({path:`${root}/states/case-form-${width}.png`});await p.keyboard.press('Escape');await p.locator('footer a[href="/consent"]').click();await p.screenshot({path:`${root}/states/consent-${width}.png`,fullPage:true});await c.close();
}
await browser.close();await writeFile(`${root}/supplement.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
