import { Link, useParams } from 'react-router-dom';
import { useDriverDocuments, useDriverFuelings, useDriverTrip } from '../api/queries';
import { DocStatusPill, FuelStatusText, TripStatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';

export function DriverTripDetailsPage() {
  const { tripId = 'trip-248' } = useParams();
  const { data: trip } = useDriverTrip(tripId);
  const { data: documents = [] } = useDriverDocuments();
  const { data: fuelings = [] } = useDriverFuelings();
  if (!trip) return null;
  const tripDocs = documents.filter(item => item.tripId === trip.id);
  const tripFuelings = fuelings.filter(item => item.tripId === trip.id);

  return (
    <div className="page driver-page driver-trip-details-page">
      <div className="detail-header driver-detail-header">
        <div className="detail-header__title"><Link to="/driver/trips" className="back-link">← Мои рейсы</Link><div className="detail-title-line"><h1>{trip.number}</h1><TripStatusPill status={trip.status}/></div><p>{trip.origin} → {trip.destination}</p></div>
        <div className="detail-header__actions"><Link to="/driver/documents" className="btn btn--secondary"><Icon name="file"/>Документы</Link><Link to="/driver/fuel/new" className="btn btn--primary"><Icon name="fuel"/>Добавить заправку</Link></div>
      </div>

      <section className="driver-trip-hero panel">
        <div className="driver-trip-hero__route">
          <div><span>Погрузка</span><strong>{trip.origin}</strong><small>{trip.plannedAt}</small></div>
          <div className="driver-trip-hero__road"><i/><span><Icon name="truck"/></span><i/></div>
          <div><span>Разгрузка</span><strong>{trip.destination}</strong><small>По маршруту</small></div>
        </div>
        <div className="driver-trip-hero__facts"><span><Icon name="route"/><b>{trip.plannedMileageKm} км</b></span><span><Icon name="package"/><b>{(trip.weightKg/1000).toFixed(1)} т</b></span><span><Icon name="car"/><b>{trip.vehicle}</b></span></div>
      </section>

      <section className="driver-detail-grid">
        <article className="panel driver-task-panel">
          <div className="panel__header"><div><span className="eyebrow">Задание</span><h2>Что везём</h2></div></div>
          <div className="driver-info-list"><span><b>Груз</b><strong>{trip.cargo}</strong></span><span><b>Заказчик</b><strong>{trip.customer}</strong></span><span><b>Грузополучатель</b><strong>{trip.consignee}</strong></span><span><b>Вес</b><strong>{trip.weightKg.toLocaleString('ru-RU')} кг</strong></span></div>
        </article>

        <article className="panel driver-documents-panel">
          <div className="panel__header"><div><span className="eyebrow">Документы</span><h2>По этому рейсу</h2></div><Link to="/driver/documents" className="text-link">Все <Icon name="arrow"/></Link></div>
          <div className="driver-document-list">{tripDocs.map(doc => <Link to={`/epd/${doc.id}`} className="driver-document-row" key={doc.id}><span className="driver-document-row__icon"><Icon name="file"/></span><div><strong>{doc.number}</strong><span>{doc.type} · {doc.signature}</span></div><DocStatusPill status={doc.status}/><Icon name="chevron"/></Link>)}</div>
        </article>
      </section>

      <section className="panel driver-progress-panel">
        <div className="panel__header"><div><span className="eyebrow">Статус рейса</span><h2>Сегодня</h2></div></div>
        <div className="driver-progress-list"><div className="is-done"><i><Icon name="check"/></i><span><b>Назначение получено</b><small>08:30 · диспетчер</small></span></div><div className="is-done"><i><Icon name="check"/></i><span><b>ТС вышло на линию</b><small>{trip.actualAt ?? '—'}</small></span></div><div className="is-current"><i><Icon name="truck"/></i><span><b>В пути</b><small>{trip.actualMileageKm ?? 0} из {trip.plannedMileageKm} км</small></span></div><div><i><Icon name="package"/></i><span><b>Разгрузка</b><small>После прибытия</small></span></div></div>
      </section>

      <section className="panel driver-trip-fuel-panel">
        <div className="panel__header"><div><span className="eyebrow">ГСМ</span><h2>Заправки рейса</h2></div><Link to="/driver/fuel/new" className="text-link">Добавить <Icon name="plus"/></Link></div>
        {tripFuelings.length ? <div className="driver-trip-fuel-list">{tripFuelings.map(item => <Link to={`/fuel/${item.id}`} key={item.id}><span className="driver-trip-fuel-list__icon"><Icon name="fuel"/></span><div><strong>{item.liters.toLocaleString('ru-RU')} л · {item.gasStation}</strong><span>{item.dateTime} · {item.amount.toLocaleString('ru-RU')} ₽</span></div><FuelStatusText status={item.status}/><Icon name="chevron"/></Link>)}</div> : <div className="driver-empty-state"><Icon name="fuel"/><span>По этому рейсу заправок ещё нет.</span></div>}
      </section>

      <div className="driver-mobile-actionbar"><Link to="/driver/documents" className="btn btn--secondary"><Icon name="file"/>Документы</Link><Link to="/driver/fuel/new" className="btn btn--primary"><Icon name="fuel"/>Заправка</Link></div>
    </div>
  );
}
