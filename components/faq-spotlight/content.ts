import source from '@/content/stage-b.json';
import metadata from './metadata.json';
export const faqIds=['products','custom','pricing','meeting'] as const;
export type FaqId=typeof faqIds[number];
// The existing public FAQ remains the single source of the four exact Q/A.
export const faqItems=faqIds.map((id,index)=>({id,label:metadata.items[index].label,searchAliases:metadata.items[index].searchAliases,...source.faq.items[index]}));
export {metadata as faqCopy};
