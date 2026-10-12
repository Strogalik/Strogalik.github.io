// Lossless crops of the fresh before/after screenshots; no generated pixels.
// Insets follow the unchanged Hero geometry, checked against both audit records.
import sharp from 'sharp';import{readFile,mkdir}from'node:fs/promises';
const root='qa/v6-a46';await mkdir(`${root}/messages`,{recursive:true});
for(const [folder,label]of [['before-sdk','before'],['sdk','after']]){
 const audit=JSON.parse(await readFile(`${root}/${folder}/audit.json`));
 for(const width of [1920,1728,1440,430,390])for(const mode of ['css','sdk']){
  const boxes=audit.comparisons.find(r=>r.width===width).modes[mode].boxes;
  for(const [i,name]of ['incoming','outgoing'].entries()){
   const left=Math.floor((width<500?17:31)+boxes[i].x-boxes[0].x)-3,top=Math.floor((width<500?69:101)+boxes[i].y-boxes[0].y)-3;
   await sharp(`${root}/${folder}/${mode}-story-${width}.png`).extract({left,top,width:Math.ceil(boxes[i].width)+6,height:Math.ceil(boxes[i].height)+6}).png().toFile(`${root}/messages/${label}-${mode}-${name}-${width}.png`);
  }
 }
}
