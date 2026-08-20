import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDriverTrips } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { TripStatusPill } from '../components/StatusPill';

type DriverTab='today'|'upcoming'|'completed';
export function DriverTripsPage() {
  const { data: trips = [] } = useDriverTrips();
  const [tab,setTab]=useState<DriverTab>('today');
  const visible=useMemo(()=>trips.filter(trip=>tab==='today'?trip.status!=='completed'&&trip.status!=='cancelled':tab==='upcoming'?trip.status==='planned'||trip.status==='assigned':trip.status==='completed'),[trips,tab]);
  const completed=trips.filter(x=>x.status==='completed').length, upcoming=trips.filter(x=>x.status==='planned'||x.status==='assigned').length;
  return (
    <div className="page driver-page driver-trips-page">
      <PageHeader kicker="Полевой режим" title="Мои рейсы" description="Только назначенные вам перевозки — без лишней операционной информации." actions={<Link to="/driver" className="btn btn--secondary">Мой день</Link>} />
      <div className="segmented-tabs driver-tabs" data-no-history-swipe><button type="button" className={tab==='today'?'is-active':''} onClick={()=>setTab('today')}>Сегодня <span>{trips.length-completed}</span></button><button type="button" className={tab==='upcoming'?'is-active':''} onClick={()=>setTab('upcoming')}>Предстоящие <span>{upcoming}</span></button><button type="button" className={tab==='completed'?'is-active':''} onClick={()=>setTab('completed')}>Завершённые <span>{completed}</span></button></div>
      <section className="driver-trip-registry desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--driver"><thead><tr><th>Рейс</th><th>Статус</th><th>Маршрут</th><th>Время</th><th>ТС</th><th>Документы</th><th></th></tr></thead><tbody>{visible.map(trip => <tr key={trip.id}><td><Link className="entity-link" to={`/driver/trips/${trip.id}`}><strong>{trip.number}</strong><span>{trip.counterparty}</span></Link></td><td><TripStatusPill status={trip.status}/></td><td><div className="route-cell"><strong>{trip.origin}</strong><Icon name="arrow"/><strong>{trip.destination}</strong></div><span className="table-muted">{trip.plannedMileageKm} км</span></td><td><strong className="table-main">{trip.plannedAt}</strong><span className="table-muted">{trip.actualAt ? `Факт: ${trip.actualAt}` : 'По плану'}</span></td><td><strong className="table-main">{trip.vehicle}</strong></td><td><div className="docs-cell"><span>{trip.documentsReady}/{trip.documentsTotal}</span><div className="mini-progress"><i style={{width:`${(trip.documentsReady / Math.max(1, trip.documentsTotal))*100}%`}}/></div></div></td><td><Link to={`/driver/trips/${trip.id}`} className="table-arrow"><Icon name="chevron"/></Link></td></tr>)}</tbody></table></section>
      <section className="driver-trip-cards mobile-card-list">{visible.map(trip => <Link to={`/driver/trips/${trip.id}`} key={trip.id} className="driver-trip-card"><div className="driver-trip-card__head"><div><span>{trip.number}</span><strong>{trip.origin} → {trip.destination}</strong></div><TripStatusPill status={trip.status}/></div><div className="driver-trip-card__route"><div><span>Выезд</span><strong>{trip.plannedAt}</strong></div><div><span>Расстояние</span><strong>{trip.plannedMileageKm} км</strong></div></div><div className="driver-trip-card__meta"><span><Icon name="car"/>{trip.vehicle}</span><span><Icon name="package"/>{trip.cargo}</span></div><div className="driver-trip-card__foot"><span><b>Документы</b><strong>{trip.documentsReady}/{trip.documentsTotal}</strong></span><span>Открыть рейс <Icon name="chevron"/></span></div></Link>)}</section>
    </div>
  );
}
