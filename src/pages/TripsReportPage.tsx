import { Link } from 'react-router-dom';
import { useTripsReport } from '../api/queries';
import { DistributionList } from '../components/DistributionList';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { TripStatusPill } from '../components/StatusPill';
import { DateRangeButton, ExportButton } from '../components/CommonActions';

export function TripsReportPage() {
  const { data } = useTripsReport();
  if (!data) return null;
  return (
    <div className="page report-detail-page">
      <PageHeader kicker="Отчёты · Перевозки" title="Рейсы и транспорт" description="Статусы перевозок, выполнение и отклонения — с переходом к конкретному рейсу." actions={<div className="action-group"><DateRangeButton/><ExportButton/></div>} />
      <section className="metric-grid metric-grid--4"><MetricCard label="Всего рейсов" value={String(data.total)} meta="за выбранный период" icon="truck"/><MetricCard label="В пути" value={String(data.inTransit)} meta="оперативный контур" icon="truck"/><MetricCard label="Завершено" value={String(data.completed)} meta={`${data.completionRate}% выполнения`} icon="check" tone="green"/><MetricCard label="С задержкой" value={String(data.delayed)} meta="требуют внимания" icon="warning" tone="amber"/></section>
      <section className="report-two-col"><article className="panel"><div className="panel__header"><div><span className="eyebrow">Статусы</span><h2>Распределение рейсов</h2></div></div><DistributionList items={data.distribution}/></article><article className="panel report-insight-card"><span className="eyebrow">Фокус руководителя</span><strong>{data.completionRate}%</strong><h2>рейсов выполнено</h2><p>Главный риск периода — задержка на маршруте Москва → Нижний Новгород. Провалитесь в рейс, чтобы увидеть документы и текущие события.</p><Link to="/trips/trip-244" className="btn btn--primary">Открыть TR-0244 <Icon name="arrow"/></Link></article></section>
      <section className="panel"><div className="panel__header"><div><span className="eyebrow eyebrow--danger">Требует внимания</span><h2>Отклонения по рейсам</h2></div><Link to="/trips" className="text-link">Все рейсы <Icon name="arrow"/></Link></div><div className="report-entity-list">{data.risks.map(trip => <Link to={`/trips/${trip.id}`} key={trip.id}><div><strong>{trip.number}</strong><span>{trip.origin} → {trip.destination}</span></div><TripStatusPill status={trip.status}/><div className="report-entity-list__meta"><span>Контрагент</span><strong>{trip.counterparty}</strong></div><div className="report-risk-label"><Icon name="warning"/><span>{trip.risk === 'delay' ? 'Задержка' : trip.risk === 'documents' ? 'Документы' : 'Маржа'}</span></div><Icon name="chevron"/></Link>)}</div></section>
    </div>
  );
}
