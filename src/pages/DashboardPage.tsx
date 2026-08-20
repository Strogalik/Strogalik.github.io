import { Link } from 'react-router-dom';
import { useDashboard } from '../api/queries';
import { Icon } from '../components/Icon';
import { LineChart } from '../components/LineChart';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { DateRangeButton } from '../components/CommonActions';

const money = (value:number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits:0 }).format(value) + ' ₽';

export function DashboardPage() {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) return <div className="page-loading"><div className="skeleton skeleton--title"/><div className="metric-grid">{[1,2,3,4].map(x=><div key={x} className="skeleton skeleton--card"/>)}</div></div>;
  return (
    <div className="page dashboard-page">
      <PageHeader kicker="Сегодня · 18 августа" title="Добрый день, Александр" description="Вот что происходит в логистике прямо сейчас." actions={<DateRangeButton initial="18–24 августа"/>} />

      <section className="metric-grid metric-grid--5">
        <MetricCard label="Активные рейсы" value={String(data.active)} meta="2 требуют внимания" icon="truck" />
        <MetricCard label="Завершено" value={String(data.completed)} meta="за текущий период" icon="check" tone="green" />
        <MetricCard label="Выручка" value={money(data.revenue)} meta="+8,4% к прошлой неделе" icon="wallet" />
        <MetricCard label="Прибыль" value={money(data.profit)} meta={`${data.margin.toFixed(1)}% маржа`} icon="chart" tone="navy" />
        <MetricCard label="Документы" value="94%" meta="успешность ЭПД / ЭДО" icon="file" tone="green" />
      </section>

      <section className="dashboard-main-grid">
        <article className="panel panel--chart">
          <div className="panel__header"><div><span className="eyebrow">Финансовая динамика</span><h2>Выручка и затраты</h2></div><div className="legend"><span><i className="legend__dot legend__dot--blue"/>Выручка</span><span><i className="legend__dot legend__dot--ice"/>Затраты</span></div></div>
          <LineChart data={data.series} title="Выручка и затраты"/>
          <div className="chart-summary"><div><span>Выручка сегодня</span><strong>479 тыс. ₽</strong></div><div><span>Затраты</span><strong>315 тыс. ₽</strong></div><div><span>Операционная маржа</span><strong>34,2%</strong></div></div>
        </article>

        <article className="panel attention-panel">
          <div className="panel__header"><div><span className="eyebrow eyebrow--danger">Требует внимания</span><h2>3 события</h2></div><Link to="/notifications" className="text-link">Все <Icon name="arrow"/></Link></div>
          <div className="attention-list">
            {data.alerts.map(alert => <Link to={alert.href} key={alert.id} className="attention-item"><span className={`attention-item__marker attention-item__marker--${alert.tone}`}><Icon name={alert.tone === 'danger' ? 'warning' : 'clock'}/></span><div><strong>{alert.title}</strong><span>{alert.meta}</span></div><Icon name="chevron"/></Link>)}
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="panel">
          <div className="panel__header"><div><span className="eyebrow">Рейсы</span><h2>Статус перевозок</h2></div><Link to="/trips" className="text-link">Реестр <Icon name="arrow"/></Link></div>
          <div className="status-overview">
            <div className="status-ring"><div><strong>8</strong><span>рейсов</span></div></div>
            <div className="status-breakdown">
              <div><i className="status-dot status-dot--blue"/><span>В пути</span><strong>2</strong></div>
              <div><i className="status-dot status-dot--powder"/><span>Назначены</span><strong>1</strong></div>
              <div><i className="status-dot status-dot--green"/><span>Завершены</span><strong>3</strong></div>
              <div><i className="status-dot status-dot--gray"/><span>Прочие</span><strong>2</strong></div>
            </div>
          </div>
        </article>
        <article className="panel docs-health">
          <div className="panel__header"><div><span className="eyebrow">Документы</span><h2>Контур ЭПД / ЭДО</h2></div></div>
          <div className="doc-health-row"><div className="doc-health-icon"><Icon name="file"/></div><div><strong>ЭПД</strong><span>16 документов · 1 ошибка</span></div><b>96%</b></div>
          <div className="doc-health-row"><div className="doc-health-icon"><Icon name="folder"/></div><div><strong>ЭДО</strong><span>11 документов · 2 ждут подписи</span></div><b>91%</b></div>
        </article>
      </section>
    </div>
  );
}
