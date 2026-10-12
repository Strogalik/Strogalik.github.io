import {chromium} from 'playwright';import{readFile,access,writeFile}from'node:fs/promises';import{resolve,dirname}from'node:path';import{pathToFileURL}from'node:url';
const file=resolve('qa/v6-a46/index.html'),html=await readFile(file,'utf8'),references=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(s=>!/^https?:/.test(s)&&!s.startsWith('#'));
for(const ref of references)await access(resolve(dirname(file),ref));
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto(pathToFileURL(file).href);
let combinations=0;for(const topic of ['hero','crm-history','crm-next-step','oms-continuity','oms-responsibility','custom-process','custom-solution'])for(const width of ['1920','1728','1440','430','390'])for(const opened of [false,true]){
 await p.locator('#topic').selectOption(topic);await p.locator('#width').selectOption(width);if(topic==='hero')await p.locator('#mode').selectOption(opened?'css':'sdk');else await p.locator('#opened').setChecked(opened);
 await p.evaluate(async()=>{for(const id of ['before','after','before-incoming','after-incoming','before-outgoing','after-outgoing'])await document.getElementById(id).decode();});combinations++;
}
await p.locator('#topic').selectOption('hero');await p.locator('#width').selectOption('1440');await p.locator('#mode').selectOption('sdk');await p.screenshot({path:'qa/v6-a46/gallery-desktop.png'});
await p.setViewportSize({width:390,height:844});await p.screenshot({path:'qa/v6-a46/gallery-mobile.png'});const noOverflow=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);await b.close();if(!noOverflow)throw Error('Gallery overflow');await writeFile('qa/v6-a46/gallery-check.json',JSON.stringify({date:new Date().toISOString(),status:'PASS',staticReferences:references.length,dynamicCombinations:combinations,noOverflow},null,2));console.log('Gallery PASS:',combinations,'combinations;',references.length,'local references');
