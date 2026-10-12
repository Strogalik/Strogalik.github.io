import Link from 'next/link';
import {pageMetadata} from '@/lib/seo';
import {InternalCases} from '@/components/site-v6/InternalCases';
import {InternalContact} from '@/components/site-v6/InternalViews';
import s from '@/components/site-v6/internal.module.css';
export const metadata=pageMetadata('Кейсы внедрения | TMS','Три обезличенных проекта: задачи, изменения процесса и границы результатов.','/cases');
export default function CasesPage(){return <main id="main" data-internal-page><section className={s.index}><div className={s.container}><nav className={s.breadcrumb} aria-label="Хлебные крошки"><Link href="/">Главная</Link><span aria-hidden="true">/</span><span>Практика TMS</span></nav><h1>Кейсы внедрения</h1><p className={s.intro}>Три обезличенных проекта: задача, изменение работы и результат с его условиями.</p><InternalCases/></div></section><InternalContact/></main>;}
