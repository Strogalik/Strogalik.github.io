import { Link } from 'react-router-dom';
import { useDriverDocuments, useDriverFuelings, useDriverProfile, useDriverTrips } from '../api/queries';
import { DocStatusPill, TripStatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

const money = (value:number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

export function DriverHomePage() {
  const { data: profile } = useDriverProfile();
  const { data: trips = [] } = useDriverTrips();
  const { data: documents = [] } = useDriverDocuments();
  const { data: fuelings = [] } = useDriverFuelings();
  const activeTrip = trips.find(item => item.status === 'in_transit' || item.status === 'assigned') ?? trips[0];
  const attentionDoc = documents.find(item => item.status === 'awaiting_signature' || item.status === 'error' || item.status === 'rejected');
  const latestFueling = fuelings[0];

  return (
    <div className="page driver-page driver-home-page">
      <PageHeader
        kicker="Полевой режим"
        title={`Добрый день${profile ? `, ${profile.name.split(' ')[0]}` : ''}`}
        description="Рейсы, документы и заправки — только то, что нужно водителю в дороге."
        actions={<Link to="/dashboard" className="btn btn--secondary">Вернуться в основной контур</Link>}
      />

      <section className="driver-home-grid">
        {activeTrip ? <article className="driver-current-trip panel">
          <div className="driver-current-trip__top">
            <div>
              <span className="page-kicker">Текущий рейс</span>
              <div className="driver-current-trip__title"><h2>{activeTrip.number}</h2><TripStatusPill status={activeTrip.status}/></div>
            </div>
            <Link to={`/driver/trips/${activeTrip.id}`} className="driver-round-link" aria-label="Открыть текущий рейс"><Icon name="arrow"/></Link>
          </div>

          <div className="driver-route-line">
            <div><span>Откуда</span><strong>{activeTrip.origin}</strong></div>
            <div className="driver-route-line__path"><i/><Icon name="truck"/><i/></div>
            <div><span>Куда</span><strong>{activeTrip.destination}</strong></div>
          </div>

          <div className="driver-current-trip__facts">
            <div><Icon name="calendar"/><span>Выезд</span><strong>{activeTrip.plannedAt}</strong></div>
            <div><Icon name="route"/><span>Маршрут</span><strong>{activeTrip.plannedMileageKm} км</strong></div>
            <div><Icon name="car"/><span>ТС</span><strong>{activeTrip.vehicle}</strong></div>
          </div>
        </article> : null}

        <aside className="panel driver-profile-panel">
          <div className="driver-profile-panel__head"><div className="driver-profile-avatar">ИП</div><div><span>Водитель</span><strong>{profile?.name ?? 'Иван Петров'}</strong><small>{profile?.personnelNumber ?? 'В-0142'}</small></div></div>
          <div className="driver-profile-panel__facts">
            <span><b>Транспорт</b><strong>{profile?.vehicle ?? '—'}</strong></span>
            <span><b>Телефон</b><strong>{profile?.phone ?? '—'}</strong></span>
          </div>
        </aside>
      </section>

      <section className="driver-quick-grid">
        <Link to="/driver/trips" className="driver-quick-card"><span className="driver-quick-card__icon"><Icon name="truck"/></span><div><span>Мои рейсы</span><strong>{trips.length ? `${trips.length} активный` : 'Нет активных'}</strong><small>Маршрут и статус</small></div><Icon name="chevron"/></Link>
        <Link to="/driver/documents" className="driver-quick-card"><span className="driver-quick-card__icon"><Icon name="file"/></span><div><span>Документы</span><strong>{attentionDoc ? 'Нужно действие' : 'Всё готово'}</strong><small>{attentionDoc?.number ?? `${documents.length} документа`}</small></div><Icon name="chevron"/></Link>
        <Link to="/driver/fuel/new" className="driver-quick-card"><span className="driver-quick-card__icon"><Icon name="fuel"/></span><div><span>Заправка</span><strong>Добавить чек</strong><small>Фото + данные заправки</small></div><Icon name="chevron"/></Link>
      </section>

      <section className="driver-home-bottom-grid">
        <article className="panel driver-action-panel">
          <div className="panel__header"><div><span className="eyebrow">Следующее действие</span><h2>{attentionDoc ? 'Документ ждёт вас' : 'На сегодня всё спокойно'}</h2></div></div>
          {attentionDoc ? <Link to={`/epd/${attentionDoc.id}`} className="driver-attention-row">
            <span className="driver-attention-row__icon"><Icon name="signature"/></span>
            <div><strong>{attentionDoc.number}</strong><span>{attentionDoc.tripNumber} · {attentionDoc.type}</span></div>
            <DocStatusPill status={attentionDoc.status}/><Icon name="chevron"/>
          </Link> : <div className="driver-empty-state"><Icon name="check"/><span>Нет документов, требующих действия.</span></div>}
        </article>

        <article className="panel driver-last-fueling">
          <div className="panel__header"><div><span className="eyebrow">Последняя заправка</span><h2>{latestFueling?.number ?? 'Нет данных'}</h2></div>{latestFueling ? <Link to={`/fuel/${latestFueling.id}`} className="text-link">Открыть <Icon name="arrow"/></Link> : null}</div>
          {latestFueling ? <div className="driver-fueling-summary"><div><span>Топливо</span><strong>{latestFueling.liters.toLocaleString('ru-RU')} л</strong></div><div><span>Сумма</span><strong>{money(latestFueling.amount)}</strong></div><div><span>АЗС</span><strong>{latestFueling.gasStation}</strong></div></div> : null}
        </article>
      </section>
    </div>
  );
}
