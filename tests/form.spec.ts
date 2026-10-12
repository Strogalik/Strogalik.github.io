import { test, expect, type Page } from '@playwright/test';
async function fill(page:Page){await page.getByLabel('Ваше имя').fill('QA Test');await page.getByLabel('Компания').fill('Synthetic QA');await page.getByLabel('Email или телефон').fill('qa@example.test');await page.getByLabel('Что хотите изменить').fill('Synthetic test only');await page.locator('input[name=consent]').check();}
test('validation, missing delivery, focus trap, preserved values, retry and Escape',async({page})=>{
 await page.route('**/api/lead',r=>r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,message:'Сейчас отправка обращений недоступна. Ваши данные не отправлены.'})}));
 await page.goto('/');const trigger=page.locator('#solution').getByRole('button',{name:'Обсудить задачу'});await trigger.click();await page.getByRole('button',{name:'Отправить запрос'}).click();await expect(page.getByLabel('Ваше имя')).toBeFocused();await fill(page);await page.getByRole('button',{name:'Отправить запрос'}).click();await expect(page.getByRole('dialog').getByRole('alert')).toContainText('не отправлены');await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);await expect(page.getByLabel('Ваше имя')).toHaveValue('QA Test');await page.getByRole('button',{name:'Закрыть форму'}).focus();await page.keyboard.press('Shift+Tab');expect(await page.evaluate(()=>document.querySelector('dialog[open]')?.contains(document.activeElement))).toBe(true);await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
});
test('consultation contexts and current-URL UTM; duplicate click guard',async({page})=>{
 let count=0;let payload:Record<string,unknown>={};await page.route('**/api/lead',async route=>{count++;payload=route.request().postDataJSON();await new Promise(r=>setTimeout(r,150));await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
 await page.goto('/?utm_source=first&utm_campaign=qa');
 for(const [path,label,intent] of [['/products/oms','Обсудить задачу','saas'],['/custom-development','Обсудить проект','custom'],['/partners','Обсудить партнёрство','partner'],['/cases/online-school','Обсудить похожую задачу','custom']]){
  await page.goto(path+'?utm_source=second');await page.getByRole('button',{name:label,exact:true}).first().click();await fill(page);await page.getByRole('button',{name:'Отправить запрос'}).dblclick();await expect(page.getByRole('dialog').getByRole('status')).toContainText('доставлен');expect(payload.intent).toBe('consultation');expect(payload.context).toBe(intent);expect((payload.utm as Record<string,string>).utm_source).toBe('second');await page.keyboard.press('Escape');
 }
 expect(count).toBe(4);
});
test('network error never presents success',async({page})=>{await page.route('**/api/lead',r=>r.abort());await page.goto('/partners');await page.getByRole('button',{name:'Обсудить партнёрство'}).click();await fill(page);await page.getByRole('button',{name:'Отправить запрос'}).click();await expect(page.getByRole('dialog').getByRole('alert')).toBeVisible();await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);await expect(page.getByRole('button',{name:'Отправить запрос'})).toBeEnabled();});

test.beforeEach(async({page})=>{await page.addInitScript(()=>{try{localStorage.setItem('tms:cookie-notice:v1','closed');}catch{}});});
