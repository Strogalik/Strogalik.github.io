import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('qa/v3-screenshots',{recursive:true});const b=await chromium.launch();const output=[];let failures=0;
for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,720],[390,844],[360,800],[640,360]]){
 const p=await b.newPage({viewport:{width,height},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:3000/');await p.evaluate(()=>document.fonts.ready);
 for(const id of ['hero','ecosystem','product-crm','product-oms','together','calculator','cases']){
  const scene=p.locator('#'+id);await scene.evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))));await p.waitForTimeout(500);
  const selectors=id==='cases'?['h2','.section-intro','.case-card']:id==='calculator'?['h2','.calculator']:id==='ecosystem'?['h2','.lead','.context-strip','.text-link']:['h1,h2','.scene-copy>p','.actions','.demo'];
  const issues=[];for(const selector of selectors){for(const el of await scene.locator(selector).all()){const r=await el.boundingBox();if(width>=1280 && (r.y<75||r.y+r.height>height+1))issues.push({selector,top:r.y,bottom:r.y+r.height,height});}}
  const demo=scene.locator('.demo'),heights=[];
  if(await demo.count() && await demo.locator('button').count()){
   await demo.getByRole('button',{name:'Повторить'}).click();
   do{heights.push((await demo.boundingBox()).height);if(!await demo.getByRole('button',{name:'Следующий шаг'}).isEnabled())break;await demo.getByRole('button',{name:'Следующий шаг'}).click();}while(heights.length<5);
   if(Math.max(...heights)-Math.min(...heights)>1)issues.push({kind:'unstable demo height',heights});
  }
  const clipped=await scene.evaluate(root=>[...root.querySelectorAll('h1,h2,p,b,strong,a,button,figcaption')].filter(el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height)return false;for(let ancestor=el.parentElement;ancestor&&ancestor!==document.body;ancestor=ancestor.parentElement){const s=getComputedStyle(ancestor),a=ancestor.getBoundingClientRect();if(/hidden|clip/.test(s.overflowY)&&(r.top<a.top-1||r.bottom>a.bottom+1))return true;if(/hidden|clip/.test(s.overflowX)&&(r.left<a.left-1||r.right>a.right+1))return true;}return false;}).map(el=>el.tagName));
  if(clipped.length)issues.push({kind:'ancestor clipping',elements:clipped});failures+=issues.length;output.push({width,height,id,heights,issues});
  if(width===1280||width===1366)await p.screenshot({path:`qa/v3-screenshots/${id}-${width}x${height}.png`});
 }
 if(width>=1280)for(const slug of ['crm','oms','crm-oms']){
  await p.goto('http://127.0.0.1:3000/products/'+slug);await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);const scene=p.locator('.product-detail-hero');const issues=[];
  for(const selector of ['h1','.scene-copy>p','.actions','.demo']){const r=await scene.locator(selector).boundingBox();if(r.y<75||r.y+r.height>height+1)issues.push({selector,top:r.y,bottom:r.y+r.height,height});}
  failures+=issues.length;output.push({width,height,id:'landing-'+slug,issues});if(width===1280)await p.screenshot({path:`qa/v3-screenshots/landing-${slug}-1280x720.png`});
 }
 await p.close();
}
const zoom=await b.newContext({viewport:{width:640,height:360},deviceScaleFactor:2,reducedMotion:'reduce'});const p=await zoom.newPage();await p.goto('http://127.0.0.1:3000/');await p.screenshot({path:'qa/v3-screenshots/zoom-200-equivalent.png'});await p.locator('#product-crm .demo').scrollIntoViewIfNeeded();await p.screenshot({path:'qa/v3-screenshots/zoom-200-demo.png'});await p.locator('#product-crm .demo button').first().focus();const focus=await p.evaluate(()=>{const r=document.activeElement.getBoundingClientRect();return{top:r.top,bottom:r.bottom,viewport:innerHeight,header:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))}});if(focus.top<focus.header||focus.bottom>focus.viewport)failures++;output.push({zoom:'200% equivalent: 640x360 CSS, device scale 2 → 1280x720 pixels',focus});await zoom.close();
await writeFile('qa/v3-geometry.json',JSON.stringify({failures,output},null,2));console.log(JSON.stringify({failures,issues:output.filter(r=>r.issues?.length)}));await b.close();process.exitCode=failures?1:0;
