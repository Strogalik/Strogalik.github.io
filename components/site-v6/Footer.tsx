import Link from 'next/link';
import type {ReactNode} from 'react';
import approved from '../review-v6/review.module.css';
import s from './footer.module.css';

export function PublicFooter({brand}:{brand:ReactNode}){
 return <footer className={s.footer} data-public-footer>
  <div className={approved.container}>
   <div className={s.grid}>
    <div className={s.brand} data-footer-brand>{brand}<p>Продажи и исполнение — с понятным<br className={approved.desktopBreak}/> следующим шагом для команды</p></div>
    <div className={s.group} data-footer-contacts><h2>Контакты</h2><div className={s.contacts}><a href="mailto:tmsasub@yandex.ru">tmsasub@yandex.ru</a><Link href="/">tmsasub.store</Link></div></div>
    <nav className={s.group} aria-label="Дополнительная навигация"><h2>Компания</h2><div className={s.links}><a href="/about">О компании</a><a href="/partners">Партнёрам</a><a href="/custom-development">Разработка</a></div></nav>
    <nav className={s.group} aria-label="Юридические документы"><h2>Документы</h2><div className={s.links}><a href="/privacy">Политика конфиденциальности</a><a href="/consent">Согласие на обработку данных</a><a href="/cookies">Политика cookies</a></div></nav>
   </div>
   <div className={s.legal} data-footer-legal><span>ООО «ТМС»</span><span>ИНН 6900030390</span></div>
  </div>
 </footer>;
}
