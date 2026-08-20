import { Link } from 'react-router-dom';
import { useIntegrationJobs, useIntegrations } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { IntegrationStatusPill, JobStatusPill } from '../components/StatusPill';

export function IntegrationsPage() {
  const { data = [] } = useIntegrations();
  const { data: jobs = [] } = useIntegrationJobs();
  const activeJobs = jobs.filter((item) => item.status === 'queued' || item.status === 'processing');

  return (
    <div className="page integrations-page">
      <PageHeader kicker="Системный контур" title="Интеграции" description="Статус внешних систем, очередь обмена и безопасная диагностика без отображения секретов." actions={<Link className="btn btn--secondary" to="/integrations/jobs"><Icon name="clock"/>Очередь обмена</Link>} />
      <section className="integration-grid">
        {data.map((item) => (
          <Link key={item.id} to={`/integrations/${item.id}`} className="integration-card">
            <div className="integration-card__top"><span className="integration-card__icon"><Icon name={item.id === '1c' ? 'building' : item.id === 'telematics' ? 'route' : item.id === 'fuel-cards' ? 'receipt' : 'link'} /></span><IntegrationStatusPill status={item.status}/></div>
            <div className="integration-card__copy"><span>{item.subtitle}</span><h2>{item.name}</h2><p>{item.description}</p></div>
            <div className="integration-card__stats"><span><b>Последний обмен</b><strong>{item.lastSync}</strong></span><span><b>Очередь</b><strong>{item.queue}</strong></span><span><b>Ошибки</b><strong className={item.errors ? 'text-danger' : ''}>{item.errors}</strong></span></div>
            <div className="integration-card__foot"><span>{item.environment}</span><Icon name="chevron"/></div>
          </Link>
        ))}
      </section>
      <section className="panel integration-queue-preview">
        <div className="panel__header"><div><span className="eyebrow">Фоновые операции</span><h2>Очередь обмена</h2></div><Link to="/integrations/jobs" className="inline-link">Все операции <Icon name="arrow"/></Link></div>
        <div className="integration-job-list">
          {(activeJobs.length ? activeJobs : jobs.slice(0,3)).map((job) => <div className="integration-job-row" key={job.id}><span className="integration-job-row__system">{job.system}</span><span className="integration-job-row__main"><strong>{job.operation}</strong><small>{job.entity}</small></span><JobStatusPill status={job.status}/><span className="integration-job-row__time">{job.createdAt}</span></div>)}
        </div>
      </section>
    </div>
  );
}
