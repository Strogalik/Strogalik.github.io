"""Native-size browser validation and PDF export; no fonts are packaged."""
import json, os, pathlib, sys
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'qa'; (OUT/'screens').mkdir(parents=True,exist_ok=True)
URL=os.environ.get('TMS_PREVIEW_URL','http://127.0.0.1:4188/preview.html?native=1')
CHECK=r'''() => [...document.querySelectorAll('.frame')].map((frame,i)=>{
 const box=frame.getBoundingClientRect(); let texts=[]; let walker=document.createTreeWalker(frame,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()) {const node=walker.currentNode;if(!node.textContent.trim())continue;const el=node.parentElement;const css=getComputedStyle(el);if(css.display==='none'||css.visibility==='hidden')continue;const r=document.createRange();r.selectNodeContents(node);for(const rr of r.getClientRects()){if(rr.width<1||rr.height<1)continue;texts.push({element:[...frame.querySelectorAll('*')].indexOf(el),group:[...frame.querySelectorAll('*')].indexOf(el.closest('h1,h2,h3,p')||el),text:node.textContent.trim(),tag:el.tagName,cls:el.className,font:css.fontFamily,weight:css.fontWeight,size:parseFloat(css.fontSize),x:rr.x-box.x,y:rr.y-box.y,w:rr.width,h:rr.height});}}
 const small=texts.filter(t=>t.size<20), overflow=texts.filter(t=>t.x<-.5||t.y<-.5||t.x+t.w>1920.5||t.y+t.h>1080.5);
 let overlaps=[];for(let a=0;a<texts.length;a++)for(let b=a+1;b<texts.length;b++){let x=texts[a],y=texts[b];if(x.group===y.group)continue;let dx=Math.min(x.x+x.w,y.x+y.w)-Math.max(x.x,y.x);let dy=Math.min(x.y+x.h,y.y+y.h)-Math.max(x.y,y.y);if(dx>3&&dy>3&&dx*dy>80)overlaps.push({a:x.text,b:y.text,dx,dy});}
 const boxes=[...frame.querySelectorAll('*')].filter(el=>el.scrollWidth>el.clientWidth+2&&el.clientWidth>0&&getComputedStyle(el).display!=='inline'&&!(el instanceof SVGElement)).map(el=>({tag:el.tagName,cls:el.className,scroll:el.scrollWidth,width:el.clientWidth}));
 return {screen:i+1,width:box.width,height:box.height,min_text_size:Math.min(...texts.map(x=>x.size)),small,overflow,overlaps,boxes,texts};
})'''
with sync_playwright() as p:
 executable=os.environ.get('CHROMIUM_EXECUTABLE') or ('/usr/bin/chromium' if pathlib.Path('/usr/bin/chromium').exists() else None)
 browser=p.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
 # This execution environment is offline. Use the installed Montserrat/Inter for QA.
 if os.environ.get('TMS_QA_OFFLINE')=='1':
  page.route('**/fonts.googleapis.com/**',lambda route:route.abort())
  page.route('**/fonts.gstatic.com/**',lambda route:route.abort())
 errors=[]; page.on('pageerror',lambda err:errors.append(str(err)))
 page.set_content((ROOT/'preview.html').read_text(), wait_until='load');page.evaluate('document.fonts.ready');page.wait_for_timeout(300)
 report=page.evaluate(CHECK)
 for i,el in enumerate(page.locator('.frame').all()):el.screenshot(path=str(OUT/'screens'/f'{i+1:02}.png'))
 # Check actual typeface used by Chromium, not merely the CSS declaration.
 cdp=page.context.new_cdp_session(page);cdp.send('DOM.enable');cdp.send('CSS.enable');doc=cdp.send('DOM.getDocument')
 fonts={}
 for sel in ['h1','.result-money','.budget-number','.history-money']:
  node=cdp.send('DOM.querySelector',{'nodeId':doc['root']['nodeId'],'selector':sel})
  fonts[sel]=cdp.send('CSS.getPlatformFontsForNode',{'nodeId':node['nodeId']})
 page.pdf(path=str(ROOT/'TMS_ASUB_SAAS_GROWTH.pdf'),width='1920px',height='1080px',prefer_css_page_size=True,print_background=True,display_header_footer=False)
 browser.close()
summary={'screens':len(report),'runtime_errors':errors,'fonts':fonts,'frames':report}
(OUT/'QA_REPORT.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
# Two-column contact sheet at a readable 50% of original slide width.
thumb_w,thumb_h=960,540;pad=28;label=35
sheet=Image.new('RGB',(thumb_w*2+pad*3,(thumb_h+label+pad)*6+pad),'#DCE4EC')
draw=ImageDraw.Draw(sheet)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
for i in range(12):
 im=Image.open(OUT/'screens'/f'{i+1:02}.png').convert('RGB').resize((thumb_w,thumb_h),Image.Resampling.LANCZOS)
 x=pad+(i%2)*(thumb_w+pad);y=pad+(i//2)*(thumb_h+label+pad)
 draw.text((x,y+3),f'{i+1:02}',fill='#000926',font=font);sheet.paste(im,(x,y+label))
sheet.save(ROOT/'full-visual-preview.jpg',quality=92)
for f in report:print('screen',f['screen'],'min',f['min_text_size'],'overflows',len(f['overflow']),'overlaps',len(f['overlaps']),'boxes',len(f['boxes']))
print('fonts',json.dumps(fonts,ensure_ascii=False))
