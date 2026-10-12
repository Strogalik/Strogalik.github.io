import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {storyContent} from '../components/review-v6/story-content';
const path='/review/v6';
const scenes=storyContent.scenes;
test('review is gated, noindex, absent from sitemap; public build defaults to 404',async({request,page})=>{
 expect((await request.get('http://127.0.0.1:3201/review/v6')).status()).toBe(404);
 expect((await request.get(path,{headers:{host:'example.com'}})).status()).toBe(404);
 expect((await request.get(path,{headers:{'x-forwarded-host':'example.com'}})).status()).toBe(404);
 const external:string[]=[];page.on('request',r=>{if(!new URL(r.url()).hostname.match(/^(localhost|127\.0\.0\.1)$/))external.push(r.url());});await page.goto(path);await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);expect(await (await request.get('/sitemap.xml')).text()).not.toContain('/review/');await expect(page.getByRole('heading',{level:1})).toHaveText('От первого обращения до выполненного заказа');await expect(page.locator('[data-v6-review] a[href^="/demo"]')).toHaveCount(0);await expect(page.locator('#yandex-metrika')).toHaveCount(0);expect(external).toEqual([]);
});
for(const [width,height] of [[1920,1080],[1728,960],[1440,900],[1366,768],[1180,820],[1024,768],[1250,900],[1251,900],[900,900],[901,900],[768,1024],[430,932],[390,844],[360,800],[320,740],[844,390]])test(`geometry ${width}x${height}`,async({page})=>{
 await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(width>=1440){const next=(await page.locator('#products').boundingBox())!;expect(next.y).toBeGreaterThanOrEqual(height-1);for(const selector of ['#v6-title','[class*="heroActions"]','[data-v6-story]']){const b=(await page.locator(selector).boundingBox())!;expect(b.y).toBeGreaterThanOrEqual(88);expect(b.y+b.height,selector).toBeLessThanOrEqual(height+1);}}
 const cta=page.locator('#solution').getByRole('button',{name:'Обсудить задачу'});await cta.focus();const b=(await cta.boundingBox())!;expect(b.y).toBeGreaterThanOrEqual(0);expect(b.y+b.height).toBeLessThanOrEqual(height+1);expect(b.height).toBeGreaterThanOrEqual(48);if(width===390||width===430){await page.evaluate(()=>scrollTo(0,0));const m=(await page.locator('[data-hero-meaning]').boundingBox())!;expect(m.y+m.height).toBeLessThanOrEqual(height);expect(m.height).toBeGreaterThan(50);}
 await page.locator('#solution').getByRole('link',{name:'Как работает TMS'}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('CTA opens isolated local form: errors, focus, honest check, Escape return, no transport',async({page})=>{
 const sent:string[]=[];page.on('request',r=>{if(r.method()!=='GET')sent.push(r.url());});await page.goto(path);const button=page.locator('#solution').getByRole('button',{name:'Обсудить задачу'});await button.click();const dialog=page.getByRole('dialog',{name:'Обсудить задачу'});await expect(dialog.getByRole('heading')).toBeFocused();await dialog.getByRole('button',{name:'Проверить форму'}).click();await expect(dialog.locator('#v6-name')).toBeFocused();await expect(dialog).toContainText('Укажите email или телефон');await dialog.locator('#v6-name').fill('Проверка макета');await dialog.locator('#v6-contact').fill('review@example.test');await dialog.getByRole('checkbox').check();await dialog.getByRole('button',{name:'Проверить форму'}).click();await expect(dialog.getByRole('status')).toContainText('обращение не отправлено');await page.keyboard.press('Tab');expect(await page.evaluate(()=>!!document.activeElement?.closest('dialog[open]'))).toBe(true);await page.keyboard.press('Escape');await expect(button).toBeFocused();expect(sent).toEqual([]);
});
test('mobile menu and form focus remain usable at a short keyboard-sized viewport',async({page})=>{
 await page.setViewportSize({width:390,height:500});await page.goto(path);const menu=page.getByRole('button',{name:'Меню',exact:true});await menu.click();await page.keyboard.press('Escape');await expect(menu).toBeFocused();await menu.click();await page.getByRole('navigation',{name:'Мобильная навигация'}).getByRole('button',{name:'Обсудить задачу'}).click();const d=page.getByRole('dialog',{name:'Обсудить задачу'});await d.getByRole('button',{name:'Проверить форму'}).focus();const b=(await d.getByRole('button',{name:'Проверить форму'}).boundingBox())!;expect(b.y+b.height).toBeLessThanOrEqual(501);await page.keyboard.press('Escape');await expect(menu).toBeFocused();
});
test('six topics stay coherent through quick changes, resize and return; no operational simulation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);const root=page.locator('[data-story-experience]');
 for(const t of scenes){await page.locator(`button[data-topic="${t.id}"]`).click();await expect(root).toHaveAttribute('data-topic',t.id);await expect(page.getByRole('tabpanel')).toHaveCount(1);await expect(page.locator('[data-scene]')).toHaveCount(1);await expect(page.locator('#scene-title')).toHaveText(t.heading);await expect(page.locator('[data-story-visual]')).toHaveCount(0);await expect(page.locator('[class*=narrative] [class*=body]')).toHaveText(t.body);await expect(page.getByRole('tabpanel').getByRole('link')).toHaveAttribute('href',t.secondaryLink.href);await expect(page.getByRole('tab',{selected:true})).toHaveText(t.navLabel);}
 await page.setViewportSize({width:390,height:844});await expect(root).toHaveAttribute('data-topic','custom-solution');await expect(page.getByRole('tab',{selected:true})).toHaveText('Подбираем решение');
 for(const product of storyContent.products){await page.getByRole('button',{name:product.name,exact:true}).click();await expect(root).toHaveAttribute('data-topic',scenes.find(t=>t.product===product.id)!.id);const topics=scenes.filter(t=>t.product===product.id);await page.getByRole('tab',{name:topics[1].navLabel,exact:true}).click();await expect(page.locator('#scene-title')).toHaveText(topics[1].heading);}
 await page.setViewportSize({width:1920,height:1080});await expect(root).toHaveAttribute('data-topic','custom-solution');await expect(page.getByRole('tab',{selected:true})).toHaveText('Подбираем решение');
 await expect(root.locator('input,select,[draggable=true],table,[data-record-id]')).toHaveCount(0);expect(await root.innerText()).not.toMatch(/ИИ онлайн|DEMO-|ORDER-|₽|claimRefs|sources\//);expect(await root.innerText()).not.toMatch(/[←→↑↓↗↻]/);
 const before=await page.evaluate(()=>scrollY);await page.mouse.move(700,500);await page.mouse.wheel(0,200);await page.waitForTimeout(250);expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(before);
});
test('manual vertical tabs: arrows move focus, Enter and Space activate, Tab enters panel',async({page})=>{
 await page.goto(path);const first=page.getByRole('tab',{name:'Клиентская история',exact:true});await first.focus();await page.keyboard.press('ArrowDown');await expect(page.getByRole('tab',{name:'Следующее действие'})).toBeFocused();await expect(first).toHaveAttribute('aria-selected','true');await page.keyboard.press('Enter');await expect(page.locator('[data-story-experience]')).toHaveAttribute('data-topic','crm-next-step');await page.keyboard.press('End');await page.keyboard.press('Space');await expect(page.locator('[data-story-experience]')).toHaveAttribute('data-topic','custom-solution');await page.keyboard.press('Tab');await expect(page.getByRole('tabpanel')).toBeFocused();
 await page.setViewportSize({width:390,height:844});await page.getByRole('tab',{name:'Подбираем решение'}).focus();await page.keyboard.press('Home');await expect(page.getByRole('tab',{name:'Начинаем с процесса'})).toBeFocused();await page.keyboard.press('Space');await expect(page.locator('[data-story-experience]')).toHaveAttribute('data-topic','custom-process');
});
test('anchor uses one actual header offset; inline detail and form preserve topic, focus and scroll',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});for(const width of [1920,1440,390,430]){await page.setViewportSize({width,height:width<500?844:900});await page.goto(path);await page.locator('#solution').getByRole('link',{name:'Как работает TMS'}).click();const top=(await page.locator('#products').boundingBox())!.y;const header=(await page.locator('[data-v6-review]>header').boundingBox())!;expect(top).toBeGreaterThanOrEqual(header.height+20);expect(top).toBeLessThanOrEqual(header.height+30);}
 await page.setViewportSize({width:1440,height:900});await page.getByRole('tab',{name:'Работа команды'}).click();const detail=page.getByRole('tabpanel').locator('[data-a3-disclosure]');await detail.click();await expect(page.getByRole('tabpanel')).toContainText('Согласованные условия, действия и ответственные');await detail.click();await expect(detail).toBeFocused();const cta=page.getByRole('tabpanel').getByRole('button',{name:'Обсудить задачу'});await cta.click();const scroll=await page.evaluate(()=>scrollY);await page.keyboard.press('Escape');await expect(cta).toBeFocused();expect(await page.evaluate(()=>scrollY)).toBeCloseTo(scroll,0);await expect(page.locator('[data-story-experience]')).toHaveAttribute('data-topic','oms-responsibility');
});
test('one clock freezes reveal and progress on pause/hidden; resume, replay, rapid clicks and reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(path);const story=page.locator('[data-v6-story]');await expect(story).toHaveAttribute('data-playing','true');await page.waitForTimeout(1150);await page.getByRole('button',{name:'Пауза анимации',exact:true}).click();const elapsed=await story.getAttribute('data-elapsed');const paints=await page.locator('[data-hero-reveal]').evaluateAll(es=>es.map(e=>e.getAttribute('style')));await page.waitForTimeout(500);await expect(story).toHaveAttribute('data-elapsed',elapsed!);expect(await page.locator('[data-hero-reveal]').evaluateAll(es=>es.map(e=>e.getAttribute('style')))).toEqual(paints);
 await page.setViewportSize({width:1728,height:960});await expect(story).toHaveAttribute('data-playback','paused');await page.getByRole('button',{name:'Продолжить анимацию'}).click();await page.waitForTimeout(100);expect(Number(await story.getAttribute('data-elapsed'))).toBeGreaterThan(Number(elapsed));
 // Headless visibility API simulation exercises the real visibilitychange handler.
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});await expect(story).toHaveAttribute('data-playing','false');const hidden=await story.getAttribute('data-elapsed');await page.waitForTimeout(700);await expect(story).toHaveAttribute('data-elapsed',hidden!);await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});document.dispatchEvent(new Event('visibilitychange'));});await expect(story).toHaveAttribute('data-playback','completed',{timeout:5500});await page.waitForTimeout(300);await expect(story).toHaveAttribute('data-elapsed','6000');await page.getByRole('button',{name:'Повторить историю'}).click();await page.waitForTimeout(200);expect(Number(await story.getAttribute('data-elapsed'))).toBeLessThan(600);await page.getByRole('button',{name:'Пауза анимации',exact:true}).click();await page.getByRole('button',{name:'Продолжить анимацию'}).click();await page.emulateMedia({reducedMotion:'reduce'});await expect(story).toHaveAttribute('data-phase','3');await expect(story).toHaveAttribute('data-playing','false');await expect(page.getByRole('button',{name:'История показана целиком'})).toBeDisabled();await page.emulateMedia({reducedMotion:'no-preference'});await expect(story).toHaveAttribute('data-playback','completed');
});
test('no-JS preserves process, product links and native mobile menu; text resize and spacing reflow',async({browser,page})=>{
 const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const p=await c.newPage();await p.goto('http://127.0.0.1:3200'+path);await expect(p.locator('[data-v6-story]')).toHaveAttribute('data-phase','3');await expect(p.locator('[data-glass-message=incoming]')).toBeVisible();await expect(p.locator('[data-glass-message=outgoing]')).toBeVisible();await expect(p.locator('[data-story-experience] noscript details')).toHaveCount(6);await expect(p.getByRole('tab')).toHaveCount(0);await expect(p.locator('[data-story-experience] noscript a[href=\"/custom-development\"]')).toHaveCount(1);await p.getByRole('button',{name:'Меню',exact:true}).click();await expect(p.getByRole('navigation',{name:'Мобильная навигация'})).toBeVisible();expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await c.close();await page.setViewportSize({width:640,height:450});await page.goto(path);await page.addStyleTag({content:'html{font-size:200%} [data-v6-review] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('axe on desktop/mobile, form errors, material samples and opaque fallback',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});for(const width of [1920,390]){await page.setViewportSize({width,height:1080});await page.goto(path);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);await page.getByText('Материалы для согласования',{exact:true}).click();expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);await page.locator('[data-v6-review]').evaluate(e=>e.setAttribute('data-no-blur',''));expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);await page.locator('#solution').getByRole('button',{name:'Обсудить задачу'}).click();await page.getByRole('button',{name:'Проверить форму'}).click();expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);}
});
test('existing marketing, calculator and demo still operate; review changes do not replace V5',async({page,request})=>{
 for(const route of ['/','/products/crm','/products/oms','/products/crm-oms','/cases','/cases/b2b-wholesale','/cases/flooring-manufacturer','/cases/online-school','/about','/partners','/custom-development','/privacy','/demo'])expect((await request.get(route)).status()).toBe(200);await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('Бизнес не должен держаться');await expect(page.locator('[data-v6-review]')).toHaveCount(0);await page.goto('/demo?product=crm-oms&view=list');await page.locator('[data-record-id=DEMO-D-01]').click();await page.getByRole('button',{name:'Передать в работу'}).click();await expect(page.locator('.record-details')).toContainText('ORDER-DEMO-D-01');
});
test('all six content topics reflow at every target size and enlarged text',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
 for(const [width,height] of [[1920,1080],[1728,960],[1440,900],[1366,768],[1180,820],[1024,768],[1250,900],[1251,900],[900,900],[901,900],[768,1024],[430,932],[390,844],[360,800],[320,740],[844,390],[640,450],[320,740]]){
  await page.setViewportSize({width,height});if(width===640)await page.addStyleTag({content:'html{font-size:200%}[data-v6-review] *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}'});
  for(const t of scenes){if(width<=900){const p=storyContent.products.find(v=>v.id===t.product)!;await page.getByRole('button',{name:p.name,exact:true}).click();}await page.getByRole('tab',{name:t.navLabel,exact:true}).click();await page.locator('[data-a3-disclosure]').click();expect(await page.locator('[class*=disclosureBody]>div').evaluate(e=>e.scrollHeight-e.clientHeight)).toBeLessThanOrEqual(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${t.id}`).toBe(true);const overflow=await page.locator('[data-a3-copy]').evaluate(el=>[...el.querySelectorAll('h3,button,a,p')].flatMap(n=>{const range=document.createRange();range.selectNodeContents(n);return [...range.getClientRects()].filter(r=>r.width&& (r.left<0||r.right>innerWidth+1)).map(()=>n.textContent);}));expect(overflow,`${width} ${t.id} text`).toEqual([]);}
 }
});

test('A4.2 balances the whole copy group, keeps the CRM anchor, and removes intro without a reserved slot',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);await page.evaluate(()=>document.fonts.ready);
 for(const [width,height] of [[1920,1080],[1728,960],[1440,900],[1366,768],[1251,900],[1250,900],[1024,768]]){
  await page.setViewportSize({width,height});let initial:number|undefined;
  for(const t of scenes){await page.locator(`button[data-topic="${t.id}"]`).click();
   const g=await page.evaluate(()=>{const box=(s:string)=>document.querySelector(s)!.getBoundingClientRect();const meta=box('[data-a3-meta]'),nav=box('[data-a3-group]'),copy=box('[data-a3-copy]'),workspace=box('[data-a3-workspace]'),intro=box('#products'),introContent=box('#products>div');const axes=['[data-a3-meta]','#scene-title','[class*=narrative] [class*=body]','[data-a3-disclosure]','[class*=sceneActions]>button','[class*=sceneActions]>a'].map(s=>box(s).left);return{top:meta.top+scrollY,delta:Math.abs(meta.top-nav.top),width:copy.width,navWidth:nav.width,columns:getComputedStyle(document.querySelector('[data-a3-workspace]')!).gridTemplateColumns.split(' ').length,fraction:(copy.left-workspace.left)/workspace.width,gap:copy.left-nav.right,right:workspace.right-copy.right,axisSpread:Math.max(...axes)-Math.min(...axes),introDisplay:getComputedStyle(document.querySelector('#products')!).display,introHeight:intro.height,contentHeight:introContent.height,h3gap:box('#scene-title').top-meta.bottom};});
   expect(g.columns).toBe(2);expect(g.navWidth).toBe(336);expect(g.delta).toBeLessThanOrEqual(4);expect(g.width).toBeLessThanOrEqual(680);expect(g.width).toBeGreaterThanOrEqual(540);expect(g.h3gap).toBeCloseTo(16,0);expect(g.axisSpread).toBeLessThan(1);expect(g.introDisplay).toBe('block');expect(g.introHeight).toBeCloseTo(g.contentHeight,0);
   expect(g.gap).toBeGreaterThanOrEqual(31.9);
   if(width>=1366){expect(g.fraction).toBeGreaterThanOrEqual(.30);expect(g.fraction).toBeLessThanOrEqual(.34);expect(g.right).toBeGreaterThan(100);}

   initial??=g.top;expect(Math.abs(g.top-initial)).toBeLessThanOrEqual(1);
   await expect(page.locator('[data-story-visual],[data-a3-visual-anchor],[data-a3-intro-copy]')).toHaveCount(0);await expect(page.locator('#products>div')).toHaveCount(1);await expect(page.locator('[data-story-experience]')).not.toContainText('CRM помогает вести продажи');
  }
 }
});

test('A4 disclosure moves whole copy smoothly; fixed nav/intro, no scroll, quick reverse and resize',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(path);await page.getByRole('tab',{name:'Подбираем решение'}).click();await page.locator('#products').evaluate(e=>e.scrollIntoView());await page.waitForTimeout(300);
 const trigger=page.locator('[data-a3-disclosure]');const sample=()=>page.evaluate(()=>{const top=(s:string)=>document.querySelector(s)!.getBoundingClientRect().top;return {copy:top('[data-a3-copy]'),nav:top('[data-a3-group]'),intro:top('[data-a3-intro]'),scroll:scrollY,height:document.querySelector('[class*=disclosureBody]')!.getBoundingClientRect().height};});
 const before=await sample();await trigger.click();await page.waitForTimeout(75);const mid=await sample();await page.waitForTimeout(300);const end=await sample();expect(mid.copy).toBeLessThan(before.copy);expect(mid.copy).toBeGreaterThan(end.copy);expect(mid.height).toBeGreaterThan(0);expect(mid.height).toBeLessThan(end.height);expect(before.copy-end.copy).toBeGreaterThan(0);expect(before.copy-end.copy).toBeLessThanOrEqual(32.1);
 for(const k of ['nav','intro','scroll'] as const)expect(Math.abs(end[k]-before[k]),k).toBeLessThanOrEqual(4);
 await trigger.click();await page.waitForTimeout(300);expect(Math.abs((await sample()).copy-before.copy)).toBeLessThanOrEqual(4);await expect(trigger).toBeFocused();
 await trigger.click();await page.waitForTimeout(40);await trigger.click();await page.waitForTimeout(300);await expect(trigger).toHaveAttribute('aria-expanded','false');expect((await sample()).height).toBe(0);
 await trigger.click();await page.getByRole('tab',{name:'Клиентская история',exact:true}).click();await expect(trigger).toHaveAttribute('aria-expanded','false');await page.waitForTimeout(300);expect((await sample()).height).toBe(0);
 await trigger.click();await page.setViewportSize({width:390,height:844});await expect(trigger).toHaveAttribute('aria-expanded','true');expect(await page.locator('[data-a3-copy]').evaluate(e=>getComputedStyle(e).translate)).toBe('none');await trigger.click();await expect(trigger).toBeFocused();
 await page.setViewportSize({width:1920,height:768});await trigger.click();await page.waitForTimeout(300);expect(await page.locator('[data-a3-copy]').evaluate(e=>getComputedStyle(e).translate)).toMatch(/^0px/);expect(await page.locator('[data-a3-copy]').evaluate(e=>e.style.getPropertyValue('--disclosure-rise'))).toBe('0px');
});

test('A4 controlled disclosure has no native marker; reduced motion ends immediately and text stays accessible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
 for(const width of [1920,1440,430,320]){await page.setViewportSize({width,height:1080});for(const t of scenes){if(width<=900)await page.getByRole('button',{name:storyContent.products.find(p=>p.id===t.product)!.name,exact:true}).click();await page.locator(`button[data-topic="${t.id}"]`).click();const d=page.locator('[data-a3-disclosure]');await expect(d).toHaveAttribute('aria-expanded','false');expect(await d.evaluate(e=>({tag:e.tagName,display:getComputedStyle(e).display,marker:getComputedStyle(e,'::marker').content}))).toEqual({tag:'BUTTON',display:'flex',marker:'normal'});await expect(d.locator('svg')).toHaveCount(1);await d.click();await expect(d).toHaveAttribute('aria-expanded','true');const body=page.locator(`#explanation-${t.id}`);await expect(body).toHaveAttribute('aria-hidden','false');await expect(body).toHaveText(t.explanation.body);expect(await body.evaluate(e=>getComputedStyle(e).transitionDuration)).toBe('0s');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await d.click();}}
});

test('A4 preserves header: retains gradient and transitions overlay in both directions, quick reverse, pressed and focus',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(path);const cta=page.locator('header [class*=headerBlue]').first();const state=()=>cta.evaluate(e=>({opacity:Number(getComputedStyle(e,'::before').opacity),gradient:getComputedStyle(e).backgroundImage,duration:getComputedStyle(e,'::before').transitionDuration,width:e.getBoundingClientRect().width}));await page.mouse.move(0,0);const before=await state();expect(before.opacity).toBe(0);expect(before.gradient).toContain('linear-gradient');await cta.hover();await page.waitForTimeout(40);const mid=await state();expect(mid.opacity).toBeGreaterThan(0);expect(mid.opacity).toBeLessThan(1);await page.waitForTimeout(180);expect((await state()).opacity).toBe(1);await page.mouse.move(0,0);await page.waitForTimeout(40);const out=await state();expect(out.opacity).toBeGreaterThan(0);expect(out.opacity).toBeLessThan(1);await cta.hover();await page.waitForTimeout(200);expect((await state()).opacity).toBe(1);expect((await state()).width).toBe(before.width);expect((await state()).gradient).toBe(before.gradient);await page.mouse.down();expect(await cta.evaluate(e=>getComputedStyle(e,'::before').backgroundColor)).toBe('rgb(11, 63, 157)');await page.mouse.move(0,0);await page.mouse.up();await cta.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(cta).toBeFocused();expect(await cta.evaluate(e=>getComputedStyle(e).outlineStyle)).toBe('solid');await page.emulateMedia({reducedMotion:'reduce'});expect((await state()).duration).toBe('0s');await cta.hover();expect((await state()).opacity).toBe(1);
});

 test('A4 mobile reading flows directly from heading to body; disclosure uses new measured width',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
 for(const width of [430,390,360,320]){await page.setViewportSize({width,height:844});for(const t of scenes){await page.getByRole('button',{name:storyContent.products.find(p=>p.id===t.product)!.name,exact:true}).click();await page.locator(`button[data-topic="${t.id}"]`).click();const gap=await page.evaluate(()=>document.querySelector('[class*=narrative] [class*=body]')!.getBoundingClientRect().top-document.querySelector('#scene-title')!.getBoundingClientRect().bottom);expect(gap).toBeGreaterThanOrEqual(15);expect(gap).toBeLessThanOrEqual(21);const d=page.locator('[data-a3-disclosure]');await d.click();expect(await page.locator('[class*=disclosureBody]>div').evaluate(e=>e.scrollHeight-e.clientHeight)).toBeLessThanOrEqual(1);await d.click();}}
 await page.setViewportSize({width:1920,height:1080});await page.getByRole('tab',{name:'Подбираем решение'}).click();await page.locator('[data-a3-disclosure]').click();const m=await page.locator('[data-a3-copy]').evaluate(e=>({rise:parseFloat((e as HTMLElement).style.getPropertyValue('--disclosure-rise')),added:e.querySelector('[class*=disclosureBody]>div')!.scrollHeight}));expect(m.rise).toBeCloseTo(Math.min(32,m.added*.22),1);expect(m.rise).toBeLessThanOrEqual(32);
 });


test('A4.2 adjacent widths interpolate continuously while approved desktop endpoints stay fixed',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);await page.evaluate(()=>document.fonts.ready);
 let previous:{x:number;width:number}|undefined;
 for(let width=1179;width<=1367;width++){
  await page.setViewportSize({width,height:900});
  const m=await page.locator('[data-a3-copy]').evaluate(e=>({x:e.getBoundingClientRect().left,width:e.getBoundingClientRect().width}));
  if(previous){expect(Math.abs(m.x-previous.x),`copy x: ${width-1} → ${width}`).toBeLessThanOrEqual(4);expect(Math.abs(m.width-previous.width),`copy width: ${width}`).toBeLessThanOrEqual(4);}
  expect(m.width).toBeCloseTo(640,0);previous=m;
 }
});

