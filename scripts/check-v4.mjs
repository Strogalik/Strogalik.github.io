import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
const results=[];
for(const [script,file] of [['lint','lint'],['typecheck','typecheck'],['test:unit','unit'],['test','browser-final']]){
 const started=new Date().toISOString();const child=spawn('npm',['run',script],{stdio:['ignore','pipe','pipe']});let output='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);const exitCode=await new Promise(resolve=>child.on('close',resolve));await writeFile(`qa/v4/${file}.log`,output);results.push({command:`npm run ${script}`,started,finished:new Date().toISOString(),exitCode,status:exitCode===0?'PASS':'FAIL'});console.log(results.at(-1));
}
await writeFile('qa/v4/check-commands.json',JSON.stringify(results,null,2));process.exitCode=results.some(r=>r.exitCode!==0)?1:0;
