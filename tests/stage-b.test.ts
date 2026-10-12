import {consentVersion} from '../lib/consent';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {conversionScenario,timeScenario} from '../lib/calculator-extension';
import {leadSchema} from '../lib/validation';import {handleLead} from '../lib/lead-handler';
const v={intent:'consultation',name:'QA Test',contact:'qa@example.test',consent:true,consentVersion};
test('consultation optional fields, required contact/consent, allowlisted context and unchanged legacy requirements',()=>{
 const p=leadSchema.parse(v);assert.equal(p.company,'');assert.equal(p.message,'');
 for(const patch of [{productSlug:'brm'},{caseSlug:'fake'},{context:'unknown'},{name:''},{contact:'bad'},{consent:false},{company:'x'.repeat(161)},{message:'x'.repeat(2001)}])assert.equal(leadSchema.safeParse({...v,...patch}).success,false);
 for(const intent of ['saas','custom','partner','builder_interest'])assert.equal(leadSchema.safeParse({...v,intent}).success,false);
 for(const context of ['saas','custom','partner'])assert.equal(leadSchema.safeParse({...v,context}).success,true);
});
test('consultation cannot bypass delivery, origin, honeypot, rate or token redirect protection',async()=>{
 const req=(payload=v,headers={})=>new Request('http://localhost/api/lead',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(payload)});
 assert.equal((await handleLead(req(),{})).status,503);
 assert.equal((await handleLead(req(v,{origin:'https://evil.test'}),{})).status,403);
 assert.equal((await handleLead(req({...v,website:'spam'} as typeof v),{})).status,400);
 assert.equal((await handleLead(req(),{rateLimit:()=>false})).status,429);
 let sent:Record<string,unknown>={};const response=await handleLead(req(),{legalApproved:true,webhookUrl:'http://localhost/only-test',token:'synthetic-only',fetcher:async(_,init)=>{assert.equal(init?.redirect,'error');sent=JSON.parse(String(init?.body));return new Response(null,{status:204});}});
 assert.equal(response.status,200);assert.equal(sent.intent,'consultation');assert.equal(sent.company,'');assert.equal(sent.message,'');
});
test('scenario extensions preserve negative, zero, fractions, comma and optional semantics',()=>{
 assert.equal(conversionScenario('400','10','12','50000').deltaRevenue,400000);
 assert.equal(conversionScenario('400','12','10','50000').deltaRevenue,-400000);
 assert.equal(conversionScenario('3','10','20','1000').deltaRevenue,300);
 assert.equal(conversionScenario('0','0','100','1000').deltaRevenue,0);
 assert.equal(conversionScenario('3,5','10','20').deltaRevenue,undefined);
 assert.deepEqual(timeScenario('5','30','22','50','1000'),{currentHours:55,possibleReleasedHours:27.5,timeResourceValue:27500});
 assert.deepEqual(timeScenario('0','30','22','50','1000'),{currentHours:0,possibleReleasedHours:0,timeResourceValue:0});
 assert.deepEqual(timeScenario('2,5','12','20','0','1000'),{currentHours:10,possibleReleasedHours:0,timeResourceValue:0});
 assert.equal(timeScenario('5','30','22','','1000').timeResourceValue,undefined);
 for(const bad of ['','-1','Infinity','text'])assert.throws(()=>conversionScenario(bad,'10','20'));
 assert.throws(()=>timeScenario('5','30','22','101'));assert.throws(()=>conversionScenario('1e300','1','2','1e300'));assert.throws(()=>timeScenario('5','30','22','50','1e308'));
});