test('A4.2 resize restores a disappearing focused tab without changing selection or stealing outside focus',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:901,height:900});await page.goto(path);
 const selected=page.locator('button[data-topic="crm-history"]');await selected.focus();await page.keyboard.press('End');await expect(page.locator('button[data-topic="custom-solution"]')).toBeFocused();await expect(selected).toHaveAttribute('aria-selected','true');
 const scroll=await page.evaluate(()=>scrollY);await page.setViewportSize({width:900,height:900});await expect(selected).toBeFocused();await expect(selected).toHaveAttribute('aria-selected','true');expect(await page.evaluate(()=>scrollY)).toBeCloseTo(scroll,0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');await expect(page.locator('button[data-topic="crm-next-step"]')).toHaveAttribute('aria-selected','true');await page.keyboard.press('Tab');await expect(page.getByRole('tabpanel')).toBeFocused();
 await page.setViewportSize({width:901,height:900});await expect(page.getByRole('tabpanel')).toBeFocused();await page.setViewportSize({width:900,height:900});await expect(page.getByRole('tabpanel')).toBeFocused();await expect(page.locator('[data-story-experience]')).toHaveAttribute('data-topic','crm-next-step');
});

test('A4.2 forced colors retains visible selection, focus and operable disclosure',async({page})=>{
 await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});await page.goto(path);
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});const tab=page.getByRole('tab',{name:'Клиентская история',exact:true});await tab.focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');const chosen=page.getByRole('tab',{name:'Следующее действие'});await expect(chosen).toBeFocused();await expect(chosen).toHaveAttribute('aria-selected','true');expect(await chosen.evaluate(e=>({border:getComputedStyle(e).borderTopStyle,outline:getComputedStyle(e).outlineStyle}))).toEqual({border:'solid',outline:'solid'});await page.keyboard.press('Tab');await expect(page.getByRole('tabpanel')).toBeFocused();await page.keyboard.press('Tab');const d=page.locator('[data-a3-disclosure]');await expect(d).toBeFocused();await page.keyboard.press('Space');await expect(d).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Space');await expect(d).toHaveAttribute('aria-expanded','false');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});

