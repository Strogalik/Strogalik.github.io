import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
export const routes=['/','/consent','/cookies','/products/crm','/products/oms','/products/crm-oms','/custom-development','/about','/partners','/cases','/cases/b2b-wholesale','/cases/flooring-manufacturer','/cases/online-school','/privacy'];
test('Stage B routes, 404, 308, sitemap, canonical and runtime errors',async({page,request})=>{
 const errors:string[]=[];const titles=new Set<string>();page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 for(const path of routes){expect((await page.goto(path))?.status(),path).toBe(200);await expect(page.getByRole('heading',{level:1})).toBeVisible();titles.add(await page.title());expect(new URL((await page.locator('link[rel=canonical]').getAttribute('href'))!).pathname).toBe(path);}
 expect(titles.size).toBe(routes.length);expect(errors).toEqual([]);const redirect=await request.get('/products/brm',{maxRedirects:0});expect(redirect.status()).toBe(308);expect(redirect.headers().location).toBe('/custom-development');
 for(const path of ['/products/missing','/cases/missing'])expect((await request.get(path)).status()).toBe(404);
 const map=await(await request.get('/sitemap.xml')).text();for(const path of routes)expect(map).toContain(path);expect(map).not.toContain('/products/brm');
});
test('Stage B approved Hero, public case content, production boundary and consultation context',async({page})=>{
 await page.goto('/');await expect(page.locator('#solution h1')).toHaveText('От первого обращения до выполненного заказа');await expect(page.locator('#cases details[name="tms-case-stories"]')).toHaveCount(3);
 for(const path of routes.filter(p=>p!=='/demo')){await page.goto(path);await expect(page.locator('.workspace,.mini-demo,.case-sandbox,.work-board,[data-record-id]')).toHaveCount(0);await expect(page.getByRole('button',{name:/Передать в работу|Завершить|Назначить контакт|Записать на занятие/})).toHaveCount(0);}
 let payload:Record<string,unknown>={};await page.route('**/api/lead',async r=>{payload=r.request().postDataJSON();await r.fulfill({status:503,contentType:'application/json',body:'{"ok":false}'});});await page.goto('/products/oms');await page.locator('main').getByRole('button',{name:'Обсудить задачу'}).first().click();await page.getByLabel('Ваше имя').fill('QA Test');await page.getByLabel('Email или телефон').fill('qa@example.test');await page.locator('input[name=consent]').check();await page.getByRole('button',{name:'Отправить запрос'}).click();await expect.poll(()=>payload.productSlug).toBe('oms');expect(payload.intent).toBe('consultation');expect(payload.company).toBe('');expect(payload.message).toBe('');await page.keyboard.press('Escape');await expect(page.locator('a[href^="/demo"]')).toHaveCount(0);
});
test('calculator preserved: positive/negative/fraction, validation and hours',async({page})=>{
 await page.goto('/#calculator');const result=page.locator('.calculator-result');await expect(result.locator('strong')).toHaveText('+8');await page.getByRole('textbox',{name:'Текущая конверсия, %',exact:true}).fill('12');await page.getByRole('textbox',{name:'Сценарная конверсия, %',exact:true}).fill('10');await expect(result.locator('strong')).toHaveText('-8');await page.locator('[data-calc-method] summary').click();await expect(page.locator('[data-calc-method]')).toContainText('п. п.: -2');await page.locator('[data-calc-method] summary').click();await page.getByLabel('Обращений в месяц').fill('3');await page.getByRole('textbox',{name:'Текущая конверсия, %',exact:true}).fill('10');await page.getByRole('textbox',{name:'Сценарная конверсия, %',exact:true}).fill('20');await expect(result).toContainText('0,3');for(const value of ['','-1']){await page.getByLabel('Обращений в месяц').fill(value);await expect(result.getByRole('alert')).toBeVisible();}await page.getByRole('button',{name:'Команда',exact:true}).click();await expect(result.locator('strong')).toHaveText('55');await expect(result).toContainText('часов в месяц');await expect(result).not.toContainText('₽');
});

for(const [width,height] of [[320,740],[360,800],[390,844],[430,932],[768,1024],[1024,768],[1280,720],[1440,900],[1920,1080],[844,390]])test(`route reflow, mobile defaults and focus ${width}x${height}`,async({page})=>{
 await page.setViewportSize({width,height});for(const path of routes){await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);}
});
test('keyboard tabs/menu, modal trap/focus return and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:'Меню',exact:true}).click();await expect(page.getByRole('navigation',{name:'Мобильная навигация'})).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Меню',exact:true})).toBeFocused();expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});
test('no-JS all content/routes and 200% CSS reflow equivalent',async({browser,page})=>{
 await page.setViewportSize({width:640,height:360});for(const path of routes){await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);}
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const p=await context.newPage();for(const path of routes){await p.goto('http://127.0.0.1:3100'+path);await expect(p.getByRole('heading',{level:1})).toBeVisible();if(path!=='/demo'){await p.getByRole('button',{name:'Меню',exact:true}).click();await expect(p.getByRole('navigation',{name:'Мобильная навигация'})).toBeVisible();}expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);}await p.goto('http://127.0.0.1:3100/');await expect(p.locator('[data-story-experience] noscript details')).toHaveCount(6);await expect(p.locator('#cases details[name="tms-case-stories"]')).toHaveCount(3);await context.close();
});
for(const path of ['/','/products/crm','/cases/flooring-manufacturer','/consent'])test(`user text spacing and 200% text resize preserve controls: ${path}`,async({page})=>{
 await page.goto(path);await page.addStyleTag({content:'*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);await page.addStyleTag({content:'html{font-size:200%}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+' resized').toBe(true);
});
test('axe AA routes and changed record/dialog states',async({page})=>{
 for(const path of routes){await page.goto(path);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations,path).toEqual([]);}
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.locator('#solution').getByRole('button',{name:'Обсудить задачу'}).click();await page.getByRole('button',{name:'Отправить запрос'}).click();expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});

test.beforeEach(async({page})=>{await page.addInitScript(()=>{try{localStorage.setItem('tms:cookie-notice:v1','closed');}catch{}});});
