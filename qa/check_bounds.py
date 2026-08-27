from pathlib import Path
from playwright.sync_api import sync_playwright
import re, json
root=Path('/mnt/data/tms-commercial-deck-v0.3')
html=(root/'qa'/'index.html').read_text(encoding='utf-8')
css=(root/'src'/'styles.css').read_text(encoding='utf-8')
html=re.sub(r'<link rel="stylesheet"[^>]+>','',html)
html=re.sub(r'<script>.*?</script>','',html,flags=re.S)
html=html.replace('</head>',f'<style>{css}</style></head>')
report=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1920,'height':1080}, device_scale_factor=1)
    page.set_content(html)
    for i in range(1,15):
        page.eval_on_selector_all('.frame',"(els,n)=>els.forEach(el=>el.style.display=el.dataset.screen===n?'block':'none')",f'{i:02d}')
        info=page.evaluate("""() => {
          const f=document.querySelector('.frame[style*="display: block"]') || [...document.querySelectorAll('.frame')].find(x=>getComputedStyle(x).display!=='none');
          const bad=[];
          for(const el of f.querySelectorAll('*')){
            const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue;
            const r=el.getBoundingClientRect();
            if(r.width===0&&r.height===0) continue;
            if(r.left < -0.5 || r.top < -0.5 || r.right > 1920.5 || r.bottom > 1080.5){
              bad.push({tag:el.tagName, cls:el.className?.baseVal||el.className||'', text:(el.textContent||'').trim().slice(0,80), rect:[r.left,r.top,r.right,r.bottom]})
            }
          }
          return {bad, sw:document.documentElement.scrollWidth, sh:document.documentElement.scrollHeight};
        }""")
        report.append((i,info))
    browser.close()
for i,info in report:
    print(f'{i:02d}: overflow={len(info["bad"])} scroll={info["sw"]}x{info["sh"]}')
    for b in info['bad'][:4]: print('  ',b)