test('A4.3 peripheral light never changes geometry or crosses reading/focus areas',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
 for(const width of [1920,1728,1440,1366,1251,1024,901,900,430,390,360,320]){
  await page.setViewportSize({width,height:1080});
  for(const t of scenes){
   if(width<=900)await page.getByRole('button',{name:storyContent.products.find(p=>p.id===t.product)!.name,exact:true}).click();
   await page.locator(`button[data-topic="${t.id}"]`).click();await page.locator('[data-a3-disclosure]').click();
   const measure=()=>page.evaluate(()=>({height:document.documentElement.scrollHeight,boxes:['[data-a3-copy]','[data-a3-workspace]','[class*=navigation]','#products'].map(s=>document.querySelector(s)!.getBoundingClientRect().toJSON())}));
   const before=await measure();const art=page.locator('[data-story-atmosphere]');await expect(art).toHaveAttribute('aria-hidden','true');expect(await art.evaluate(e=>getComputedStyle(e).pointerEvents)).toBe('none');
   if(width>1250){const a=(await art.boundingBox())!,c=(await page.locator('[data-a3-copy]').boundingBox())!;expect(a.x-c.x-c.width).toBeGreaterThan(24);}
   await art.evaluate(e=>(e as HTMLElement).style.display='none');expect(await measure()).toEqual(before);await art.evaluate(e=>(e as HTMLElement).style.removeProperty('display'));
  }
 }
});

