import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../api/queries';
import { FilterButton } from '../components/CommonActions';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { TripStatusPill } from '../components/StatusPill';
import type { TripStatus } from '../data/types';

const money = (value:number) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
type QuickFilter = 'all'|'in_transit'|'planned'|'completed';

export function TripsPage() {
  const { data = [], isLoading } = useTrips();
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState<QuickFilter>('all');
  const q=query.trim().toLocaleLowerCase('ru');
  const visible=useMemo(()=>data.filter(trip=>{
    if(filter!=='all' && trip.status !== filter as TripStatus) return false;
    if(!q)return true;
    return `${trip.number} ${trip.origin} ${trip.destination} ${trip.counterparty} ${trip.vehicle} ${trip.driver}`.toLocaleLowerCase('ru').includes(q);
  }),[data,filter,q]);
  const count=(status:QuickFilter)=>status==='all'?data.length:data.filter(x=>x.status===status).length;
  return (
    <div className="page">
      <PageHeader kicker="Операционный контур" title="Рейсы" description="Все перевозки, документы и финансовый результат в одном реестре." actions={<Link to="/trips/new" className="btn btn--primary"><Icon name="plus"/>Создать рейс</Link>} />
      <div className="toolbar">
        <label className="search-field"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Номер, маршрут, контрагент…" /></label>
        <div className="filter-chips" data-no-history-swipe>{([['all','Все'],['in_transit','В пути'],['planned','Запланированы'],['completed','Завершены']] as [QuickFilter,string][]).map(([id,label])=><button type="button" key={id} className={`chip ${filter===id?'is-active':''}`} onClick={()=>setFilter(id)}>{label} <span className="chip-count">{count(id)}</span></button>)}</div>
        <FilterButton kind="trips"/>
      </div>

      <div className="registry-card desktop-table-wrap" data-no-history-swipe>
        <table className="data-table">
          <thead><tr><th>Рейс</th><th>Статус</th><th>Маршрут</th><th>Контрагент</th><th>ТС / водитель</th><th>Документы</th><th className="align-right">Финансы</th><th></th></tr></thead>
          <tbody>{!isLoading && visible.map(trip => <tr key={trip.id} className={trip.risk ? 'row-has-risk' : ''}><td><Link className="entity-link" to={`/trips/${trip.id}`}><strong>{trip.number}</strong><span>{trip.plannedAt}</span></Link></td><td><TripStatusPill status={trip.status}/></td><td><div className="route-cell"><strong>{trip.origin}</strong><Icon name="arrow"/><strong>{trip.destination}</strong></div><span className="table-muted">{trip.plannedMileageKm} км</span></td><td><strong className="table-main">{trip.counterparty}</strong><span className="table-muted">{trip.cargo}</span></td><td><strong className="table-main">{trip.vehicle}</strong><span className="table-muted">{trip.driver}</span></td><td><div className="docs-cell"><span>{trip.documentsReady}/{trip.documentsTotal}</span><div className="mini-progress"><i style={{width:`${(trip.documentsReady/trip.documentsTotal)*100}%`}}/></div></div></td><td className="align-right"><strong className="table-main">{money(trip.revenue)}</strong><span className={`table-muted ${trip.margin < 25 ? 'text-warning' : ''}`}>{trip.margin.toFixed(1)}% маржа</span></td><td><Link to={`/trips/${trip.id}`} className="table-arrow"><Icon name="chevron"/></Link></td></tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{visible.map(trip => <Link to={`/trips/${trip.id}`} key={trip.id} className="mobile-trip-card"><div className="mobile-trip-card__top"><div><span>{trip.number}</span><strong>{trip.origin} → {trip.destination}</strong></div><TripStatusPill status={trip.status}/></div><div className="mobile-trip-card__meta"><span><Icon name="car"/>{trip.vehicle}</span><span><Icon name="user"/>{trip.driver}</span></div><div className="mobile-trip-card__bottom"><div><span>Документы</span><strong>{trip.documentsReady}/{trip.documentsTotal}</strong></div><div><span>Выручка</span><strong>{money(trip.revenue)}</strong></div><Icon name="chevron"/></div></Link>)}</div>
    </div>
  );
}
