import { useIntegrationJobs } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { JobStatusPill } from '../components/StatusPill';
import { FilterButton } from '../components/CommonActions';

export function IntegrationJobsPage() {
  const { data = [] } = useIntegrationJobs();
  return (
    <div className="page integration-jobs-page">
      <PageHeader kicker="Диагностика" title="Очередь интеграций" description="Асинхронные операции Saby и 1С: статус, количество попыток и безопасный внешний идентификатор." />
      <div className="toolbar toolbar--compact"><label className="search-field"><Icon name="search"/><input placeholder="Операция, документ, рейс…" /></label><FilterButton kind="integrations"/></div>
      <div className="registry-card desktop-table-wrap" data-no-history-swipe>
        <table className="data-table data-table--jobs"><thead><tr><th>Система</th><th>Операция</th><th>Объект</th><th>Статус</th><th>Внешний ID</th><th>Попытки</th><th>Создано</th></tr></thead><tbody>{data.map((job) => <tr key={job.id}><td><strong className="table-main">{job.system}</strong></td><td><span className="table-main">{job.operation}</span></td><td><strong className="table-main">{job.entity}</strong></td><td><JobStatusPill status={job.status}/></td><td><span className="table-muted">{job.externalId}</span></td><td><span className="table-main">{job.attempts}</span></td><td><span className="table-muted">{job.createdAt}</span></td></tr>)}</tbody></table>
      </div>
      <div className="mobile-card-list integration-job-cards">{data.map((job) => <article className="mobile-entity-card" key={job.id}><div className="mobile-entity-card__head"><div><span>{job.system}</span><strong>{job.operation}</strong></div><JobStatusPill status={job.status}/></div><div className="mobile-entity-card__rows"><span><b>Объект</b><em>{job.entity}</em></span><span><b>Внешний ID</b><em>{job.externalId}</em></span><span><b>Попытки</b><em>{job.attempts}</em></span></div><div className="mobile-entity-card__foot">{job.createdAt}</div></article>)}</div>
    </div>
  );
}
