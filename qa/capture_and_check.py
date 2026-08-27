from pathlib import Path
from collections import Counter
import re, json, asyncio, base64, html as htmlmod
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright

ROOT=Path('/mnt/data/tms-commercial-deck-v0.5')
OUT=ROOT/'qa/screens'
OUT.mkdir(parents=True,exist_ok=True)
OFFER=Path('/mnt/data/_offer_text.txt').read_text(encoding='utf-8')
pages=OFFER.split('\f')[:14]
css=(ROOT/'src/styles.css').read_text(encoding='utf-8')
app=(ROOT/'src/App.tsx').read_text(encoding='utf-8')
markup=re.search(r'const deckMarkup = String\.raw`(.*?)`\n\nexport default',app,re.S).group(1)
logo=re.search(r"const logo = '([^']+)'",app).group(1)
hero_logo=re.search(r"const heroLogo = '([^']+)'",app).group(1)
markup=markup.replace('${logo}',logo).replace('${heroLogo}',hero_logo)

# Use exact supplied SVG as image data only for QA/rendering. Source project references /TMS.svg.
svg_b64=base64.b64encode((ROOT/'public/TMS.svg').read_bytes()).decode('ascii')
markup=markup.replace('/TMS.svg','data:image/svg+xml;base64,'+svg_b64)

def data_font(path):
    data=base64.b64encode(Path(path).read_bytes()).decode('ascii')
    ext=Path(path).suffix.lower().lstrip('.')
    fmt='opentype' if ext in ('otf','ttf') else 'woff2'
    return f'data:font/{ext};base64,'+data,fmt

font_paths={
 'mont500':'/usr/share/texlive/texmf-dist/fonts/opentype/public/montserrat/Montserrat-Medium.otf',
 'mont600':'/usr/share/texlive/texmf-dist/fonts/opentype/public/montserrat/Montserrat-SemiBold.otf',
 'mont700':'/usr/share/texlive/texmf-dist/fonts/opentype/public/montserrat/Montserrat-Bold.otf',
 'inter500':'/usr/share/fonts/opentype/inter/Inter-Medium.otf',
 'inter600':'/usr/share/fonts/opentype/inter/Inter-SemiBold.otf',
 'inter700':'/usr/share/fonts/opentype/inter/Inter-Bold.otf',
 'inter800':'/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf',
}
fonts={k:data_font(v)[0] for k,v in font_paths.items()}
font_css=f'''@font-face{{font-family:Montserrat;src:url("{fonts['mont500']}");font-weight:500}}@font-face{{font-family:Montserrat;src:url("{fonts['mont600']}");font-weight:600}}@font-face{{font-family:Montserrat;src:url("{fonts['mont700']}");font-weight:700}}@font-face{{font-family:Inter;src:url("{fonts['inter500']}");font-weight:500}}@font-face{{font-family:Inter;src:url("{fonts['inter600']}");font-weight:600}}@font-face{{font-family:Inter;src:url("{fonts['inter700']}");font-weight:700}}@font-face{{font-family:Inter;src:url("{fonts['inter800']}");font-weight:800}}'''
html=f'<!doctype html><html lang="ru"><head><meta charset="UTF-8"><style>{font_css}</style><style>{css}</style></head><body><main class="deck">{markup}</main></body></html>'

# Static preview for users: exact HTML/CSS, no fonts embedded, actual public/TMS.svg referenced.
preview_markup=markup.replace('data:image/svg+xml;base64,'+svg_b64,'public/TMS.svg')
preview=f'''<!doctype html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920"><title>TMS Commercial v0.5</title><style>{css}</style></head><body><main class="deck">{preview_markup}</main></body></html>'''
(ROOT/'preview.html').write_text(preview,encoding='utf-8')

def tokens(s):
    s=s.replace('\u00ad','').replace('—',' ').replace('–',' ').replace('-',' ')
    return re.findall(r'[A-Za-zА-Яа-яЁё0-9]+|[%₽]',s)

def tc(s): return Counter(tokens(s))

