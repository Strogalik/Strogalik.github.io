import {test,expect} from '@playwright/test';

test('static public routes, fonts and assets are available',async({page,request})=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/', '/products/crm/', '/products/oms/', '/products/crm-oms/', '/cases/', '/cases/b2b-wholesale/', '/cases/flooring-manufacturer/', '/cases/online-school/', '/custom-development/', '/about/', '/partners/', '/privacy/', '/consent/', '/cookies/', '/analytics-consent/']) {
    const response=await page.goto(path);
    expect(response?.status(),path).toBe(200);
    await expect(page.locator('main')).toBeVisible();
  }
  const config=await request.get('/api/analytics-config');
  expect(config.status()).toBe(200);
  expect((await config.json()).enabled).toBe(false);
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  for(const img of await page.locator('img:visible').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test('static consultation validates without sending contact data',async({page})=>{
  let posts=0;
  page.on('request',r=>{if(r.method()==='POST')posts++;});
  await page.goto('/products/crm/');
  await page.getByRole('button',{name:'Обсудить задачу',exact:true}).first().click();
  const form=page.locator('dialog[open]');
  await expect(form).toBeVisible();
  await form.locator('input[name="name"]').fill('Тест');
  await form.locator('input[name="contact"]').fill('synthetic@example.test');
  await form.locator('input[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(form.getByRole('alert')).toContainText('Отправка недоступна');
  expect(posts).toBe(0);
  await page.keyboard.press('Escape');
  await expect(form).toHaveCount(0);
});

test('legacy redirects and private review routes',async({page,request})=>{
  await page.goto('/demo/?product=crm');
  await expect(page).toHaveURL(/\/products\/crm\/$/);
  await page.goto('/products/brm/');
  await expect(page).toHaveURL(/\/custom-development\/$/);
  for(const path of ['/review/v6/','/review/faq/'])expect((await request.get(path)).status()).toBe(404);
});
