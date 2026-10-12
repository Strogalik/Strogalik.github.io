import {consentVersion} from '../lib/consent';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { leadSchema } from '../lib/validation';
import { handleLead } from '../lib/lead-handler';
import { createRateLimiter } from '../lib/rate-limit';
import { numeric, conversion, manualWork } from '../lib/calculator';
import { cases } from '../content/cases';
const valid = { intent:'saas', productSlug:'crm', name:'QA Test', company:'Synthetic QA', contact:'qa@example.test', message:'Synthetic test only', consent:true,consentVersion, website:'', context:'saas', page:'/', utm:{utm_source:'qa'} };
const request = (payload: unknown = valid, headers: Record<string,string> = {}) => new Request('http://localhost/api/lead',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(payload)});
test('calculator: positive, negative, fractions, zero and units',()=>{
 assert.deepEqual(conversion(400,10,12),{baseDeals:40,scenarioDeals:48,deltaDeals:8,deltaPercentagePoints:2});
 assert.equal(conversion(400,12,10).deltaDeals,-8);assert.equal(conversion(400,12,10).deltaPercentagePoints,-2);
 assert.equal(conversion(3,10,20).baseDeals,.3);assert.equal(conversion(0,0,0).deltaDeals,0);
 assert.equal(manualWork(5,30,22),55);assert.equal(manualWork(0,30,22),0);
 for(const bad of ['','abc','Infinity','-1']) assert.throws(()=>numeric(bad));
 assert.throws(()=>conversion(10,101,20));assert.throws(()=>manualWork(Infinity,1,1));assert.throws(()=>manualWork(1e308,1e308,1));
});
test('three source cases retain facts and caveats',()=>{
 assert.deepEqual(cases.map(c=>c.slug),['b2b-wholesale','flooring-manufacturer','online-school']);
 assert.equal(cases[2].primaryMetric.period,null);
 assert.ok(!JSON.stringify(cases).match(/LTV|400000|400 000|288|144×/));
 for(const c of cases){assert.ok(c.work.length);assert.ok(c.measurementNote);assert.ok(c.disclaimer);assert.ok(!('publicationApproved' in c));}
});
test('server validates four intents, context and field lengths',async()=>{
 for(const intent of ['saas','custom','partner','builder_interest']) assert.equal(leadSchema.safeParse({...valid,intent,context:intent,productSlug:undefined}).success,true);
 for(const patch of [{intent:'other'},{productSlug:'brm'},{caseSlug:'missing'},{context:'untrusted'},{contact:'bad'},{name:'a'},{message:'x'.repeat(2001)},{company:'x'.repeat(161)},{intent:'partner',productSlug:'crm'}]) assert.equal((await handleLead(request({...valid,...patch}),{})).status,400);
});
test('honeypot, origin, content type, oversized and invalid JSON',async()=>{
 assert.equal((await handleLead(request({...valid,website:'spam'}),{})).status,400);
 assert.equal((await handleLead(request(valid,{Origin:'https://other.example'}),{})).status,403);
 assert.equal((await handleLead(request(valid,{'Content-Type':'text/plain'}),{})).status,415);
 assert.equal((await handleLead(request({...valid,message:'x'.repeat(17000)}),{})).status,413);
 assert.equal((await handleLead(new Request('http://localhost/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:'bad'}),{})).status,400);
});
test('local real HTTP upstream: success, 4xx, 5xx, timeout, absent endpoint, missing config',async()=>{
 const received: Record<string,unknown>[]=[];
 const server=createServer(async(req,res)=>{
   let body='';for await(const chunk of req) body+=chunk;
   if(req.url==='/ok'){received.push(JSON.parse(body));res.writeHead(204);res.end();}
   else if(req.url==='/slow'){setTimeout(()=>{res.writeHead(204);res.end();},100);}
   else {res.writeHead(req.url==='/400'?400:500);res.end('upstream failure');}
 });server.listen(0,'127.0.0.1');await once(server,'listening');const port=(server.address() as {port:number}).port;
 try{
  for(const intent of ['saas','custom','partner','builder_interest']){
   const payload={...valid,intent,context:intent,productSlug:intent==='saas'?'oms':undefined,caseSlug:intent==='custom'?'b2b-wholesale':undefined};
   const r=await handleLead(request(payload),{legalApproved:true,webhookUrl:`http://127.0.0.1:${port}/ok`});assert.equal(r.status,200);assert.equal((await r.json()).ok,true);
   assert.equal(received.at(-1)?.intent,intent);assert.deepEqual(received.at(-1)?.utm,valid.utm);assert.equal(received.at(-1)?.website,undefined);
  }
  for(const path of ['/400','/500','/slow']){const r=await handleLead(request(),{legalApproved:true,webhookUrl:`http://127.0.0.1:${port}${path}`,timeoutMs:30});assert.equal(r.status,502);assert.equal((await r.json()).ok,false);}
  assert.equal((await handleLead(request(),{legalApproved:true,webhookUrl:'http://127.0.0.1:1/unavailable'})).status,502);
  assert.equal((await handleLead(request(),{})).status,503);
  assert.equal((await handleLead(request(),{webhookUrl:`http://127.0.0.1:${port}/ok`,legalApproved:false})).status,503);
  assert.equal((await handleLead(request(),{legalApproved:true,webhookUrl:'http://remote.example'})).status,503);
 }finally{server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
test('rate limiter stops repeats, resets after window, and handler returns 429',async()=>{
 let time=0;const limiter=createRateLimiter(()=>time);for(let i=0;i<5;i++)assert.equal(limiter('qa@example.test'),true);assert.equal(limiter('qa@example.test'),false);time=600001;assert.equal(limiter('qa@example.test'),true);
 assert.equal((await handleLead(request(),{rateLimit:()=>false,webhookUrl:'http://127.0.0.1:1'})).status,429);
});
