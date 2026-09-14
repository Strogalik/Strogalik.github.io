"""Native 1920x1080 QA, font verification, PDF and PNG export. No font redistribution."""
import asyncio, json, shutil
from pathlib import Path
import fitz
from PIL import Image
from playwright.async_api import async_playwright

OUT=Path('qa-output'); OUT.mkdir(exist_ok=True)
(OUT/'screens').mkdir(exist_ok=True)
AUDIT=r'''root => {
 const R=root.getBoundingClientRect(), items=[],small=[],outside=[],clipped=[];
 const owners=new Map();let oid=0;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while(n=walker.nextNode()){
  if(!n.textContent.trim())continue;
  const e=n.parentElement, st=getComputedStyle(e);
  if(st.display==='none'||st.visibility==='hidden')continue;
  const owner=e.closest('h1,h2,h3,p,footer,.status,.window-top')||e;
  if(!owners.has(owner))owners.set(owner,++oid);
  const range=document.createRange();range.selectNodeContents(n);
  for(const b of range.getClientRects()){
   if(b.width<1||b.height<1)continue;
   const it={text:n.textContent.trim(),x:b.x-R.x,y:b.y-R.y,w:b.width,h:b.height,font:parseFloat(st.fontSize),owner:owners.get(owner)};items.push(it);
   if(it.font<20)small.push(it);
   if(it.x<-.5||it.y<-.5||it.x+it.w>1920.5||it.y+it.h>1080.5)outside.push(it);
   for(let p=e;p&&p!==root;p=p.parentElement){const ps=getComputedStyle(p);if(['hidden','clip'].includes(ps.overflowX)||['hidden','clip'].includes(ps.overflowY)){const pr=p.getBoundingClientRect();if(b.left<pr.left-1||b.right>pr.right+1||b.top<pr.top-2||b.bottom>pr.bottom+2){clipped.push({text:it.text,parent:p.className});break}}}
  }
 }
 const overlaps=[];for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const a=items[i],b=items[j];if(a.owner===b.owner)continue;const dx=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),dy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);if(dx>3&&dy>3)overlaps.push({a:a.text,b:b.text,dx,dy})}
 return {width:R.width,height:R.height,small,outside,clipped,overlaps,text:root.innerText};
}'''
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(args=['--no-sandbox'])
  page=await browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://127.0.0.1:4173/?native=1',wait_until='networkidle',timeout=90000)
  await page.evaluate("Promise.all([document.fonts.load('700 90px Montserrat','Управленческий'),document.fonts.load('500 28px Montserrat','Дилеры и команда'),document.fonts.load('600 28px Montserrat','Актуальна'),document.fonts.load('500 20px Inter','Сентябрь')])")
  await page.evaluate('document.fonts.ready')
  await page.wait_for_timeout(800)
  assert await page.locator('.frame').count()==10,'Expected 10 sections'
  assert await page.locator('input,button,select,textarea,form').count()==0,'Unexpected UI controls'
  assert await page.locator('.brand').evaluate_all('(els)=>els.every(e=>e.complete&&e.naturalWidth>0)'),'Logo failed'
  cdp=await page.context.new_cdp_session(page)
  await cdp.send('DOM.enable');await cdp.send('CSS.enable')
  doc=await cdp.send('DOM.getDocument')
  fonts={}
  for sel in ['h1','.hero-copy .support','.status.green']:
   node=await cdp.send('DOM.querySelector',{'nodeId':doc['root']['nodeId'],'selector':sel})
   fs=await cdp.send('CSS.getPlatformFontsForNode',{'nodeId':node['nodeId']})
   fonts[sel]=fs['fonts'];assert any('Montserrat' in x['familyName'] for x in fs['fonts']),f'Wrong font: {sel}: {fs}'
  reports=[]
  for i in range(10):
   frame=page.locator('.frame').nth(i)
   await frame.screenshot(path=str(OUT/f'screens/{i+1:02}.png'))
   r=await frame.evaluate(AUDIT);r['screen']=i+1;reports.append(r)
  failures=[r for r in reports if r['small'] or r['outside'] or r['overlaps'] or r['clipped'] or r['width']!=1920 or r['height']!=1080]
  report={'fonts':fonts,'runtime_errors':errors,'screens':reports,'passed':not failures and not errors}
  (OUT/'qa-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  await page.pdf(path='dist/TMS_MANAGEMENT_CONTOUR.pdf',width='1920px',height='1080px',print_background=True,prefer_css_page_size=True)
  shutil.copy('dist/TMS_MANAGEMENT_CONTOUR.pdf',OUT/'TMS_MANAGEMENT_CONTOUR.pdf')
  await page.set_viewport_size({'width':1440,'height':900})
  await page.goto('http://127.0.0.1:4173/',wait_until='networkidle')
  assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Horizontal overflow at 1440'
  await page.screenshot(path=str(OUT/'laptop-view.png'))
  await browser.close()
 imgs=[Image.open(OUT/f'screens/{i:02}.png').convert('RGB') for i in range(1,11)]
 w,h,pad=960,540,20
 contact=Image.new('RGB',(2*w+3*pad,5*(h+pad)+pad),'#DCE4EC')
 for i,im in enumerate(imgs):contact.paste(im.resize((w,h),Image.Resampling.LANCZOS),(pad+(i%2)*(w+pad),pad+(i//2)*(h+pad)))
 contact.save(OUT/'full-preview.png');contact.save('dist/full-visual-preview.png')
 pdf=fitz.open('dist/TMS_MANAGEMENT_CONTOUR.pdf');assert len(pdf)==10,f'PDF pages: {len(pdf)}'
 (OUT/'pdf-renders').mkdir(exist_ok=True)
 for i,p in enumerate(pdf):p.get_pixmap(matrix=fitz.Matrix(2/3,2/3)).save(OUT/f'pdf-renders/{i+1:02}.png')
 print(json.dumps({'passed':report['passed'],'failures':failures,'runtime_errors':errors},ensure_ascii=False))
 assert report['passed'],'Visual geometry QA failed; review qa-report.json'
asyncio.run(main())
