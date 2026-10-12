import {test,expect} from '@playwright/test';
const url='/review/v6?v=a4.7&glass=';
const scene='[data-hero-scene]';
test('CSS mode never probes GPU or creates SDK definitions; both semantic messages remain visible',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'gpu',{configurable:true,get(){throw Error('CSS must never access GPU');}});});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url+'css');await expect(page.locator(scene)).toHaveAttribute('data-glass-state','css');await expect(page.locator('[data-glass-message=incoming]')).toBeVisible();await expect(page.locator('[data-glass-message=outgoing]')).toBeVisible();await expect(page.locator(`${scene}>svg`)).toHaveCount(0);
});
for(const failure of ['absent','null','reject','slow'] as const)test(`SDK failure ${failure} preserves readable CSS and controls`,async({page})=>{
 await page.addInitScript(kind=>{Object.defineProperty(navigator,'gpu',{configurable:true,value:kind==='absent'?undefined:{requestAdapter:()=>kind==='null'?Promise.resolve(null):kind==='reject'?Promise.reject(Error('test-adapter-rejected')):new Promise(()=>{})}});},failure);
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url+'sdk');await expect(page.locator('[data-glass-message=incoming]')).toBeVisible();await expect(page.locator(scene)).toHaveAttribute('data-glass-state','fallback',{timeout:12000});await expect(page.locator(`${scene}>svg`)).toHaveCount(0);await expect(page.locator('[data-glass-message=outgoing]')).toBeVisible();await page.locator('#solution').getByRole('button',{name:'Обсудить задачу'}).click();await expect(page.getByRole('dialog')).toBeVisible();
});
test('chunk load failure is contained by the review adapter',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'gpu',{configurable:true,value:{requestAdapter:async()=>({})}}));
 await page.route('**/_next/static/chunks/*.js',async route=>{const response=await route.fetch();const body=await response.text();if(body.includes('liquid-glass/material-field'))await route.abort();else await route.fulfill({response,body});});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url+'sdk');await expect(page.locator(scene)).toHaveAttribute('data-glass-state','fallback',{timeout:12000});await expect(page.locator('[data-glass-message=incoming]')).toBeVisible();await expect(page.locator('[data-glass-message=outgoing]')).toBeVisible();
});
test('forced colors and reduced transparency override forced SDK and react to preference changes',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'gpu',{configurable:true,value:{requestAdapter:async()=>null}}));
 await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});await page.goto(url+'sdk');await expect(page.locator(scene)).toHaveAttribute('data-glass-reason','accessibility-preference');await expect(page.locator('[data-glass-message=incoming]')).toBeVisible();
 await page.emulateMedia({forcedColors:'none'});await expect(page.locator(scene)).toHaveAttribute('data-glass-reason','adapter-null');
 const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'},{name:'prefers-reduced-motion',value:'reduce'}]});await expect(page.locator(scene)).toHaveAttribute('data-glass-reason','accessibility-preference');await expect(page.locator('[data-glass-message=outgoing]')).toBeVisible();
});
test('auto keeps CSS material parity on desktop and rejects unverified engines without GPU probing',async({browser})=>{
 for(const userAgent of ['Mozilla/5.0 Chrome/153.0 Safari/537.36','Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Version/27.0 Mobile Safari/604.1','Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/27.0 Safari/605.1.15']){const context=await browser.newContext({userAgent,reducedMotion:'reduce'});const p=await context.newPage();await p.addInitScript(()=>Object.defineProperty(navigator,'gpu',{get(){throw Error('unverified engine must never probe');}}));await p.goto('http://127.0.0.1:3200'+url+'auto');await expect(p.locator(scene)).toHaveAttribute('data-glass-state',userAgent.includes('Chrome/')?'css':'fallback');await expect(p.locator('[data-glass-message=incoming]')).toBeVisible();await context.close();}
});
test('matte topic rows keep focus separate from selection and never register SDK surfaces',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url+'css');const t=page.getByRole('tab',{name:'Клиентская история',exact:true});await t.focus();await page.keyboard.press('ArrowDown');await expect(t).toHaveAttribute('aria-selected','true');const focused=page.getByRole('tab',{name:'Следующее действие',exact:true});await expect(focused).toBeFocused();expect(await focused.evaluate(e=>getComputedStyle(e).outlineStyle)).toBe('solid');await expect(t.locator('svg')).toBeVisible();expect(await t.evaluate(e=>({border:getComputedStyle(e).borderTopColor,shadow:getComputedStyle(e).boxShadow,font:getComputedStyle(e).fontSize,padding:getComputedStyle(e).padding}))).toMatchObject({border:'rgba(0, 0, 0, 0)',font:'18px',padding:'18px 24px'});await expect(page.locator('[data-story-experience] .lg-surface')).toHaveCount(0);
});

test('SDK renderer diagnostic error restores CSS after successful adapter probe',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'gpu',{configurable:true,value:{requestAdapter:async()=>({features:new Set(),limits:{},requestDevice:async()=>{throw Error('test-device-failed');}})}}));
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url+'sdk');await expect(page.locator(scene)).toHaveAttribute('data-glass-state','fallback',{timeout:12000});await expect(page.locator(scene)).toHaveAttribute('data-glass-reason',/diagnostic:/);await expect(page.locator('[data-glass-message=incoming]')).toBeVisible();await expect(page.locator('[data-glass-message=outgoing]')).toBeVisible();await expect(page.locator(`${scene}>svg`)).toHaveCount(0);
});
