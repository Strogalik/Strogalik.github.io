from pathlib import Path
from playwright.sync_api import sync_playwright
import re
root=Path('/mnt/data/tms-commercial-deck-v0.3')
out=root/'qa'/'screens'
out.mkdir(parents=True,exist_ok=True)
html=(root/'qa'/'index.html').read_text(encoding='utf-8')
css=(root/'src'/'styles.css').read_text(encoding='utf-8')
# strip stylesheet link and scripts, inline css
html=re.sub(r'<link rel="stylesheet"[^>]+>','',html)
html=re.sub(r'<script>.*?</script>','',html,flags=re.S)
html=html.replace('</head>',f'<style>{css}</style></head>')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1920,'height':1080}, device_scale_factor=1)
    page.set_content(html, wait_until='load')
    for i in range(1,15):
        page.eval_on_selector_all('.frame',"(els, n)=>els.forEach(el=>el.style.display=el.dataset.screen===n?'block':'none')",f'{i:02d}')
        page.screenshot(path=str(out/f'{i:02d}.png'), full_page=False)
    browser.close()
