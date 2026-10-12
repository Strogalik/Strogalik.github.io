import {notFound} from 'next/navigation';
import {products,findProduct} from '@/content/products';
import {cases} from '@/content/cases';
import {pageMetadata} from '@/lib/seo';
import {Action} from '@/components/site-v6/Consultation';
import {InternalHero,InternalSection,CaseSpotlight,InternalContact} from '@/components/site-v6/InternalViews';
import {InternalTopics} from '@/components/site-v6/InternalTopics';
import s from '@/components/site-v6/internal.module.css';
export function generateStaticParams(){return products.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const p=findProduct((await params).slug);return p?pageMetadata(p.seo.title,p.description,p.detailHref):{};}
const explanations={
 crm:['Обращения и история клиента собраны в одном контексте. Команда видит, с чего начался разговор.','Договорённости остаются рядом со сделкой. Руководителю понятно, на каком этапе находится продажа.','Менеджеру понятно, что делать дальше и кто продолжает контакт с клиентом.'],
 oms:['Заказ и его условия доступны команде, которая организует исполнение.','Работа связана с задачами, сроками и исполнителями. Ответственность не остаётся в переписке.','Команда видит состояние заказа и работу, которую нужно выполнить.'],
 'crm-oms':['История клиента и согласованные условия остаются в общем контексте.','Коммерческий и операционный этапы связаны: продажа продолжается работой над заказом.','Исполнение сохраняет историю продажи. CRM и OMS отвечают за разные участки одного процесса.'],
};
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const p=findProduct((await params).slug);if(!p)notFound();const slug=p.slug as 'crm'|'oms'|'crm-oms';const related=cases.find(c=>c.slug===(slug==='crm'?'b2b-wholesale':'flooring-manufacturer'))!;
 return <main id="main" data-internal-page><InternalHero label={`${p.name} · по подписке`} title={p.title} body={p.description}><div className={s.actions}><Action options={{context:'saas',productSlug:slug}}/><a className={s.link} href="#process">Как устроена работа</a></div><p className={s.note}>На встрече покажем реальную систему. Стоимость и состав решения обсуждаем под вашу задачу.</p></InternalHero><InternalSection id="process" kicker={p.eyebrow} title={p.pain.replace(/\.$/,'')} body={p.forWhom}><InternalTopics items={p.workflow.map((heading,i)=>({heading,body:<p>{explanations[slug][i]}</p>}))}/><p>{p.connectedValue}</p><p className={s.notice}>Готовые CRM и OMS доступны по подписке. Расширения и интеграции согласуются отдельно; индивидуальная разработка — отдельное направление.</p></InternalSection><section className={s.caseSection}><div className={s.container}><h2>Похожая задача в проекте</h2><CaseSpotlight item={related}/></div></section><InternalContact/></main>;
}
