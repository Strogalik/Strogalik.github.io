import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEdoDocument } from '../api/queries';
import { ConfirmActionButton, ExportButton, MoreActionsButton } from '../components/CommonActions';
import { Icon } from '../components/Icon';

const money = (value:number) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';

export function EdoDetailsPage() {
  const { documentId = 'edo-251' } = useParams();
  const navigate=useNavigate();
  const { data: doc } = useEdoDocument(documentId);
  if (!doc) return null;
  return (
    <div className="page detail-page">
      <div className="detail-header"><div className="detail-header__title"><Link to="/edo" className="back-link">← ЭДО</Link><div className="detail-title-line"><h1>{doc.number}</h1><span className="status-pill status-pill--warning">Ожидает подписи</span></div><p>{doc.counterparty}</p></div><div className="detail-header__actions"><ExportButton title={`Экспорт ${doc.number}`} label="Скачать PDF" formats={['PDF']}/><ConfirmActionButton icon="signature" title="Подписать документ?" description="После подтверждения backend запустит юридически значимый сценарий подписи и зафиксирует событие в аудите." confirmLabel="Подписать">Подписать</ConfirmActionButton><MoreActionsButton title={`Действия · ${doc.number}`} actions={[{title:"Открыть связанный рейс",description:doc.tripNumber,icon:"truck",onClick:()=>navigate(`/trips/${doc.tripId}`)},{title:"Открыть реестр ЭДО",description:"Все документы и статусы",icon:"folder",onClick:()=>navigate("/edo")}]}/></div></div>
      <section className="edo-summary-grid">
        <article className="edo-main-card panel"><div className="edo-document-head"><div className="doc-big-icon"><Icon name="receipt"/></div><div><span className="eyebrow">{doc.type}</span><h2>{doc.number}</h2><p>Оказание транспортных услуг по рейсу {doc.tripNumber}</p></div></div><div className="edo-amount"><span>Сумма документа</span><strong>{money(doc.amount)}</strong></div><div className="info-grid info-grid--doc"><div><span>Контрагент</span><strong>{doc.counterparty}</strong></div><div><span>Рейс</span><Link to={`/trips/${doc.tripId}`}>{doc.tripNumber}</Link></div><div><span>Дата</span><strong>{doc.createdAt}</strong></div><div><span>Договор</span><strong>№ ТЛ-2026/04</strong></div></div></article>
        <article className="panel approval-card"><div className="panel__header"><div><span className="eyebrow">Согласование</span><h2>Маршрут документа</h2></div></div><div className="approval-flow"><div className="approval-step is-done"><div>МЛ</div><span>Автор</span><strong>Марина Лебедева</strong><small>10:12</small></div><i/><div className="approval-step is-done"><div>ОВ</div><span>Согласующий</span><strong>Олег Власов</strong><small>10:24</small></div><i/><div className="approval-step is-current"><div>АК</div><span>Подписант</span><strong>Александр Крылов</strong><small>Ожидает</small></div><i/><div className="approval-step"><div>С</div><span>Отправитель</span><strong>Система</strong><small>После подписи</small></div></div></article>
      </section>
      <section className="panel relation-panel"><div className="panel__header"><div><span className="eyebrow">Связи</span><h2>Контекст документа</h2></div></div><div className="relation-grid"><Link to={`/trips/${doc.tripId}`}><div className="relation-icon"><Icon name="truck"/></div><div><span>Рейс</span><strong>{doc.tripNumber}</strong><small>Москва → Казань</small></div><Icon name="chevron"/></Link><div><div className="relation-icon"><Icon name="building"/></div><div><span>Контрагент</span><strong>{doc.counterparty}</strong><small>ИНН 7704••••••</small></div><Icon name="chevron"/></div><div><div className="relation-icon"><Icon name="link"/></div><div><span>1С / ERP</span><strong>Ожидает отправки</strong><small>После подписи</small></div><Icon name="chevron"/></div></div></section>
      <section className="panel"><div className="panel__header"><div><span className="eyebrow">История</span><h2>События документа</h2></div></div><div className="event-list"><div><span className="event-time">10:24</span><i className="event-dot is-done"/><div><strong>Документ согласован</strong><span>Олег Власов</span></div></div><div><span className="event-time">10:12</span><i className="event-dot is-done"/><div><strong>УПД создан автоматически</strong><span>Из данных рейса TR-0248</span></div></div></div></section>
      <div className="mobile-sticky-action"><ConfirmActionButton className="btn btn--primary btn--full" icon="signature" title="Подписать документ?" description="Подпись будет выполнена через согласованный backend-механизм КЭП/оператора." confirmLabel="Подписать">Подписать документ</ConfirmActionButton></div>
    </div>
  );
}
