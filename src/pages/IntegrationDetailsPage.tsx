import { Link, useParams } from 'react-router-dom';
import { useIntegration, useIntegrationJobs } from '../api/queries';
import { Icon } from '../components/Icon';
import { IntegrationStatusPill, JobStatusPill } from '../components/StatusPill';

export function IntegrationDetailsPage() {
  const { integrationId = 'saby' } = useParams();
  const { data } = useIntegration(integrationId);
  const { data: jobs = [] } = useIntegrationJobs();
  const related = jobs.filter((job) => data?.id === 'saby' ? job.system === 'Saby' : data?.id === '1c' ? job.system === '1С/ERP' : false);
  if (!data) return null;

  return (
    <div className="page integration-details-page">
      <Link className="back-link" to="/integrations"><Icon name="back"/>Интеграции</Link>
      <section className="integration-detail-hero panel">
        <div className="integration-detail-hero__identity"><span className="integration-card__icon"><Icon name={data.id === '1c' ? 'building' : data.id === 'telematics' ? 'route' : data.id === 'fuel-cards' ? 'receipt' : 'link'} /></span><div><span className="eyebrow">{data.subtitle}</span><h1>{data.name}</h1><p>{data.description}</p></div></div>
        <IntegrationStatusPill status={data.status}/>
      </section>
      <section className="integration-detail-grid">
        <article className="panel"><div className="panel__header"><div><span className="eyebrow">Состояние</span><h2>Подключение</h2></div></div><dl className="definition-list"><div><dt>Контур</dt><dd>{data.environment}</dd></div><div><dt>Организация</dt><dd>{data.organization}</dd></div><div><dt>Идентификатор</dt><dd>{data.safeId}</dd></div><div><dt>Последний обмен</dt><dd>{data.lastSync}</dd></div></dl></article>
        <article className="panel"><div className="panel__header"><div><span className="eyebrow">Сейчас</span><h2>Операционный статус</h2></div></div><div className="integration-health"><span><b>{data.queue}</b><small>в очереди</small></span><span className={data.errors ? 'has-error' : ''}><b>{data.errors}</b><small>ошибок</small></span><span><b>{related.filter((j) => j.status === 'success').length}</b><small>успешных операций</small></span></div></article>
      </section>
      <section className="panel">
        <div className="panel__header"><div><span className="eyebrow">Последние операции</span><h2>Журнал обмена</h2></div><Link to="/integrations/jobs" className="inline-link">Вся очередь <Icon name="arrow"/></Link></div>
        <div className="integration-job-list">{related.length ? related.map((job) => <div className="integration-job-row" key={job.id}><span className="integration-job-row__system">{job.id}</span><span className="integration-job-row__main"><strong>{job.operation}</strong><small>{job.entity} · {job.externalId}</small></span><JobStatusPill status={job.status}/><span className="integration-job-row__time">{job.createdAt}</span></div>) : <div className="compact-empty-state"><Icon name="check"/><strong>Операций пока нет</strong><span>Интеграция не настроена или ещё не выполняла обмен.</span></div>}</div>
      </section>
      <section className="security-note"><Icon name="warning"/><div><strong>Секреты не отображаются в интерфейсе</strong><span>Ключи, токены и закрытые данные подключения должны храниться только на backend / в защищённой конфигурации.</span></div></section>
    </div>
  );
}
