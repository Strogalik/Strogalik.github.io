import {spawn} from 'node:child_process';
import {mkdir,writeFile,open} from 'node:fs/promises';
await mkdir('qa/v5',{recursive:true});const results=[];
for(const [name,args] of [['lint',['run','lint']],['typecheck',['run','typecheck']],['unit',['run','test:unit']],['browser-final',['test']]]){const started=new Date().toISOString();const log=await open(`qa/v5/${name}.log`,'w');const code=await new Promise(resolve=>{const child=spawn('npm',args,{stdio:['ignore',log.fd,log.fd]});child.on('exit',resolve);});await log.close();results.push({name,command:`npm ${args.join(' ')}`,started,finished:new Date().toISOString(),exitCode:code,status:code===0?'PASS':'FAIL'});console.log(name,code);}
await writeFile('qa/v5/check-commands.json',JSON.stringify(results,null,2));process.exitCode=results.some(r=>r.exitCode!==0)?1:0;
