import {utmKeys} from './constants';
/** Read only the current URL, only at explicit submission. Never stores attribution. */
export function currentUTM(search:string):Record<string,string>{const params=new URLSearchParams(search);return Object.fromEntries(utmKeys.flatMap(key=>{const raw=params.get(key);return raw===null?[]:[[key,raw.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,200)]];}));}
