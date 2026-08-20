import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTrip } from '../api/queries';
import { Icon } from '../components/Icon';
import { TripStatusPill } from '../components/StatusPill';
import { ActionList, ActionListButton, Overlay } from '../components/Overlay';
import { MoreActionsButton } from '../components/CommonActions';

const money = (value:number) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
type Tab = 'overview'|'documents'|'route'|'finance'|'files'|'history';

export function TripDetailsPage() {
  const { tripId = 'trip-248' } = useParams();
  const { data: trip } = useTrip(tripId);
  const navigate=useNavigate();
  const [tab,setTab]=useState<Tab>('overview');
  const [editOpen,setEditOpen]=useState(false);
  const [docOpen,setDocOpen]=useState(false);
  if (!trip) return null;
  const timeline=[['08:30','Рейс назначен','Система'],['08:35','Назначен водитель','Марина Лебедева'],['08:40','Создан ЭПЛ №2341','Система'],['08:47','ТС вышло на линию','Иван Петров'],['09:02','ЭТрН отправлена в Saby','Система']];
  const tabs:[Tab,string][]=[['overview','Обзор'],['documents','Документы'],['route','Маршрут'],['finance','Финансы'],['files','Файлы'],['history','История']];
  return (
    <div className="page detail-page">
      <div className="detail-header">
        <div className="detail-header__title"><Link to="/trips" className="back-link">← Рейсы</Link><div className="detail-title-line"><h1>{trip.number}</h1><TripStatusPill status={trip.status}/></div><p>{trip.origin} → {trip.destination}</p></div>
        <div className="detail-header__actions"><button type="button" className="btn btn--secondary" onClick={()=>setEditOpen(true)}>Изменить</button><button type="button" className="btn btn--primary" onClick={()=>setDocOpen(true)}><Icon name="plus"/>Создать документ</button><MoreActionsButton title="Действия с рейсом" actions={[{title:"Открыть историю",description:"События и изменения рейса",icon:"book",onClick:()=>setTab("history")},{title:"Открыть ГСМ",description:"Связанные заправки и контроль",icon:"fuel",onClick:()=>navigate("/fuel")}]}/></div>
      </div>

      <section className="trip-hero-grid">
        <article className="route-hero">
          <span className="eyebrow eyebrow--light">Маршрут</span>
          <div className="route-hero__cities"><div><span>Откуда</span><strong>{trip.origin}</strong></div><div className="route-hero__line"><i/><Icon name="truck"/><i/></div><div><span>Куда</span><strong>{trip.destination}</strong></div></div>
          <div className="route-hero__meta"><span><Icon name="calendar"/>{trip.plannedAt}</span><span><Icon name="route"/>{trip.plannedMileageKm} км</span><span><Icon name="package"/>{(trip.weightKg/1000).toFixed(1)} т</span></div>
        </article>
        <article className="trip-people-card panel">
          <div className="entity-summary"><div className="entity-summary__icon"><Icon name="car"/></div><div><span>Транспорт</span><strong>{trip.vehicle}</strong></div></div>
          <div className="entity-summary"><div className="entity-summary__icon"><Icon name="user"/></div><div><span>Водитель</span><strong>{trip.driver}</strong></div></div>
          <div className="entity-summary"><div className="entity-summary__icon"><Icon name="building"/></div><div><span>Контрагент</span><strong>{trip.counterparty}</strong></div></div>
        </article>
      </section>

      <section className="finance-strip">
        <div><span>Выручка</span><strong>{money(trip.revenue)}</strong></div><div><span>Затраты</span><strong>{money(trip.costs)}</strong></div><div><span>Прибыль</span><strong>{money(trip.revenue-trip.costs)}</strong></div><div className={trip.margin < 25 ? 'finance-strip__warn' : ''}><span>Маржа</span><strong>{trip.margin.toFixed(1)}%</strong></div>
      </section>

      <div className="detail-tabs" role="tablist" aria-label="Разделы рейса">{tabs.map(([value,label])=><button type="button" key={value} role="tab" aria-selected={tab===value} className={tab===value?'is-active':''} onClick={()=>setTab(value)}>{label}{value==='documents'&&<span>5</span>}</button>)}</div>

      {tab==='overview' && <section className="trip-content-grid">
        <article className="panel details-card"><div className="panel__header"><div><span className="eyebrow">Рейс</span><h2>Основная информация</h2></div></div><div className="info-grid"><div><span>Заказчик</span><strong>{trip.customer}</strong></div><div><span>Грузополучатель</span><strong>{trip.consignee}</strong></div><div><span>Груз</span><strong>{trip.cargo}</strong></div><div><span>Вес</span><strong>{trip.weightKg.toLocaleString('ru-RU')} кг</strong></div><div><span>Плановый пробег</span><strong>{trip.plannedMileageKm} км</strong></div><div><span>Фактический</span><strong>{trip.actualMileageKm ?? '—'} км</strong></div></div></article>
        <article className="panel trip-docs-preview"><div className="panel__header"><div><span className="eyebrow">Документы</span><h2>Готовность рейса</h2></div><button type="button" className="text-link" onClick={()=>setTab('documents')}>Открыть <Icon name="arrow"/></button></div><Link to="/epd/epl-2341" className="doc-row"><div className="doc-row__icon"><Icon name="file"/></div><div><strong>ЭПЛ №2341</strong><span>Ожидает подписи</span></div><span className="status-pill status-pill--warning">Нужно действие</span><Icon name="chevron"/></Link><div className="doc-row"><div className="doc-row__icon"><Icon name="file"/></div><div><strong>ЭТрН №8123</strong><span>Принят Saby</span></div><span className="status-pill status-pill--success">Готов</span><Icon name="chevron"/></div><Link to="/edo/edo-251" className="doc-row"><div className="doc-row__icon"><Icon name="folder"/></div><div><strong>УПД №251</strong><span>Ожидает подписи</span></div><span className="status-pill status-pill--warning">Подпись</span><Icon name="chevron"/></Link></article>
      </section>}

      {tab==='documents' && <section className="panel trip-tab-panel"><div className="panel__header"><div><span className="eyebrow">Связанные документы</span><h2>ЭПД и ЭДО рейса</h2></div><button type="button" className="btn btn--secondary btn--compact" onClick={()=>setDocOpen(true)}><Icon name="plus"/>Создать</button></div><div className="trip-document-list"><Link to="/epd/epl-2341" className="doc-row"><div className="doc-row__icon"><Icon name="file"/></div><div><strong>ЭПЛ №2341</strong><span>Ожидает подписи · ЭПД</span></div><span className="status-pill status-pill--warning">Нужно действие</span><Icon name="chevron"/></Link><Link to="/epd/etrn-8123" className="doc-row"><div className="doc-row__icon"><Icon name="file"/></div><div><strong>ЭТрН №8123</strong><span>Принят оператором · ЭПД</span></div><span className="status-pill status-pill--success">Принят</span><Icon name="chevron"/></Link><Link to="/edo/edo-251" className="doc-row"><div className="doc-row__icon"><Icon name="folder"/></div><div><strong>УПД №251</strong><span>Ожидает подписи · ЭДО</span></div><span className="status-pill status-pill--warning">Подпись</span><Icon name="chevron"/></Link></div></section>}

      {tab==='route' && <section className="panel trip-tab-panel"><div className="panel__header"><div><span className="eyebrow">Маршрут</span><h2>{trip.origin} → {trip.destination}</h2></div></div><div className="info-grid info-grid--doc"><div><span>Точка погрузки</span><strong>{trip.origin}</strong></div><div><span>Точка разгрузки</span><strong>{trip.destination}</strong></div><div><span>Плановый выезд</span><strong>{trip.plannedAt}</strong></div><div><span>Плановый пробег</span><strong>{trip.plannedMileageKm} км</strong></div><div><span>Фактический пробег</span><strong>{trip.actualMileageKm ?? '—'} км</strong></div><div><span>Телематика</span><strong>При наличии источника</strong></div></div></section>}

      {tab==='finance' && <section className="panel trip-tab-panel"><div className="panel__header"><div><span className="eyebrow">Экономика рейса</span><h2>План и фактический результат</h2></div><Link to="/reports/finance" className="text-link">Отчёт <Icon name="arrow"/></Link></div><div className="trip-finance-grid"><div><span>Выручка</span><strong>{money(trip.revenue)}</strong></div><div><span>Затраты</span><strong>{money(trip.costs)}</strong></div><div><span>Прибыль</span><strong>{money(trip.revenue-trip.costs)}</strong></div><div><span>Маржа</span><strong>{trip.margin.toFixed(1)}%</strong></div></div></section>}

      {tab==='files' && <section className="panel trip-tab-panel"><div className="panel__header"><div><span className="eyebrow">Вложения</span><h2>Файлы рейса</h2></div></div><div className="trip-file-list"><div><span className="document-icon"><Icon name="file"/></span><div><strong>Заявка-на-перевозку.pdf</strong><small>PDF · 428 КБ</small></div></div><div><span className="document-icon"><Icon name="receipt"/></span><div><strong>receipt-8841.jpg</strong><small>Чек ГСМ · 1,2 МБ</small></div></div></div></section>}

      {(tab==='overview'||tab==='history') && <section className="panel timeline-panel"><div className="panel__header"><div><span className="eyebrow">История</span><h2>{tab==='history'?'История рейса':'Последние события'}</h2></div>{tab==='overview'&&<button type="button" className="text-link" onClick={()=>setTab('history')}>Вся история <Icon name="arrow"/></button>}</div><div className="horizontal-timeline">{timeline.map(([time,title,who],i)=><div className="timeline-step" key={title}><i className={i===4?'is-current':''}/><span>{time}</span><strong>{title}</strong><small>{who}</small></div>)}</div></section>}

      <Overlay open={editOpen} onClose={()=>setEditOpen(false)} title="Изменить рейс" description={`${trip.number} · редактирование только разрешённых полей`} kicker="Рейс" presentation="sheet" footer={<><button type="button" className="btn btn--ghost" onClick={()=>setEditOpen(false)}>Отмена</button><button type="button" className="btn btn--primary" onClick={()=>setEditOpen(false)}>Сохранить</button></>}><div className="overlay-form-grid"><label><span>Водитель</span><input defaultValue={trip.driver}/></label><label><span>ТС</span><input defaultValue={trip.vehicle}/></label><label className="is-full"><span>Комментарий</span><textarea placeholder="Причина изменения или комментарий"/></label></div></Overlay>
      <Overlay open={docOpen} onClose={()=>setDocOpen(false)} title="Создать документ" description="Документ получит контекст текущего рейса. Обязательные поля проверяются до отправки." kicker={trip.number} size="sm"><ActionList><ActionListButton icon="file" title="Перевозочный документ" description="ЭПЛ, ЭТрН или ЭЗЗ" onClick={()=>{setDocOpen(false);navigate('/epd/new')}}/><ActionListButton icon="folder" title="Документ ЭДО" description="УПД, акт, счёт или произвольный файл" onClick={()=>{setDocOpen(false);navigate('/edo/new')}}/></ActionList></Overlay>
    </div>
  );
}
