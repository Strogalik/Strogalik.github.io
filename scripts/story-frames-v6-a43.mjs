import {chromium} from 'playwright';import {mkdir} from 'node:fs/promises';
const b=await chromium.launch();await mkdir('qa/v6-a43/frames',{recursive:true});
for(const width of [1920,390]){
 const p=await b.newPage({viewport:{width,height:width===1920?1080:844}});await p.clock.install({time:new Date("2026-01-01T00:00:00Z")});await p.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));await p.goto('http://127.0.0.1:3200/review/v6');await p.evaluate(()=>document.fonts.ready);
 for(let phase=0;phase<4;phase++){
  await p.clock.runFor(phase===0?450:1050);
  await p.screenshot({path:`qa/v6-a43/frames/hero-${width}-step-${phase+1}.png`});
  await p.locator('[data-v6-story]').screenshot({path:`qa/v6-a43/frames/story-${width}-step-${phase+1}.png`});
 }
 await p.close();
}
await b.close();console.log('Four timed Hero phases captured at 1920 and 390 CSS px.');
