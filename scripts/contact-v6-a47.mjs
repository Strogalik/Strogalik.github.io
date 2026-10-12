import sharp from 'sharp';import{mkdir}from'node:fs/promises';
const root='qa/v6-a47';await mkdir(`${root}/contacts`,{recursive:true});
const topics=['crm-history','crm-next-step','oms-continuity','oms-responsibility','custom-process','custom-solution'];
for(const width of [1920,1728,1440,1121,1120,1024,901,900,430,390,360,320]){
 const tileWidth=width>900?640:390,tiles=[];let maxHeight=0;
 for(const id of topics){const source=`${root}/screenshots/${id}${[390,430].includes(width)?'-full-open':''}-${width}.png`;const image=await sharp(source).resize({width:tileWidth}).png().toBuffer(),meta=await sharp(image).metadata();tiles.push({input:image,width:tileWidth,height:meta.height});maxHeight=Math.max(maxHeight,meta.height);}
 await sharp({create:{width:tileWidth*3,height:maxHeight*2+64,channels:3,background:'#dce6f0'}}).composite(tiles.map((t,i)=>({input:t.input,left:i%3*tileWidth,top:Math.floor(i/3)*(maxHeight+32)}))).png().toFile(`${root}/contacts/topics-${width}.png`);
}
