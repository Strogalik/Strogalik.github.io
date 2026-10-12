import {conversion,manualWork,numeric} from './calculator';
const optional=(raw:string,max=Infinity)=>raw.trim()?numeric(raw,max):undefined;
function finite(value:number){if(!Number.isFinite(value))throw new Error('Значения слишком велики для расчёта');return value;}
export function conversionScenario(requests:string,baseRate:string,scenarioRate:string,averageDealValue=''){
 const base=conversion(numeric(requests),numeric(baseRate,100),numeric(scenarioRate,100));
 const average=optional(averageDealValue);
 return {...base,deltaRevenue:average===undefined?undefined:finite(base.deltaDeals*average)};
}
export function timeScenario(people:string,minutes:string,days:string,automationSharePercent='',hourValue=''){
 const currentHours=manualWork(numeric(people),numeric(minutes),numeric(days));
 const share=optional(automationSharePercent,100),value=optional(hourValue);
 const possibleReleasedHours=share===undefined?undefined:finite(currentHours*(share/100));
 return {currentHours,possibleReleasedHours,timeResourceValue:possibleReleasedHours===undefined||value===undefined?undefined:finite(possibleReleasedHours*value)};
}
