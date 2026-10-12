import test from 'node:test';import assert from 'node:assert/strict';
import vectors from './b9/math-vectors.json';
import{conversionScenario,timeScenario}from'../lib/calculator-extension';
for(const v of vectors)test(`B9 supplied math: ${v.id}`,()=>{const fn=v.fn==='conversionScenario'?conversionScenario:timeScenario;const run=()=>fn(v.args[0],v.args[1],v.args[2],v.args[3],v.args[4]) as Record<string,number|undefined>;if(v.throws){assert.throws(run);return;}const got=run();for(const[k,value]of Object.entries(v.expected??{})){assert.ok(typeof got[k]==='number'&&Math.abs(got[k]!-value!)<1e-9,`${v.id} ${k}`);}for(const k of v.absent??[])assert.equal(got[k],undefined);});
