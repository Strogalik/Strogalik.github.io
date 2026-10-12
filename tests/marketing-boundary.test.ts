import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
function files(path:string):string[]{return readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(path,e.name)):[join(path,e.name)]);}
test('marketing import graph never reaches operational demo code or seed',()=>{
 const visited=new Set<string>();function visit(file:string){if(visited.has(file))return;visited.add(file);if(!/\.tsx?$/.test(file))return;const source=readFileSync(file,'utf8');for(const match of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)){const path=match[1].startsWith('@/')?match[1].slice(2):match[1].startsWith('.')?join(dirname(file),match[1]):null;if(!path)continue;const resolved=[path,path+'.tsx',path+'.ts',path+'.json'].find(existsSync);if(resolved)visit(resolved);}}
 files('app/(marketing)').filter(f=>f.endsWith('.tsx')).forEach(visit);
 for(const path of visited)assert.ok(!/(components\/(Demo|CaseDemo|DemoWorkspace|DemoSession|DemoShell)\.tsx|lib\/(demo-state|case-demo)|demo\.seed\.json)/.test(path),path);
 // Stage B replaces the V5 static illustration; preserve the operational-code boundary.
 assert.ok(visited.has('components/site-v6/HeroStory.tsx'));
 for(const path of visited)assert.ok(!/(ReviewBench|useHeroGlass|GlassDiagnostics)/.test(path),path);
});
