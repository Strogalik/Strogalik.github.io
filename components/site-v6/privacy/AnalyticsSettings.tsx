'use client';
import Link from 'next/link';
import copy from '@/content/legal/privacy-ui.json';
import {usePrivacy} from './PrivacyProvider';
import s from './privacy.module.css';
export function AnalyticsSettings(){
 const {state,choose}=usePrivacy();const {config}=state;
 const status=!config.enabled?copy.settings.offStatus:state.decision==='granted'?copy.settings.grantedStatus:state.decision==='denied'?copy.settings.deniedStatus:copy.settings.unknownStatus;
 return <section id="analytics-settings" className={s.settings} aria-labelledby="analytics-settings-title" data-analytics-settings><h2 id="analytics-settings-title">{copy.settings.title}</h2><p role="status" data-analytics-status>{status}</p>
 {config.enabled&&<><p>Сервис: {config.profile.label}. Получатель: {config.profile.recipient}, {config.profile.address}.</p><p>Технические сведения о браузере, устройстве и просмотрах публичных страниц. Вебвизор, реклама и передача данных обращения отключены.</p><p>Выбор хранится не более 180 дней. Это срок настройки в браузере, не срок хранения заявок.</p><p>По документации сервиса: _ym_uid — 1 год, _ym_metrika_enabled — 60 минут, _ym_isad — 20 часов. Фактический состав зависит от профиля.</p><nav className={s.links} aria-label="Документы аналитического сервиса"><a href={config.profile.termsUrl} target="_blank" rel="noopener noreferrer">Условия сервиса (новая вкладка)</a><a href={config.profile.privacyUrl} target="_blank" rel="noopener noreferrer">Политика сервиса (новая вкладка)</a><a href={config.profile.storageUrl} target="_blank" rel="noopener noreferrer">Файлы хранения и сроки (новая вкладка)</a></nav>
 {state.hydrated&&<div className={s.actions}><button type="button" onClick={()=>void choose('denied')}>{state.decision==='granted'?'Отозвать разрешение':copy.available.deny}</button><button type="button" disabled={state.checking} onClick={()=>void choose('granted')}>{state.checking?'Проверяем настройки…':copy.available.allow}</button></div>}
 {state.decision==='granted'&&<p data-analytics-runtime role="status">{state.runtime==='failed'?copy.settings.failedTag:state.runtime==='ready'?'Счётчик инициализирован для разрешённого профиля.':state.runtime==='loading'?'Загрузка счётчика…':'Отправка статистики приостановлена.'}</p>}
 {['expired','invalid','profile-changed'].includes(state.reason)&&<p>Прежний выбор истёк или не соответствует текущим условиям. Для аналитики нужен новый отдельный выбор.</p>}
 {state.memoryOnly&&<p>Хранилище браузера недоступно. Выбор действует только в этом открытом сеансе.</p>}
 </>}
 <p><Link href="/analytics-consent">{copy.settings.consentLink}</Link></p><noscript><p>Без JavaScript аналитика не загружается. Документы и контакты доступны; для изменения настройки нужен JavaScript.</p></noscript></section>;
}
