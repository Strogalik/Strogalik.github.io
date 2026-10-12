import {readdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
async function walk(root){const files=[];for(const e of await readdir(root,{withFileTypes:true})){const p=join(root,e.name);if(e.isDirectory())files.push(...await walk(p));else if(e.isFile())files.push(p);}return files;}
const surfaces=[...(await walk('.next/server/app')).filter(p=>p.endsWith('.html')),...await walk('.next/static'),...await walk('public')];
const forbidden=[/docs\.google\.com\/document\//,/drive\.google\.com\//,/private\/sources\//,/publicationApproved/,/TMS_CODEX_V[345]/,/references\/private\//,/LTV/,/400(?:[ \u00a0\u202f])?000\s*(?:₽|руб)/iu];const issues=[];
for(const path of surfaces){if(!/\.(html|js|json|css|txt)$/.test(path))continue;const data=await readFile(path,'utf8');for(const pattern of forbidden)if(pattern.test(data))issues.push({path,pattern:String(pattern)});}
const baseline=JSON.parse(await readFile('docs/source-integrity.json','utf8').catch(()=>'{"package-lock.json":null}'));
const protectedFiles=Object.keys(baseline);
const integrity=[];for(const path of protectedFiles){if(path.startsWith('public/fonts/') && await readFile(path).then(()=>false,()=>true)){const fallback=(await readFile('app/fonts.ts','utf8')).includes("@fontsource/inter/");integrity.push({path,missingFromCleanSource:true,pinnedNpmFallback:fallback});if(!fallback)issues.push({path,reason:'font missing without pinned fallback'});continue;}const hash=createHash('sha256').update(await readFile(path)).digest('hex');integrity.push({path,sha256:hash,baselineUnchanged:baseline[path] ? baseline[path]===hash : null});if(baseline[path]&&baseline[path]!==hash)issues.push({path,reason:'protected baseline changed'});}
const result={date:new Date().toISOString(),status:issues.length?'FAIL':'PASS',filesScanned:surfaces.length,issues,integrity};await writeFile('qa/v5/release-audit.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));process.exitCode=issues.length?1:0;