test('A4.3 compact product picker preserves full labels, hit areas and keyboard selection',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
 for(const width of [900,768,430,390,360,320]){
  await page.setViewportSize({width,height:932});const group=page.locator('[aria-label="Направления TMS"]');const box=(await group.boundingBox())!;
  expect(box.width).toBeLessThan(width-32);expect(await group.evaluate(e=>getComputedStyle(e).backdropFilter)).toBe('none');
  for(const name of ['CRM','OMS','Разработка']){
   const b=group.getByRole('button',{name,exact:true});await b.focus();await page.keyboard.press('Space');await expect(b).toHaveAttribute('aria-pressed','true');await expect(b).toBeFocused();
   const r=(await b.boundingBox())!;expect(r.height).toBeGreaterThanOrEqual(44);expect(r.width).toBeGreaterThanOrEqual(44);
   expect(await b.evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);const b=e.getBoundingClientRect(),t=r.getBoundingClientRect();return t.left>=b.left&&t.right<=b.right&&getComputedStyle(e).borderBottomWidth==='1px';})).toBe(true);
  }
 }
 await page.addStyleTag({content:'html{font-size:200%}'});await page.setViewportSize({width:320,height:740});
 for(const name of ['CRM','OMS','Разработка']){const b=page.locator('[aria-label="Направления TMS"]').getByRole('button',{name,exact:true});await b.focus();await page.keyboard.press('Enter');await expect(b).toHaveAttribute('aria-pressed','true');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('A4.3 one Hero material and opaque/contrast fallbacks retain visible content',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
 for(const width of [1920,1440,430,390,320]){
  await page.setViewportSize({width,height:1080});const hero=page.locator('[data-v6-story]');await expect(page.locator('[data-glass-message=incoming]')).toBeVisible();await expect(page.locator('[data-glass-message=outgoing]')).toBeVisible();await expect(hero.locator('[data-glass]')).toHaveCount(1);await expect(hero.locator('[class*=artField],[class*=orbit]')).toHaveCount(0);
  expect(await hero.locator('[data-glass]').evaluate(e=>[...e.querySelectorAll('*')].filter(n=>!n.hasAttribute('data-glass-message')).every(n=>getComputedStyle(n).backdropFilter==='none'))).toBe(true);
  expect(await page.locator('[data-hero-light]').evaluate(e=>({radius:getComputedStyle(e).borderRadius,border:getComputedStyle(e).borderWidth,filter:getComputedStyle(e).backdropFilter}))).toEqual({radius:'0px',border:'0px',filter:'none'});
 }
 await page.locator('[data-v6-review]').evaluate(e=>e.setAttribute('data-no-blur',''));
 await expect(page.locator('[data-v6-story] [data-glass]')).toHaveCSS('background-color','rgb(245, 248, 252)');await expect(page.locator('[data-v6-story] [data-glass]')).toHaveCSS('backdrop-filter','none');
 await page.locator('[data-v6-review]').evaluate(e=>e.removeAttribute('data-no-blur'));await page.emulateMedia({contrast:'more'});
 await expect(page.locator('[data-v6-story] [data-glass]')).toHaveCSS('background-color','rgb(245, 248, 252)');await expect(page.locator('[data-hero-light]')).toBeHidden();await expect(page.locator('[data-story-atmosphere]')).toBeHidden();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});

