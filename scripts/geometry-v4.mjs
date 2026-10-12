import {chromium} from 'playwright';
import {writeFile,mkdir} from 'node:fs/promises';
const browser=await chromium.launch();const results=[];const failures=[];
for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,720],[768,1024],[390,844],[360,800],[640,360]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 for(const path of ['/','/demo','/products/crm','/products/oms','/products/crm-oms','/cases/b2b-wholesale','/cases/flooring-manufacturer','/cases/online-school']){
  await page.goto('http://127.0.0.1:3100'+path);await page.evaluate(()=>document.fonts.ready);
  const checks=await page.evaluate(()=>{const overflow=document.documentElement.scrollWidth>innerWidth;const controls=[...document.querySelectorAll('main button,main input,main select,main a')].filter(el=>el.getBoundingClientRect().width>0).filter(el=>{const b=el.getBoundingClientRect();return b.left<0||b.right>innerWidth+1;}).map(el=>el.textContent?.slice(0,80));return{overflow,controls};});
  const r={width,height,path,...checks};results.push(r);if(checks.overflow||checks.controls.length)failures.push(r);
  if(path==='/'&&width>=1280){const elements=[];for(const selector of ['#hero h1','#hero .scene-copy>p','#hero .actions','#hero .demo']){const b=await page.locator(selector).boundingBox();elements.push({selector,...b});if(!b||b.y<76||b.y+b.height>height+1)failures.push({width,height,path,selector,reason:'initial hero outside viewport',box:b});}results.push({width,height,path,hero:elements});}
 }
 await page.goto('http://127.0.0.1:3100/demo?product=oms');await page.locator('[data-record-id=DEMO-O-01]').click();await page.locator('[data-task-id=DEMO-T-02] button').focus();const b=await page.locator('[data-task-id=DEMO-T-02] button').boundingBox();if(!b||b.y<68||b.y+b.height>height+1)failures.push({width,height,reason:'focused task control hidden',box:b});await page.close();
}
await browser.close();await mkdir('qa/v4',{recursive:true});const report={date:new Date().toISOString(),status:failures.length?'FAIL':'PASS',results,failures,zoom:'640x360 CSS viewport emulation; native browser zoom not run'};await writeFile('qa/v4/geometry.json',JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,checks:results.length,failures}));process.exitCode=failures.length?1:0;
