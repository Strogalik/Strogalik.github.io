import { z } from 'zod';
import {topicIds} from './consent';
import { utmKeys } from './constants';
const legacyBase = z.object({
  intent: z.enum(['saas','custom','partner','builder_interest']),
  productSlug: z.enum(['crm','oms','crm-oms']).optional(),
  caseSlug: z.enum(['b2b-wholesale','flooring-manufacturer','online-school']).optional(),
  name: z.string().trim().min(2, 'Укажите имя — минимум 2 символа').max(100, 'Не более 100 символов'),
  company: z.string().trim().min(2, 'Укажите компанию').max(160, 'Не более 160 символов'),
  contact: z.string().trim().max(160).refine(value =>
    z.email().safeParse(value).success || (/^\+?[\d\s()\-]+$/.test(value) && value.replace(/\D/g, '').length >= 10 && value.replace(/\D/g, '').length <= 15),
  'Укажите корректный email или телефон с кодом страны'),
  message: z.string().trim().min(5, 'Опишите задачу — минимум 5 символов').max(2000, 'Не более 2000 символов'),
  website: z.string().max(200).optional().default(''),
  consentVersion:z.string().max(80),
  topicId:z.enum(topicIds).optional(),
  consent: z.literal(true, { error: 'Нужно согласие на обработку заявки' }),
  context: z.enum(['','saas','custom','partner','builder_interest']).optional().default(''),
  page: z.string().max(300).regex(/^\/(?!\/)[^?#]*$/, 'Ожидается путь страницы без параметров').optional().default('/'),
  utm: z.object(Object.fromEntries(utmKeys.map(key => [key, z.string().max(200).optional()]))).optional(),
});
const legacyLeadSchema=legacyBase.superRefine((value, ctx) => {
  if (value.productSlug && value.intent !== 'saas') ctx.addIssue({code:'custom',path:['productSlug'],message:'Продукт допустим только для подключения SaaS'});
  if (value.caseSlug && value.intent !== 'custom') ctx.addIssue({code:'custom',path:['caseSlug'],message:'Кейс допустим только для индивидуальной задачи'});
});
const consultationSchema=legacyBase.extend({
  intent:z.literal('consultation'),
  company:z.string().trim().max(160,'Не более 160 символов').optional().default(''),
  message:z.string().trim().max(2000,'Не более 2000 символов').optional().default(''),
  context:z.enum(['','consultation','saas','custom','partner','builder_interest']).optional().default('consultation'),
}).superRefine((value,ctx)=>{if(value.topicId){const product=value.topicId.split('-')[0];if(product==='custom'?value.context!=='custom'||!!value.productSlug:value.context!=='saas'||value.productSlug!==product)ctx.addIssue({code:'custom',path:['topicId'],message:'Тема не соответствует направлению'});}});
export const leadSchema=z.discriminatedUnion('intent',[legacyLeadSchema,consultationSchema]);
export type Lead = z.infer<typeof leadSchema>;
