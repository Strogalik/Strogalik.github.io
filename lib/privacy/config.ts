// Node-only builder; never import this module into a client component.
import {createHash} from 'node:crypto';
import {analyticsOff,providerProfile,type AnalyticsConfig} from './profile';
export function profileDigest(counterId:string){return createHash('sha256').update(JSON.stringify({counterId,...providerProfile})).digest('hex');}
export function buildAnalyticsConfig(env:Readonly<Record<string,string|undefined>>):AnalyticsConfig{
 const id=env.TMS_METRIKA_ID;
 if(env.TMS_ANALYTICS_PROVIDER!=='yandex_metrica'||env.TMS_ANALYTICS_ENABLED!=='true'||env.TMS_ANALYTICS_OPERATOR_APPROVED!=='true'||env.TMS_ANALYTICS_PROFILE_REVIEWED!=='true'||!id||!/^\d{1,12}$/.test(id)||Number(id)<=0)return analyticsOff;
 const digest=profileDigest(id);
 if(env.TMS_ANALYTICS_REVIEWED_PROFILE_DIGEST!==digest)return analyticsOff;
 return {provider:'yandex_metrica',enabled:true,operatorApproved:true,counterId:id,profileDigest:digest,profile:providerProfile};
}
