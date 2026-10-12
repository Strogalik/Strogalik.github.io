import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {faqItems,faqIds} from '../components/faq-spotlight/content';
import {normalizeFaqQuery,searchFaq} from '../lib/faq-search';
import {allowDesignReview} from '../lib/design-review';
import source from '../content/stage-b.json';
test('B7 promoted FAQ keeps one source of four exact current FAQ texts and stable UI mapping',()=>{
 assert.deepEqual(faqItems.map(({question,answer})=>({question,answer})),source.faq.items);
 assert.deepEqual(faqItems.map(x=>x.id),faqIds);assert.equal(new Set(faqIds).size,4);
 assert.equal(readFileSync('components/site-v6/Home.tsx','utf8').includes('FaqSpotlight'),true);
});
test('B6 local aliases, significant terms, Unicode and honest no-result',()=>{
 const cases:[string,string[]][]=[['цена',['pricing']],['сколько стоит',['pricing']],['СТОИМОСТЬ',['pricing']],['кастом',['custom']],['нестандартно',['custom']],['CRM',['products']],['OMS',['products']],['срм',['products']],['отдельно',['products']],['по отдельности',['products']],['звонок',['meeting']],['демо',['meeting']],['на встрече',['meeting','pricing']],['настоящая система',['meeting']],['разработка',['custom']],['скидка 50%',[]],['гарантия выручки',[]],['интеграция SAP',[]],['здравствуйте',[]],['',[]],['   ',[]],['что',[]],['ＣＲＭ',['products']],['разберем',['meeting']],['разберём',['meeting']]];
 for(const[q,expected]of cases)assert.deepEqual(searchFaq(faqItems,q).map(x=>x.id),expected,q);
 assert.equal(normalizeFaqQuery(' Ё\u0301 / Е  '),'е е');
});
test('B6 review uses a separate flag and unchanged strict loopback guard',()=>{
 assert.equal(allowDesignReview(undefined,'localhost:3206',null),false);
 assert.equal(allowDesignReview('1','127.0.0.1:3206',null),true);
 for(const host of ['tmsasub.store','localhost.evil.test','127.0.0.1,evil.test'])assert.equal(allowDesignReview('1',host,null),false);
 assert.equal(allowDesignReview('1','localhost:3206','public.example.test'),false);
 const page=readFileSync('app/review/faq/page.tsx','utf8');assert.match(page,/allowDesignReview\(process.env.TMS_FAQ_REVIEW/);
 assert.doesNotMatch(readFileSync('app/sitemap.ts','utf8'),/review\/faq/);
});