test('A4.6 equal topics, single lines and shared header axis including badge removal',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);await page.evaluate(()=>document.fonts.ready);
 for(const width of [1920,1728,1440,1366,1252,1251,1250,1249,1180,1121,1120,1119,1101,1100,1099,1024,901,900,768,601,600,430,390,360,320]){
  await page.setViewportSize({width,height:900});
  for(const t of scenes){
   if(width<=900)await page.getByRole('button',{name:storyContent.products.find(p=>p.id===t.product)!.name,exact:true}).click();await page.locator(`button[data-topic="${t.id}"]`).click();
   const metrics=await page.evaluate(()=>{
    const tabs=[...document.querySelectorAll<HTMLElement>('[data-topic][role=tab]')].filter(e=>e.getClientRects().length).map(e=>{const r=document.createRange();r.selectNodeContents(e.querySelector('span')!);return{width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,lines:new Set([...r.getClientRects()].map(x=>x.y)).size};});
    const link=document.querySelector('nav[aria-label="Основная навигация"] a')!;const r=document.createRange();r.selectNodeContents(link);const c=document.querySelector('[data-a3-copy]')!.getBoundingClientRect();const visible=!!link.getClientRects().length;return{tabs,axis:visible?Math.abs(r.getBoundingClientRect().x-c.x):0,visible,overflow:document.documentElement.scrollWidth>innerWidth};
   });
   expect(metrics.overflow).toBe(false);expect(metrics.axis).toBeLessThanOrEqual(2);expect(metrics.visible).toBe(width>1120);expect(Math.max(...metrics.tabs.map(t=>t.width))-Math.min(...metrics.tabs.map(t=>t.width))).toBeLessThanOrEqual(1);expect(metrics.tabs.every(t=>t.lines===1),`${width}: ${t.id}`).toBe(true);expect(new Set(metrics.tabs.map(t=>t.height)).size).toBe(1);
  }
  const old=(await page.locator('[data-a3-copy]').boundingBox())!.x;const hide=await page.addStyleTag({content:'header [class*=reviewBadge]{display:none!important}'});expect((await page.locator('[data-a3-copy]').boundingBox())!.x).toBe(old);if(width>1120)expect(Math.abs((await page.locator('nav[aria-label="Основная навигация"] a').first().boundingBox())!.x-old)).toBeLessThanOrEqual(2);await hide.evaluate(e=>(e as HTMLElement).remove());
 }
});

