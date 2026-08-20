import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEpdDocument } from '../api/queries';
import { ConfirmActionButton, MoreActionsButton } from '../components/CommonActions';
import { Overlay } from '../components/Overlay';
import { DocStatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';

export function EplDetailsPage() {
  const { documentId = 'epl-2341' } = useParams();
  const navigate=useNavigate();
  const { data: doc } = useEpdDocument(documentId);
  const [checkOpen,setCheckOpen]=useState(false);
  const [errorOpen,setErrorOpen]=useState(false);
  const [historyOpen,setHistoryOpen]=useState(false);
  if (!doc) return null;
  const isError = doc.status === 'error';
  return (
    <div className="page detail-page document-page">
      <div className="detail-header">
        <div className="detail-header__title"><Link to="/epd" className="back-link">← ЭПД</Link><div className="detail-title-line"><h1>{doc.number}</h1><DocStatusPill status={doc.status}/></div><p>{doc.type} · {doc.tripNumber}</p></div>
        <div className="detail-header__actions"><button type="button" className="btn btn--secondary" onClick={()=>setCheckOpen(true)}>Проверить</button><ConfirmActionButton icon="signature" title="Подписать ЭПЛ?" description="Подпись должна выполняться через согласованный backend-механизм и фиксироваться в неизменяемом аудите." confirmLabel="Подписать" disabled={isError}>Подписать</ConfirmActionButton><MoreActionsButton title={`Действия · ${doc.number}`} actions={[{title:"Открыть связанный рейс",description:doc.tripNumber,icon:"truck",onClick:()=>navigate(`/trips/${doc.tripId}`)},{title:"История обмена Saby",description:"Попытки, статусы и ошибки",icon:"link",onClick:()=>setHistoryOpen(true)}]}/></div>
      </div>
      {isError && <div className="error-banner"><div className="error-banner__icon"><Icon name="warning"/></div><div><strong>Не удалось отправить документ</strong><span>Saby вернул ошибку валидации. Исправьте реквизиты и отправьте повторно.</span></div><button type="button" className="btn btn--secondary btn--compact" onClick={()=>setErrorOpen(true)}>Детали</button></div>}
      <section className="document-layout">
        <article className="panel document-sheet">
          <div className="document-sheet__header"><div><span className="eyebrow">Электронный путевой лист</span><h2>{doc.number}</h2></div><span className="document-version">Версия 3 · 18.08.2026</span></div>
          <div className="document-section"><h3>Рейс и задание</h3><div className="info-grid info-grid--doc"><div><span>Рейс</span><Link to={`/trips/${doc.tripId}`}>{doc.tripNumber}</Link></div><div><span>Контрагент</span><strong>{doc.counterparty}</strong></div><div><span>Маршрут</span><strong>Москва → Казань</strong></div><div><span>Срок действия</span><strong>18.08 · 08:00–23:59</strong></div></div></div>
          <div className="document-section"><h3>Водитель и транспорт</h3><div className="person-vehicle-grid"><div className="identity-card"><div className="entity-summary__icon"><Icon name="user"/></div><div><span>Водитель</span><strong>{doc.driver}</strong><small>Таб. № 1842</small></div></div><div className="identity-card"><div className="entity-summary__icon"><Icon name="car"/></div><div><span>Транспорт</span><strong>{doc.vehicle}</strong><small>Одометр 184 320 км</small></div></div></div></div>
          <div className="document-section"><h3>Контроль допуска</h3><div className="checklist-grid"><div className="check-card is-done"><Icon name="check"/><div><span>Медосмотр</span><strong>Пройден</strong><small>07:54 · А. Смирнова</small></div></div><div className="check-card is-done"><Icon name="check"/><div><span>Технический контроль</span><strong>Пройден</strong><small>08:01 · М. Орлов</small></div></div><div className="check-card is-pending"><Icon name="clock"/><div><span>Подпись водителя</span><strong>Ожидается</strong><small>1 из 2 подписей</small></div></div><div className="check-card"><Icon name="route"/><div><span>Выпуск на линию</span><strong>08:47</strong><small>Рейс начат</small></div></div></div></div>
        </article>
        <aside className="document-side">
          <article className="panel readiness-card"><span className="eyebrow">Готовность</span><div className="readiness-score"><strong>{isError?'72':'86'}%</strong><span>документ заполнен</span></div><div className="readiness-progress"><i style={{width:isError?'72%':'86%'}}/></div><ul><li className="done"><Icon name="check"/>Рейс и маршрут</li><li className="done"><Icon name="check"/>Водитель и ТС</li><li className="done"><Icon name="check"/>Медосмотр</li><li className="done"><Icon name="check"/>Техконтроль</li><li><Icon name="clock"/>Подпись водителя</li></ul></article>
          <article className="panel saby-card"><div className="panel__header"><div><span className="eyebrow">Saby</span><h2>Обмен</h2></div><span className={`integration-light ${isError?'is-error':'is-idle'}`}/></div><div className="saby-info"><div><span>Внешний ID</span><strong>{isError?'SBY-99102':'—'}</strong></div><div><span>Последняя попытка</span><strong>{isError?'09:04':'—'}</strong></div><div><span>Попыток</span><strong>{isError?'2':'0'}</strong></div></div><button type="button" className="btn btn--secondary btn--full" onClick={()=>setHistoryOpen(true)}>История обмена</button></article>
        </aside>
      </section>
      <div className="mobile-sticky-action"><ConfirmActionButton className="btn btn--primary btn--full" icon="signature" title="Подписать ЭПЛ?" description="Подпись будет выполнена через backend-сценарий. Frontend не хранит ключи КЭП." confirmLabel="Подписать" disabled={isError}>Подписать документ</ConfirmActionButton></div>

      <Overlay open={checkOpen} onClose={()=>setCheckOpen(false)} title="Проверка готовности" description="Перед подписью пользователь видит только те пункты, которые влияют на возможность отправки." kicker="Валидация" size="sm"><div className="validation-list"><span className="is-ok"><Icon name="check"/>Рейс и маршрут заполнены</span><span className="is-ok"><Icon name="check"/>Водитель и транспорт определены</span><span className="is-ok"><Icon name="check"/>Медицинская отметка есть</span><span className="is-ok"><Icon name="check"/>Технический контроль есть</span><span className={isError?'is-bad':'is-warn'}><Icon name={isError?'warning':'clock'}/>{isError?'Есть ошибка обмена Saby':'Ожидается подпись водителя'}</span></div></Overlay>
      <Overlay open={errorOpen} onClose={()=>setErrorOpen(false)} title="Ошибка интеграции" description="Показываем безопасное описание без токенов, секретов и внутренних stack trace." kicker="Saby" size="sm"><div className="integration-error-details"><span><b>Операция</b><strong>Отправка ЭПЛ</strong></span><span><b>Внешний ID</b><strong>SBY-99102</strong></span><span><b>Попытка</b><strong>2</strong></span><span><b>Причина</b><strong>Не заполнен обязательный реквизит титула</strong></span></div></Overlay>
      <Overlay open={historyOpen} onClose={()=>setHistoryOpen(false)} title="История обмена" description="Очередь интеграции сохраняет попытки и результат каждой операции." kicker="Saby" presentation="sheet"><div className="event-list"><div><span className="event-time">09:04</span><i className="event-dot is-current"/><div><strong>Ошибка валидации</strong><span>Попытка 2 · SBY-99102</span></div></div><div><span className="event-time">09:02</span><i className="event-dot is-done"/><div><strong>Документ поставлен в очередь</strong><span>Система</span></div></div></div></Overlay>
    </div>
  );
}
