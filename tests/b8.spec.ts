import{test,expect,type Page}from'@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const slugs=['flooring-manufacturer','b2b-wholesale','online-school'];
async function start(p:Page){await p.addInitScript(()=>localStorage.setItem('tms:cookie-notice:v1','closed'));await p.goto('/');await p.locator('[data-case-ready]').waitFor();await p.evaluate(()=>document.fonts.ready);}
async function settled(p:Page){await p.locator('[data-active-case]').evaluate(async e=>{await Promise.allSettled(e.getAnimations({subtree:true}).map(a=>a.finished));});await expect(p.locator('[data-case-snapshot],[data-case-ghost]')).toHaveCount(0);}
for(const width of[1920,1728,1512,1440,1366,1024,901])test(`B8 normal desktop ${width}: six directions and complete presentation`,async({page})=>{
 await page.setViewportSize({width,height:width===1920?1080:width===1366?650:900});await start(page);
 const stage=page.locator('[data-active-case]');await page.locator('#cases').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
 for(const from of slugs)for(const to of slugs.filter(x=>x!==from)){
  await page.locator(`[data-case-choice=${from}] summary`).click();await settled(page);const before=await stage.boundingBox();
  const initial=await page.locator(`[data-case-choice=${from}]`).evaluate(e=>e.getBoundingClientRect().height);
  await page.locator(`[data-case-choice=${to}] summary`).evaluate(e=>(e as HTMLElement).click());
  await expect(stage).toHaveAttribute('data-active-case',to);await expect(page.locator('[data-case-snapshot]')).toHaveCount(0);await expect(page.locator('[data-case-visual-stage] > [data-case-live]')).toHaveCount(1);
  await page.waitForTimeout(60);const middle=await page.locator(`[data-case-choice=${from}]`).evaluate(e=>e.getBoundingClientRect().height);expect(middle).toBeLessThan(initial);expect(middle).toBeGreaterThan(62);
  expect(await page.locator('[data-case-ghost]').evaluateAll(ns=>ns.every(e=>(e as HTMLElement).inert&&e.getAttribute('aria-hidden')==='true'&&!e.querySelector('[id]')))).toBe(true);expect(await page.locator('[data-case-live] figcaption').evaluate(e=>getComputedStyle(e).clipPath)).toBe('none');
  expect(await page.locator('[data-case-visual-stage] > [data-case-live] figcaption').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');
  await settled(page);await expect(page.locator('[data-case-live]')).toHaveAttribute('data-case-live',to);const after=await stage.boundingBox();expect(after).toEqual(before);
  const a=page.locator(`[data-case-choice=${to}] a`);await expect(a).toHaveAttribute('href',`/cases/${to}`);
 }
});
test('B8 rapid interruption, repeated target, resize, reduced and hidden cleanup',async({page})=>{
 await start(page);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(let i=0;i<10;i++){await page.locator(`[data-case-choice=${slugs[i%3]}] summary`).evaluate(e=>(e as HTMLElement).click());await page.waitForTimeout([50,90,140][i%3]);}
 await settled(page);await expect(page.locator('[data-active-case]')).toHaveAttribute('data-active-case',slugs[0]);await page.locator(`[data-case-choice=${slugs[0]}] summary`).click();expect(await page.locator('[data-active-case]').evaluate(e=>e.getAnimations({subtree:true}).length)).toBe(0);
 for(const widths of[[901,900],[900,901],[1100,1101]]){await page.setViewportSize({width:widths[0],height:900});await page.locator('[data-case-choice=online-school] summary').click();await page.waitForTimeout(60);await page.setViewportSize({width:widths[1],height:900});await settled(page);await expect(page.locator('details[data-case-choice][open]')).toHaveAttribute('data-case-choice','online-school');}
 await page.locator('[data-case-choice=b2b-wholesale] summary').click();await page.waitForTimeout(60);await page.emulateMedia({reducedMotion:'reduce'});await settled(page);await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('[data-case-choice=flooring-manufacturer] summary').click();await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await settled(page);await page.evaluate(()=>{delete (document as unknown as Record<string,unknown>).hidden;document.dispatchEvent(new Event('visibilitychange'));});
 await page.locator('[data-case-choice=online-school] summary').click();await page.waitForTimeout(60);await page.goto('/about');expect(errors).toEqual([]);
});
for(const width of[320,360,390,430,900])test(`B8 touch cases ${width}, keyboard and scroll`,async({browser})=>{
 const c=await browser.newContext({viewport:{width,height:844},hasTouch:true});const p=await c.newPage();await start(p);
 for(const slug of[...slugs,...slugs.toReversed()]){const s=p.locator(`[data-case-choice=${slug}] summary`);await s.tap();await settled(p);expect((await s.boundingBox())!.y).toBeGreaterThanOrEqual(72);await expect(s).toBeFocused();expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);}
 const s=p.locator('[data-case-choice=b2b-wholesale] summary');await s.focus();await p.keyboard.press('Enter');await settled(p);await expect(p.locator('details[data-case-choice][open]')).toHaveAttribute('data-case-choice','b2b-wholesale');await c.close();
});
const footerWidths=[1920,1728,1440,1366,1280,1201,1200,1199,1120,1024,900,768,601,600,599,430,390,385,384,383,360,320];
for(const width of footerWidths)test(`B8 footer ${width}: grid, eight links, no glass, focus`,async({page})=>{
 await page.setViewportSize({width,height:900});await start(page);const f=page.locator('footer');await f.scrollIntoViewIfNeeded();await expect(f.locator('small')).toContainText('Система автоматизации бизнеса');
 for(const href of['mailto:tmsasub@yandex.ru','/','/about','/partners','/custom-development','/privacy','/consent','/cookies']){const a=f.locator(`a[href="${href}"]`).last();await expect(a).toBeVisible();await a.focus();await expect(a).toBeFocused();const r=(await a.boundingBox())!;expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width+.1);if(href!=='/')expect(r.height).toBeGreaterThanOrEqual(44);}
 const rect=(await f.boundingBox())!;if(width>1200){expect(rect.height).toBeGreaterThanOrEqual(230);expect(rect.height).toBeLessThanOrEqual(280);const tops=await f.locator('h2').evaluateAll(ns=>ns.map(e=>e.getBoundingClientRect().y));expect(new Set(tops).size).toBe(1);}
 expect(await f.locator('[data-footer-legal]').evaluate(e=>getComputedStyle(e).textAlign)).toBe('left');expect(await f.locator('[data-footer-contacts]').evaluate(e=>getComputedStyle(e).backdropFilter)).toBe('none');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
});
test('B8 footer accessibility text200 spacing forced no-blur; Hero known issue separate',async({page})=>{
 for(const width of[1440,1024,768,430,390,360,320]){await page.setViewportSize({width,height:900});await start(page);await page.addStyleTag({content:'html{font-size:200%!important}*{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});await page.evaluate(()=>document.documentElement.setAttribute('data-no-blur',''));const f=page.locator('footer');await f.scrollIntoViewIfNeeded();const bounds=await f.evaluate(e=>[...e.querySelectorAll('*')].filter(n=>n.getBoundingClientRect().width).map(n=>{const r=n.getBoundingClientRect();return{x:r.x,right:r.right}}));for(const r of bounds){expect(r.x).toBeGreaterThanOrEqual(0);expect(r.right).toBeLessThanOrEqual(width+.1);}await expect(f.locator('nav a')).toHaveCount(6);}
});
test('B8 no JS native cases and footer; shared routes; contrast',async({browser,page})=>{
 const c=await browser.newContext({javaScriptEnabled:false});const p=await c.newPage();await p.goto('/');for(const slug of slugs){if(!await p.locator(`[data-case-choice=${slug}]`).evaluate(e=>(e as HTMLDetailsElement).open))await p.locator(`[data-case-choice=${slug}] summary`).click();await expect(p.locator(`[data-case-choice=${slug}] figure`)).toBeVisible();await expect(p.locator(`[data-case-choice=${slug}] a`)).toHaveAttribute('href',`/cases/${slug}`);}await expect(p.locator('footer nav a')).toHaveCount(6);await c.close();
 for(const route of['/','/products/crm','/products/oms','/products/crm-oms','/cases','/partners','/custom-development','/about','/privacy','/consent','/cookies']){await page.goto(route);await expect(page.locator('footer h2')).toHaveText(['Контакты','Компания','Документы']);}
 await start(page);const result=await new AxeBuilder({page}).include('footer').withRules(['color-contrast','link-name']).analyze();expect(result.violations).toEqual([]);
});
test('B8 enlarged case text is immediate and never held behind presentation masks',async({page})=>{
 await start(page);await page.addStyleTag({content:'html{font-size:200%}*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'});
 for(const slug of slugs){await page.locator(`[data-case-choice=${slug}] summary`).click();await expect(page.locator('[data-case-snapshot],[data-case-ghost]')).toHaveCount(0);const motion=await page.locator('[data-active-case]').evaluate(e=>({width:innerWidth,font:getComputedStyle(document.documentElement).fontSize,animations:e.getAnimations({subtree:true}).map(a=>({kind:a.constructor.name,keys:(a.effect as KeyframeEffect).getKeyframes()}))}));expect(motion.font).toBe('32px');expect(motion.animations.filter(a=>a.kind==='Animation')).toEqual([]);await expect(page.locator('[data-case-visual-stage] > [data-case-live]')).toHaveAttribute('data-case-live',slug);const c=page.locator('[data-case-live] figcaption');expect(await c.evaluate(e=>getComputedStyle(e).clipPath)).toBe('none');}
});
test('B8 footer links remain available with the unchanged OFF cookie notice',async({page})=>{
 for(const width of[1440,390]){await page.setViewportSize({width,height:900});await page.goto('/');await page.evaluate(()=>{localStorage.removeItem('tms:cookie-notice:v1');});await page.reload();await page.getByRole('button',{name:'Понятно',exact:true}).waitFor();await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));const f=page.locator('footer');for(const a of await f.locator('nav a').all()){await a.focus();await expect(a).toBeFocused();const r=(await a.boundingBox())!,notice=(await page.getByRole('button',{name:'Понятно',exact:true}).boundingBox())!;expect(r.y+r.height<=notice.y||r.x+r.width<=notice.x||r.x>=notice.x+notice.width).toBe(true);}}
});
