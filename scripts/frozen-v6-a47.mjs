import sharp from 'sharp';import {readFile,writeFile} from 'node:fs/promises';
const root='qa/v6-a47',rows=JSON.parse(await readFile(`${root}/geometry.json`)).geometry,results=[];
for(const r of rows)for(const open of [false,true]){
 const name=`${r.id}${open?'-open':''}-${r.width}.png`,top=Math.max(0,Math.ceil(r.workspace.y)),bottom=Math.min(r.height,Math.floor(r.workspace.bottom));
 if(bottom<=top)continue;
 const region={left:Math.max(0,Math.ceil(r.workspace.x)),top,width:Math.floor(r.workspace.width)-1,height:bottom-top};
 const a=await sharp(`${root}/before/${name}`).extract(region).raw().toBuffer(),b=await sharp(`${root}/screenshots/${name}`).extract(region).raw().toBuffer();let pixels=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])pixels++;
 results.push({width:r.width,topic:r.id,open,region,same:a.equals(b),differentChannels:pixels});
}
await writeFile(`${root}/frozen-pixels.json`,JSON.stringify({comparisons:results.length,identical:results.filter(r=>r.same).length,results},null,2));console.log({comparisons:results.length,identical:results.filter(r=>r.same).length});
