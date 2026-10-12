import {chromium} from 'playwright';
import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root='qa/v6-a43';await mkdir(`${root}/contrast`,{recursive:true});const b=await chromium.launch(),rows=[];
const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const ratio=(a,c)=>(Math.max(lum(a),lum(c))+.05)/(Math.min(lum(a),lum(c))+.05);
for(const width of [1920,1440,430,390,320]){
 const p=await b.newPage({viewport:{width,height:2400},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:3200/review/v6');await p.evaluate(()=>document.fonts.ready);
 for(const mode of ['normal','no-blur','contrast']){
  await p.emulateMedia({contrast:mode==='contrast'?'more':'no-preference'});await p.locator('[data-v6-review]').evaluate((e,opaque)=>e.toggleAttribute('data-no-blur',opaque),mode==='no-blur');
  await p.evaluate(()=>scrollTo(0,0));
  const targets=await p.evaluate(()=>{const roots=[document.querySelector('[data-v6-story]')],out=[];for(const root of roots){const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walk.nextNode()){const t=walk.currentNode,e=t.parentElement;if(!t.textContent.trim()||!e.getClientRects().length||e.closest('button:disabled'))continue;const r=document.createRange();r.selectNode(t);const c=getComputedStyle(e);for(const rect of r.getClientRects()){if(rect.width&&rect.height&&rect.top>=0&&rect.bottom<=innerHeight)out.push({text:t.textContent.trim(),rect:rect.toJSON(),color:c.color});}}}return out;});
  await p.screenshot({path:`${root}/contrast/hero-${width}-${mode}.png`});
  const hide=await p.addStyleTag({content:'[data-v6-review] *{-webkit-text-fill-color:transparent!important;text-shadow:none!important}'});
  const{data,info}=await sharp(await p.screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const results=targets.map(t=>{const fg=t.color.match(/[\d.]+/g).slice(0,3).map(Number),r=t.rect;let min=99,bg;for(let y=Math.ceil(r.y)+1;y<Math.floor(r.y+r.height)-1;y+=2)for(let x=Math.ceil(r.x)+1;x<Math.floor(r.x+r.width)-1;x+=2){const i=(y*info.width+x)*info.channels,c=[data[i],data[i+1],data[i+2]],n=ratio(fg,c);if(n<min){min=n;bg=c}}return{text:t.text,foreground:fg,worstBackground:bg,minContrast:min}});
  rows.push({width,mode,minimum:Math.min(...results.map(r=>r.minContrast)),results});await hide.evaluate(e=>e.remove());
 }
 await p.close();
}
const p=await b.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:3200/review/v6');await p.locator('#products').evaluate(e=>e.scrollIntoView());await p.evaluate(()=>document.fonts.ready);
const client=await p.context().newCDPSession(p);await client.send('Performance.enable');const first=(await client.send('Performance.getMetrics')).metrics;await p.waitForTimeout(1000);const last=(await client.send('Performance.getMetrics')).metrics;
const metric=n=>last.find(v=>v.name===n).value-first.find(v=>v.name===n).value;
const staticCost={sampleMs:1000,layoutCount:metric('LayoutCount'),recalcStyleCount:metric('RecalcStyleCount'),scriptDurationSeconds:metric('ScriptDuration'),animations:await p.locator('[data-story-atmosphere]').evaluate(e=>e.getAnimations({subtree:true}).length)};

const productRows=[];
for(const width of [1920,1728,1440,430,390,320]){
 const p=await b.newPage({viewport:{width,height:2200},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:3200/review/v6');await p.evaluate(()=>document.fonts.ready);
 for(const id of ['crm-history','crm-next-step','oms-continuity','oms-responsibility','custom-process','custom-solution']){
  if(width<=900)await p.getByRole('button',{name:{crm:'CRM',oms:'OMS',custom:'Разработка'}[id.split('-')[0]],exact:true}).click();
  await p.locator(`button[data-topic="${id}"]`).click();await p.locator('[data-a3-disclosure]').click();await p.locator('#products').evaluate(e=>e.scrollIntoView({behavior:'instant'}));await p.evaluate(()=>document.activeElement?.blur());
  const targets=await p.evaluate(()=>{const roots=[document.querySelector('[data-a3-copy]'),document.querySelector('[aria-label="Направления TMS"]')],out=[];for(const root of roots){const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walk.nextNode()){const t=walk.currentNode,e=t.parentElement;if(!t.textContent.trim()||!e.getClientRects().length||e.closest('button:disabled'))continue;const r=document.createRange();r.selectNode(t);const c=getComputedStyle(e);for(const rect of r.getClientRects()){if(rect.width&&rect.height&&rect.top>=0&&rect.bottom<=innerHeight)out.push({text:t.textContent.trim(),rect:rect.toJSON(),color:c.color});}}}return out;});
  await p.screenshot({path:`${root}/contrast/product-${width}-${id}.png`});
  const hide=await p.addStyleTag({content:'[data-v6-review] *{-webkit-text-fill-color:transparent!important;text-shadow:none!important}'});
  const{data,info}=await sharp(await p.screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const results=targets.map(t=>{const fg=t.color.match(/[\d.]+/g).slice(0,3).map(Number),r=t.rect;let min=99,bg;for(let y=Math.ceil(r.y)+1;y<Math.floor(r.y+r.height)-1;y+=2)for(let x=Math.ceil(r.x)+1;x<Math.floor(r.x+r.width)-1;x+=2){const i=(y*info.width+x)*info.channels,c=[data[i],data[i+1],data[i+2]],n=ratio(fg,c);if(n<min){min=n;bg=c}}return{text:t.text,foreground:fg,worstBackground:bg,minContrast:min}});
  productRows.push({width,id,minimum:Math.min(...results.map(r=>r.minContrast)),results});await hide.evaluate(e=>e.remove());
 }await p.close();
}
await writeFile(`${root}/product-contrast.json`,JSON.stringify({checkedAt:new Date().toISOString(),status:productRows.every(r=>r.minimum>=4.5)?'PASS':'FAIL',rows:productRows},null,2));
console.log('Product composite minimum',Math.min(...productRows.map(r=>r.minimum)));

await b.close();
const report={checkedAt:new Date().toISOString(),method:'Chromium rendered backgrounds: text fill hidden without changing layout, original foreground vs every second pixel in each visible text range. Conservative bounding-rectangle sampling; not a screen-reader audit.',rows,staticCost,status:rows.every(r=>r.minimum>=4.5)?'PASS':'FAIL'};
await writeFile(`${root}/composite-contrast.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,min:Math.min(...rows.map(r=>r.minimum)),staticCost}));
const before=JSON.parse(await readFile(`${root}/before-geometry.json`)),after=JSON.parse(await readFile(`${root}/geometry.json`));let maxDelta=0;for(let i=0;i<before.geometry.length;i++){const a=before.geometry[i],z=after.geometry[i];if(a.width>900)for(const s of ['workspace','copy','heading','cta','nav','body'])for(const key of ['x','y','width','height'])maxDelta=Math.max(maxDelta,Math.abs(a[s][key]-z[s][key]));}
const navA=await sharp(`${root}/before/navigation.png`).raw().toBuffer(),navB=await sharp(`${root}/screenshots/navigation.png`).raw().toBuffer();const geometry={checkedAt:new Date().toISOString(),sceneViewports:after.geometry.length,desktopMaxDelta:maxDelta,navigationPixelsIdentical:navA.equals(navB),noOverflow:after.geometry.every(g=>g.pageWidth<=g.width),status:maxDelta===0&&navA.equals(navB)&&after.geometry.every(g=>g.pageWidth<=g.width)?'PASS':'FAIL'};await writeFile(`${root}/geometry-verification.json`,JSON.stringify(geometry,null,2));console.log(geometry);
