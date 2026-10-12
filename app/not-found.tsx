import Link from 'next/link';
import {SiteShell} from '@/components/site-v6/SiteShell';
import {PageHero} from '@/components/site-v6/Sections';
import s from '@/components/site-v6/sections.module.css';
import a from '@/components/review-v6/review.module.css';
export default function NotFound(){return <SiteShell><main id="main"><PageHero label="Ошибка 404" title="Страница не найдена" body="Вернитесь на главную — там собраны продукты и способы работы с TMS."><div className={s.actions}><Link href="/" className={`${a.button} ${a.primary}`}>На главную</Link></div></PageHero></main></SiteShell>;}
