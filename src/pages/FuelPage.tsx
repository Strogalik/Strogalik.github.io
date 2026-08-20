import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFuelings } from '../api/queries';
import { FuelStatusText, SemanticStatusText } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { fuelAnomalyShortLabel, rub } from '../lib/fuel';
import { FilterButton } from '../components/CommonActions';

type FuelFilter = 'all' | 'attention' | 'confirmed';

export function FuelPage() {
  const { data: fuelings = [] } = useFuelings();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FuelFilter>('all');
  const q = query.trim().toLocaleLowerCase('ru');
  const attentionCount = fuelings.filter(item => item.status !== 'confirmed' || item.anomalies.length).length;
  const confirmedCount = fuelings.filter(item => item.status === 'confirmed').length;
  const totalAmount = fuelings.filter(item => item.status !== 'rejected').reduce((sum, item) => sum + item.amount, 0);
  const totalLiters = fuelings.filter(item => item.status !== 'rejected').reduce((sum, item) => sum + item.liters, 0);

  const visible = useMemo(() => fuelings.filter(item => {
    if (filter === 'attention' && item.status === 'confirmed' && !item.anomalies.length) return false;
    if (filter === 'confirmed' && item.status !== 'confirmed') return false;
    if (!q) return true;
    return `${item.number} ${item.vehicle} ${item.driver} ${item.tripNumber} ${item.gasStation}`.toLocaleLowerCase('ru').includes(q);
  }), [fuelings, filter, q]);

  return (
    <div className="page fuel-page">
      <PageHeader kicker="ГСМ" title="Заправки и топливо" description="Заправки, чеки, контроль отклонений и связь с рейсами — в одном рабочем контуре." actions={<div className="action-group"><Link to="/fuel/anomalies" className="btn btn--secondary"><Icon name="warning"/>Аномалии</Link><Link to="/fuel/approvals" className="btn btn--secondary"><Icon name="check"/>Согласование</Link><Link to="/fuel/new" className="btn btn--primary"><Icon name="plus"/>Добавить заправку</Link></div>} />

      <div className="fuel-mobile-actions">
        <Link to="/fuel/new" className="btn btn--primary"><Icon name="plus"/>Добавить</Link>
        <Link to="/fuel/anomalies" className="btn btn--secondary"><Icon name="warning"/>Аномалии</Link>
        <Link to="/fuel/approvals" className="btn btn--secondary fuel-mobile-action-icon" aria-label="Согласование" title="Согласование"><Icon name="check"/></Link>
      </div>

      <section className="metric-grid metric-grid--4 fuel-metrics">
        <MetricCard label="Объём" value={`${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(totalLiters)} л`} meta="подтверждено и в работе" icon="fuel" />
        <MetricCard label="Затраты" value={rub(totalAmount)} meta="по текущему реестру" icon="wallet" tone="navy" />
        <MetricCard label="Требуют внимания" value={String(attentionCount)} meta="аномалии / согласование" icon="warning" tone="amber" />
        <MetricCard label="Подтверждено" value={String(confirmedCount)} meta="готово к учёту" icon="check" tone="green" />
      </section>

      <div className="segmented-tabs fuel-tabs" data-no-history-swipe>
        <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Все <span>{fuelings.length}</span></button>
        <button className={filter === 'attention' ? 'is-active' : ''} onClick={() => setFilter('attention')}>Требуют внимания <span>{attentionCount}</span></button>
        <button className={filter === 'confirmed' ? 'is-active' : ''} onClick={() => setFilter('confirmed')}>Подтверждено <span>{confirmedCount}</span></button>
      </div>

      <div className="toolbar toolbar--compact fuel-toolbar">
        <label className="search-field"><Icon name="search"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Рейс, ТС, водитель, АЗС…"/></label>
        <FilterButton kind="fuel"/>
      </div>

      <div className="registry-card desktop-table-wrap" data-no-history-swipe>
        <table className="data-table data-table--fuel">
          <thead><tr><th>Заправка</th><th>ТС / водитель</th><th>Рейс</th><th>Топливо</th><th>Литры</th><th>Цена / л</th><th>Сумма</th><th>Контроль</th><th>Статус</th><th></th></tr></thead>
          <tbody>{visible.map(item => <tr key={item.id} className={item.anomalies.length ? 'row-has-risk' : ''}>
            <td><Link className="entity-link" to={`/fuel/${item.id}`}><strong>{item.number}</strong><span>{item.dateTime}</span></Link></td>
            <td><strong className="table-main fuel-vehicle-cell">{item.vehicle}</strong><span className="table-muted">{item.driver}</span></td>
            <td><Link className="inline-link" to={`/trips/${item.tripId}`}>{item.tripNumber}</Link></td>
            <td><strong className="table-main">{item.fuelType}</strong><span className="table-muted">{item.gasStation}</span></td>
            <td><strong className="table-main">{item.liters.toLocaleString('ru-RU')} л</strong></td>
            <td><span className="table-main">{item.pricePerLiter.toLocaleString('ru-RU')} ₽</span></td>
            <td><strong className="table-main">{rub(item.amount)}</strong></td>
            <td>{item.anomalies.length ? <SemanticStatusText label={item.anomalies.slice(0,2).map(type => fuelAnomalyShortLabel[type]).join(' · ')} tone="warning"/> : <SemanticStatusText label="Без отклонений" tone="success"/>}</td>
            <td><FuelStatusText status={item.status}/></td>
            <td><Link to={`/fuel/${item.id}`} className="table-arrow" aria-label={`Открыть ${item.number}`}><Icon name="chevron"/></Link></td>
          </tr>)}</tbody>
        </table>
      </div>

      <div className="mobile-card-list mobile-fuel-list">
        {visible.map(item => <Link to={`/fuel/${item.id}`} className={`mobile-fuel-card ${item.anomalies.length ? 'has-attention' : ''}`} key={item.id}>
          <div className="mobile-fuel-card__head">
            <span className="mobile-fuel-card__icon"><Icon name="fuel"/></span>
            <div className="mobile-fuel-card__identity"><strong>{item.number}</strong><span>{item.vehicle}</span></div>
            <FuelStatusText status={item.status}/>
          </div>
          <div className="mobile-fuel-card__summary"><strong>{item.liters.toLocaleString('ru-RU')} л</strong><b>{rub(item.amount)}</b></div>
          <div className="mobile-fuel-card__quick-meta"><span><b>Цена:</b> {item.pricePerLiter.toLocaleString('ru-RU')} ₽/л</span><span><b>Время:</b> {item.dateTime}</span></div>
          <div className="mobile-fuel-card__rows">
            <span><b>Рейс</b><em>{item.tripNumber}</em></span>
            <span><b>АЗС</b><em>{item.gasStation}</em></span>
          </div>
          {item.anomalies.length ? <div className="mobile-fuel-card__signal is-warning"><Icon name="warning"/><span>{item.anomalies.map(type => fuelAnomalyShortLabel[type]).join(' · ')}</span></div> : <div className="mobile-fuel-card__signal is-success"><Icon name="check"/><span>Без отклонений</span></div>}
        </Link>)}
      </div>
    </div>
  );
}
