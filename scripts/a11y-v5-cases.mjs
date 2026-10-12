import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();const results=[];
try{for(const slug of ['b2b-wholesale','flooring-manufacturer','online-school']){for(const width of [1440,390]){const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();await page.goto('http://127.0.0.1:3100/demo?case='+slug);await page.evaluate(()=>document.fonts.ready);
const scan=async state=>{const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();results.push({slug,width,state,violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>n.target)}))});};await scan('initial');
if(slug==='b2b-wholesale'){await page.locator('[data-record-id=DEMO-D-03]').click();}
if(slug==='flooring-manufacturer'){await page.getByRole('button',{name:'Оформить учебный заказ'}).click();await page.getByRole('button',{name:'Посмотреть учебный документ'}).click();}
if(slug==='online-school'){await page.getByRole('button',{name:'Показать подготовленный ответ'}).click();await page.getByRole('button',{name:'Записать на занятие'}).click();}
await scan('changed');await context.close();}}}finally{await browser.close();}
const status=results.some(r=>r.violations.length)?'FAIL':'PASS';await writeFile('qa/v5/case-accessibility.json',JSON.stringify({date:new Date().toISOString(),status,results},null,2));console.log(JSON.stringify({status,scans:results.length,violations:results.flatMap(r=>r.violations)}));process.exitCode=status==='PASS'?0:1;
