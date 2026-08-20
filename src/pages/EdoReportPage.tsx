import { Link } from 'react-router-dom';
import { useEdoReport } from '../api/queries';
import { DistributionList } from '../components/DistributionList';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { EdoStatusPill } from '../components/StatusPill';
import { DateRangeButton, ExportButton } from '../components/CommonActions';

const money = (value:number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits:0 }).format(value) + ' ₽';

export function EdoReportPage() {
  const { data } = useEdoReport();
  if (!data) return null;
  return (
    <div className="page report-detail-page">
      <PageHeader kicker="Отчёты · ЭДО" title="Электронный документооборот" description="Согласования, подписи, отклонения и документы, которые тормозят закрытие рейсов." actions={<div className="action-group"><DateRangeButton/><ExportButton/></div>} />
      <section className="metric-grid metric-grid--4"><MetricCard label="Всего документов" value={String(data.total)} meta="за выбранный период" icon="file"/><MetricCard label="Подписано" value={String(data.signed)} meta={`${data.signedRate}% потока`} icon="check" tone="green"/><MetricCard label="Ждут подписи" value={String(data.awaitingSignature)} meta="нужно действие" icon="file" tone="amber"/><MetricCard label="На согласовании" value={String(data.approval)} meta="внутренний маршрут" icon="folder" tone="navy"/></section>
      <section className="report-two-col"><article className="panel"><div className="panel__header"><div><span className="eyebrow">Типы документов</span><h2>Структура потока</h2></div></div><DistributionList items={data.distribution}/></article><article className="panel report-insight-card report-insight-card--navy"><span className="eyebrow">В работе</span><strong>{money(data.amountInWork)}</strong><h2>документов не закрыто</h2><p>Сумма документов, которые ещё проходят согласование или ждут подписи. Это быстрый ориентир для бухгалтера и руководителя.</p><Link to="/edo" className="btn btn--primary">Открыть ЭДО <Icon name="arrow"/></Link></article></section>
      <section className="panel"><div className="panel__header"><div><span className="eyebrow eyebrow--danger">Очередь</span><h2>Требуют внимания</h2></div></div><div className="report-entity-list report-entity-list--docs">{data.attention.map(doc => <Link to={`/edo/${doc.id}`} key={doc.id}><div><strong>{doc.number}</strong><span>{doc.type} · {doc.tripNumber}</span></div><EdoStatusPill status={doc.status}/><div className="report-entity-list__meta"><span>Контрагент</span><strong>{doc.counterparty}</strong></div><div className="report-entity-list__meta"><span>Сумма</span><strong>{money(doc.amount)}</strong></div><Icon name="chevron"/></Link>)}</div></section>
    </div>
  );
}
