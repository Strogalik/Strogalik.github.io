import {type AnalyticsConfig,type AvailableConfig} from './profile';
export type Decision='granted'|'denied';
export type ChoiceRecord={schemaVersion:1;decision:Decision;profileDigest:string;consentVersion:string;consentHash:string;chosenAt:number;expiresAt:number};
export type ChoiceReason='missing'|'expired'|'invalid'|'profile-changed'|'current'|'operator-off';
export const retentionMs=180*24*60*60*1000;
export function makeChoice(decision:Decision,config:AvailableConfig,now:number):ChoiceRecord{return {schemaVersion:1,decision,profileDigest:config.profileDigest,consentVersion:config.profile.consentVersion,consentHash:config.profile.consentDocumentHash,chosenAt:now,expiresAt:now+retentionMs};}
export function parseChoice(raw:string|null,config:AnalyticsConfig,now:number):{record:ChoiceRecord|null;reason:ChoiceReason}{
 if(!config.enabled)return {record:null,reason:'operator-off'};
 if(!raw)return {record:null,reason:'missing'};
 try{const c=JSON.parse(raw);const keys=['schemaVersion','decision','profileDigest','consentVersion','consentHash','chosenAt','expiresAt'];
 if(!c||typeof c!=='object'||Object.keys(c).length!==keys.length||!keys.every(k=>Object.hasOwn(c,k))||c.schemaVersion!==1||!['granted','denied'].includes(c.decision)||!Number.isSafeInteger(c.chosenAt)||!Number.isSafeInteger(c.expiresAt)||c.chosenAt>now||c.chosenAt<0||c.expiresAt<=c.chosenAt||c.expiresAt-c.chosenAt>retentionMs)return {record:null,reason:'invalid'};
 if(c.profileDigest!==config.profileDigest||c.consentVersion!==config.profile.consentVersion||c.consentHash!==config.profile.consentDocumentHash)return {record:null,reason:'profile-changed'};
 if(c.expiresAt<=now)return {record:null,reason:'expired'};
 return {record:c,reason:'current'};
 }catch{return {record:null,reason:'invalid'};}
}
