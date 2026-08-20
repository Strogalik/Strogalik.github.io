import { Link } from 'react-router-dom';
import { useEpdReport } from '../api/queries';
import { DistributionList } from '../components/DistributionList';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';
import { DocStatusPill } from '../components/StatusPill';
import { DateRangeButton, ExportButton } from '../components/CommonActions';

export function EpdReportPage() {
  const { data } = useEpdReport();
  if (!data) return null;
  return (
    <div className="page report-detail-page">
      <PageHeader kicker="Отчёты · ЭПД" title="Перевозочные документы" description="Успешность ЭПЛ, ЭТрН и ЭЗЗ, очередь подписания и ошибки обмена с Saby." actions={<div className="action-group"><DateRangeButton/><ExportButton/></div>} />
      <section className="metric-grid metric-grid--4"><MetricCard label="Всего ЭПД" value={String(data.total)} meta="за выбранный период" icon="file"/><MetricCard label="Принято" value={String(data.accepted)} meta={`${data.successRate}% успешности`} icon="check" tone="green"/><MetricCard label="Ждут подписи" value={String(data.awaitingSignature)} meta="нужно действие" icon="file" tone="amber"/><MetricCard label="Ошибки" value={String(data.errors)} meta="обмен / валидация" icon="warning" tone="amber"/></section>
      <section className="report-two-col"><article className="panel"><div className="panel__header"><div><span className="eyebrow">Статусы</span><h2>Состояние ЭПД</h2></div></div><DistributionList items={data.distribution}/></article><article className="panel report-insight-card report-insight-card--amber"><span className="eyebrow eyebrow--danger">Контроль</span><strong>{data.attention.length}</strong><h2>документа требуют внимания</h2><p>Сначала исправьте ошибку обмена, затем закройте ожидающую подпись. Порядок соответствует операционному риску.</p><Link to="/epd" className="btn btn--primary">Открыть реестр <Icon name="arrow"/></Link></article></section>
      <section className="panel"><div className="panel__header"><div><span className="eyebrow eyebrow--danger">Проблемные документы</span><h2>Нужно действие</h2></div></div><div className="report-entity-list report-entity-list--docs">{data.attention.map(doc => <Link to={`/epd/${doc.id}`} key={doc.id}><div><strong>{doc.number}</strong><span>{doc.type} · {doc.tripNumber}</span></div><DocStatusPill status={doc.status}/><div className="report-entity-list__meta"><span>Контрагент</span><strong>{doc.counterparty}</strong></div><div className="report-entity-list__meta"><span>Saby</span><strong className={doc.status === 'error' ? 'text-danger' : ''}>{doc.saby}</strong></div><Icon name="chevron"/></Link>)}</div></section>
    </div>
  );
}