async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--font-render-hinting=none'])
        page=await browser.new_page(viewport={"width":1920,"height":1080},device_scale_factor=1)
        await page.set_content(html,wait_until='load')
        await page.evaluate('document.fonts.ready')
        frames=page.locator('.frame'); count=await frames.count(); assert count==14
        report=[]
        for i in range(14):
            f=frames.nth(i)
            await f.screenshot(path=str(OUT/f'{i+1:02d}.png'))
            inner=await f.evaluate('''el=>{const parts=[];const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(n.parentElement&&n.parentElement.closest('[aria-hidden=\"true\"]'))continue;const t=n.textContent.trim();if(t)parts.push(t)}return parts.join(' ')}''')
            a,b=tc(inner),tc(pages[i]); missing=b-a; extra=a-b
            bounds=await f.evaluate('''el=>{const r=el.getBoundingClientRect(),bad=[];for(const n of el.querySelectorAll('*')){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)===0)continue;const b=n.getBoundingClientRect();if(!b.width&&!b.height)continue;if(b.left<r.left-.5||b.top<r.top-.5||b.right>r.right+.5||b.bottom>r.bottom+.5)bad.push({cls:String(n.className),text:(n.innerText||'').slice(0,80),l:Math.round(b.left-r.left),t:Math.round(b.top-r.top),r:Math.round(b.right-r.left),b:Math.round(b.bottom-r.top)});}return bad.slice(0,40)}''')
            small=await f.evaluate('''el=>{const bad=[];for(const n of el.querySelectorAll('*')){if(n.closest('[aria-hidden="true"]'))continue;const own=[...n.childNodes].some(x=>x.nodeType===3&&x.textContent.trim());if(!own)continue;const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')continue;const fs=parseFloat(s.fontSize);if(fs<20)bad.push({tag:n.tagName,cls:String(n.className),text:(n.textContent||'').trim().slice(0,100),fontSize:fs,color:s.color});}return bad}''')
            lowcontrast=await f.evaluate('''el=>{const bad=[];function rgb(c){const m=c.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;return m[1].split(',').slice(0,3).map(Number)}function lum(c){const a=rgb(c);if(!a)return 1;return a.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0)}for(const n of el.querySelectorAll('*')){if(n.closest('[aria-hidden="true"]'))continue;const own=[...n.childNodes].some(x=>x.nodeType===3&&x.textContent.trim());if(!own)continue;const s=getComputedStyle(n),bg=getComputedStyle(n.parentElement||el).backgroundColor;const l1=lum(s.color),l2=lum(bg);const ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);if(ratio<2.8)bad.push({cls:String(n.className),text:(n.textContent||'').trim().slice(0,80),ratio:+ratio.toFixed(2),color:s.color,bg});}return bad.slice(0,30)}''')
            report.append({'screen':i+1,'missing':dict(missing),'extra':dict(extra),'out_of_bounds':bounds,'text_under_20px':small,'low_contrast_candidates':lowcontrast})
        # 50% readability contact sheet: 2 columns x 7, 960x540 scaled to 48% with label strip.
        cellw,cellh=980,572
        sheet=Image.new('RGB',(cellw*2,cellh*7),(229,235,241))
        for i in range(14):
            im=Image.open(OUT/f'{i+1:02d}.png').convert('RGB').resize((960,540),Image.Resampling.LANCZOS)
            card=Image.new('RGB',(cellw,cellh),'white');card.paste(im,(10,10));ImageDraw.Draw(card).text((14,552),f'{i+1:02d}',fill='#000926');sheet.paste(card,((i%2)*cellw,(i//2)*cellh))
        sheet.save(OUT/'full-visual-preview.png')
        (ROOT/'qa/QA_REPORT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        # PDF
        await page.add_style_tag(content='''@page{size:20in 11.25in;margin:0}@media print{html,body{min-width:0!important;background:#fff!important}.deck{width:1920px!important;margin:0!important}.frame{break-after:page;page-break-after:always}.frame:last-child{break-after:auto;page-break-after:auto}}''')
        await page.pdf(path=str(ROOT/'TMS_COMMERCIAL_OFFER_v0.5.pdf'),width='20in',height='11.25in',print_background=True,margin={'top':'0','right':'0','bottom':'0','left':'0'})
        await browser.close()

asyncio.run(main())
