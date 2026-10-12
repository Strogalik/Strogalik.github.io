import {chromium} from 'playwright';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const before=process.argv.includes('--before'),root=`qa/v6-a48/${before?'before-entry':'entry'}`;await mkdir(root,{recursive:true});
const browser=await chromium.launch();const report={date:new Date().toISOString(),engine:browser.version(),clock:'Controlled requestAnimationFrame timestamps, actual production controller; not performance measurements',runs:[]};
const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0),ratio=(a,c)=>(Math.max(lum(a),lum(c))+.05)/(Math.min(lum(a),lum(c))+.05);
async function contrast(page,selector,name){
 const targets=await page.evaluate(selector=>{const out=[];for(const root of document.querySelectorAll(selector)){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode,e=n.parentElement,s=getComputedStyle(e);if(!n.textContent.trim()||s.visibility!=='visible'||!e.getClientRects().length)continue;let opacity=1;for(let el=e;el;el=el.parentElement)opacity*=Number(getComputedStyle(el).opacity);const r=document.createRange();r.selectNode(n);for(const rect of r.getClientRects())if(rect.width&&rect.top>=0&&rect.bottom<=innerHeight)out.push({text:n.textContent.trim(),color:s.color,opacity,rect:rect.toJSON()});}}return out;},selector);
 await page.screenshot({path:`${root}/${name}.png`});const hide=await page.addStyleTag({content:`${selector},${selector} *{-webkit-text-fill-color:transparent!important;text-shadow:none!important}`});const{data,info}=await sharp(await page.screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});await hide.evaluate(e=>e.remove());
 const values=targets.map(t=>{const color=t.color.match(/[\d.]+/g).slice(0,3).map(Number);let minimum=99,worst;for(let y=Math.ceil(t.rect.y)+1;y<Math.floor(t.rect.bottom)-1;y+=2)for(let x=Math.ceil(t.rect.x)+1;x<Math.floor(t.rect.right)-1;x+=2){const i=(y*info.width+x)*info.channels,bg=[data[i],data[i+1],data[i+2]],fg=color.map((v,i)=>v*t.opacity+bg[i]*(1-t.opacity)),v=ratio(fg,bg);if(v<minimum){minimum=v;worst=bg;}}return{text:t.text,opacity:t.opacity,minContrast:minimum,worstBackground:worst};});return{values,minimum:Math.min(...values.map(v=>v.minContrast))};
}

for(const width of [1920,430,390]){
 const page=await browser.newPage({viewport:{width,height:width<500?1600:1080}});
 await page.addInitScript(()=>{const q=new Map();let id=0;window.requestAnimationFrame=fn=>{q.set(++id,fn);return id;};window.cancelAnimationFrame=id=>q.delete(id);window.__tick=t=>{const batch=[...q.values()];q.clear();batch.forEach(fn=>fn(t));return q.size;};});
 await page.goto('http://127.0.0.1:3200/review/v6?glass=auto');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);await page.evaluate(()=>window.__tick(0));
 const run={width,phases:[]};let base;
 for(const time of [0,120,240,480,3000,3120,3240,3480,4490,4500,4540,4620,4740,4920,5100,6000]){
  await page.evaluate(t=>window.__tick(t),time);await page.waitForTimeout(25);
  const state=await page.evaluate(()=>{const fig=document.querySelector('[data-v6-story]'),oms=document.querySelector('[data-hero-step="3"]');return{actualMs:Number(fig.dataset.elapsed),ambientTime:fig.dataset.ambientTime,omsTranslate:oms.style.translate,omsVisibility:getComputedStyle(oms).visibility,shell:document.querySelector('[class*=glassWindow]').getBoundingClientRect().toJSON(),background:document.querySelector('[data-glass-background]').getBoundingClientRect().toJSON()};});
  await page.locator('[class*=glassWindow]').screenshot({path:`${root}/${width}-${time}.png`});
  const hide=await page.addStyleTag({content:'[data-hero-step]{visibility:hidden!important}'});const bg=await page.locator('[class*=glassWindow]').screenshot({path:`${root}/${width}-${time}-background.png`});await hide.evaluate(e=>e.remove());const raw=await sharp(bg).raw().toBuffer();if(!base)base=raw;run.phases.push({targetMs:time,...state,backgroundSame:base.equals(raw),...(!before?await contrast(page,'[data-hero-scene]',`${width}-${time}-composite`):{})});
  if(time===4620){await page.locator('[data-v6-story] button').first().click();const a=await page.locator('[class*=glassWindow]').screenshot();await page.evaluate(()=>window.__tick(4620));const b=await page.locator('[class*=glassWindow]').screenshot();run.pauseSame=a.equals(b);await page.locator('[data-v6-story] button').first().click();await page.evaluate(()=>window.__tick(4620));}
 }
 report.runs.push(run);await page.close();
}
await browser.close();await writeFile(`${root}/audit.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report.runs.map(r=>({width:r.width,pause:r.pauseSame,background:r.phases.every(p=>p.backgroundSame),actual:r.phases.map(p=>p.actualMs)}))));
