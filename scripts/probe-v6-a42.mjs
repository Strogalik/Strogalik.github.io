import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const before=process.argv.includes('--before'),root='qa/v6-a42',b=await chromium.launch(),p=await b.newPage({viewport:{width:1180,height:900},reducedMotion:'reduce'});await mkdir(root,{recursive:true});
await p.goto('http://127.0.0.1:3200/review/v6');await p.evaluate(()=>document.fonts.ready);
const rows=[];
for(const width of [1180,1249,1250,1251,1252,1300,1365,1366]){await p.setViewportSize({width,height:900});await p.locator('#products').evaluate(e=>e.scrollIntoView({behavior:'instant'}));rows.push({width,...await p.evaluate(()=>{const box=s=>document.querySelector(s).getBoundingClientRect().toJSON();return{nav:box('[data-a3-group]'),copy:box('[data-a3-copy]'),workspace:box('[data-a3-workspace]'),gap:getComputedStyle(document.querySelector('[data-a3-workspace]')).columnGap};})});if([1250,1251,1366].includes(width))await p.screenshot({path:`${root}/${before?'before':'after'}-transition-${width}.png`});}
await p.setViewportSize({width:901,height:900});await p.locator('button[data-topic="crm-history"]').click();await p.keyboard.press('End');
const focus=()=>p.evaluate(()=>({activeTopic:document.querySelector('[data-story-experience]').getAttribute('data-topic'),focused:document.activeElement?.getAttribute('data-topic'),tag:document.activeElement?.tagName,visible:!!document.activeElement?.getClientRects().length,tabIndex:document.activeElement?.tabIndex,scroll:scrollY}));
const desktop=await focus();await p.setViewportSize({width:900,height:900});await p.waitForTimeout(150);const mobile=await focus();
const report={date:new Date().toISOString(),version:before?'A4.1':'A4.2',height:900,rows,jump1250to1251:rows.find(v=>v.width===1251).copy.x-rows.find(v=>v.width===1250).copy.x,focus:{desktop,mobile}};
await writeFile(`${root}/${before?'before':'after'}-risks.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await b.close();