test('A4.6 header switches before collision, compact menu and actual anchor remain usable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);await page.evaluate(()=>document.fonts.ready);
 for(const width of [1121,1120,1119,1101,1100,1099,901,900,601,600]){
  await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));
  if(width<=1120){await page.getByRole('button',{name:'Меню',exact:true}).click();const nav=page.getByRole('navigation',{name:'Мобильная навигация'});await expect(nav).toBeVisible();await nav.getByRole('link',{name:'Продукты',exact:true}).click();}
  else{const nav=(await page.getByRole('navigation',{name:'Основная навигация'}).boundingBox())!,actions=(await page.locator('header [class*=headerActions]').boundingBox())!;expect(nav.x+nav.width).toBeLessThanOrEqual(actions.x+1);await page.getByRole('navigation',{name:'Основная навигация'}).getByRole('link',{name:'Продукты',exact:true}).click();}
  const h=(await page.locator('header').boundingBox())!;expect((await page.locator('#products').boundingBox())!.y-h.height).toBeCloseTo(24,0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('A4.7 one clock freezes whole bubbles and partial reveal; accessibility keeps static meaning',async({page})=>{
 await page.goto(path+'?glass=css');await page.getByRole('button',{name:'Пауза анимации',exact:true}).click();await page.getByRole('button',{name:'Продолжить анимацию'}).click();await page.waitForTimeout(1100);await page.getByRole('button',{name:'Пауза анимации',exact:true}).click();
 const state=()=>page.locator('[data-glass-message=incoming]').evaluate(e=>e.getAttribute('style'));const before=await state();await page.waitForTimeout(500);expect(await state()).toBe(before);const time=Number(await page.locator('[data-v6-story]').getAttribute('data-elapsed'));await page.getByRole('button',{name:'Продолжить анимацию'}).click();await page.waitForTimeout(150);expect(Number(await page.locator('[data-v6-story]').getAttribute('data-elapsed'))).toBeGreaterThan(time);expect(await state()).not.toBe(before);
 await page.emulateMedia({contrast:'more'});await expect(page.locator('[data-v6-story]')).toHaveAttribute('data-playback','static');await expect(page.locator('[data-glass-message=outgoing] p')).toBeVisible();expect(await page.locator('[data-glass-message=incoming]').evaluate(e=>getComputedStyle(e).translate)).toBe('0px');
});


test('A4.7 float continues after completion; pause, resume, replay and offscreen share one clock',async({page})=>{
 await page.goto(path+'?glass=css');const story=page.locator('[data-v6-story]');
 await expect(story).toHaveAttribute('data-playback','completed',{timeout:8000});
 const bubble=page.locator('[data-glass-message=incoming]'),position=()=>bubble.evaluate(e=>getComputedStyle(e).translate);
 const first=await position();await page.waitForTimeout(800);expect(await position()).not.toBe(first);await expect(story).toHaveAttribute('data-elapsed','6000');
 await page.getByRole('button',{name:'Пауза анимации'}).focus();await page.keyboard.press('Space');
 const paused=await position();await page.waitForTimeout(1000);expect(await position()).toBe(paused);
 await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(900);await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);await expect(story).toHaveAttribute('data-playback','paused');expect(await position()).toBe(paused);
 await page.getByRole('button',{name:'Продолжить анимацию'}).click();await page.waitForTimeout(250);expect(await position()).not.toBe(paused);
 await page.getByRole('button',{name:'Повторить историю'}).click();expect(Number(await story.getAttribute('data-elapsed'))).toBeLessThan(500);
 await expect(bubble.locator('p')).toBeVisible();await expect(bubble).toHaveCSS('opacity','1');
});

