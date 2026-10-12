import {test,expect} from '@playwright/test';
const path='/';
// Regression assertions retained from the approved A4.8 tests, run on the public B2 homepage.
for(const width of [390,900])test(`B2 approved finite ${width}: clock stops, Pause becomes Replay without focus loss`,async({page})=>{
 await page.setViewportSize({width,height:1600});await page.goto(path+'?glass=auto');const story=page.locator('[data-v6-story]');const control=story.locator('button').first();await control.focus();
 await expect(story).toHaveAttribute('data-playback','completed',{timeout:8000});await expect(story).toHaveAttribute('data-playing','false');await expect(control).toHaveAttribute('aria-label','Повторить историю');await expect(control).toBeFocused();
 const state=await story.getAttribute('data-ambient-time');const styles=await story.locator('[data-hero-step]').evaluateAll(es=>es.map(e=>e.getAttribute('style')));await page.waitForTimeout(800);expect(await story.getAttribute('data-ambient-time')).toBe(state);expect(await story.locator('[data-hero-step]').evaluateAll(es=>es.map(e=>e.getAttribute('style')))).toEqual(styles);
 await page.keyboard.press('Space');await expect(control).toHaveAttribute('aria-label','Пауза анимации');expect(Number(await story.getAttribute('data-elapsed'))).toBeLessThan(500);await control.click();const paused=await story.getAttribute('data-elapsed');await page.waitForTimeout(200);expect(await story.getAttribute('data-elapsed')).toBe(paused);
});
test('B2 approved OMS enters as one readable card and freezes mid-entry without layout shift',async({page})=>{
 await page.goto(path+'?glass=css');await expect(page.locator('[data-v6-story]')).toHaveAttribute('data-playback','running');await page.evaluate(()=>document.fonts.ready);const oms=page.locator('[data-hero-step="3"]'),shell=page.locator('[data-hero-scene]'),bg=page.locator('[data-glass-background]');const geometry=[await shell.boundingBox(),await bg.boundingBox()];
 await page.evaluate(()=>new Promise<void>(resolve=>{const tick=()=>{const story=document.querySelector<HTMLElement>('[data-v6-story]')!;if(Number(story.dataset.elapsed)>=4540&&getComputedStyle(document.querySelector('[data-hero-step="3"]')!).visibility==='visible'){story.querySelector<HTMLButtonElement>('button')!.click();resolve();}else requestAnimationFrame(tick);};requestAnimationFrame(tick);}));
 const translate=await oms.evaluate(e=>(e as HTMLElement).style.translate);expect(Number(translate.split(' ')[1]?.replace('px','')||0)).toBeGreaterThan(0);await expect(oms).toHaveCSS('opacity','1');await expect(oms.getByText('Заказ принят в работу')).toBeVisible();await expect(oms.getByText('Подготовить заказ к передаче')).toBeVisible();await page.waitForTimeout(500);expect(await oms.evaluate(e=>(e as HTMLElement).style.translate)).toBe(translate);expect([await shell.boundingBox(),await bg.boundingBox()]).toEqual(geometry);await page.getByRole('button',{name:'Продолжить анимацию'}).click();await page.waitForTimeout(400);await expect(oms).toHaveCSS('translate','0px');
});

test.beforeEach(async({page})=>{await page.addInitScript(()=>{try{localStorage.setItem('tms:cookie-notice:v1','closed');}catch{}});});
