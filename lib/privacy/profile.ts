// Proposed adapter only. Configuration is selected and approved on the server.
export const analyticsChoiceKey='tms:analytics-choice:v1';
export const analyticsConsentVersion='2026-10-11-b5-metrica';
export const analyticsConsentHash='76e8e4caf42cc04a9cd78db0494421e41ad0815964834aaba05f1769a693a955';
export const features={defer:true,webvisor:false,clickmap:false,trackLinks:false,accurateTrackBounce:false,ecommerce:false,trackHash:false,childIframe:false,disableYtm:true,sendTitle:false} as const;
export const providerProfile={
 provider:'yandex_metrica',label:'Яндекс Метрика',profileVersion:'b5-metrica-basic-v1',
 recipient:'ООО «ЯНДЕКС»',address:'г. Москва, ул. Льва Толстого, д. 16',
 termsUrl:'https://yandex.ru/legal/metrica_termsofuse/ru/',privacyUrl:'https://yandex.ru/legal/confidential/ru/',storageUrl:'https://yandex.ru/support/metrica/ru/general/cookie-usage',
 dataCategories:['IP и технические сведения запроса','Идентификаторы браузера и устройства','Просмотры публичных путей без query/hash'],
 consentVersion:analyticsConsentVersion,consentDocumentHash:analyticsConsentHash,choiceRetentionDays:180,features,
} as const;
export type AvailableConfig={provider:'yandex_metrica';enabled:true;operatorApproved:true;counterId:string;profileDigest:string;profile:typeof providerProfile};
export type OffConfig={provider:'none';enabled:false;operatorApproved:false;counterId:null;profileDigest:null;profile:null};
export type AnalyticsConfig=OffConfig|AvailableConfig;
export const analyticsOff:OffConfig={provider:'none',enabled:false,operatorApproved:false,counterId:null,profileDigest:null,profile:null};
export const publicPaths=['/','/products/crm','/products/oms','/products/crm-oms','/cases','/cases/b2b-wholesale','/cases/flooring-manufacturer','/cases/online-school','/custom-development','/about','/partners','/privacy','/consent','/cookies','/analytics-consent'] as const;
export function safePagePath(input:string):string|null{
 // Only fixed paths, never a user-provided slug, origin, search or fragment.
 const path=input.split(/[?#]/,1)[0];return (publicPaths as readonly string[]).includes(path)?path:null;
}
export function safeReferrer(input:string):string{try{const u=new URL(input);return ['http:','https:'].includes(u.protocol)?u.origin:'';}catch{return '';}}
export function readPublicConfig(value:unknown):AnalyticsConfig{
 if(!value||typeof value!=='object')return analyticsOff;
 const c=value as Partial<AvailableConfig>;
 if(c.provider!=='yandex_metrica'||c.enabled!==true||c.operatorApproved!==true||typeof c.counterId!=='string'||!/^\d{1,12}$/.test(c.counterId)||Number(c.counterId)<=0||typeof c.profileDigest!=='string'||!/^[a-f0-9]{64}$/.test(c.profileDigest)||JSON.stringify(c.profile)!==JSON.stringify(providerProfile))return analyticsOff;
 return {provider:c.provider,enabled:true,operatorApproved:true,counterId:c.counterId,profileDigest:c.profileDigest,profile:providerProfile};
}