test('A4.7 footer contacts and legal links remain readable at 200% text and no blur',async({page})=>{
 await page.goto(path+'?glass=css');await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1920,768,430,390,320]){
  await page.setViewportSize({width,height:900});await page.locator('[data-v6-review]').evaluate(e=>e.setAttribute('data-no-blur',''));
  if(width===320)await page.addStyleTag({content:'html{font-size:200%}'});
  const footer=page.locator('footer');for(const href of ['mailto:tmsasub@yandex.ru','https://tmsasub.store','/privacy','/about','/partners','/custom-development'])await expect(footer.locator(`a[href="${href}"]`)).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(footer).toContainText('ИНН 6900030390');
 }
});

for(const width of [390,900])test(`A4.8 finite ${width}: clock stops, Pause becomes Replay without focus loss`,async({page})=>{
 await page.setViewportSize({width,height:1600});await page.goto(path+'?glass=auto');const story=page.locator('[data-v6-story]');const control=story.locator('button').first();await control.focus();
 await expect(story).toHaveAttribute('data-playback','completed',{timeout:8000});await expect(story).toHaveAttribute('data-playing','false');await expect(control).toHaveAttribute('aria-label','Повторить историю');await expect(control).toBeFocused();
 const state=await story.getAttribute('data-ambient-time');const styles=await story.locator('[data-hero-step]').evaluateAll(es=>es.map(e=>e.getAttribute('style')));await page.waitForTimeout(800);expect(await story.getAttribute('data-ambient-time')).toBe(state);expect(await story.locator('[data-hero-step]').evaluateAll(es=>es.map(e=>e.getAttribute('style')))).toEqual(styles);
 await page.keyboard.press('Space');await expect(control).toHaveAttribute('aria-label','Пауза анимации');expect(Number(await story.getAttribute('data-elapsed'))).toBeLessThan(500);await control.click();const paused=await story.getAttribute('data-elapsed');await page.waitForTimeout(200);expect(await story.getAttribute('data-elapsed')).toBe(paused);
});
test('A4.8 resize preserves read history, paused offsets and settles compact playback',async({page})=>{
 await page.setViewportSize({width:901,height:1600});await page.goto(path+'?glass=css');const story=page.locator('[data-v6-story]');await expect(story).toHaveAttribute('data-playback','completed',{timeout:8000});await page.getByRole('button',{name:'Пауза анимации'}).click();const before=await story.locator('[data-glass-message]').evaluateAll(es=>es.map(e=>e.getAttribute('style')));
 await page.setViewportSize({width:900,height:1600});await expect(story).toHaveAttribute('data-playback','paused');expect(await story.locator('[data-glass-message]').evaluateAll(es=>es.map(e=>e.getAttribute('style')))).toEqual(before);await expect(story).toHaveAttribute('data-elapsed','6000');await page.getByRole('button',{name:'Продолжить анимацию'}).click();await page.waitForTimeout(500);await expect(story).toHaveAttribute('data-playing','false');await expect(story.locator('button').first()).toHaveAttribute('aria-label','Повторить историю');
 await page.setViewportSize({width:901,height:1600});await expect(story).toHaveAttribute('data-playing','true');await expect(story).toHaveAttribute('data-elapsed','6000');
});
test('A4.8 wide touch policy is finite without depending on viewport width',async({browser})=>{
 const context=await browser.newContext({viewport:{width:1440,height:1000},hasTouch:true});const page=await context.newPage();await page.goto('http://127.0.0.1:3200'+path+'?glass=auto');await expect(page.locator('[data-v6-story]')).toHaveAttribute('data-motion-policy','finite');await expect(page.locator('[data-v6-story]')).toHaveAttribute('data-playback','completed',{timeout:8000});await expect(page.locator('[data-v6-story]')).toHaveAttribute('data-playing','false');await context.close();
});
test('A4.8 footer uses one nav row on wide and compact desktop',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);for(const width of [1920,1728,1440,1366,1024]){await page.setViewportSize({width,height:1080});const links=await page.locator('footer nav a').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().toJSON()));expect(new Set(links.map(r=>r.y)).size).toBe(1);if(width>=1440){const h=await page.locator('footer').evaluate(e=>e.getBoundingClientRect().height);expect(h).toBeGreaterThanOrEqual(250);expect(h).toBeLessThanOrEqual(290);}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('A4.8 OMS enters as one readable card and freezes mid-entry without layout shift',async({page})=>{
 await page.goto(path+'?glass=css');await expect(page.locator('[data-v6-story]')).toHaveAttribute('data-playback','running');await page.evaluate(()=>document.fonts.ready);const oms=page.locator('[data-hero-step="3"]'),shell=page.locator('[data-hero-scene]'),bg=page.locator('[data-glass-background]');const geometry=[await shell.boundingBox(),await bg.boundingBox()];
 await page.evaluate(()=>new Promise<void>(resolve=>{const tick=()=>{const story=document.querySelector<HTMLElement>('[data-v6-story]')!;if(Number(story.dataset.elapsed)>=4540&&getComputedStyle(document.querySelector('[data-hero-step="3"]')!).visibility==='visible'){story.querySelector<HTMLButtonElement>('button')!.click();resolve();}else requestAnimationFrame(tick);};requestAnimationFrame(tick);}));
 const translate=await oms.evaluate(e=>(e as HTMLElement).style.translate);expect(Number(translate.split(' ')[1]?.replace('px','')||0)).toBeGreaterThan(0);await expect(oms).toHaveCSS('opacity','1');await expect(oms.getByText('Заказ принят в работу')).toBeVisible();await expect(oms.getByText('Подготовить заказ к передаче')).toBeVisible();await page.waitForTimeout(500);expect(await oms.evaluate(e=>(e as HTMLElement).style.translate)).toBe(translate);expect([await shell.boundingBox(),await bg.boundingBox()]).toEqual(geometry);await page.getByRole('button',{name:'Продолжить анимацию'}).click();await page.waitForTimeout(400);await expect(oms).toHaveCSS('translate','0px');
});
test('A4.8 input capability change keeps user pause and viewed history',async({page})=>{
 await page.goto(path+'?glass=css');await page.getByRole('button',{name:'Пауза анимации'}).click();const story=page.locator('[data-v6-story]'),time=await story.getAttribute('data-elapsed');const before=await page.locator('[data-glass-message=incoming]').getAttribute('style');const session=await page.context().newCDPSession(page);await session.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await expect(story).toHaveAttribute('data-motion-policy','finite');await expect(story).toHaveAttribute('data-playback','paused');expect(await story.getAttribute('data-elapsed')).toBe(time);expect(await page.locator('[data-glass-message=incoming]').getAttribute('style')).toBe(before);await session.send('Emulation.setTouchEmulationEnabled',{enabled:false});await expect(story).toHaveAttribute('data-motion-policy','ambient');await expect(story).toHaveAttribute('data-playback','paused');await session.detach();
});
