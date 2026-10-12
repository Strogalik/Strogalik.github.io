import {consentVersion,consentHash} from '../lib/consent';
import {test,expect} from '@playwright/test';
import {createServer,type Server} from 'node:http';
import {spawn,type ChildProcess} from 'node:child_process';
import {once} from 'node:events';
let upstream:Server,app:ChildProcess,status=204,count=0,delay=0;
let received:Record<string,unknown>={};
test.describe.serial('real form → Next API → local HTTP stub',()=>{
 test.beforeAll(async()=>{
  upstream=createServer(async(req,res)=>{let body='';for await(const c of req)body+=c;received=JSON.parse(body);count++;if(delay)await new Promise(r=>setTimeout(r,delay));res.writeHead(status);res.end();});
  upstream.listen(0,'127.0.0.1');await once(upstream,'listening');const port=(upstream.address() as {port:number}).port;
  let occupied=false;try{await fetch('http://127.0.0.1:3001/',{signal:AbortSignal.timeout(500)});occupied=true;}catch{}
  if(occupied)throw new Error('QA port 3001 is occupied; no submissions were made');
  app=spawn(process.execPath,['.next/standalone/server.js'],{env:{...process.env,PORT:'3001',HOSTNAME:'127.0.0.1',LEADS_WEBHOOK_URL:`http://127.0.0.1:${port}`,LEADS_WEBHOOK_TOKEN:'',LEADS_LEGAL_APPROVED:'true',NEXT_PUBLIC_YANDEX_METRIKA_ID:''},stdio:'ignore'});
  for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:3001/')).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw new Error('QA app did not start');
 });
 test.afterAll(async()=>{app?.kill('SIGTERM');upstream?.closeAllConnections();await new Promise<void>(r=>upstream.close(()=>r()));});
 for(const [path,label,intent] of [['/products/crm','Обсудить задачу','saas'],['/cases/b2b-wholesale','Обсудить похожую задачу','custom'],['/partners','Обсудить партнёрство','partner'],['/cases/online-school','Обсудить похожую задачу','custom']]){
  test(`confirmed delivery ${path}`,async({page})=>{
   status=204;const before=count;await page.goto(`http://127.0.0.1:3001${path}`);await page.getByRole('button',{name:label,exact:true}).first().click();await page.getByLabel('Ваше имя').fill('QA Test');await page.getByLabel('Компания').fill('Synthetic QA');await page.getByLabel('Email или телефон').fill(`${intent}@example.test`);await page.getByLabel('Что хотите изменить').fill('Synthetic test only');await page.locator('input[name=consent]').check();await page.getByRole('button',{name:'Отправить запрос'}).click();await expect(page.getByRole('dialog').getByRole('status')).toContainText('доставлен');expect(count).toBe(before+1);expect(received.intent).toBe('consultation');expect(received.context).toBe(intent);if(path.includes('/cases/'))expect(received.caseSlug).toBe(path.split('/').at(-1));if(intent==='saas')expect(received.productSlug).toBe('crm');
  });
 }
 test('three explorers → form → confirmed localhost receipt, then focus return',async({page})=>{
  await page.setViewportSize({width:390,height:844});status=204;
  for(const slug of ['b2b-wholesale','flooring-manufacturer','online-school']){
   await page.goto('http://127.0.0.1:3001/cases');const link=page.locator(`main a[href="/cases/${slug}"]`);const choice=page.locator("[data-case-selection] details").filter({has:page.locator(`a[href="/cases/${slug}"]`)});if(await choice.getAttribute("open")===null)await choice.locator("summary").click();await link.click();await page.getByRole('button',{name:'Обсудить похожую задачу'}).click();await page.getByLabel('Ваше имя').fill('B3 QA');await page.getByLabel('Email или телефон').fill('explorer@example.test');await page.getByRole('checkbox').check();const before=count;await page.getByRole('button',{name:'Отправить запрос'}).click();await expect(page.getByRole('dialog').getByRole('status')).toContainText('доставлен');expect(count).toBe(before+1);expect(received.caseSlug).toBe(slug);expect(received.context).toBe('custom');expect(received.consentReceipt).toMatchObject({version:consentVersion,sha256:consentHash,accepted:true});await page.keyboard.press('Escape');await expect(link).toBeFocused();await expect(page.locator('dialog[open]')).toHaveCount(0);
  }
 });
 test('actual upstream rejection is visible, never success',async({page})=>{
  status=500;await page.goto('http://127.0.0.1:3001/partners');await page.getByRole('button',{name:'Обсудить партнёрство'}).click();await page.getByLabel('Ваше имя').fill('QA Test');await page.getByLabel('Компания').fill('Synthetic QA');await page.getByLabel('Email или телефон').fill('failure@example.test');await page.getByLabel('Что хотите изменить').fill('Synthetic test only');await page.locator('input[name=consent]').check();await page.getByRole('button',{name:'Отправить запрос'}).click();await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Не удалось передать');await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);
 });
 test('optional fields, pending/double submit, timeout and successful retry use real localhost upstream',async({page})=>{
  await page.goto('http://127.0.0.1:3001/');await page.locator('#solution').getByRole('button',{name:'Обсудить задачу'}).click();await page.getByLabel('Ваше имя').fill('QA Test');await page.getByLabel('Email или телефон').fill('timeout-b@example.test');await page.locator('input[name=consent]').check();status=204;delay=9000;const before=count;await page.getByRole('button',{name:'Отправить запрос'}).click();await expect(page.getByRole('button',{name:'Отправляем…'})).toBeDisabled();await page.locator('dialog form').evaluate(e=>{(e as HTMLFormElement).requestSubmit();});await expect(page.getByRole('dialog').getByRole('alert')).toContainText('не ответил',{timeout:11000});expect(count).toBe(before+1);await expect(page.getByLabel('Ваше имя')).toHaveValue('QA Test');delay=0;await page.getByRole('button',{name:'Отправить запрос'}).click();await expect(page.getByRole('dialog').getByRole('status')).toContainText('доставлен');expect(received.company).toBe('');expect(received.message).toBe('');
 });

});

test.beforeEach(async({page})=>{await page.addInitScript(()=>{try{localStorage.setItem('tms:cookie-notice:v1','closed');}catch{}});});
